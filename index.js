'use strict'
var Loop = require('./loop')
var noop = function noop () {}

var Transient = module.exports = function Transient (options) {
  var opts = options || {}

  // Animation settings
  this.name = opts.name
  this.duration = opts.duration || 5000
  this.fps = opts.fps || 60
  this.loop = !!(opts.loop || false)

  // Calculate total number of frames
  this.frames = this.duration / 1000 * this.fps

  // Our callback functions
  this.draw = opts.draw || noop
  this.onEnd = opts.onEnd || noop
  this.onCancel = opts.onCancel || this.onEnd

  // Setup our integration with the loop
  this._onLoopEnd = noop
  if (opts.animationLoop) {
    // Add this update call to trail after other loop updates
    this._onLoopEnd = opts.animationLoop.onTick(this.update.bind(this))
    this._loop = opts.animationLoop
  } else {
    this._loop = new Loop(this.update.bind(this))
    this._onLoopEnd = this._loop.end.bind(this._loop)
  }

  // Internal tracking for looped animations
  this._timeAcc = 0
}

Transient.prototype.start = function () {
  this._loop.start()
  this._timeAcc = 0
}

Transient.prototype.update = function (elapsed, delta) {
  // Are we done?
  var t = elapsed - this._timeAcc
  if (t >= this.duration) {
    this._timeAcc += t
    if (!this.loop) {
      this._onLoopEnd()
      return this.onEnd()
    }
  }

  var progress = t / this.duration

  // Determine frame
  var frame = Math.floor(this.frames * progress)
  if (frame !== this._currentFrame) {
    this._currentFrame = frame
    this.draw(progress)
  }
}

Transient.prototype.cancel = function () {
  this._loop.end()
  this.onCancel()
}

// Export the loop directly
Transient.Loop = Loop
