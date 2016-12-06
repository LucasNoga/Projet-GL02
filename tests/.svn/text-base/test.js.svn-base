/**fichier pour tester les tests*/

QUnit.extend(QUnit.assert, {
    notOk: function (result, message) {
        message = message || (!result ? "okay" : "failed, expected argument to be falsey, was: " +
        QUnit.dump.parse(result));
        QUnit.push(!result, result, false, message);
    },
});

QUnit.module("Test de calcul");


QUnit.test('1+1 =2', function(assert) {
    assert.strictEqual(1+1, 2, 'succeed !');
});
QUnit.test('1*1 = 1', function(assert) {
    assert.strictEqual(1*1, 1, 'succeed !');
});


QUnit.test( "a test", function( assert ) {
  function square( x ) {
    return x * x;
  }
  var result = square( 2 );
  assert.equal( result, 4, "square(2) equals 4" );
});