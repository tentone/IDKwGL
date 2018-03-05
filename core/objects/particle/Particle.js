"use strict";

function Particle(model, position, speed, scale, time)
{
	this.position = position;
	this.speed = speed;
	this.scale = scale;
	this.time = time;

	this.model = model;
	this.model.position.set(this.position.x, this.position.y, this.position.z);
	this.model.scale.mulConst(this.scale);
	this.model.update();
}

//Update particles
Particle.prototype.update = function()
{
	this.position.add(this.speed);
	this.time--;

	this.model.position.set(this.position.x, this.position.y, this.position.z);
	this.model.updateMatrix();
};

//Draw particles into camera
Particle.prototype.render = function(renderer, camera, scene)
{
	this.model.render(renderer, camera, scene)
};

