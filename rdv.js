/**@constructor RendezVous
 * @param String, titre le titre du rendez-vous
 * @param String, intervenant l'intervenant du rendez-vous
 * @param Date, date_heure la date et l'heure du début du rendez-vous
 * @param int, duree la duree en minute
 * @param String, lieu le lieu du rendez-vous
 * Crée un objet RendezVous à partir du nom de l'intervenant, de la date et heure de début, de la durée et du lieu.*/
var RendezVous = function(titre, intervenant, date_heure, duree, lieu) {
    this.titre = titre
    this.intervenant = intervenant;
    this.date_heure = date_heure;
    this.duree = duree;
    this.lieu = lieu;
};

//retourne le titre//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
RendezVous.prototype.getTitre = function () {
    return this.titre;
};
/**@method getIntervenant,
 * @return String intervenant, le nom d'intervenant*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
RendezVous.prototype.getIntervenant = function () {
    return this.intervenant;
};

/**@method getDebut
 * @return Date, date_debut qui indique la date de debut du rendez-vous*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
RendezVous.prototype.getDebut = function() {
    return this.date_heure;
};

/**@method getFin
 * @return Date, date_fin qui indique la date de fin du rendez-vous*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
RendezVous.prototype.getFin = function() {
    var date_fin = new Date();
    date_fin.setTime(this.date_heure.getTime() + this.duree * 1000 * 60) /* Conversion en millisecondes de la durée */
    return date_fin;
};

//retour la duree///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
RendezVous.prototype.getDuree = function () {
    return this.duree;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
RendezVous.prototype.getLieu = function () {
    return this.lieu;
};

/**@method intersectionHeures
 * @param autreRdv, RendezVous l'autre rendez-vous à tester
 * @param predicat, function une fonction retournant un booléan et prenant deux RendezVous en paramètre.
 * @return new RendezVous ou null depedemment d'une présence d'un conflit ou non*/
RendezVous.prototype.intersectionHeures = function(autreRdv, predicat) {
    //Le deux rendez-vous se chevauchent et ont le même lieu ou intervenant.
    if(predicat(this, autreRdv) &&
        ((this.getDebut() >= autreRdv.getDebut()
        && this.getDebut() < autreRdv.getFin())
        || (this.getFin() > autreRdv.getDebut()
        && this.getFin() <= autreRdv.getFin()))){ //Si les intrevenants on affiche les deux noms.

        var intervenantsDeuxRdv = this.intervenant + (this.intervenant === autreRdv.intervenant ? "" : ", " + autreRdv.intervenant);
        var domicilesDeuxRdv = this.lieu + (this.lieu === autreRdv.lieu ? "" : ", " + autreRdv.lieu);  //Même chose pour les domiciles
        var titreDeuxRdv = this.titre + (this.titre === autreRdv.titre ? "" : ", " + autreRdv.titre);  //Même chose pour le titre

        //On crée un rendez-vous qui représente l'intersection des deux rendez-Vous
        return new RendezVous( titreDeuxRdv, intervenantsDeuxRdv,
            new Date(Math.max(this.getDebut().getTime(), autreRdv.getDebut().getTime())),
            (Math.min(this.getFin().getTime(), autreRdv.getFin().getTime()) - Math.max(this.getDebut().getTime(),
            autreRdv.getDebut().getTime()))/(1000*60),
            domicilesDeuxRdv );
    }else
        return null;
}

/**@method intersectionMemeLieu
 * @param RendezVous, autreRdv l'autre rendez-vous à tester
 * @return intersectionHeures, un callback qui test le lieu des deux rendez vous*/
RendezVous.prototype.intersectionMemeLieu = function(autreRdv) {
    return this.intersectionHeures(autreRdv, function(rdv1, rdv2) {
        return rdv1.lieu === rdv2.lieu;
    });
};

/**@method intersectionMemeIntervenant
 * @param RendezVous, autreRdv l'autre rendez-vous à tester
 * @return RendezVous, un rendez-vous représentant le conflit s'il y en a un*/
RendezVous.prototype.intersectionMemeIntervenant = function(autreRdv) {
    return this.intersectionHeures(autreRdv, function(rdv1, rdv2){
        return rdv1.intervenant === rdv2.intervenant;
    });
};

/**@method intersectionMemeLieuOuIntervenant
 * @param RendezVous, autreRdv l'autre rendez-vous à tester
 * @return RendezVous, un callback qui test si les intervenants ont le même nom ou le lieu*/
RendezVous.prototype.intersectionMemeLieuOuIntervenant = function(autreRdv) {
    return this.intersectionHeures(autreRdv, function(rdv1, rdv2) {
        return ((rdv1.intervenant === rdv2.intervenant) || (rdv1.lieu === rdv2.lieu));
    });
};

exports.RendezVous = RendezVous;
