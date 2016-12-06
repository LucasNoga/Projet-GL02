/**
 * Fichier qui permet de parser un fichier PlanInfo (.csv)
 */
var pl = require("./planning");
var rdv = require("./rdv");
var fs = require("fs");
var readlineSync = require('readline-sync');

/**@method parser_planinfo methode qui permet de parser
 * @param chemin_fichier_planinfo, le fichier csv a parser
 * @param choix l'utilisateur aura choisi au preablable si c'est un fichier d'intervenant ou de domicile
 * @return {Planning}, le planning parsé*/
var parser_planinfo = function(chemin_fichier_planinfo){
    var data = fs.readFileSync(chemin_fichier_planinfo, "utf8");
    var ligne = data.split('\n').length; //recupere le nombre de ligne dans le fichier

    if (ligne==50){ //50 lignes = fichier valide
        var parseur = new PlanInfoParser();
        parseur.choixParsing();
        parseur.saisirDatePlanning();
        parseur.parse(data);
        return parseur.getPlanning();//on recupere le planning
    }else {
        console.log("nombre de ligne = " + ligne + ".\nCe nombre est incorrect, un fichier planinfo attentd un fichier de 50 lignes");
        process.exit(1);
    }
}

/*@constructor PlanInfoParser est objet qui permet de separer les données d'un fichier planInfo (.csv)*/
var PlanInfoParser = function() {
	this.planning = new pl.Planning();
	this.symb = ["###","--",";"]
	this.debut;
	this.datePlanning = new Date();
	this.choix; //domicile ou intervenant
}

/**@method getPlanning, permet de nous recuperer le planning une fois le fichie parsé
 * @return {Planning}, le planning parsé
 */
PlanInfoParser.prototype.getPlanning = function(){
    return this.planning;
}

/**@method choixParsing, cette méthode demande a l'utilistaeur de saisir la methode de parsing soit un parsing client, soit un parsing intervenant*/
PlanInfoParser.prototype.choixParsing = function(){
    console.log("voulez-vous parser un fichier pour un client ou pour un intervenant");
    console.log("[1] pour un domicile");
    console.log("[2] pour un intervenant");
    var choix = parseInt(readlineSync.question("Quel est votre choix ? \nSaisi : "));

    if(choix == 1 || choix == 2){ //pour un choix valide
        switch(choix){
            case 1:
                this.choix = "domicile"
                break;
            case 2:
                 this.choix = "intervenant";
                 break;
        }
        console.log("Vous avez choisi " + this.choix);
    }else{
        console.log("Erreur, vous n'avez pas saisi 1 ou 2");
        this.choixParsing();
    }
}

/**@method saisirDatePlanning, cette méthode demande a l'utilistaeur de saisir la date du début du planning pour pouvir le situer dans le temps*/
PlanInfoParser.prototype.saisirDatePlanning = function(){
    var annee = parseInt(readlineSync.question("Saissisez une Année entre 2000 et 2020\nSaisi : "));
    var mois = parseInt(readlineSync.question("Saissisez le mois 0 = Janvier, 1 = Février etc...\nSaisi : "));
    var jour = parseInt(readlineSync.question("Saissisez le jour\nSaisi : "));

    if(annee >= 2000 && annee <= 2020 && mois <= 12 && jour <= 31){ //pour une date de valide
        this.datePlanning = new Date(annee, mois, jour);
    }else{
        console.log("Erreur, Saisissez une année comprise entre 2000 et 2020, un mois inferieur ou egale a 12 et un jour inférieur a 31\nResaissisez une date");
        this.saisirDatePlanning();
    }
}


/**@method tokenize, cette méthode permet de séparer toutes les données en les placant dans une liste nommée data
 * @return data, toutes les données du fichier
 */
PlanInfoParser.prototype.tokenize = function(data) {
	var separator = /(\r\n|\n|;)/; //separateur des données
	data = data.split(separator);
	data = data.filter(function(val, idx){
		return !val.match(separator);
    });
	return data;
}

/**@method parse, cette méthode appelle la méthode tokenize afin de découper le fichier ( intervenant ou domicile) et appelle ensuite la bonne méthode
 * @param data liste des données parsé
 */
