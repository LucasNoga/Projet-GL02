var rdv = require('./rdv.js');
var tmp_plan= require('./planning.js');
//var p = require('./parser_ical.js');


//console.log(serialiserPlanningEnPlaninfo(p.parser_ical('./files/cc1.ics'),'./RRRR.txt'));
/**@method saisirNomFichierIcal, demande à l'utilisateur de saisir le nom du fichier ou le planning sera exporter
 * @returns {string} le nom du nouveau fichier
 */
var saisirNomFichierPlanInfo = function(){
    var fs = require("fs");
    var fichierPlanInfoDestination = "./files/"+readlineSync.question("Veuillez choisir le nom du fichier .csv de destination qui sera placé dans le repertoire files\nSaisi : ");
    if(extension(fichierPlanInfoDestination) != "csv"){
        console.log("erreur vous n'avez pas saisi l'extension .csv");
        process.exit(1);
    }
    if(fs.existsSync(fichierPlanInfoDestination)) {
        console.log("erreur le fichier existe déja");
        process.exit(1);
    }
    else {
        console.log("Création du fichier")
    }
    return fichierPlanInfoDestination;
}

/**@method serialiserPlanningEnPlaninfo, cette méthode enregistre un Planning dans un fichier PlanInfo
 * @param planning, le planning a convertir
 * @param chemin_fichier_ical, le nouveau ficheir planInfo
 */
function serialiserPlanningEnPlaninfo(planning) {
    var fs = require('fs');
    var chemin_fichier_csv = saisirNomFichierPlanInfo();
    var stream = fs.createWriteStream(chemin_fichier_csv);
    stream.once('open', function (fd) {
        var itePlanning = new tmp_plan.Planning;
        var cliPlanning = new tmp_plan.Planning;
        var listIte = new Array;
        var listCli = new Array;
        for (var i = 0; i < planning.listeRdv.length; i++) { //avoir RDV de chaque intervenant et client
            var rdv = planning.getRdv(i);
            if (itePlanning[rdv.getIntervenant()] == undefined) {
                itePlanning[rdv.getIntervenant()] = new Array;
                listIte.push(rdv.getIntervenant());
            }
            if (cliPlanning[rdv.getLieu()] == undefined) {
                cliPlanning[rdv.getLieu()] = new Array;
                listCli.push(rdv.getLieu());
            }
            itePlanning[rdv.getIntervenant()].push(rdv);
            cliPlanning[rdv.getLieu()].push(rdv); 
        }
        for (var i = 0; i < listCli.length; i++) { //planinfo pour domicile
            stream.write("### unknown -- ");
            stream.write(listCli[i] + "\n");       //lieu
            stream.write("lundi;mardi;mercredi;jeudi;vendredi;samedi;dimanche\n");
            var creneau = new Array(48 * 7);
            for (var j = 0; j < 48 * 7; j++) {
                creneau[j] = 'vide';
            }
            for (var j = 0; j < cliPlanning[listCli[i]].length; j++) { //traitement contenu de cliPlanning, met dedans des informations
                var rdv = cliPlanning[listCli[i]][j];
                var day = new Date(rdv.getDebut()).getDay(); // 0 dimanche 1 lundi
                day = (day + 6) % 7; // 0 lundi, 6 dimanche
                var hours = new Date(rdv.getDebut()).getHours();
                var mins = new Date(rdv.getDebut()).getMinutes();
                var dur = rdv.getDuree();
                //console.log(dur, mins, hours , day);
                for (var k = 0; k < Math.floor(dur / 30); k++) {
                    //console.log(hours * 7 * 2 + (Math.floor(mins / 30) + k) * 7 + day);
                    creneau[hours * 7 * 2 + (Math.floor(mins / 30) + k) * 7 + day] = rdv.getTitre() + '(' + rdv.getIntervenant() + ')'
                    //console.log(creneau[hours * 7 * 2 + (Math.floor(mins / 30) + k) * 7 + day]);
                }
            }
            for (var j = 0; j < creneau.length; j++) { //output planinfo client domicile
                if (((j + 1) % 7) != 0) {
                    stream.write(creneau[j] + ';');
                }
                else if (j == creneau.length - 1)
                    stream.write(creneau[j] + ';' + '\n\n');
                else
                    stream.write(creneau[j] + ';' + '\n');
            }
        }
        
        for (var i = 0; i < listIte.length; i++) { //planinfo pour intervenant
            stream.write("### " + listIte[i] + " -- ");
            var tmp_rdv = cliPlanning[listCli[i]][0]; //pour avoir un titre
            stream.write(tmp_rdv.getTitre() + "\n");       //titre
            stream.write("lundi;mardi;mercredi;jeudi;vendredi;samedi;dimanche\n");
            var creneau = new Array(48 * 7);
            for (var j = 0; j < 48 * 7; j++) {
                creneau[j] = 'vide';
            }
            for (var j = 0; j < itePlanning[listIte[i]].length; j++) { //traitement contenu de itePlanning, met dedans des informations
                var rdv = itePlanning[listIte[i]][j];
                var day = new Date(rdv.getDebut()).getDay(); // 0 dimanche 1 lundi
                day = (day + 6) % 7; // 0 lundi, 6 dimanche
                var hours = new Date(rdv.getDebut()).getHours();
                var mins = new Date(rdv.getDebut()).getMinutes();
                var dur = rdv.getDuree();
                for (var k = 0; k < Math.floor(dur / 30); k++) {
                    creneau[hours * 7 * 2 + (Math.floor(mins / 30) + k) * 7 + day] = "unknown" + '(' + rdv.getLieu() + ')';
                }
            }
            for (var j = 0; j < creneau.length; j++) {
                if (((j + 1) % 7) != 0) {
                    stream.write(creneau[j] + ';');
                }
                else if (j == creneau.length - 1)
                    stream.write(creneau[j] + ';' + '\n\n');
                else
                    stream.write(creneau[j] + ';' + '\n');
            }
        }
        stream.end();
    });
};


exports.serialiserPlanningEnPlaninfo = serialiserPlanningEnPlaninfo;



