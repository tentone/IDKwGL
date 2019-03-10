"use strict";

/**
 * A particle emitter can be used to create and move 3D objects as particles.
 *
 * Particle have a speed, scale and time limit and wrap a drawable object.
 */
function ParticleEmitter(object, positionBase, speedBase, speedDelta, scaleBase, scaleDelta, lifetime, lifetimeDelta, count)
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
	 * Position of the particles.
	 */
	this.positionBase = positionBase;
	this.positionDelta = new Vector3(0, 0, 0);

	/**
	 * Base speed of the particle moving.
	 */
	this.speedBase = speedBase;
	this.speedDelta = speedDelta;
	
	/**
	 * Base scale of the particle.
	 */
	this.scaleBase = scaleBase;
	this.scaleDelta = scaleDelta;
	
	/**
	 * Lifetime of a individual particle.
	 */
	this.lifetime = lifetime;
	this.lifetimeDelta = lifetimeDelta;

	for(var i = 0; i < count; i++)
	{
		var particle = new Particle(this.object.clone());
		this.resetParticle(particle);
		this.particles.push(particle);
	}
}

ParticleEmitter.prototype.constructor = ParticleEmitter;

//ParticleEmitter.prototype = Object.create(Object3D.prototype);
ParticleEmitter.prototype.isObject3D = true;

/** 
 * Reset particle properties based on the emitter configuration.
 */
ParticleEmitter.prototype.resetParticle = function(particle)
{
	particle.speed.setRandVar(this.speedBase, this.speedDelta);
	particle.object.scale.setScalar(this.scaleBase + this.scaleDelta * MathUtils.randomMod());
	particle.object.position.setRandVar(this.positionBase, this.positionDelta);
	particle.time = this.lifetime + this.lifetimeDelta * MathUtils.randomMod();
};

/**
 * Update Particles position.
 */
ParticleEmitter.prototype.update = function()
{
	for(var i = 0; i < this.particles.length; i++)
	{
		this.particles[i].update();

		if(this.particles[i].time < 0)
		{
			this.resetParticle(this.particles[i]);
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
