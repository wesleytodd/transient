# Transient

[![NPM Version](https://img.shields.io/npm/v/transient.svg)](https://npmjs.org/package/transient)
[![NPM Downloads](https://img.shields.io/npm/dm/transient.svg)](https://npmjs.org/package/transient)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![image](/wesleytodd/transient/blob/master/examples/little-scene/scene.gif)

A simple and minimal animation loop.  Consistent frame rate's are achieved with `requestAnimationFrame` and high resolution timing. 
This library is great for simple transition animations, thus the name, but can also be used for complex animations.

Usage:

```javascript
const Animation = require('transient')
const el = document.getElementById('.my-element')

// Create the animation
var fadeIn = new Animation({
  duration: 1500, // 1.5 seconds
  draw: function (progress) {
    // progress is an integer between 0 and 1
    el.style.opacity = progress;
  }
})

// Start the animation
fadeIn.start()
```

Options:

- `duration`: The animation duration in milliseconds. default: `5000`
- `fps`: Consistant frames per second for the animation. default: `60`
- `loop`: Should the animation loop? default: `false`
- `draw`: The draw function which is called for each loop.
- `onEnd`: A function to call when the animation is finished.
- `onCancel`: A function to call when the animation is canceled.  If this is not specified it will call the `onEnd` function

## Advanced Usage

This package's main export is perfect for handling single animations, but it also exports a loop for more complex work.  A single
loop can be started for general animation use, and many `Transient` animation instances can be attached to one loop.  Here is an example:

```javascript
const Animation = require('transient')
const Loop = require('transient/loop') // or const Loop = Animation.Loop

// Only use one loop to syncronize the animations
var l = new Loop()

var moveBackground = new Animation({
  duration: 1000 * 10, // 10s
  animationLoop: l,
  draw: function (progress) {
    // Draw background
  }
})
var moveForeground = new Animation({
  duration: 1000 * 5, // 5s
  animationLoop: l,
  draw: function (progress) {
    // Draw foreground
  }
})

// Start the animations
moveBackground.start()
moveForeground.start()
```
