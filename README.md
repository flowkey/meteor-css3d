#css3d

A very thin multibrowser-compatible abstraction for transforms and animations using CSS3 transform matrices.

## Usage

This package is not really documented yet and is mostly for internal use. Feature requests are welcome (but pull requests will more likely be acted upon) - keep in mind that this is supposed to be LEAN. I will not be introducing any animation features, for example. It is merely a thin-as-possible abstraction layer to simplify dealing with the transform matrix.

Most of the functions only work for the X-Axis, because that's all we've needed so far. There are some exceptions to this, see `.setTranslate(x, y)` and `.setScale(x,y)`, under __API__ below.

```
let myElement3d = css3d('.myelement');
let anotherElement3d = css3d(document.getElementById('another-element'));

for (let i=0; i<500; i++) {
    window.requestAnimationFrame(function() {
        myElement3d.setX(i);
    });
}
```

If you want to work directly with the element's `.style` property, browser prefixes are also dealt with in a lean manner:

```
    myElement3d.style[css3d.transform] = "translate3d(0,50px,0)";
```

You can also `css3d.duration` (i.e. `transitionDuration`) and `css3d.easing` (i.e. `transitionTimingFunction`)

Note: these are the prefixed versions, depending on current browser. It is a monofill, NOT a polyfill, per se. i.e. only one property will be set (again, better performance).


## API

- `getX()` -> Number
- `setX()`
- `setTranslate(x,y)`
- `setScale(x,y)`


## SimpleDrag

This allows you to drag elements on the X axis in a very lean manner. This was mainly created because jQuery UI uses `style.left` for some ungodly reason. Here we use the transform matrix.

Some simple callbacks are provided (`onStart`, `onEnd`, `onUpdate`). It's ok not to set these callbacks.

```
myElement3d.SimpleDrag({
    // min defaults to 0, but can be set here
    max: sheet.realSongWidth,
    onStart: function () {
        console.log("You started dragging")
    },
    onUpdate: function (current, max) {
        if (current === max) {
            console.log("You have reached the end of the allowed drag area");
        }
    },
    onEnd: function () {
        if (!this.dragging) {
            alert("You didn't actually drag me, you just clicked!");
        }
    }
});
```


## SimpleResize

This allows you to resize elements on the X axis, including resizing both edges at once using two fingers. At the moment there are no callbacks, because we don't need them in our implementation (we just resize and look afterwards how big the element is):

```
myElement3d.SimpleResize({
    // min defaults to 0, but can be set here
    max: 500,
});
```