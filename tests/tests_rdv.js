var rdv = require("./../rdv.js");
var pl = require("./../planning.js");

QUnit.extend(QUnit.assert, {
    notOk: function (result, message) {
        message = message || (!result ? "okay" : "failed, expected argument to be falsey, was: " +
        QUnit.dump.parse(result));
        QUnit.push(!result, result, false, message);
    },
});

QUnit.module("Objets RendezVous");

QUnit.test("Intersection de deux RendezVous sans conflit", function(assert){
    var r1 = new rdv.RendezVous("Ménage", "intervenant1", new Date(2015, 11, 23, 17, 00), 120, "lieu1");
    var r2 = new rdv.RendezVous("Repas", "intervenant2", new Date(2015, 11, 23, 19, 00), 120, "lieu1");

    assert.notOk(r1.intersectionMemeLieuOuIntervenant(r2), "Renvoit bien null");
});

QUnit.test("Calcul de la date de fin", function(assert) {
    var r1 = new rdv.RendezVous("Ménage", "intervenant1", new Date(2015, 11, 23, 17, 00), 120, "lieu1");
    assert.deepEqual(r1.getFin(), new Date(2015, 11, 23, 19, 00), "RendezVous de deux heures ok");

    var r2 = new rdv.RendezVous("Ménage", "intervenant1", new Date(2015, 11, 23, 17, 00), 600, "lieu1");
    assert.deepEqual(r2.getFin(), new Date(2015, 11, 24, 3, 00), "RendezVous sur deux jours ok");
});
