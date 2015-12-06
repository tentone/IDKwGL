function Body()
{	
	this.geometry = geometry;
	this.canColide = false;

	this.position = new Vector3(0,0,0);
	this.speed = new Vector3(0,0,0);
	this.acceleration = new Vector3(0,0,0);

	this.friction = new Vector3(0.5,0.5,1);
}

Body.prototype.update = update;

function update()
{
	this.speed.add(this.acceleration);
	this.speed.mul(this.friction);
	this.position.add(this.speed);
}

