"use strict";

/**
 * Base particle object.
 *
 * Wraps a object to be rendered on th particle position.
 */
function Particle(object, position, speed, scale, time)
{
	this.object = object;
	this.object.position.set(position.x, position.y, position.z);
	this.object.scale.set(scale, scale, scale);

	this.speed = new Vector3(speed.x, speed.y, speed.z);

	this.time = time;
}

Particle.prototype.constructor = Particle;

/**
 * Update particle position.
 */
Particle.prototype.update = function()
{
	this.object.position.add(this.speed);
	this.time--;
};

/**
 * Draw particles into camera.
 */
Particle.prototype.render = function(renderer, camera, scene)
{
	this.object.updateMatrix();	
	this.object.render(renderer, camera, scene);
};
