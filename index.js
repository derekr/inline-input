/**
 * inline-input
 *
 * Returns a function that takes in input and will be validated
 * based on the provided namespace.
 *
 * @author Derek Reynolds <drk@diy.org>
 */

/**
 * Dependencies
 */
var hasChanged = require('input-has-changed');
var events = require('events');
var inherits = require('inherits');

function InlineInput ($el, validate) {
    if (!(this instanceof InlineInput)) return new InlineInput($el, validate);

    var me = this;

    this.$el = $el;
    this.change = hasChanged($el);

    this.canValidate(false);

    if (validate.schema && validate.schema.maxLength) {
        this.$el.setAttribute('maxlength', validate.schema.maxLength);
    }

    /**
     * Check if initial input is valid so we can emit relevant validation
     * events if the input has been valid at least once.
     */
    validate(this.$el.value, function (err) {
        if (err) {
            process.nextTick(function () {
                me.emit('invalid', err);
            });
        }

        me.canValidate((!err));

        me.change.on('changed', function (val) {
            validate(val, function (err, msg) {
                if (err) {
                    if (!me.canValidate()) return;
                    return me.emit('invalid', err, msg);
                }

                if (!me.canValidate()) me.canValidate(true);
                me.emit('data', val);
            });
        });

        me.change.on('original', function (val) {
            me.canValidate(false);
            me.emit('original', val);
        });
    });
}

inherits(InlineInput, events.EventEmitter);

InlineInput.prototype.update = function () {
    this.change.update(this.$el.val());
};

InlineInput.prototype.canValidate = function (canValidate) {
    if (typeof canValidate === 'undefined') return this._canValidate;

    this._canValidate = canValidate;
};

/**
 * Exports
 *
 * @param {Object} $el - Input element
 *
 * @returns {EventEmitter}
 */
module.exports = InlineInput;
