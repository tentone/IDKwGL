"use strict";

/**
 * Physics world. 
 */
function World(acceleration)
{
	if(acceleration === undefined)
	{
		this.acceleration = new Vector3(0, -9.8, 0);
	}
	else
	{
		this.acceleration = acceleration;
	}

	this.friction = new Vector3(0.80, 0.80, 0.80);
	this.body = [];

	this.acceleration.mulConst(0.016);
}

/**
 * Update all bodys in world.
 */
World.prototype.update = function()
{
	for(var i = 0; i < this.body.length; i++)
	{
		this.body[i].update(this);
	}	
}

/**
 * Add body to world.
 */
World.prototype.addBody = function(body)
{
	body.setId(this.body.length);
	this.body.push(body);
}

World.prototype.toString = function()
{
	var s = "World (BodyCount:"+this.body.length+")\n   Body List:";

	for(var i = 0; i < this.body.length; i++)
	{
		s += "\n    "+this.body[i].toString();
	}

	return s;
}