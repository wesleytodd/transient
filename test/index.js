/* global describe, it */
var Transient = require('../');
var Loop = require('../loop');
var assert = require('assert');

describe('Transient', function () {
	describe('Loop', function () {
		it('should start and stop looping', function (done) {
			var count = 0;
			var l = new Loop(function (elapsed, delta) {
				assert(elapsed >= 0);
				assert(delta >= 0);
				assert(elapsed >= delta);
				count++;

				if (count === 100) {
					l.end();
					setTimeout(function () {
						done();
					}, 250);
				} else if (count > 100) {
					throw new Error('Loop didnt stop');
				}
			});
			l.start();
		});
	});

	it('should calculate the right number of frames and call draw for every one', function (done) {
		var called = 0;
		var a = new Transient({
			duration: 1500,
			draw: function (f) {
				called++;
			},
			onEnd: function () {
				// 1.5 second duration at 60 fps. Should draw 60 * 1.5 = 90 frames;
				assert.equal(90, a.frames);
				// draw should be called once for every frame
				assert.equal(called, 90);
				done();
			}
		});
		a.start();
	});
	it('should call cancel if provided, stopping an in progress animation', function (done) {
		var a = new Transient({
			duration: 1500,
			onCancel: function () {
				done();
			}
		});
		a.start();
		a.cancel();
	});
	it('won\'t call end when progress reaches 1 if loop is true', function (done) {
		var endCalled = false;

		var a = new Transient({
			duration: 100,
			loop: true,
			onCancel: function () {
				done();
			},
			onEnd: function () {
				endCalled = true;
			}
		});
		a.start();
		// 500ms is enough time for this 100ms duration animation to run 5 times
		setTimeout(function () {
			assert.equal(endCalled, false);
			a.cancel();
		}, 500);
	});
});
