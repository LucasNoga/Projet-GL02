/**
 * Fichier faisant l'intermediation entre planInfo et iCalndear il contient la liste des objet RendezVous d'un fichier
 */
var rdv = require("./rdv");
var fs = require('fs');

/** Crée un objet Planning à qui représente la liste des rendez-vous d'un fichier Ical ou planInfo
 *  avec le nom de l'intervenant, la date, l'heure de début, la durée et le lieu.
 * @constructor Planning*/
var Planning = function() {
    this.listeRdv = [];
};

/**@method addRdv, Permet d'ajouter des rendez vous dans el planning
* @param rdv */
Planning.prototype.addRdv = function(rdv) {
    this.listeRdv.push(rdv);
};

/**@method getRdv, function qui retourne le  rendezVous a l'indice i d'un planning
 * @param i, indique la position du rendezVous
 * @return listeRdv[i] retourne l'objet rendezVous a l'indice i du planning
 */
Planning.prototype.getRdv = function(i) {
    return this.listeRdv[i];
};

/**@method afficherPlanning, affiche tous les rendezVous d'un Planning*/
/*Planning.prototype.afficherPlanning = function(){
    console.log(this.listeRdv);
}*/

/**@method getUnionDeuxPlannings, fait l'union de 2 plannings
 * @param p1, le premier planning
 * @param p2, le second planning
 * @return {Planning}, retourne un planning
 */
var getUnionDeuxPlannings = function(p1, p2) {
    var planningUnion = new Planning();
    //On ajoute tous les rdv de p1 puis ceux de p2 dans planningUnion
    for(var i = 0; i < p1.listeRdv.length; i++) {
	var unionRdv = p1.getRdv(i);
        //On ajoute le RendezVous en créant une nouvelle instance (si on l'ajoute
        //directement, l'objet n'est pas copié mais dans les deux Plannings à la
        //fois).
	planningUnion.addRdv(new rdv.RendezVous(
            unionRdv.titre,
            unionRdv.intervenant,
            unionRdv.date_heure,
            unionRdv.duree,
            unionRdv.lieu
        ));
	}
	for(var j = 0; j < p2.listeRdv.length; j++) {
        var unionRdv = p2.getRdv(j);
        planningUnion.addRdv(new rdv.RendezVous(
            unionRdv.titre,
            unionRdv.intervenant,
            unionRdv.date_heure,
            unionRdv.duree,
            unionRdv.lieu
        ));
    }
	return planningUnion;
}


/**@method getUnionPlannings, fait l'union de 2 plannings
 * @param p2, le second planning
 * @return {Planning}, retourne un planning
 */
var getUnionPlannings = function(p) {
    var planningUnion = new Planning();
    for(var i = 0; i < p.length; i++)
		planningUnion=getUnionDeuxPlannings(p[i], planningUnion);
    return planningUnion;
}

/**@method getIntersectionDeuxPlannings
 * @param listPlannings, un tableau de planning contient la liste des planning a tester
 * @return planningIntersction,Planning, un planning contenant les intersections entre tous les plannings deux à deux.*/
var getIntersectionPlannings = function(listPlanning) {
    //On parcourt tous les plannings deux à deux en faisant en sorte de ne pas parcourir deux
    //fois le même couple de planning (et de ne pas traiter un couple formé d'un même planning).
    var planningIntersection = new Planning();
    for(var i = 0; i < listPlanning.length; i++) {
        for(var j = i + 1; j < listPlanning.length; j++) {
            var planningIntersectionDeux = getIntersectionDeuxPlannings(listPlanning[i], listPlanning[j]);
            planningIntersection=getUnionDeuxPlannings(planningIntersection, planningIntersectionDeux);
        }
    }
    return planningIntersection;
}

/**@method getIntersectionDeuxPlannings
 * @param planning1, Planning le premier planning
 * @param planning2, Planning le second planning
 * @return planningIntersection, Planning un planning contenant les intersections entre planning1 et planning2
 * @see getIntersectionPlannings pour avoir une fonction qui supporte plus de deux plannings.*/
var getIntersectionDeuxPlannings = function(planning1, planning2) {
    var planningIntersection = new Planning();
    for(var i = 0; i < planning1.listeRdv.length; i++) { //On itère sur tous les rendez-vous de chaques plannings pour trouver les intersections
        for(var j = 0; j < planning2.listeRdv.length; j++) {
            var intersectionRdv = planning1.getRdv(i).intersectionMemeLieuOuIntervenant(planning2.getRdv(j));
            if(intersectionRdv)
                planningIntersection.addRdv(intersectionRdv);//Il y a bien une intersection, on l'ajoute
        }
    }
    return planningIntersection;
}

/**@method ecrireRapportIntervention, permet d'ecrire les stats d'un planning dans un fichier csv a savoir
 * le nom des intervenants, leurs nombres d'intervention, leurs nombres d'heures
 * @param chemin_rapport le chemin du nouveau fichier csv
 */
Planning.prototype.ecrireRapportIntervention = function(chemin_rapport){
    var cpt_heure = [];
    var cpt_intervention = [];

    for(var i=0; i<this.listeRdv.length;i++){
        var nom=this.getRdv(i).intervenant;
        if (cpt_intervention[nom] == undefined)
            cpt_intervention[nom] = 0;
        cpt_intervention[nom]++;

        if (cpt_heure[nom] == undefined)
            cpt_heure[nom] = 0;
        cpt_heure[nom] += this.getRdv(i).duree / 60;
    }

    var stream = fs.createWriteStream(chemin_rapport);
    stream.once('open', function(fd) {
        stream.write('nom;nombre d\'intervention;nombre d\'heure\n');
        for(var nom in cpt_heure){
            stream.write(nom + ';' + cpt_intervention[nom] + ';' + cpt_heure[nom] + '\n');
        }
    });
};

exports.Planning = Planning;
exports.getUnionPlannings = getUnionPlannings;
exports.getIntersectionPlannings= getIntersectionPlannings;
exports.getIntersectionDeuxPlannings = getIntersectionDeuxPlannings;