"use strict";

function Sphere()
{
	this.position = new Vector3(0,0,0);
	this.radius = 0;
	this.ori = new Vector3(0,0,0);

	this.type = Geometry.SPHERE;
}

//Check if its colliding
Sphere.prototype.isColliding = function(obj)
{
	if(obj.type === Geometry.SPHERE)
	{
		return MathUtils.pointDistance(this.position, obj.position) > this.radius + obj.radius;
	}

	return false;
}

//Check if will collide after movement
Sphere.prototype.willCollide = function(speed, obj)
{
	return false;
}

//Retuns string with sphere info
Sphere.prototype.toString = function()
{
	return "Pos"+this.position.toString()+" Radius"+this.radius+" Ori"+this.ori.toString();
}