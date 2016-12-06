var rdv = require("./../rdv.js");
var pl = require("./../planning.js");
var parical = require("./../parser_ical");

QUnit.extend(QUnit.assert, {
    notOk: function (result, message) {
        message = message || (!result ? "okay" : "failed, expected argument to be falsey, was: " +
        QUnit.dump.parse(result));
        QUnit.push(!result, result, false, message);
    },
});

QUnit.module("Objets Planning");

/*Teste sur le parser*/
QUnit.test("Parser un icalendar", function(assert){
    var planning = parical.parser_ical(__dirname + "/iCalTest.ics");

    QUnit.deepEqual(planning.listeRdv[0].titre, "Infirmière");
    QUnit.deepEqual(planning.listeRdv[0].intervenant, "C. Gross");
    QUnit.deepEqual(planning.listeRdv[0].date_heure.toString(), new Date(2016, 0, 4, 1, 30).toString());
    QUnit.deepEqual(planning.listeRdv[0].duree, 90);
    QUnit.deepEqual(planning.listeRdv[0].lieu, "Troyes");

});

/*Test sur l'union des plannings*/
QUnit.test("Union", function(assert) {
    var planning1 = new pl.Planning();
    planning1.addRdv(new rdv.RendezVous("Massage", "Mme.Silva", new Date(2015, 11, 7, 9, 00), 100, "lieu2"));
    var planning2 = new pl.Planning();
    planning2.addRdv(new rdv.RendezVous("Massage", "M.Gilbert", new Date(2015, 11, 7, 8, 00), 100, "lieu1"));

    var planningUnion = pl.getUnionPlannings([planning1, planning2]);

    QUnit.deepEqual(planningUnion.listeRdv[0].titre, "Massage");
    QUnit.deepEqual(planningUnion.listeRdv[0].intervenant, "M.Gilbert");
    QUnit.deepEqual(planningUnion.listeRdv[0].date_heure, new Date(2015, 11, 7, 8, 00));
    QUnit.deepEqual(planningUnion.listeRdv[0].duree, 100);
    QUnit.deepEqual(planningUnion.listeRdv[0].lieu, "lieu1");

    QUnit.deepEqual(planningUnion.listeRdv[1].titre, "Massage");
    QUnit.deepEqual(planningUnion.listeRdv[1].intervenant, "Mme.Silva");
    QUnit.deepEqual(planningUnion.listeRdv[1].date_heure, new Date(2015, 11, 7, 9, 00));
    QUnit.deepEqual(planningUnion.listeRdv[1].duree, 100);
    QUnit.deepEqual(planningUnion.listeRdv[1].lieu, "lieu2");
});

/*Test sur l'intersection des plannings*/
QUnit.test("Intersection", function(assert) {
    var planning1 = new pl.Planning();
    planning1.addRdv(new rdv.RendezVous("Massage", "Mme.Silva", new Date(2015, 11, 7, 9, 00), 100, "lieu1"));
    var planning2 = new pl.Planning();
    planning2.addRdv(new rdv.RendezVous("Massage", "M.Gilbert", new Date(2015, 11, 7, 8, 00), 100, "lieu1"));
    var planning3 = new pl.Planning();
    planning3.addRdv(new rdv.RendezVous("Massage", "M.Gilbert", new Date(2015, 11, 7, 8, 30), 100, "lieu2"));

    var planningInter = pl.getIntersectionPlannings([planning1, planning2, planning3]);

    QUnit.deepEqual(planningInter.listeRdv[0].titre, "Massage");
    QUnit.deepEqual(planningInter.listeRdv[0].intervenant, "Mme.Silva, M.Gilbert");
    QUnit.deepEqual(planningInter.listeRdv[0].date_heure, new Date(2015, 11, 7, 9, 00));
    QUnit.deepEqual(planningInter.listeRdv[0].duree, 40);
    QUnit.deepEqual(planningInter.listeRdv[0].lieu, "lieu1");

    QUnit.deepEqual(planningInter.listeRdv[1].titre, "Massage");
    QUnit.deepEqual(planningInter.listeRdv[1].intervenant, "M.Gilbert");
    QUnit.deepEqual(planningInter.listeRdv[1].date_heure, new Date(2015, 11, 7, 8, 30));
    QUnit.deepEqual(planningInter.listeRdv[1].duree, 70);
    QUnit.deepEqual(planningInter.listeRdv[1].lieu, "lieu1, lieu2");
});