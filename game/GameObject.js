"use strict";

//Game object constructor
function GameObject(model, body)
{
	this.model = model;

	if(body === undefined)
	{
		this.body = new Body(this.model.getBox());
	} 
	else
	{
		this.body = body;
	}
}

//Set ID for body
GameObject.prototype.setId = function(value)
{
	this.body.setId(value);
}

//Get body ID
GameObject.prototype.getId = function()
{
	return this.body.getId();
}

//Update game object
GameObject.prototype.update = function(world)
{
	this.body.update(world);
	this.model.position.set(this.body.geometry.position.x, this.body.geometry.position.y, this.body.geometry.position.z);
	this.model.updateMatrix();
}

//Get Body Geometry
GameObject.prototype.getGeometry = function()
{
	return this.body.geometry;
}

//Set static
GameObject.prototype.setStatic = function(value)
{
	this.body.isStatic = value;
}

//Set if it can collide
GameObject.prototype.setCollidable = function(collidable)
{
	this.body.collidable = collidable;
}

//Create info string
GameObject.prototype.toString = function()
{
	return this.body.toString();
}
