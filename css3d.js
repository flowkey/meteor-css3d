css3d = function(selector) {
    if (!(this instanceof css3d)) return new css3d(selector);

    if (selector instanceof $) {
        this.$el = selector;
        this.el = selector[0];
    } else if (selector instanceof HTMLElement) {
        this.$el = $(selector);
        this.el = selector;
    } else if (_.isString(selector)) {
        this.$el = $(selector);
        this.el = this.$el[0];
    } else {
        throw new Error(
            "You must provide a jQuery object, HTML element, or string containing a (jQuery compatible) CSS selector"
        );
    }

    if (this.el) {
        this.style = this.el.style;
    } else {
        throw new Error(`css3d: ${selector} could not be found", "font-size: larger`);
    }

    this.getMatrix(); // set an initial value for the matrix
};

/*
 * As of November 2018, all relevant mobile browser
 * (chrome, firefox, safari, opera) should define window.TouchEvent
 * Desktop browsers generally don't, but they interprete touches as mouse events.
 * The only Desktop Browser to define window.TouchEvent is Chrome,
 * but it does not interprete mouse clicks as touches in turn.
 * see https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
 */
css3d.touchIsSupported = typeof window.TouchEvent !== "undefined";

css3d.originMatrix = [1, 0, 0, 1, 0, 0];
css3d.matrixRegex = new RegExp(/-?\d+\.?\d*/g);
css3d.check = function(properties) {
    // feature discovery given an array of potential style prefixes
    var root = document.documentElement;
    for (var i = 0; i < properties.length; i++) {
        if (properties[i] in root.style) {
            return properties[i];
        }
    }
};

css3d.delay = css3d.check(["transitionDelay", "webkitTransitionDelay"]);
css3d.transform = css3d.check(["transform", "webkitTransform", "msTransform"]);
css3d.duration = css3d.check(["transitionDuration", "webkitTransitionDuration"]);
css3d.easing = css3d.check(["transitionTimingFunction", "webkitTransitionTimingFunction"]);

var makeObjFromMatrix = function(args) {
    if (_.isObject(args) && !_.isArray(args)) return args;
    var args = _.isArray(args) ? args : _.toArray(arguments);
    return _.object(["scaleX", undefined, undefined, "scaleY", "x", "y"], args); // undefined are unused
};

_.extend(css3d.prototype, {
    _registeredListeners: [],
    destroy: function() {
        this._registeredListeners.forEach(listenerName => {
            if (this[listenerName]) {
                this[listenerName].destroy();
                this[listenerName] = null;
            }
        });

        this.style = null;
        this.$el = null;
        this.el = null;
    },

    getString: function() {
        return window.getComputedStyle(this.el)[css3d.transform];
    },

    getMatrix: function() {
        var array = this.getString().match(css3d.matrixRegex);

        if (!array || array.length !== 6) {
            // console.warn(this.el, "isn't using a transform matrix!");
            // override so we can at least start transforming from here
            array = css3d.originMatrix.slice(0); // make a copy
        }

        return (this.matrix = array.map(function(value) {
            return value * 1; // co-erce value into a number
        }));
    },

    get: function() {
        // Return coordinates x, y, z etc.
        return makeObjFromMatrix(this.getMatrix());
    },

    getScaleX: function() {
        return this.getMatrix()[0];
    },

    getX: function() {
        return this.getMatrix()[4];
    },

    getTranslate: function() {
        return this.getX();
    },

    getRotation: function() {
        var rotation = this.el.style[css3d.transform].match(/(rotate\w\()(-?\d+\.?\d+)(deg\))/);
        return (rotation && rotation[2]) || 0;
    },

    setMatrix: function(matrix) {
        this.overrideMatrix(matrix);
        this.style[css3d.transform] = "matrix(" + this.matrix.join(",") + ")";
    },

    setTranslate: function(x, y) {
        if (x === undefined) x = 0;
        if (y === undefined) y = 0;
        this.style[css3d.transform] =
            "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " + x + ", " + y + ", 0, 1)";
    },

    setRotation: function(degrees) {
        degrees = degrees || 0;
        this.style[css3d.transform] = "rotateZ(" + degrees + "deg)";
    },

    setScale: function(x, y) {
        if (x === undefined) x = 1;
        if (y === undefined) y = 1;
        this.style[css3d.transform] =
            "matrix3d(" + x + ", 0, 0, 0, 0, " + y + ", 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
    },

    overrideMatrix: (function() {
        var j; // outside the scope of garbage colleciton
        return function(newM) {
            if (!newM || newM.length < 6) return this.getMatrix();
            j = newM.length;
            while (j--) {
                if (newM[j] !== undefined) this.matrix[j] = newM[j];
            }
        };
    })(), // make a closure on start
});
