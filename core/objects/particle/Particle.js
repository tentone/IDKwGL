"use strict";

/**
 * Base particle object.
 *
 * Wraps a object to be rendered on th particle position.
 */
function Particle(object, position, speed, scale, time)
{
	this.position = new Vector3(position.x, position.y, position.z);
	this.scale = new Vector3(scale, scale, scale);
	this.speed = new Vector3(speed.x, speed.y, speed.z);

	this.time = time;

	this.object = object;
}

Particle.prototype.constructor = Particle;

/**
 * Update particle position.
 */
Particle.prototype.update = function()
{
	this.position.add(this.speed);
	this.time--;
};

/**
 * Draw particles into camera.
 */
Particle.prototype.render = function(renderer, camera, scene)
{
	this.object.position.set(this.position.x, this.position.y, this.position.z);
	this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
	this.object.updateMatrix();
	this.object.render(renderer, camera, scene);
};
