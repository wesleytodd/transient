/* globals Image */
const Animation = require('../../')

// Go do stuff
init()

// Load the images, then create the animations
async function init () {
  // Size up canvas
  var stage = document.getElementById('stage')
  stage.width = 640
  stage.height = 320

  var canvas1 = await loadImgToCanvas(stage, 'layer-1.png')
  var canvas2 = await loadImgToCanvas(stage, 'layer-2.png')

  // Start animation
  var a = new Animation({
    loop: true,
    duration: 1000 * 10,
    draw: function (progress) {
      var c = stage.getContext('2d')
      var w = stage.width
      var o = -Math.floor(w * progress)
      var o2 = -Math.floor(o * 2)

      // Draw background
      c.drawImage(canvas1, o, 0, w, stage.height)
      c.drawImage(canvas1, o + w, 0, w, stage.height)

      // Draw foreground (goes 2x so needs a third piece)
      c.drawImage(canvas2, o2, 0, w, stage.height)
      c.drawImage(canvas2, o2 + w, 0, w, stage.height)
      c.drawImage(canvas2, o2 + (w * 2), 0, w, stage.height)
    }
  })

  // Start animation
  a.start()
}

async function loadImgToCanvas (stage, src) {
  return new Promise(function (resolve, reject) {
    var img = new Image()
    img.onload = function () {
      var can = document.createElement('canvas')
      can.width = stage.width
      can.height = stage.height

      // Scale the image down
      var c = can.getContext('2d')
      c.drawImage(img,
        // source values
        0, 0, img.width, img.height,
        // dest values
        0, 0, stage.width, stage.height
      )

      resolve(can)
    }
    img.onerror = function (e) {
      reject(e)
    }
    img.src = src
  })
}
