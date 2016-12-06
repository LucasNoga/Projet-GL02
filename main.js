/**
 *fichier principale, qui gère les option en ligne de commande
 */
var version = "2.0"
var Aide = require("./aide");
var rdv = require("./rdv");
var parical = require("./parser_ical");
var parplan = require("./parser_planinfo");
var seri = require("./serializer_ical");
var serplan = require("./serializer_planinfo");
var pl = require("./planning");
var Affichage = require("./affichage");
//module ajouté avec npm
var fs = require("fs");
var readlineSync = require('readline-sync');
var extension = require('file-extension');

/**@method importerFichierIcal Importe un fichier au format iCal dans le répertoire /files
 * @returns {*} Le fichier iCal choisi par l'utilisateur
 */
var importerFichierIcal = function(){
    var iCalFiles = Affichage.listeFichiersIcal();//recupere tous les fichiers iCal
    var index = readlineSync.keyInSelect(iCalFiles, "choisissez votre fichier");
    console.log("Vous avez choisi " + iCalFiles[index]);
    console.log("icalfiles "+iCalFiles[index]);/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return iCalFiles[index];
};


/**@method importerFichierPlanInfo Importe un fichier au format PlanInfo dans le répertoire /files
 * @returns {*} Le fichier planInfo choisi par l'utilisateur
 */
var importerFichierPlanInfo = function(){
    var planInfoFiles = Affichage.listeFichiersPlanInfo();//recupere tous les fichiers planInfo
    var index = readlineSync.keyInSelect(planInfoFiles, "choisissez votre fichier");
    console.log("Vous avez choisi " + planInfoFiles[index]);
    console.log("planInfoFiles "+planInfoFiles[index]);/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return planInfoFiles[index];
}
/**@method importerPlanning Importe un planning planInfo ou iCal au choix de l'utilisateur
 * @returns {*} Un planning
 */
var importerPlanning = function(){
    console.log("quel type de fichier voulez vous importer");
    var index = readlineSync.keyInSelect(["un fichier Ical (.ics)", "un fichier planInfo (.csv)"], 'votre choix');
    if(index == 0)
        var ex = "ics";
    else
        var ex = "csv";
    switch(ex){
        case "ics":
            console.log("vous avez choisi iCal");
            return parical.parser_ical("./files/" + importerFichierIcal());
            break;
        case "csv":
            console.log("vous avez choisi planInfo");
            return parplan.parser_planinfo("./files/" + importerFichierPlanInfo());
            break;

        default:
            console.log("Veuillez choisir un fichier valide (.csv ou .ics)");
            break;
    }
}
/**
 * @method csvToIcal Convertit un fichier csv au format iCal
 * @param argumentsCommande Les arguments requis. cf l'aide.
 */
var csvToIcal = function() {
    var filePlanInfo = importerFichierPlanInfo();//On importe le planning
    console.log("filePlanInfo " +filePlanInfo);
    var planningImporte = parplan.parser_planinfo("./files/"+filePlanInfo); //on parse le fichier
    //console.log(planningImporte);
    seri.convertToIcal(planningImporte);
    console.log("\nLe planning a été créé :");
};

var icalToCsv = function() {
    var fileIcal = importerFichierIcal();//On importe le planning
    console.log("fileIcal " +fileIcal);
    var planningImporte = parical.parser_ical("./files/"+filePlanInfo); //on parse le fichier
    //console.log(planningImporte);
    serplan.serialiserPlanningEnPlaninfo(planningImporte);
    console.log("\nLe planning a été créé :");
};
/**
 * @method menuPrincipal Affiche le menu principal
 */
var menuPrincipal = function(){
    console.log("Bienvenue chez Yadom");
    choix = ["Importer des plannings", "Détecter des conflits entre 2 plannings", "Exporter un planning au format PlanInfo",
        "Exporter un planning au format iCal","Afficher un planning","Affiche le fichier ReadMe","Affiche la version de la librairie"];
    var index = readlineSync.keyInSelect(choix, "Faites un choix");
    switch(index){
        case 0:
            importerPlanning();
            break;
        case 1:
            //Detecte les conflits
            p1 = importerPlanning();
            p2 = importerPlanning();
            //TODO Parser_plan_info renvoie le bon type
            console.log(pl.getIntersectionDeuxPlannings(p1, p2));
            break;
        case 2:
            icalToCsv();
            break;
        case 3:
            csvToIcal();
            break;
        case 4:
            Affichage.afficherPlanning();
            break;
        case 5:
            //Afficher le readMe
            Aide.afficherAide();
            break;
        case 6:
            //Affiche la version
            console.log(version);
            break;
        case -1:
            process.exit(1);
            break;
        default:
            break;
    }
};
while(true)
    menuPrincipal();

menuPrincipal();

/**
 * @method faireUnion Réalise l'union de 2 planning. Ne marche pas
 */
var faireUnion = function(){
    console.log("quel est votre premier planning");
    iCal1 = importerPlanning();
    console.log("quel est votre second planning");
    iCal2 = importerPlanning();

    console.log(iCal1);
    console.log(iCal2);

    if(extension(iCal1) == "ics" && extension(iCal2) == "ics"){
        var fichierDestination = "./files/"+readlineSync.question("Veuillez choisir le nom du fichier de destination qui sera placé dans le repertoire files\n");
        if(fs.readFileSync(fichierDestination, "utf8") != null){  //Test pour savoir si le fichier de destination spécifié existe déjà
            console.log("Erreur : le fichier de destination spécifié existe déjà\n");
            process.exit(1);
        }
    }else{
        console.log("erreur vous n'avez pas saisi 2 fichiers iCal (.ics)");
        process.exit(1);
    }

    fichierDestination = fs.openSync(fichierDestination, "w+");
    var planning = [iCal1, iCal2]
    var plannings = [];
    for(i=0; i<planning.length; i++){
        plannings.push(parical.parser_ical(planning[i]));
    }
    var planningResultat = pl.getUnionPlannings(plannings);
    seri.convertToIcal(planningResultat, fichierDestination);
    //console.log(planningResultat);
}