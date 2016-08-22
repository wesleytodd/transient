/* global describe, it */
var Transient = require('../');
var assert = require('assert');

describe('Transient', function () {
	it('should call draw the right amount of times', function (done) {
		var called = 0;
		var a = new Transient({
			duration: 1500,
			draw: function (f) {
				called++;
			},
			onEnd: function () {
				assert.equal(called, 90);
				assert.equal(called, a.frames);
				done();
			}
		});
		a.start();
	});
	it('should call cancel if provided', function (done) {
		var a = new Transient({
			duration: 1500,
			onCancel: function () {
				done();
			}
		});
		a.start();
		a.cancel();
	});
});
