# Transient

[![js-happiness-style](https://img.shields.io/badge/code%20style-happiness-brightgreen.svg)](https://github.com/JedWatson/happiness)

A simple and minimal animation loop.  Consistant frame rate is attempted with independant progress timing and requestAnimationFrame.  This library is great for simple transition animations, thus the name, but can also be used to complex animations.

Usage:

```javascript
var animation = require('transient');

var el = document.getElementById('.my-element');

// Create the animation
var fadeIn = new animation({
	duration: 1500, // 1.5 seconds
	draw: function(progress) {
		// progress is an integer between 0 and 1
		el.style.opacity = progress;
	}
});

// Start the animation
fadeIn.start();
```

Options:

- `duration`: The animation duration in milliseconds. default: `5000`
- `fps`: Consistant frames per second for the animation. default: `60`
- `loop`: Should the animation loop? default: `false`
- `draw`: The draw function which is called for each loop.
- `onEnd`: A function to call when the animation is finished.
- `onCancel`: A function to call when the animation is canceled.  If this is not specified it will call the `onEnd` function
