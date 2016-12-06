/**
 * Crée un objet Aide qui permet d'afficher le readme ou bien d'aaficher lalliste des commandes disponibles en cas d'erreur
 */

var fs = require("fs");

/**@constructor Aide, constructeur de lobjet Aide*/
var Aide = function(){}

/**@method afficherAide, permet d'afficher le fichier ReadMe du projet*/
Aide.prototype.afficherAide = function(){
    console.log("\n\n\n\t\t\t\t\t\t\t\t\t\t\tAffichage du README\n\n");
    fs.readFile("../Readme.md", "utf-8", function(err, data){
        if (err)
            return console.log(err);
        else
            console.log(data);
    });
};

/**@method affichageFausseCommande, cette methode affiche la liste des commandes possibles*/
Aide.prototype.affichageFausseCommande = function() {
    console.error("Main : La commande saisie est inconnue.");
    console.log("voici la liste des commandes possibles");
    var commandes = ["Importer des plannings", "Détecter des conflits entre 2 plannings", "Exporter un planning au format PlanInfo",
        "Exporter un planning au format iCal","Afficher un planning","Affiche le fichier ReadMe","Affiche la version de la librairie"];
    for(var i in commandes){
        console.log("commande "+ i + " : "+ commandes[i]);
    }
    console.log("Consultez le fichier README.txt pour obtenir des détails supplémentaires.");
};


var aide = new Aide();
module.exports = aide; //exporation de l'objet
