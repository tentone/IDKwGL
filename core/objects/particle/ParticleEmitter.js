"use strict";

/**
 * A particle emitter can be used to create and move 3D objects as particles.
 *
 * Particle have a speed, scale and time limit and wrap a drawable object.
 */
function ParticleEmitter(model, position, speed, speedVar, scale, scaleVar, time, timeVar, particleCount)
{
	this.particles = [];
	this.particleCount = particleCount;
	this.position = position;
	this.speed = speed;
	this.speedVar = speedVar;
	this.scale = scale;
	this.scaleVar = scaleVar;
	this.time = time;
	this.timeVar = timeVar;
	this.model = model;

	var speed = new Vector3();

	for(var i = 0; i < this.particleCount; i++)
	{
		speed.set(this.speed.x + this.speedVar.x*MathUtils.randomMod(), this.speed.y + this.speedVar.y*MathUtils.randomMod(), this.speed.z + this.speedVar.z*MathUtils.randomMod());
		this.particles.push(new Particle(this.model, this.position, speed, this.scale + this.scaleVar*MathUtils.randomMod(), this.time + this.timeVar*MathUtils.randomMod()));
	}
}

ParticleEmitter.prototype.constructor = ParticleEmitter;

/**
 * Update Particles position.
 */
ParticleEmitter.prototype.update = function()
{
	for(var i = 0; i < this.particles.length; i++)
	{
		this.particles[i].update();

		//Reset particle
		if(this.particles[i].time < 0)
		{
			this.particles[i].position.copy(this.position);
			var scale = this.scale + this.scaleVar * MathUtils.randomMod();
			this.particles[i].scale.set(scale, scale, scale);
			this.particles[i].time = this.time + this.timeVar*MathUtils.randomMod();
			this.particles[i].speed.set(this.speed.x + this.speedVar.x*MathUtils.randomMod(), this.speed.y + this.speedVar.y*MathUtils.randomMod(), this.speed.z + this.speedVar.z*MathUtils.randomMod());
		}
	}
};

/**
 * Draw particles object into the camera.
 */
ParticleEmitter.prototype.render = function(renderer, camera, scene)
{
	for(var i = 0; i < this.particles.length; i++)
	{
		this.particles[i].render(renderer, camera, scene);
	}
};
