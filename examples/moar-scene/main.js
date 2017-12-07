/* globals Image */
const Node = require('scenik')
const Animation = require('../../')
const Loop = require('../../loop')

// Go do stuff
init()

// Load the images, then create the animations
async function init () {
  // Size up canvas
  var stage = document.getElementById('stage')
  stage.width = 640
  stage.height = 320

  // Load up our images
  var [[err1, bg1Canvas], [err2, bg2Canvas], [err3, characterCanvas]] = await loadAssets([
    'layer-1.png',
    'layer-2.png',
    'character.png'
  ])
  if (err1 || err2 || err3) {
    return console.error(err1 || err2 || err3)
  }

  // Create the scene tree root
  var scene = new Node({
    name: 'scene'
  })

  // Setup the background, returns the two layers for different animations
  var [bg, bg1, bg2] = setupSceneBackground(bg1Canvas, bg2Canvas)
  scene.add(bg)

  // Setup the character
  var character = new Node({
    name: 'character',
    x: 0,
    y: 0,
    z: 1,
    img: characterCanvas
  })
  // scene.add(character)

  // Create the animation loop
  var loop = new Loop()

  // Animation to move the background state
  var bg1Animation = scrolllingAnimation(bg1, loop, stage, 1000 * 10)
  var bg2Animation = scrolllingAnimation(bg2, loop, stage, 1000 * 5)
  var characterSprite = spriteAnimation(character, loop, stage, 1000 * 5)

  // Render on tick
  loop.onTick(function () {
    // Dont render if not changed
    if (!scene.changed) {
      return
    }

    render(scene, stage)

    // Mark as rendered
    scene.changed = false
  })

  // Start animations
  bg1Animation.start()
  bg2Animation.start()
}

function render (scene, stage) {
  var sc = stage.getContext('2d')
  renderLayer(scene)

  function renderLayer (layer) {
    layer.forEachChild(function (l) {
      // Recurse into the layer
      if (l.children) {
        return renderLayer(l)
      }
      
      // Accumulate the x and y positions
      // @TODO: this is less efficent that it could be, it
      // should accumulate x/y as it recurses in so it
      // doesnt have to loop back out
      var x = l.state.x
      var y = l.state.y
      var p
      while (p = (p || l).parent) {
        x += (p.state.x || 0)
        y += (p.state.y || 0)
      }
      sc.drawImage(l.state.img, x, y, l.state.width, l.state.height)
    })
  }
}

function setupSceneBackground (bg1Canvas, bg2Canvas) {
  // Background layers
  var bg1 = new Node({
    name: 'bg1',
    z: 0
  })
  var bg2 = new Node({
    name: 'bg2',
    z: 1
  })

  // Create two tiles of the background
  for (var i = 0; i < 2; i++) {
    bg1.add(new Node({
      name: 'bg1' + i,
      x: i * bg1Canvas.width,
      y: 0,
      z: 0,
      width: bg1Canvas.width,
      height: bg1Canvas.height,
      img: bg1Canvas
    }))
  }

  // Create three tiles of the ground background
  for (var i = 0; i < 2; i++) {
    bg2.add(new Node({
      name: 'bg2' + i,
      x: i * bg2Canvas.width,
      y: bg1Canvas.height - bg2Canvas.height,
      z: 0,
      width: bg2Canvas.width,
      height: bg2Canvas.height,
      img: bg2Canvas
    }))
  }

  return [new Node({
    name: 'bg',
    z: 0
  }, [bg1, bg2]), bg1, bg2]
}

function scrolllingAnimation (node, loop, stage, duration) {
  return new Animation({
    animationLoop: loop,
    loop: true,
    duration: duration,
    fps: 30,
    draw: function (progress) {
      node.setState({
        x: -Math.floor(stage.width * progress)
      })
    }
  })
}

function spriteAnimation (node, loop, stage, duration) {
  console.log(node.state.img.width, node.state.img.height)
  return new Animation({
    animationLoop: loop,
    loop: true,
    duration: duration,
    draw: function (progress) {
      var frame = Math.min(10, Math.ceil(10 * progress)) - 1

      var frameWidth = node.state.img.width / 5
      var frameHeight = node.state.img.height / 2

      var x = frame % 5 * frameWidth
      var y = Math.floor(frame / 5) * frameHeight

      console.log({
        frame: frame,
        x: x,
        y: y,
        width: frameWidth,
        height: frameHeight
      })
    }
  })
}

function loadAssets (assets) {
  return Promise.all(assets.map(function (a) {
    return loadImgToCanvas(a)
  }))
}

function loadImgToCanvas (src) {
  return new Promise(function (resolve, reject) {
    var img = new Image()
    img.onload = function () {
      var can = document.createElement('canvas')
      can.width = img.width
      can.height = img.height

      var c = can.getContext('2d')
      c.drawImage(img, 0, 0)

      resolve([null, can])
    }
    img.onerror = function (e) {
      resolve([e])
    }
    img.src = src
  })
}

function scale (src, scale) {
  var can = document.createElement('canvas')
  can.width = src.width * scale
  can.height = src.height * scale

  // Scale the image down
  var c = can.getContext('2d')
  c.drawImage(src, 0, 0, src.width, src.height, 0, 0, can.width, can.height)
  return can
}
