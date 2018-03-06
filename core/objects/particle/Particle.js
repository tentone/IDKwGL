"use strict";

function Particle(model, position, speed, scale, time)
{
	this.position = new Vector3(position.x, position.y, position.z);
	this.scale = new Vector3(scale, scale, scale);
	this.speed = new Vector3(speed.x, speed.y, speed.z);
	this.time = time;

	this.model = model;
}

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
	this.model.position.set(this.position.x, this.position.y, this.position.z);
	this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
	this.model.updateMatrix();

	this.model.render(renderer, camera, scene);
};
