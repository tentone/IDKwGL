function Body(geometry)
{
	//Random ID to identify body
	this.id = -1;
	this.geometry = geometry;

	this.collidable = true;
	this.is_static = true;

	this.acceleration = new Vector3(0,0,0);
	this.position = new Vector3(0,0,0);
	this.speed = new Vector3(0,0,0);

	this.is_colliding = new Vector3(0,0,0);
}

//Functions prototypes
Body.prototype.update = update;
Body.prototype.setCollidable = setCollidable;
Body.prototype.getGeometry = getGeometry;
Body.prototype.setStatic = setStatic;
Body.prototype.toString = toString;
Body.prototype.setId = setId;
Body.prototype.getId = getId;

//Set ID
function setId(value)
{
	this.id = value;
}

//Get ID
function getId()
{
	return this.id;
}

//Updates body status 
function update(world)
{
	if(world === undefined)
	{
		return;
	}

	if(!this.is_static)
	{
		this.speed.add(world.acceleration);
		this.speed.add(this.acceleration);
		
		if(this.is_colliding.z == 1)
		{
			this.acceleration.mul(world.friction);
			this.speed.mul(world.friction);
		}
		else
		{
			this.acceleration.mul(world.friction_air);
			this.speed.mul(world.friction_air);
		}

		this.speed.roundCloseToZero();
		this.is_colliding.set(0, 0, 0);

		//Collision on X axis
		for(var i = 0; i < world.body.length; i++)
		{
			if(this.getId() != world.body[i].getId())
			{
				if(this.geometry.willCollide(new Vector3(this.speed.x,0,0), world.body[i].getGeometry()))
				{
					this.is_colliding.x = 1;
					if(this.speed.x < 0)
					{
						this.geometry.position.x = (world.body[i].getGeometry().position.x - world.body[i].getGeometry().ori.x + world.body[i].getGeometry().size.x) + this.geometry.ori.x;
					}
					else
					{
						this.geometry.position.x = (world.body[i].getGeometry().position.x - world.body[i].getGeometry().ori.x) - this.geometry.size.x + this.geometry.ori.x;
					}
					this.speed.x = 0;
				}
			}
		}

		//Collision on Y axis
		for(i = 0; i < world.body.length; i++)
		{
			if(this.getId() != world.body[i].getId())
			{
				if(this.geometry.willCollide(new Vector3(0,this.speed.y,0), world.body[i].getGeometry()))
				{
					this.is_colliding.y = 1;
					if(this.speed.y < 0)
					{
						this.geometry.position.y = (world.body[i].getGeometry().position.y - world.body[i].getGeometry().ori.y + world.body[i].getGeometry().size.y) + this.geometry.ori.y;
					}
					else
					{
						this.geometry.position.y = (world.body[i].getGeometry().position.y - world.body[i].getGeometry().ori.y) - this.geometry.size.y + this.geometry.ori.y;
					}
					this.speed.y = 0;
				}
			}
		}

		//Collision on Z axis
		for(i = 0; i < world.body.length; i++)
		{
			if(this.getId() != world.body[i].getId())
			{
				if(this.geometry.willCollide(new Vector3(0,0,this.speed.z), world.body[i].getGeometry()))
				{
					this.is_colliding.z = 1;
					if(this.speed.z < 0)
					{
						this.geometry.position.z = (world.body[i].getGeometry().position.z - world.body[i].getGeometry().ori.z + world.body[i].getGeometry().size.z) + this.geometry.ori.z;
					}
					else
					{
						this.geometry.position.z = (world.body[i].getGeometry().position.z - world.body[i].getGeometry().ori.z) - this.geometry.size.z + this.geometry.ori.z;
					}
					this.speed.z = 0;
				}
			}
		}
	}

	this.geometry.position.add(this.speed);
	this.position = this.geometry.position;
}

//Set static
function setStatic(value)
{
	this.body.is_static = value;
}

//Get Body Geometry
function getGeometry()
{
	return this.geometry;
}

//Set if body is collidable
function setCollidable(collidable)
{
	this.collidable = collidable;
}

//String
function toString()
{
	return "Body (Position:" + this.position.toString() + ", Speed:" + this.speed.toString() + ", Acceleration:"+this.acceleration.toString() +")";
}