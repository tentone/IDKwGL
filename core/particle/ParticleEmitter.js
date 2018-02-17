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

	//Initialize particles
	for(var i = 0; i < particleCount; i++)
	{
		speed = new Vector3(this.speed.x + this.speedVar.x*MathUtils.randomMod(), this.speed.y + this.speedVar.y*MathUtils.randomMod(), this.speed.z + this.speedVar.z*MathUtils.randomMod());
		this.particles.push(new Particle(model.clone(), this.position.clone(), speed, this.scale + this.scaleVar*MathUtils.randomMod(), this.time + this.timeVar*MathUtils.randomMod()));
	}
}

//Update Particles position
ParticleEmitter.prototype.update = function()
{
	for(var i = 0; i < this.particles.length; i++)
	{
		this.particles[i].update();
		if(this.particles[i].time < 0)
		{
			var speed = new Vector3(this.speed.x + this.speedVar.x*MathUtils.randomMod(), this.speed.y + this.speedVar.y*MathUtils.randomMod(), this.speed.z + this.speedVar.z*MathUtils.randomMod());
			this.particles[i] = new Particle(this.model.clone(), this.position.clone(), speed, this.scale + this.scaleVar*MathUtils.randomMod(), this.time + this.timeVar*MathUtils.randomMod());
		}
	}
}

//Draw particles into camera
ParticleEmitter.prototype.draw = function(camera, light)
{
	for(var i = 0; i < this.particles.length; i++)
	{
		this.particles[i].draw(camera, light);
	}
}

//Creates string with particle emitter info
ParticleEmitter.prototype.toString = function()
{
	return "Particle (Count:" + this.particles.length + ")";
}