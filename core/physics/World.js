"use strict";

/**
 * Physics world contains all the physics bodies.
 *
 * Responsible for managing and updating physics.
 */
function World(acceleration)
{
	/**
	 * World base acceleration, affects the speed of all bodies places in the world.
	 *
	 * Defauls to the value of -9.8.
	 */
	this.acceleration = acceleration === undefined ? new Vector3(0, -9.8, 0) : acceleration;
	this.acceleration.mulScalar(0.016);

	/** 
	 * World air friction applies to all bodies, affects the acceleration of the bodies.
	 */
	this.friction = new Vector3(0.8, 0.8, 0.8);

	/**
	 * List of bodies placed in the world.
	 */
	this.body = [];
};

/**
 * Update all bodys in world.
 */
World.prototype.update = function()
{
	for(var i = 0; i < this.body.length; i++)
	{
		this.body[i].update(this);
	}	
};

/**
 * Add body to world.
 */
World.prototype.addBody = function(body)
{
	body.setId(this.body.length);
	this.body.push(body);
};

World.prototype.toString = function()
{
	var s = "World (BodyCount:" + this.body.length + ")\n   Body List:";

	for(var i = 0; i < this.body.length; i++)
	{
		s += "\n    " + this.body[i].toString();
	}

	return s;
};