/**
 * Fichier qui permet de parser un fichier iCal (.ics)
 */
var pl = require("./planning");
var rdv = require("./rdv");
var fs = require("fs");



/** @constructor IcalParser est objet qui permet de separer les données d'un fichier Ical*/
var IcalParser = function () {
    this.planning = new pl.Planning();
    this.symb = [
        "BEGIN",
        "VCALENDAR",
        "VEVENT",
        "SUMMARY",
        "LOCATION",
        "DTSTART",
        "DTEND",
        "END",
    ];
}

/**@method parser_ical permet d'importer un fichier iCalendar sous forme d'un planning
 * @param file_ical, fichier iCalendar à parser
 */
function parser_ical(file_ical){
    var parseur = new IcalParser();
    var data = fs.readFileSync(file_ical, "utf8");
    parseur.parse(data);
    return parseur.getPlanning(); //recupere l'objet planning avec les rendez-vous
}



/**@method getPlanning, accesseur de l'attribut planning
 * @returns {Planning}, l'attribut planning
 */
IcalParser.prototype.getPlanning = function(){
    return this.planning;
}

/**@method tokenize, transforme le fichier Ical en une liste d'element <eol> = CRLF
 * @param data, l'ensemble du fichier iCal
 * @returns {Array} la liste des éléments contenus dans le fichier iCal
 */
IcalParser.prototype.tokenize = function(data){
	var separator = /(\r\n|\n|:)/; //on recupere dans un tableau chaine par chaine
	data = data.split(separator);
	data = data.filter(function(val, idx){
        return !val.match(separator);
	});
	return data;
}


/**@method parse analyse les données en récupérant les symboles non terminaux de la grammaire
 * @param data la liste des elements du fichiers
 */
IcalParser.prototype.parse = function(data){
	var tData = this.tokenize(data);
	this.listVEvent(tData);
}

/**@method err si un element improbable se trouve dans le fichier on arrete le parsing
 * @param msg, le message à afficher
 * @param input l'element anormale présent dans le fichier
 */
IcalParser.prototype.err = function(msg, input){
	console.log("Parsing Error ! on "+input[0]+" -- msg : "+msg);
	process.exit(0);
}

/**@method next, parcours le tableau parse, retire le premier element de ce tableau et le retourne
* @param input tableau parsé
* @return curS premier element du tableau
*/
IcalParser.prototype.next = function(input){
	var curS = input.shift();
	return curS;
}

/**@method accept vérifie si la tête de liste correspond à un des symboles du langage
 * @param s l'élément a vérifier
 * @returns true si l'élément appartient à la liste symb sinon false
 */
IcalParser.prototype.accept = function(s){
	if(s !== undefined){
		var idx = this.symb.indexOf(s);
		if(idx === -1){
			this.err("symbol "+s+" unknown", [" "]);
			return false;
		}
		return idx;
	}
}

/**@method check, vérifie si l'argument en tête de liste est vérifié
* @param s la chaine attendue
* @param input la liste a parser et input[0] l'element en tête de liste
*/
IcalParser.prototype.check = function(s, input){
	if(this.accept(input[0]) == this.accept(s)){
		return true;
	}
	return false;
}

/**@method isKnown, verifie si l'argument en tête de liste est connue
* @param s la chaine attendue
* @param input
*/
IcalParser.prototype.isKnown = function(input) {
    var idx = this.symb.indexOf(input[0]);
    if(idx === -1)
        return false;
    return true;
}

/**@method expect, detecter les chaines qu'on compare avec ceux qui sont attendus
* @param s la chaine attendue
* @param input liste du ICal parsé
*/
IcalParser.prototype.expect = function(s, input){
	if(s == this.next(input)){
		return true;
	}else{
		this.err("symbol "+s+" doesn't match", input);
	}
	return false;
}


/**@method listVEvent, supprime de la liste le BEGIN et le END et conserve donc dans cette liste uniquement les events en les stockant dans des objets events
* @param input liste du ICal parsé
*/
IcalParser.prototype.listVEvent = function(input){
    //Début du fichier
    this.expect("BEGIN", input);
    this.expect("VCALENDAR", input);

    //tant que le premier element de la liste n'est pas un nouveau rendez-vous on traite ces données
    while(input[0] != "BEGIN"){
        this.next(input);
    }

    //Lecture du premier rdv
	this.vEvent(input);

    //Fin du fichier
    this.expect("END", input);
    this.expect("VCALENDAR", input);
    //this.expect("", input) //enleve la chaine vide qu'il y a a la fin de chaque fichier iCal

};

/**
 * @method vEvent Récupere les données des rendez-vous, créer les rendez-vous et les ajoute dans le planning
 * @param input liste du ICal parsé
 * @returns {boolean}
 */
