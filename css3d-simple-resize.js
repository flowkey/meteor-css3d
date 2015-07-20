'use strict';

css3d.prototype.SimpleResize = function(options) {
    _.defaults(options, {resizable3d: this});

    if (this.resizer) this.resizer.destroy();
    this.resizer = new SimpleResize(options);
};

var SimpleResize = function(options) {

    _.extend(this, options);

    this.min = this.min || 0;

    this.rootOffset = this.min;
    this.offsetX = [0.0, 0.0];

    this.resizing = false;

    this.tap = this.tap.bind(this);
    this.drag = this.drag.bind(this);
    this.pinch = this.pinch.bind(this);
    this.release = this.release.bind(this);

    // It's important to have both events:
    // e.g. MS Surface supports both depending on touch or stylus click
    if (typeof window.ontouchstart !== 'undefined') {
        this.resizable3d.el.addEventListener('touchstart', this.tap);
    }

    this.resizable3d.el.addEventListener('mousedown', this.tap);
}

_.extend(SimpleResize.prototype, {
    tap: function(e) {

        this.resizable3d.style[css3d.duration] = 0;

        this.resizing = false;
        this.reference0 = this.xpos(e);

        if (e.targetTouches && e.targetTouches.length > 1) {
            this.reference0 = getTouchPoint(e, 0);

            // Set rootOffset to the left-most touch point:
            this.rootOffset = this.reference0 - this.resizable3d.el.parentElement.getBoundingClientRect().left;

            window.removeEventListener('touchmove', this.drag);
            window.addEventListener('touchmove', this.pinch);
            window.addEventListener('touchend', this.release);
            return false; // cancel any other click handlers
        }

        // Store a reference for where each of the drag handles are:
        this.offsetX = [0, parseInt(this.resizable3d.style.width)];
        this.rootOffset = this.resizable3d.getX();

        // Store which handle we're dragging from ...
        if (this.xOffset(e) < 20) { // 20 is the number of pixels overlapping from the transparent resize areas
            this.curDragHandle = 0; // the drag handle on the left
        } else if (this.offsetX[1] - this.xOffset(e) < 20) { // within 20px of resizable el's width
            this.curDragHandle = 1; // the drag handle on the right
        } else {
            return; // we're not resizing, don't set up any other listeners etc
        }

        this.resizable3d.el.classList.add('resizing');

        if (typeof window.ontouchstart !== 'undefined') {
            window.addEventListener('touchmove', this.drag);
            window.addEventListener('touchend', this.release);
        }

        window.addEventListener('mousemove', this.drag);
        window.addEventListener('mouseup', this.release);

        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
    },

    drag: function(e) {
        var x, delta;
        // 'x' & 'reference' are in the window space (clientX)
        x = this.xpos(e);
        delta = this.reference0 - x;

        if (delta > 2 || delta < -2) {
            this.resizing = true;
            this.reference0 = x;

            this.offsetX[this.curDragHandle] -= delta;

            this.resize(); // uses offsetX[n0, n1]
        }

        // e.stopPropagation();
        e.preventDefault();
        // return false;
    },

    pinch: function(e) {
        // We get here when we're __touching__ with >= 2 fingers
        this.offsetX[0] = getTouchPoint(e, 0);
        this.offsetX[1] = getTouchPoint(e, 1);

        this.resizable3d.setTranslate(this.rootOffset + this.offsetX[0] - this.reference0);
        this.resizable3d.style.width = Math.max(90, this.offsetX[1] - this.offsetX[0]) + 'px';

        e.preventDefault();
    },

    resize: function() {
        // We get here when dragging one(!) of the loop handles
        // (example) this.offsetX === [-5, 395];
        var leftAnchor = Math.min(this.offsetX[0], this.offsetX[1]) + this.rootOffset;
        leftAnchor = Math.max(0, Math.min(leftAnchor, this.max)); // bounds check

        var width = Math.max(this.offsetX[0], this.offsetX[1]) + this.rootOffset - leftAnchor;
        width = Math.max(90, Math.min(width, this.max - leftAnchor)); // bounds check
        width += 'px'; // deliberately on a new line for memory efficiency

        this.resizable3d.setTranslate(leftAnchor);
        this.resizable3d.style.width = width;
    },

    release: function(e) {
        this.resizable3d.style[css3d.duration] = null;
        this.resizable3d.el.classList.remove('resizing');

        if (typeof window.ontouchstart !== 'undefined') {
            if (e.touches && e.touches.length < 2) {
                window.removeEventListener('touchmove', this.pinch);
            }
            window.removeEventListener('touchmove', this.drag);
            window.removeEventListener('touchend', this.release);
        }
        window.removeEventListener('mousemove', this.drag);
        window.removeEventListener('mouseup', this.release);

        this.resizing = false;
        e.preventDefault();
    },

    xOffset: function(e, finger) {
        // touch event
        if (e.touches && e.touches.length >= 1) {
            return e.touches[finger || 0].pageX - this.resizable3d.el.getBoundingClientRect().left;
        }

        // mouse event
        // offsetX doesn't exist in firefox, but getBoundingClientRect does
        return e.offsetX || e.pageX - this.resizable3d.el.getBoundingClientRect().left;
    },

    xpos: function(e) {
        // touch event
        if (e.touches && e.touches.length >= 1) {
            return e.touches[0].clientX;
        }

        // mouse event
        return e.clientX;
    },

    destroy: function() {
        if (typeof window.ontouchstart !== 'undefined') {
            this.resizable3d.el.removeEventListener('touchstart', this.tap);
        }

        this.resizable3d.el.removeEventListener('mousedown', this.tap);
    }
});

// touch point 0 is the left-most touch point
// touch point 1 is the right-most touch point
function getTouchPoint(e, point) {
    return Math[point === 1 ? 'max' : 'min'](e.touches[0].pageX, e.touches[1].pageX);
}
