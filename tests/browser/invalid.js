var test = require('tape');
var simulate = require('simulate');

var InlineInput = require('../../');

var _i = document.createElement('input');

test('test invalid input', function (t) {
    /**
     * Should emit invalid once on initialization and again
     * for the keyup trigger
     */
    t.plan(4);

    var expected = 'error';
    var expectedMsg = 'Oops!';

    function validate (val, callback) {
        callback({
            error: expected,
            msg: expectedMsg
        });
    }

    _i.value = 'initial';

    var i = InlineInput(_i, validate);
    i.canValidate(true);

    i.on('data', function () {
        t.fail('data should not be emitted');
    });

    i.on('invalid', function (err) {
        t.equal(err.error, expected, 'invalid should emit w/ err');
        t.equal(err.msg, expectedMsg, 'invalid should emit w/ msg');
    });

    i.on('original', function () {
        t.fail('original should not be emitted');
    });

    _i.value = 'blah';
    simulate.keyEvent(_i, 'keyup');
});
