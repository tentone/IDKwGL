"use strict";

/**
 * A particle emitter can be used to create and move 3D objects as particles.
 *
 * Particle have a speed, scale and time limit and wrap a drawable object.
 */
function ParticleEmitter(object, position, speed, speedVar, scale, scaleVar, time, timeVar, count)
{
	/** 
	 * Base object of the emitter, the object is cloned for each particle.
	 */
	this.object = object;

	/**
	 * Particles in the emitter, to be updated and rendered.
	 */
	this.particles = [];

	/**
	 * Number of particles in the emitter.
	 */
	this.count = count;
	
	/** 
	 * Position of the particles.
	 */
	this.position = position;
	this.positionVar = new Vector3(0, 0, 0);

	/**
	 * Base speed of the particle moving.
	 */
	this.speed = speed;
	this.speedVar = speedVar;
	
	/**
	 * Base scale of the particle.
	 */
	this.scale = scale;
	this.scaleVar = scaleVar;
	
	/**
	 * Lifetime of a individual particle.
	 */
	this.time = time;
	this.timeVar = timeVar;
	
	for(var i = 0; i < this.count; i++)
	{
		var speed = new Vector3();
		speed.set(this.speed.x + this.speedVar.x * MathUtils.randomMod(), this.speed.y + this.speedVar.y * MathUtils.randomMod(), this.speed.z + this.speedVar.z * MathUtils.randomMod());

		this.particles.push(new Particle(this.object, this.position, speed, this.scale + this.scaleVar * MathUtils.randomMod(), this.time + this.timeVar * MathUtils.randomMod()));
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
			this.particles[i].object.position.copy(this.position);
			
			var scale = this.scale + this.scaleVar * MathUtils.randomMod();
			this.particles[i].object.scale.set(scale, scale, scale);

			this.particles[i].time = this.time + this.timeVar * MathUtils.randomMod();
			this.particles[i].speed.set(this.speed.x + this.speedVar.x * MathUtils.randomMod(), this.speed.y + this.speedVar.y * MathUtils.randomMod(), this.speed.z + this.speedVar.z * MathUtils.randomMod());
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
