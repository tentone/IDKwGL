"use strict";

/**
 * Physics rigid body.
 */
function Body(geometry)
{
	/**
	 * Random ID to identify body
	 */
	this.id = -1;

	/**
	 * Geometry of this physics body.
	 */
	this.geometry = geometry;

	/**
	 * Indicates other bodies can collide with this one.
	 */
	this.collidable = true;

	/** 
	 * Static bodies do not move, can be used to create walls.
	 */
	this.isStatic = true;

	/**
	 * Acceleration of the body.
	 */
	this.acceleration = new Vector3(0, 0, 0);

	/**
	 * Position of the body, affected by speed.
	 */
	this.position = new Vector3(0, 0, 0);

	/** 
	 * Speed of the body, affected by acceleration.
	 */
	this.speed = new Vector3(0, 0, 0);

	/** 
	 * Indicates collision directions.
	 */
	this.isColliding = new Vector3(0, 0, 0);
}

/**
 * Set ID
 */
Body.prototype.setId = function(value)
{
	this.id = value;
};

/** 
 * Get ID
 */
Body.prototype.getId = function()
{
	return this.id;
};

/**
 * Updates body state.
 */ 
Body.prototype.update = function(world)
{
	if(world === undefined)
	{
		return;
	}

	if(!this.isStatic)
	{
		this.speed.add(world.acceleration);
		this.speed.add(this.acceleration);
		
		this.acceleration.mul(world.friction);
		this.speed.mul(world.friction);

		this.speed.roundCloseToZero();
		this.isColliding.set(0, 0, 0);

		//Collision on X axis
		for(var i = 0; i < world.body.length; i++)
		{
			if(this.getId() !== world.body[i].getId())
			{
				if(this.geometry.willCollide(new Vector3(this.speed.x, 0, 0), world.body[i].getGeometry()))
				{
					this.isColliding.x = 1;
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
			if(this.getId() !== world.body[i].getId())
			{
				if(this.geometry.willCollide(new Vector3(0, this.speed.y, 0), world.body[i].getGeometry()))
				{
					this.isColliding.y = 1;
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
			if(this.getId() !== world.body[i].getId())
			{
				if(this.geometry.willCollide(new Vector3(0, 0, this.speed.z), world.body[i].getGeometry()))
				{
					this.isColliding.z = 1;
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
};

/**
 * Set as static body.
 */
Body.prototype.setStatic = function(value)
{
	this.body.isStatic = value;
};

/**
 * Get body geometry.
 */
Body.prototype.getGeometry = function()
{
	return this.geometry;
};

/**
 * Set if body is collidable.
 */
Body.prototype.setCollidable = function(collidable)
{
	this.collidable = collidable;
};

Body.prototype.toString = function()
{
	return "Body (Position:" + this.position.toString() + ", Speed:" + this.speed.toString() + ", Acceleration:"+this.acceleration.toString() +")";
};