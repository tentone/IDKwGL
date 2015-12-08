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

//Funtion prototypes
Particle.prototype.update = update;
Particle.prototype.draw = draw;

//Update particles
function update()
{
	this.position.add(this.speed);
	this.time--;

	this.model.position.set(this.position.x, this.position.y, this.position.z);
	this.model.update();
}

//Draw particles into camera
function draw(camera, light)
{
	this.model.draw(camera, light);
}

