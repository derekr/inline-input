var test = require('tape');
var simulate = require('simulate');

var InlineInput = require('../../');

var _i = document.createElement('input');

test('test valid input', function (t) {
    t.plan(1);

    function validate (val, callback) {
        callback(null);
    }

    _i.value = 'initial';

    var i = InlineInput(_i, validate);
    var expected = 'test';

    i.on('data', function (val) {
        t.equal(val, expected, 'valid input emits data');
    });

    i.on('invalid', function () {
        t.fail('invalid should not be emitted');
    });

    i.on('original', function () {
        t.fail('original should not be emitted');
    });

    _i.value = expected;
    simulate.keyEvent(_i, 'keyup');
});
