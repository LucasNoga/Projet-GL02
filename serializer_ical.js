/**
 * fichier qui permet d'exporter en iCalendar (.ics)
 */

var fs = require('fs');
var readlineSync = require('readline-sync');
var extension = require('file-extension');

/**@method serialiserDate, cette méthode permet de recuperer la date d'un rendezvous et de la convertir pour qu'elle soit conforme au format iCalendar)
 * @param date, la date du rendez-vous
 * @returns {string}, la date formaté
 */
var serialiserDate = function(date) {
    var dateEnCaractere = "";
    dateEnCaractere += date.getFullYear();
    dateEnCaractere += ("0" + (date.getMonth()+1)).slice(-2); //Permet d'avoir toujours un nombre avec deux chiffres
    dateEnCaractere += ("0" + date.getDate()).slice(-2);
    dateEnCaractere += "T";
    dateEnCaractere += ("0" + date.getHours()).slice(-2);
    dateEnCaractere += ("0" + date.getMinutes()).slice(-2);
    dateEnCaractere += ("0" + date.getSeconds()).slice(-2);

    return dateEnCaractere;
}

/**@method saisirNomFichierIcal, demande à l'utilisateur de saisir le nom du fichier ou le planning sera exporter
 * @returns {string} le nom du nouveau fichier
 */
var saisirNomFichierIcal = function(){
    var fs = require("fs");
    var fichierICalDestination = "./files/"+readlineSync.question("Veuillez choisir le nom du fichier .ics de destination qui sera placé dans le repertoire files\nSaisi : ");
    if(extension(fichierICalDestination) != "ics"){
        console.log("erreur vous n'avez pas saisi l'extension .ics");
        process.exit(1);
    }
    if(fs.existsSync(fichierICalDestination)) {
        console.log("erreur le fichier existe déja");
        process.exit(1);
    }
    else {
        console.log("Création du fichier")
    }
    return fichierICalDestination;
}

/**@method convertToIcal, cette méthode enregistre un Planning dans un fichier iCalendar
 * @param planning, le planning a convertir
 * @param chemin_fichier_ical, le nouveau ficheir iCalendar
 */
var convertToIcal = function(planning) {
    var chemin_fichier_ical = saisirNomFichierIcal();
    console.log("votre fichier se trouve maintenant dans le repertoire : " + chemin_fichier_ical);
    var stream = fs.createWriteStream(chemin_fichier_ical);
    stream.once('open', function(fd) {
        stream.write("BEGIN:VCALENDAR\n");
        stream.write("VERSION:2.0\n");
        stream.write("PRODID:-//UTT/GL02/A15/UTTIFY\n");
        for(var i = 0; i < planning.listeRdv.length; i++) { //tant qu'il ya des rendezvous dans le planning
            var rdv = planning.getRdv(i); //on recupere le rdv
            stream.write("BEGIN:VEVENT\n");
            stream.write("SUMMARY:" + rdv.titre + " (" + rdv.intervenant + ")\n");
            stream.write("LOCATION:" + rdv.lieu + "\n");
            stream.write("DTSTART:"+serialiserDate(rdv.getDebut()) + "\n");
            stream.write("DTEND:"+serialiserDate(rdv.getFin()) + "\n");
            stream.write("END:VEVENT\n");
        }
        stream.write("END:VCALENDAR\n");
        stream.end();
        console.log("Exportation du planning réussi")
    });
};


//LES TESTS
 /*var pl = require('./planning');
 var rdv = require('./rdv');*/

/*pour un fichier a partir d'un iCal
var parical = require("./parser_ical");
var planning2 = parical.parser_ical("./files/iCal1.ics");
convertToIcal(planning2);*/

/*Pour un planning fait manuellment
var planning = new pl.Planning();
var rdv1 = new rdv.RendezVous("titre1", "intervenant1", new Date(2016, 1, 04, 00, 30, 00, 000), 30, "lieu1");
var rdv2 = new rdv.RendezVous("titre2", "intervenant2", new Date(2017, 5, 24, 05, 30, 00, 000), 30, "lieu2");
planning.addRdv(rdv1);
planning.addRdv(rdv2);
convertToIcal(planning);*/

/*pour un fichier a partir d'un planInfo
var parplan = require("./parser_planinfo");
var planning2 = parplan.parser_planinfo("./files/cvsTest.csv");
convertToIcal(planning2);*/


exports.convertToIcal = convertToIcal;
