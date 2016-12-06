
var pl = require('./planning.js');

var Intervenant = function (nom, prenom, travail, planning) {
    this.nom = nom;
    this.prenom = prenom;
    this.travail = travail;
    this.planning = this.findAllRdv(planning);
};

/**@method getNom, retourne le nom de l'intervenant
 * @return nom, le nom de l'intervenant
 */
Intervenant.prototype.getNom = function () {
    return this.nom;
};

/**@method getPrenom, retourne le prénom de l'intervenant
 * @return prenom, le prénom de l'intervenant
 */
Intervenant.prototype.getPrenom = function () {
    return this.prenom;
};

/**@method getTravail, retourne le travail de l'intervenant
 * @return adresse, le travail de l'intervenant
 */
Intervenant.prototype.getTravail = function () { 
    return this.travail;
};

/**@method getPlanning, retourne le planning de l'intervennant
 * @return planning, le planning de l'intervennant
 */
Intervenant.prototype.getPlanning = function () {
    return this.planning;
};

/**@method checkRdv, verifie si l'intervenant est bien le nom de l'intervenant
 * @param rdv le rendezvous testé
 * @return rdv, le rendezvous si il est valide
 */
Intervenant.prototype.checkRdv = function (rdv) {
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
Intervenant.prototype.findAllRdv = function (planning) {
    var tmpPlanning = new pl.Planning();
    //console.log(planning.length);
    for (var i = 0; i < planning.length; i++) {
        if (this.checkRdv(planning[i])) {
            tmpPlanning.addRdv(this.checkRdv(planning[i]));
        }
    }
    return tmpPlanning;
};
    
exports.Intervenant = Intervenant;

