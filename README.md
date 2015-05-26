#css3d

A very thin multibrowser-compatible abstraction for transforms and animations using CSS3 transform matrices.

## Usage

This package is not really supported yet and is mostly for internal use. Feature requests are welcome, but keep in mind that this is supposed to be LEAN. I will not be introducing any animation features. It is merely a thin abstraction layer to simplify dealing with the matrix.

```
let myElement3d = css3d('.myelement');
let anotherElement3d = css3d(document.getElementById('another-element'));

for (let i=0; i<500; i++) {
    window.requestAnimationFrame(function() {
        myElement3d.setX(i);
    });
}
```

### API

- `getX()` -> Number
- `setX()`
- `setTranslate(x,y)`
- `setScale(x,y)`


## SimpleDrag

This allows you to drag elements on the X axis in a very lean manner. This was mainly created because jQuery UI uses `style.left` for some ungodly reason. Here we use the transform matrix.

Some simple callbacks are provided (`onStart`, `onEnd`, `onUpdate`).

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

This allows you to resize elements on the X axis, including using two fingers. At the moment there are no callbacks, because we don't need them in our implementation (we just resize and look afterwards how big the element is):

```
myElement3d.SimpleResize({
    // min defaults to 0, but can be set here
    max: 500,
});
```