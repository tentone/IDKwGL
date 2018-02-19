"use strict";

function Vector4(x, y, z, w)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
}

Vector4.prototype.copy = function(vector)
{
	this.x = vector.x;
	this.y = vector.y;
	this.z = vector.z;
	this.w = vector.w;
}

Vector4.prototype.set = function(x, y, z, w)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
}

Vector4.prototype.normalize = function()
{
	var norm = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w);
	this.x /= norm;
	this.y /= norm;
	this.z /= norm;
	this.w /= norm;
}

Vector4.prototype.equals = function(val)
{
	return (this.x === val.x && this.y === val.y && this.z === val.z && this.w === val.w)
}

Vector4.prototype.add = function(vector)
{
	this.x += vector.x;
	this.y += vector.y;
	this.z += vector.z;
	this.w += vector.w;
}

//Subtract Vector
Vector4.prototype.sub = function(vector)
{
	this.x -= vector.x;
	this.y -= vector.y;
	this.z -= vector.z;
	this.w -= vector.w;
}

//Multiply Vector
Vector4.prototype.mul = function(vector)
{
	this.x *= vector.x;
	this.y *= vector.y;
	this.z *= vector.z;
	this.w *= vector.w;
}

//Multiply Vector
Vector4.prototype.mulScalar = function(scalar)
{
	this.x *= scalar;
	this.y *= scalar;
	this.z *= scalar;
	this.w *= scalar;
}


//toString Vector Values
Vector4.prototype.toString = function()
{
	return "("+this.x+", "+this.y+", "+this.z+", "+this.w+")";
}