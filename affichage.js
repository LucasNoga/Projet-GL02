/**
 * Ensemble des fonctions d'affichage à la console.
 */
var fs = require("fs");
var Aide = require("./aide");
var version = "2.0"
var readlineSync = require('readline-sync');
var extension = require('file-extension');
var plannings = new Array();
var parical = require("./parser_ical");
var parplan = require("./parser_planinfo");

/**@constructor Affichage permet l'affcihae dans la console pour l'utilisateur*/
var Affichage = function(){};

/**@method lireRepertoireFiles Retourne les fichiers présent dans le repertoire files
 * @return Array, un tableau contennant les fichiers du repertoire files
 */
Affichage.prototype.lireRepertoireFiles = function(){
    console.log("lecture du repertoire: /files");
    return fs.readdirSync("./files");
}

/** @method Affiche uniquement la liste des fichiers Ical
 * @return Array, retourne un tableau contennant tous les fichier iCal
 */
Affichage.prototype.listeFichiersIcal = function(){
    var files = this.lireRepertoireFiles();
    var filesIcal = [];
    for (var file in files){//parcourt tous le repertoire
        if(extension(files[file]) === "ics")
            filesIcal.push(files[file]);
    }
    return filesIcal;
};

/**Affiche uniquement la liste des fichiers Ical
 * @return Array, retourne un tableau contennant tous les fichier iCal
 */
Affichage.prototype.listeFichiersPlanInfo = function(){
    var files = this.lireRepertoireFiles();
    var filesPlanInfo = [];
    for (var file in files){//parcourt tous le repertoire
        if(extension(files[file]) === "csv")
            filesPlanInfo.push(files[file]);
    }
    return filesPlanInfo;
};

/**@method lirePlanningFichierIcal, affiche le planning d'un ficher iCal (.ics) saisi par l'utilisateur
 * @param iCalFile , le fichier iCal a envoyer au parser
 */
Affichage.prototype.lirePlanningFichierIcal = function(iCalFile){
    iCalFile = "./files/"+iCalFile;
    if(fs.existsSync(iCalFile))
        console.log(parical.parser_ical(iCalFile));
    else{
        console.log("le fichier n'existe pas");
        process.exit(1);
    }
}

/**@method lirePlanningFichierPlanInfo, affiche le planning d'un ficher planInfo (.csv) saisi par l'utilisateur
 * @param planInfoFile, le fichier planInfo a envoyer au parser
 */
Affichage.prototype.lirePlanningFichierPlanInfo = function(planInfoFile){
    planInfoFile = "./files/"+planInfoFile;
    if(fs.existsSync(planInfoFile)) //verifie si le fichier existe bien
        parplan.parser_planinfo(planInfoFile);
};

/**@method afficherPlanning, affiche dans la console un planning recupéré à partir d'un fichier saisi par l'utilisateur*/
Affichage.prototype.afficherPlanning = function(){
    console.log("quel type de fichier voulez vous afficher")
    console.log("[1]: Fichier iCalendar (.ics)");
    console.log("[2]: Fichier planInfo (.csv)")
    var choix = parseInt(readlineSync.question("Saisissez 1 pour un fichier iCalendar et 2 pour un fichier planInfo\n"));

    if (choix == 1){
        console.log("vous avez choisi iCal");
        var iCalFiles = this.listeFichiersIcal();//recupere tous les fichiers iCal
        var index = readlineSync.keyInSelect(iCalFiles, "choisissez votre fichier");
        console.log("Vous avez choisi " + iCalFiles[index]);
        this.lirePlanningFichierIcal(iCalFiles[index]);
    }else if(choix == 2){
        console.log("vous avez choisi planInfo");
        var planInfoFiles = this.listeFichiersPlanInfo();//recupere tous les fichiers planInfo
        var index = readlineSync.keyInSelect(planInfoFiles, "choisissez votre fichier");
        console.log("Vous avez choisi " + planInfoFiles[index]);
        this.lirePlanningFichierPlanInfo(planInfoFiles[index]);
    }
};

var affichage = new Affichage();
module.exports = affichage;