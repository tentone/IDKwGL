"use strict";

function Vector3(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector3.prototype.constructor = Vector3;

/**
 * Cross product.
 */
Vector3.cross = function(a, b)
{
    return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}

/** 
 * Copy value and a apply a random variation to the vector.
 */
Vector3.prototype.setRandVar = function(base, variation)
{
	this.x = base.x + variation.x * MathUtils.randomMod();
	this.y = base.y + variation.y * MathUtils.randomMod();
	this.z = base.z + variation.z * MathUtils.randomMod();
};

Vector3.prototype.cross = function(a, b)
{
	this.set(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
};

Vector3.prototype.copy = function(vector)
{
	this.x = vector.x;
	this.y = vector.y;
	this.z = vector.z;
}

/**
 * Set all values of the vector to the same scalar.
 */
Vector3.prototype.setScalar = function(v)
{
	this.x = v;
	this.y = v;
	this.z = v;
}

//Change all values at once
Vector3.prototype.set = function(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

/**
 * Clone vector3, create a new instance with the same values.
 */
Vector3.prototype.clone = function()
{
	return new Vector3(this.x, this.y, this.z);
};

/**
 * Normalize Vector, (to length of one).
 */
Vector3.prototype.normalize = function()
{
    var norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x /= norm;
    this.y /= norm;
    this.z /= norm;
};

/**
 * Check if two vectors store the same value.
 */
Vector3.prototype.equals = function(val)
{
	return (this.x === val.x && this.y === val.y && this.z === val.z)
};

/**
 * Add the components of two vectors to each other.
 */
Vector3.prototype.add = function(val)
{
	this.x += val.x;
	this.y += val.y;
	this.z += val.z;
};

/**
 * Substract the components of two vectors from each other.
 */
Vector3.prototype.sub = function(val)
{
	this.x -= val.x;
	this.y -= val.y;
	this.z -= val.z
};

/**
 * Multiply the components of two vectors be each other.
 */
Vector3.prototype.mul = function(val)
{
	this.x *= val.x;
	this.y *= val.y;
	this.z *= val.z;
};

/**
 * Divide the components of two vectors be each other.
 */
Vector3.prototype.div = function(val)
{
	this.x /= val.x;
	this.y /= val.y;
	this.z /= val.z;
};

/**
 * Multiply each component of the vector by a scalar.
 */
Vector3.prototype.mulScalar = function(val)
{
	this.x *= val;
	this.y *= val;
	this.z *= val;
};

Vector3.prototype.lengthSquared = function()
{
	return this.x * this.x + this.y * this.y + this.z * this.z;
};

/**
 * Calculate distance between p1 and p2 (Vector3)
 */
Vector3.distance = function(p1, p2)
{
	return Math.sqrt((p1.x*p1.x - p2.x*p2.x) + (p1.y*p1.y - p2.y*p2.y) + (p1.z*p1.z - p2.z*p2.z));
};

/**
 * Round all values close to zero to zero.
 */
Vector3.prototype.roundCloseToZero = function(tolerance)
{
	if(tolerance === undefined)
	{
		tolerance = 1e-5;
	}

	if(MathUtils.inRange(this.x, -tolerance, tolerance))
	{
		this.x = 0;
	}
	if(MathUtils.inRange(this.y, -tolerance, tolerance))
	{
		this.y = 0;
	}
	if(MathUtils.inRange(this.z, -tolerance, tolerance))
	{
		this.z = 0;
	}
};
