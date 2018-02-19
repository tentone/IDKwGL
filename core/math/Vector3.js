"use strict";

function Vector3(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

//Cross product
Vector3.cross = function(a, b)
{
    return new Vector3(a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x);
}

Vector3.prototype.cross = function(a, b)
{
	this.set(a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x);
};

Vector3.prototype.copy = function(vector)
{
	this.x = vector.x;
	this.y = vector.y;
	this.z = vector.z;
}

//Change all values at once
Vector3.prototype.set = function(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

//Clone vector3
Vector3.prototype.clone = function()
{
	return new Vector3(this.x, this.y, this.z);
}

//Normalize Vector
Vector3.prototype.normalize = function()
{
    var norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x /= norm;
    this.y /= norm;
    this.z /= norm;
}

//Compare values
Vector3.prototype.equals = function(val)
{
	return (this.x === val.x && this.y === val.y && this.z === val.z)
}

//Add
Vector3.prototype.add = function(val)
{
	this.x += val.x;
	this.y += val.y;
	this.z += val.z;
}

//Sub
Vector3.prototype.sub = function(val)
{
	this.x -= val.x;
	this.y -= val.y;
	this.z -= val.z
}

//Mult
Vector3.prototype.mul = function(val)
{
	this.x *= val.x;
	this.y *= val.y;
	this.z *= val.z;
}

//Div
Vector3.prototype.div = function(val)
{
	this.x /= val.x;
	this.y /= val.y;
	this.z /= val.z;
}

//Mult by const
Vector3.prototype.mulConst = function(val)
{
	this.x *= val;
	this.y *= val;
	this.z *= val;
}

Vector3.prototype.lengthSquared = function()
{
	return this.x * this.x + this.y * this.y + this.z * this.z;
};

//String info
Vector3.prototype.toString = function()
{
	return "("+this.x+", "+this.y+", "+this.z+")";
}

//Round all values close to zero to zero
Vector3.prototype.roundCloseToZero = function()
{
	if(MathUtils.inRange(this.x, 0, 0.000001))
	{
		this.x = 0;
	}
	if(MathUtils.inRange(this.y, 0, 0.000001))
	{
		this.y = 0;
	}
	if(MathUtils.inRange(this.z, 0, 0.000001))
	{
		this.z = 0;
	}
}
