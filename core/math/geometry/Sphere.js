"use strict";

function Sphere()
{
	this.position = new Vector3(0,0,0);
	this.radius = 0;
	this.ori = new Vector3(0,0,0);

	this.type = "Sphere";
}

Sphere.prototype.constructor = Sphere;

/**
 * Check sphere collision against another geometry.
 */
Sphere.prototype.isColliding = function(obj)
{
	if(obj.type === "Sphere")
	{
		return MathUtils.pointDistance(this.position, obj.position) > this.radius + obj.radius;
	}

	return false;
};

/**
 * Check if sphere will collide after movement.
 */
Sphere.prototype.willCollide = function(speed, obj)
{
	return false;
};