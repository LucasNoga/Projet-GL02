/**
 * Fichier représentant un client
 */

var planning = require("./planning");
/**
 * @constructor Client
 * Crée un objet Client, en spécifiant son nom, prenom, adresse et planning
 *
 * @param nom
 * Un String pour le nom du client
 * @param prenom
 * Un String pour le prénom du client
 * @param adresse
 * Un String pour l'adresse du client
 * @param planning
 * Un objet planning associé au Client
 */
var Client = function(nom, prenom, adresse, planning){
    this.nom = nom;
    this.prenom = prenom;
    this.adresse = adresse;
    this.planning = planning;
};

/**@method getNom, retourne le nom du client
 * @return nom
 */
Client.prototype.getNom = function(){
    return this.nom;
}

/**@method getPrenom, retourne le prénom du client
 * @return prenom
 */
Client.prototype.getPrenom = function(){
    return this.prenom;
}

/**@method getAdresse, retourne l'adresse du client
 * @return adresse
 */
Client.prototype.getAdresse = function(){
    return this.adresse;
}

/**@method getPlanning, retourne le planning du client
 * @return planning
 */
Client.prototype.getPlanning = function () {
    return this.planning;
}

/**@method checkRdv, verifie si l'intervenant est bien le nom du client
 * @param rdv le rendezvous testé
 * @return rdv, le rendezvous si il est valide
 */
Client.prototype.checkRdv = function (rdv) {
    if (rdv.getIntervenant() == this.getNom()) {
        return rdv;
    }
    else
        return false;
};

/**@method findAllRdv, trouve tous les rdv de client d'un planning
 * @param planning le planning testé
 * @return tmpPlanning, le planning avec les rendezvous correspondant au client
 */
Client.prototype.findAllRdv = function (planning) {
    var tmpPlanning = new plan.Planning();
    //console.log(planning.length);
    for (var i = 0; i < planning.length; i++) {
        if (this.checkRdv(planning[i])) {
            tmpPlanning.addRdv(this.checkRdv(planning[i]));
        }
    }
    return tmpPlanning;
};
    
exports.Client = Client;
