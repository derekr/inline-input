var test = require('tape');
var simulate = require('simulate');

var InlineInput = require('../../');

var _i = document.createElement('input');

test('test original input', function (t) {
    t.plan(2);

    var expected = 'original';

    function validate (val, callback) {
        callback(null);
    }

    _i.value = expected;

    var i = InlineInput(_i, validate);
    i.canValidate(true);

    i.on('data', function (val) {
        t.equal(val, expected + '+', '+ appended to valid value')
    });

    i.on('invalid', function (err) {
        t.fail('invalid should not be emitted');
    });

    i.on('original', function (val) {
        t.equal(val, expected, 'original should be emitted');
    });

    _i.value = expected + '+';
    simulate.keyEvent(_i, 'keyup');

    _i.value = expected;
    simulate.keyEvent(_i, 'keyup');
});
