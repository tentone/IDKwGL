function Body(world, geometry)
{
	if(world === undefined)
	{
		this.world = null;
		this.has_world = false;
	}
	else
	{
		this.world = world;
		this.has_world = true;
	}

	this.id=Math.random()*10000+Math.random()*10;

	this.geometry = geometry;

	this.collidable = true;
	this.is_static = false;

	this.position = new Vector3(0,0,0);
	this.speed = new Vector3(0,0,0);
	this.acceleration = new Vector3(0,0,0);
}

//Functions prototypes
Body.prototype.update = update;
Body.prototype.setWorld = setWorld;
Body.prototype.setCollidable = setCollidable;
Body.prototype.getGeometry = getGeometry;
Body.prototype.toString = toString;

//Updates body status 
function update()
{
	var willCollide = -1;

	if(!this.is_static)
	{
		if(this.has_world)
		{
			this.speed.add(world.acceleration);
		}
		this.speed.add(this.acceleration);
		this.speed.mul(world.friction);
		this.acceleration.mul(world.friction);

		for(var i = 0; i < this.world.body.length; i++)
		{
			if(this.id != this.world.body[i].id)
			{
				if(this.geometry.willCollide(new Vector3(this.speed.x,0,0),this.world.body[i].getGeometry()))
				{
					willCollide = 0;
					break;
				}
				else if(this.geometry.willCollide(new Vector3(0,this.speed.y,0),this.world.body[i].getGeometry()))
				{
					willCollide = 1;
					break;
				}
				else if(this.geometry.willCollide(new Vector3(0,0,this.speed.z),this.world.body[i].getGeometry()))
				{
					willCollide = 2;
					break;
				}
			}
		}

		//No collision
		if(willCollide == -1)
		{	
			this.position.add(this.speed);
			this.geometry.position.add(this.speed);
		}
		//Collision in X axis
		else if(willCollide == 0)
		{
			if(this.speed.x < 0)
			{
				destPos = this.world.body[i].getGeometry().position.x+this.world.body[i].getGeometry().size.x;
				this.geometry.position.x=destPos;
				this.position.x=destPos;
			}
			else
			{
				destPos = this.world.body[i].getGeometry().position.x - this.world.body[i].getGeometry().size.x;
				this.geometry.position.x=destPos;
				this.position.x=destPos;
			}
			this.speed.set(0,0,0);
			this.acceleration.set(0,0,0);
		}
		//Collision in Y axis
		else if(willCollide == 1)
		{
			if(this.speed.y < 0)
			{
				destPos = this.world.body[i].geometry.position.y + this.world.body[i].getGeometry().size.y;
				this.geometry.position.y=destPos;
				this.position.y=destPos;
			}
			else
			{
				destPos = this.world.body[i].geometry.position.y - this.world.body[i].getGeometry().size.y;
				this.geometry.position.y=destPos;
				this.position.y=destPos;
			}
			this.speed.set(0,0,0);
			this.acceleration.set(0,0,0);
		}
		//Collision in Z axis
		else
		{	
			if(this.speed.z < 0)
			{
				destPos = this.world.body[i].geometry.position.z + this.world.body[i].getGeometry().size.z;
				this.geometry.position.z=destPos;
				this.position.z=destPos;
			}
			else
			{
				destPos = this.world.body[i].geometry.position.z - this.world.body[i].getGeometry().size.z;
				this.geometry.position.z=destPos;
				this.position.z=destPos;
			}
			this.speed.set(0,0,0);
			this.acceleration.set(0,0,0);
		}
	}
}

//Get Body Geometry
function getGeometry()
{
	return this.geometry;
}

//Set body world
function setWorld(world)
{
	this.world = world;
	this.has_world = true;
}

//Set if body is collidable
function setCollidable(collidable)
{
	this.collidable = collidable;
}

//String
function toString()
{
	return "Body (Position: " + this.position.toString() + ")";
}