PlanInfoParser.prototype.parse = function(data) {
	var ttData = [];
	var tData = this.tokenize(data);

    var ligne=0;
	for ( i=8; i<tData.length; i++) //on part a 8 pour supprimer les jours de la semaine
		ttData[ligne++] = tData[i];

	this.debut = tData[0]; //permet de recuperer l'adresser ou le nom de l'intervennant dépendant du type de fichier planInfo
    if(this.choix === "domicile"){
        console.log ("on appele la fonction pour le domicile");
        this.listPlanInfoDomicile(ttData);
    }
    else if(this.choix == "intervenant"){
        console.log ("on appele la fonction pour l'intervenant");
        this.listPlanInfoIntervenant(ttData);
    }
}

/**@method listPlanInfoDomicile, cette méthode permet de créer les rdv associé à une personne âgée
 * @param input , liste des données restantes a parsé
 */
PlanInfoParser.prototype.listPlanInfoDomicile = function(input) {
    console.log("fonction listPlanInfoDomicile appelé");
	var adresse = this.debut.split("--");
	var lieu = adresse[1];
	lieu = lieu.replace("\"", ''); //Le lieu se situe dans la première ligne qu'on découpe pour récuperer l'info souhaitée

	for (i = 0; i < input.length; i++) {//parcourt les rendez vous non vides
        if(input[i] === "vide" || input[i] ==='' ){}

        else{ //si il y a un rendez-vous alors on prépare les données pour ce rendez-vous
            var elem = input[i].split(" "); //separe le titre de l'intrevenant
            var titre = elem[0];

            var intervenant = elem[1] + " " +  elem[2];
            intervenant = intervenant.replace(')', '');
            intervenant = intervenant.replace('(', ''); // on enlève les parentheses de l'intervenants
            this.creerRdv(titre, intervenant, this.datePlanning, 30, lieu); //un rendez vous en csv durent tous le temps 30 minutes
        }
        this.updateDate();//on passe a un nouveau créneau du coup on met a jour la date
    }
}

/**@method listPlanInfoIntervenant, cette méthode permet de créer les rdv associé à un professionel*/
PlanInfoParser.prototype.listPlanInfoIntervenant = function(input) {
    console.log("fonction listPlanInfoIntervenant appelé");
    // on récupere le nom de l'intervenant
	var personne = this.debut.split("--");
	var intervenant = personne[0];
	intervenant = intervenant.replace("### ", '');

	for (i = 0; i < input.length; i++) {//chercher les rdv en évitant les cases vides
        if(input[i] === "vide" || input[i] ==='' ){}

        else{ //si il y a un rendez-vous alors on prépare les données pour ce rendez-vous
            var elem = input[i].split("(");
            var titre = elem[0];   //recupere le titre du rdv correspondant au métier de l'intervenant
            titre = titre.replace(" ", '');

            var lieu = elem[1]; //recupere l'initial du prenom et le nom de l'intrevnant
            lieu = lieu.replace(')', '');

            this.creerRdv(titre, intervenant, this.datePlanning, 30, lieu); //un rendez vous en csv durent tous le temps 30 minutes
        }
        this.updateDate();//on passe a un nouveau créneau du coup on met a jour la date
    }
}

/**@method updateDate, cette méthode met à jour la date pour avoir la bonne date et la bonne heure à chaque rendez vous*/
PlanInfoParser.prototype.updateDate = function(){
    if(this.datePlanning.getMinutes() == 30){ //s'il est déjà 30 alors on passe à l'heure suivante et on remet les minutes a 0
        if(this.datePlanning.getHours() == 23){ //s'il est 23 heures on passe au jour suivant
            this.datePlanning.setHours(this.datePlanning.getHours()+1);
        }else{
            this.datePlanning.setHours(this.datePlanning.getHours()+1);
            this.datePlanning.setMinutes(0);
        }
    }else // sinon les minutes son déja à 0 du coup on les mets à 30
        this.datePlanning.setMinutes(30);
}

/**@method creerRdv, permet de créer un rendezvous
 *
 * @param titre le titre du rendezvous
 * @param intervenant, le nom de l'intervenant du rendezvous
 * @param date, la date du rendezvous
 * @param duree, la duree du rendezvous
 * @param lieu, le lieu du rendezvous
 */
PlanInfoParser.prototype.creerRdv = function(titre, intervenant, date, duree, lieu) {
   var rdvAjouté = new rdv.RendezVous(titre, intervenant, this.datePlanning, duree, lieu);
   this.planning.addRdv(rdvAjouté);
}

/*méthode pour creer un rdv
parser_planinfo("./files/cvsTest.csv");*/

//exportation du fichier
module.exports.parser_planinfo = parser_planinfo;
module.exports.PlanInfoParser = PlanInfoParser;