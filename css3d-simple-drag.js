'use strict';

css3d.prototype.SimpleDrag = function (options) {
    // Clone options to avoid changing object input by calling function.
    // This ensures no references to dead DOM elements are retained.
    // Also prevents SimpleDrag getting "stuck" with dead DOM els:
    if (_.isObject(options)) options = _.clone(options);
    else options = {};
    
    _.defaults(options, {movable3d: this});
    
    if (this.draggable) this.draggable.destroy();
    this.draggable = new SimpleDrag(options);
};

var SimpleDrag = function (options) {
    
    _.extend(this, options);
    
    this.min = this.min || 0;
    this.offset = this.min;

    this.dragging = false;

    this.tap = this.tap.bind(this);
    this.drag = this.drag.bind(this);
    this.release = this.release.bind(this);

    this.animFrame;
    
    // Callbacks when something happens
    this.onEnd = (this.onEnd || function () {}).bind(this);
    this.onStart = (this.onStart || function () {}).bind(this);
    this.onUpdate = (this.onUpdate || function () {}).bind(this);

    // Set up the click handlers (without these nothing happens)
    if (typeof window.ontouchstart !== 'undefined') {
        this.movable3d.el.addEventListener('touchstart', this.tap);
    }
    this.movable3d.el.addEventListener('mousedown', this.tap);
}


_.extend(SimpleDrag.prototype, {
    tap: function (e) {
        
        this.movable3d.style[css3d.duration] = 0;

        this.dragging = false;
        this.reference = this.xpos(e);

        this.offset = e.synthetic ? this.reference : this.movable3d.getX();

        if (typeof window.ontouchstart !== 'undefined') {
            if (e.targetTouches.length && e.targetTouches.length > 1) {
                // disable drag with two or more fingers
                // this allows us to resize and do other things
                this.killEventHandlers();
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
            window.addEventListener('touchmove', this.drag);
            window.addEventListener('touchend', this.release);
        }
        window.addEventListener('mousemove', this.drag);
        window.addEventListener('mouseup', this.release);

        this.onStart(this.offset, this.max);

        e.stopPropagation();
        e.preventDefault();
        // return false;
    },

    drag: function (e) {
        var x, delta;

        x = this.xpos(e);
        delta = this.reference - x;
        
        if (!this.dragging && Math.abs(delta) > 1) {
            // Make it easier to just "click" (not drag) a draggable
            this.dragging = true;
        }

        this.reference = x;
        this.scroll(this.offset - delta);

        // e.stopPropagation();
        e.preventDefault();
        // return false;
    },

    killEventHandlers: function () {
        if (typeof window.ontouchstart !== 'undefined') {
            window.removeEventListener('touchmove', this.drag);
            window.removeEventListener('touchend', this.release);
        }
        window.removeEventListener('mousemove', this.drag);
        window.removeEventListener('mouseup', this.release);
    },

    release: function (e) {
        
        this.movable3d.style[css3d.duration] = null;
        this.killEventHandlers();
        this.onEnd(this.offset, this.max);

        this.dragging = false;
        e.preventDefault();
        e.stopPropagation(); 
        return false;
    },

    xpos: function (e) {
        // touch event
        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            return e.targetTouches[0].clientX;
        }

        // mouse event
        return e.clientX;
    },

    scroll: function (x) {
        this.offset = (x < this.min) ? this.min : (x > this.max) ? this.max : x;
        this.movable3d.setTranslate(this.offset);

        window.cancelAnimationFrame(this.animFrame);
        this.animFrame = window.requestAnimationFrame(this.onUpdate.bind(this, this.offset, this.max));
    },

    destroy: function () {
        if (typeof window.ontouchstart !== 'undefined') {
            this.movable3d.el.removeEventListener('touchstart', this.tap);
        }
        this.movable3d.el.removeEventListener('mousedown', this.tap);
    }
});
