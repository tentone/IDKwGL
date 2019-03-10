"use strict";

/**
 * Base particle object.
 *
 * Wraps a object to be rendered on th particle position.
 */
function Particle(object)
{
	/**
	 * Object of this particle instance (clone of the object in the emitter).
	 */
	this.object = object;

	/** 
	 * Speed of the particle.
	 */
	this.speed = new Vector3();

	/**
	 * Life time of the particle.
	 *
	 * When it gets to zero the particle needs to be reset.
	 */
	this.time = 0;
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
