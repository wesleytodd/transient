'use strict';
var nextTick = require('browser-next-tick');
var now = require('@streammedev/perfnow');

var Loop = module.exports = function (fn) {
	if (!(this instanceof Loop)) {
		return new Loop(fn);
	}

	this.fn = fn;
	this.tick = tick.bind(this);

	// Start in an ended state
	this.end();
};

Loop.prototype.start = function () {
	var n = now();

	// Start things up
	if (!this.running) {
		this._running = true;
		this._startTime = this._lastTime = n;
		this.tick();
	}

	// Always return the current started time
	return n;
};

Loop.prototype.end = function () {
	this._running = false;
	this._startTime = null;
	this._lastTime = null;
};

// A separate tick function, prevents
// having to bind it on every iteration
function tick () {
	if (!this._running) {
		return;
	}

	var n = now();

	// Call the function
	this.fn(n - this._startTime, n - this._lastTime);

	// Update the last time
	this._lastTime = n;

	// Call on next tick
	nextTick(this.tick);
};
