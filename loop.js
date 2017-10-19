'use strict'
var nextTick = require('browser-next-tick')
var now = require('@streammedev/perfnow')

var Loop = module.exports = function Loop (fn) {
  if (!(this instanceof Loop)) {
    return new Loop(fn)
  }

  this.onTick(fn)
  this.tick = tick.bind(this)

  // Start in an ended state
  this._running = 0
  this.end()
}

Loop.prototype.onTick = function loopOnTick (fnc) {
  if (Array.isArray(this.fn)) {
    this.fn.push(fnc)
  } else if (typeof this.fn === 'function') {
    this.fn = [this.fn, fnc]
  } else {
    this.fn = fnc || null
  }

  // Return the off function
  return function off () {
    if (Array.isArray(this.fn)) {
      this.fn.splice(this.fn.indexOf(fnc), 1)
    } else if (typeof this.fn === 'function' && this.fn === fnc) {
      this.fn = null
    }
  }.bind(this)
}

Loop.prototype.start = function loopStart () {
  var n = now()

  // Start things up
  if (this._running === 0) {
    this._startTime = this._lastTime = n
    nextTick(this.tick)
  }

  // Increment the number of running processes
  this._running++

  // Always run tick and return the current started time
  return n
}

Loop.prototype.end = function loopEnd () {
  this._running = (this._running || 1) - 1
  if (this._running === 0) {
    this._startTime = null
    this._lastTime = null
  }
}

// A separate tick function, prevents
// having to bind it on every iteration
function tick () {
  if (this._running <= 0) {
    return
  }

  var n = now()
  var elapsed = n - this._startTime
  var delta = n - this._lastTime

  // Call the function(s)
  if (Array.isArray(this.fn)) {
    for (var i = 0; i < this.fn.length; i++) {
      this.fn[i](elapsed, delta)
    }
  } else if (typeof this.fn === 'function') {
    this.fn(elapsed, delta)
  }

  // Update the last time
  this._lastTime = n

  // Call on next tick
  nextTick(this.tick)
};
