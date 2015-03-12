var nextTick = require('browser-next-tick'),
	noop = function(){};

var Transient = module.exports = function Transient(options) {
	options = options || {};

	// Animation settings
	this.duration = options.duration || 5000;
	this.fps = options.fps || 60;
	this.loop = options.loop || false;

	// Calculate total number of frames
	this.frames = this.duration / 1000 * this.fps;

	// Our callback functions
	this.draw = options.draw || noop;
	this.onEnd = options.onEnd || noop;
	this.onCancel = options.onCancel || this.onEnd;

	// Keep some internal state
	this._canceled = false;
	this._currentFrame = null;
	this._startTime = null;
	this._timeAcc = null;
};

Transient.prototype.start = function() {
	var now = Date.now();
	this._timeAcc = this._timeAcc || now;
	this._startTime = now;

	// For looped animations, compensate for lag between loops
	if (this._timeAcc != this._startTime) {
		this._timeAcc += this.duration;
		this._startTime = this._timeAcc;
	}

	this.update();
};

Transient.prototype.update = function() {
	// Did we cancel?
	if (this._canceled) {
		return this.onCancel();
	}

	var progress = (Date.now() - this._startTime) / this.duration;

	// Are we done?
	if (progress >= 1) {
		return this.loop ? this.start() : this.onEnd();
	}

	// Determine frame
	var frame = Math.floor(this.frames * progress);
	if (frame !== this._currentFrame) {
		this._currentFrame = frame;
		this.draw(progress);
	}

	// Call again on next tick/request animation frame
	nextTick(this.update.bind(this));
};

Transient.prototype.cancel = function() {
	this._canceled = true;
};
