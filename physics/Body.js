function Body(geometry)
{
	//Random ID to identify body
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
Body.prototype.setCollidable = setCollidable;
Body.prototype.getGeometry = getGeometry;
Body.prototype.setStatic = setStatic;
Body.prototype.toString = toString;

//Updates body status 
function update(world)
{
	if(world === undefined)
	{
		return;
	}

	if(!this.is_static)
	{
		var willCollide = -1;

		this.speed.add(world.acceleration);
		this.speed.add(this.acceleration);

		this.speed.mul(world.friction);
		this.acceleration.mul(world.friction);

		for(var i = 0; i < world.body.length; i++)
		{
			if(this.id != world.body[i].id)
			{
				if(this.geometry.willCollide(new Vector3(this.speed.x,0,0),world.body[i].getGeometry()))
				{
					willCollide = 0;
					break;
				}
				else if(this.geometry.willCollide(new Vector3(0,this.speed.y,0),world.body[i].getGeometry()))
				{
					willCollide = 1;
					break;
				}
				else if(this.geometry.willCollide(new Vector3(0,0,this.speed.z),world.body[i].getGeometry()))
				{
					willCollide = 2;
					break;
				}
			}
		}

		//No collision
		if(willCollide == -1)
		{	
			this.geometry.position.add(this.speed);
		}
		//Collision in X axis
		else if(willCollide == 0)
		{
			if(this.speed.x < 0)
			{
				destPos = world.body[i].getGeometry().position.x+world.body[i].getGeometry().size.x;
				this.geometry.position.x=destPos;
			}
			else
			{
				destPos = world.body[i].getGeometry().position.x - world.body[i].getGeometry().size.x;
				this.geometry.position.x=destPos;
			}
			this.speed.set(0,0,0);
			this.acceleration.set(0,0,0);
		}
		//Collision in Y axis
		else if(willCollide == 1)
		{
			if(this.speed.y < 0)
			{
				destPos = world.body[i].geometry.position.y + world.body[i].getGeometry().size.y;
				this.geometry.position.y=destPos;
			}
			else
			{
				destPos = world.body[i].geometry.position.y - world.body[i].getGeometry().size.y;
				this.geometry.position.y=destPos;
			}
			this.speed.set(0,0,0);
			this.acceleration.set(0,0,0);
		}
		//Collision in Z axis
		else
		{	
			if(this.speed.z < 0)
			{
				destPos = world.body[i].geometry.position.z + world.body[i].getGeometry().size.z;
				this.geometry.position.z=destPos;
			}
			else
			{
				destPos = world.body[i].geometry.position.z - world.body[i].getGeometry().size.z;
				this.geometry.position.z=destPos;
			}
			this.speed.set(0,0,0);
			this.acceleration.set(0,0,0);
		}
	}

	console.log(world.toString());
	
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