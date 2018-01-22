function ParticleEmitter(model, position, speed, speed_var, scale, scale_var, time, time_var, particle_count)
{
	this.particles = [];
	this.particle_count = particle_count;
	this.position = position;
	this.speed = speed;
	this.speed_var = speed_var;
	this.scale = scale;
	this.scale_var = scale_var;
	this.time = time;
	this.time_var = time_var;
	this.model = model;

	//Initialize particles
	for(var i = 0; i < particle_count; i++)
	{
		speed = new Vector3(this.speed.x + this.speed_var.x*MathUtils.randomMod(), this.speed.y + this.speed_var.y*MathUtils.randomMod(), this.speed.z + this.speed_var.z*MathUtils.randomMod());
		this.particles.push(new Particle(model.clone(), this.position.clone(), speed, this.scale + this.scale_var*MathUtils.randomMod(), this.time + this.time_var*MathUtils.randomMod()));
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
			var speed = new Vector3(this.speed.x + this.speed_var.x*MathUtils.randomMod(), this.speed.y + this.speed_var.y*MathUtils.randomMod(), this.speed.z + this.speed_var.z*MathUtils.randomMod());
			this.particles[i] = new Particle(this.model.clone(), this.position.clone(), speed, this.scale + this.scale_var*MathUtils.randomMod(), this.time + this.time_var*MathUtils.randomMod());
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