"use strict";

/**
 * Timer is used to keep time of time.
 */
function Timer()
{
	this.initial = 0.0;
}

/**
 * Start the timer.
 */ 
Timer.prototype.start = function()
{
	this.initial = performance.now();
};

/**
 * Get time value.
 */
Timer.prototype.get = function()
{
	return performance.now() - this.initial;
};
