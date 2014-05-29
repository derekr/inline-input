# inline-input

#### Generic inline input event emitter.

Will validate an input field w/ the provided validation callback. It
uses `input-has-changed` to validate as input is entered for inline validating.

```
npm install inline-input
```

# Usage

```js
var InlineInput = require('inline-input');

var $email = document.createElement('input');
$email.setAttribute('type', 'email');

var e = InlineInput($email, function (val, callback) {
    // really simple and not real email check
    var hasEmailThings = (
        val.indexOf('@') > -1 &&
        val.indexOf('.') > -1
    );

    if (hasEmailThings) return callback(null);

    callback({
        error: 'invalid-email',
        msg: 'Your email does NOT look right! o_O'
    });
});

e.on('data', function (val) {}); // input is valid
e.on('invalid', function (err) {}); // input is invalid
e.on('original', function (val) {}); // input has returned to original state
```

This will validate the input as it's entered. If the field has data on
instantiation it's validated before input. It's designed to be user friendly
so it will only start emitting events after the first `data` even – so on
the first occurance of valid data. If the input then becomes invalid the
`invalid` event is emitted. You can change this behavior by calling
`canValidate` and passing true before input is entered.

```
// This will emit `invalid` even before valid input is entered
e.canValidate(true);
```

# var i = InlineInput($input, function (value, callback) {});

Instantiate by providing a (for now) `text` type input and a validation
callback w/ `value` and `callback` arguments.

Your validation function should call `callback` w/ `null` if the value is
valid or an error object `{ error: 'error-key', msg: 'friendly msg' }` if
the value is invalid.

# i#data

Emitted when the input is valid and passed the input value.

# i#invalid

Emitted when the input is invalid.

# i#original

Emitted when the input is returned to the initial state.

# i.update(val)

To update the original input value.

This is useful for things like saving off the input and
resestting validation.

```js
i.on('data', function (val) {
    save(val, function () {
        // reset form state
        i.update(val);
    });
});
```

# i.canValidate(boolean)

Force `invalid` to be emitted even if `valid` never emitted.