IcalParser.prototype.vEvent = function(input){

    //console.log(input);
	if(this.check("BEGIN", input)){
		this.expect("BEGIN", input);
        if(input[0] === "VEVENT") {
            this.expect("VEVENT", input);
    		var rdv = this.creerRdv(input); //creer un objet rendez-vous a partir d'un event
    		this.expect("END", input);
            this.expect("VEVENT", input);
    		this.planning.addRdv(rdv); //ajoute l'objet rendez vous dans le planning
    		this.vEvent(input); //relance la fonction pour avoir le rendez-vous suivant
    		return true;
        } else {
            var baliseInconnue = input[0]; //On ignore les balises BEGIN:X où X est inconnu
            this.next(input);
            while(input[0] != "END" || input[1] != baliseInconnue) {
                this.next(input);
                this.next(input);
            }
            this.next(input);
            this.next(input);
            return this.vEvent(input);
        }
	} else {
		return false;
	}
}

/**@method creerRdv, fonction qui permet creer un objet RendezVous
 * @param input liste du ICal parsé
 */
IcalParser.prototype.creerRdv = function(input) {
    var str = {
        summary: null,
        location: null,
        dtstart: null,
        dtend: null
    };

    while(input[0] !== "END") { //On parcourt tout le VEVENT
        this.dataRdv(input, str);  //trie les données du rendez-vous
    }


    if(!str.summary || !str.location || !str.dtstart || !str.dtend) {
        this.err("Manque une information pour un rendez-vous.", input)
    }

    var summaryTableau = str.summary.split(/ *(\(|\)) */);

    var start_date = new Date(
        parseInt(str.dtstart.substr(0, 4)),
        parseInt(str.dtstart.substr(4, 2)) - 1,
        parseInt(str.dtstart.substr(6, 2)),
        parseInt(str.dtstart.substr(9, 2)),
        parseInt(str.dtstart.substr(11, 2)),
        parseInt(str.dtstart.substr(13, 2))
    );

    var end_date = new Date(
        parseInt(str.dtend.substr(0, 4)),
        parseInt(str.dtend.substr(4, 2)) - 1,
        parseInt(str.dtend.substr(6, 2)),
        parseInt(str.dtend.substr(9, 2)),
        parseInt(str.dtend.substr(11, 2)),
        parseInt(str.dtend.substr(13, 2))
    );

    return new rdv.RendezVous(summaryTableau[0], str.location, start_date, (end_date.getTime() - start_date.getTime())/(60*1000), summaryTableau[2]);
}

/**@method dataRdv trie les données de l'événement iCal pour en faire un objet Rdv
 * @param input liste du ICal parsé
 * @param str l'element en tete de la liste
 */
IcalParser.prototype.dataRdv = function(input, str) {
    if(!this.isKnown(input)) {
        this.next(input);
        this.next(input);
    }else if(this.check("SUMMARY", input))
        str.summary = this.summary(input);//Lignes SUMMARY:nom de l'intervention (intervenant)
    else if(this.check("LOCATION", input))
        str.location = this.location(input); //Lignes LOCATION:lieu du rdv
    else if(this.check("DTSTART", input))
        str.dtstart = this.dtstart(input); //Lignes DTSTART:jour et heure de début
    else if(this.check("DTEND", input))
        str.dtend = this.dtend(input); //Lignes DTEND:jour et heure de fin
    else { //Une ligne inconnue
        this.next(input);
        this.next(input);
    }
}


/**@method summary, permet de recuperer le titre du RendezVous
 * @param input liste du ICal parsé
 */
IcalParser.prototype.summary = function(input){
	this.expect("SUMMARY", input)
	var curS = this.next(input);
	return curS;
}

/**@method location, permet de recuperer le lieu du RendezVous
 * @param input liste du ICal parsé
 */
IcalParser.prototype.location = function(input){
	this.expect("LOCATION", input)
	var curS = this.next(input);
	return curS;
}

/**@method dtstart, permet de recuperer la date du début du RendezVous
 * @param input liste du ICal parsé
 */
IcalParser.prototype.dtstart = function(input){
	this.expect("DTSTART", input)
	var curS = this.next(input);
	if(matched = curS.match(/\d\d\d\d\d\d\d\dT\d\d\d\d\d\d(|Z)+/i)){
		return matched[0];
	}else{
		this.err("Date de début invalide", input);
	}
}

/**@method dtend, permet de recuperer la durée du RendezVous
 * @param input liste du ICal parsé
 */
IcalParser.prototype.dtend = function(input){
	this.expect("DTEND", input)
	var curS = this.next(input);
	if(matched = curS.match(/\d\d\d\d\d\d\d\dT\d\d\d\d\d\d(|Z)+/i)){
		return matched[0];
	}else{
		this.err("Date de fin invalide", input);
	}
}

////////////////////////////////////////////////////////////////A ENLEVER///////////////////////////////////////////////////////////////////////////////////////////
/*var test = new pl.Planning();
test = parser_ical("files/iCal1.ics");/////////////////////////APPEL DE LA FONCTION
console.log(test);*/

exports.parser_ical = parser_ical;
exports.IcalParser = IcalParser;
