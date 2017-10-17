'use strict';
var Loop = require('./loop');
var noop = function () {};

var Transient = module.exports = function Transient (options) {
	var opts = options || {};

	// Animation settings
	this.duration = opts.duration || 5000;
	this.fps = opts.fps || 60;
	this.loop = !!(opts.loop || false);

	// Calculate total number of frames
	this.frames = this.duration / 1000 * this.fps;

	// Our callback functions
	this.draw = opts.draw || noop;
	this.onEnd = opts.onEnd || noop;
	this.onCancel = opts.onCancel || this.onEnd;

	// Keep some internal state
	this._loop = new Loop(this.update.bind(this));
	this._timeAcc = 0;
};

Transient.prototype.start = function () {
	this._loop.start();
	this._timeAcc = 0;
};

Transient.prototype.update = function (elapsed) {
	// Are we done?
	if (elapsed >= this.duration) {
		this._timeAcc += elapsed;
		if (!this.loop) {
			this._loop.end();
			return this.onEnd();
		}
	}

	var progress = (elapsed - this._timeAcc) / this.duration;

	// Determine frame
	var frame = Math.floor(this.frames * progress);
	if (frame !== this._currentFrame) {
		this._currentFrame = frame;
		this.draw(progress);
	}
};

Transient.prototype.cancel = function () {
	this._loop.end();
	this.onCancel();
};
