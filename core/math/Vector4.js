function Vector4(x, y, z, w)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
}


//Returns a new vector3 with values without w
Vector4.prototype.toVector3 = function()
{
	return new Vector3(this.x, this.y, this.z);
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
	if(typeof val != typeof this)
	{
		return false;
	}
	else if(this.x == val.x && this.y == val.y && this.z == val.z && this.w == val.w)
	{
		return true;
	}
}

Vector4.prototype.add = function(val)
{
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		this.x += val.x;
		this.y += val.y;
		this.z += val.z;
		this.w += val.w;
	}
}

//Subtract Vector
Vector4.prototype.sub = function(val)
{
	//Check type of val
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		this.x -= val.x;
		this.y -= val.y;
		this.z -= val.z;
		this.w -= val.w;
	}
}

//Multiply Vector
Vector4.prototype.mul = function(val)
{
	//Check type of val
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		this.x *= val.x;
		this.y *= val.y;
		this.z *= val.z;
		this.w -= val.w;
	}
}

//toString Vector Values
Vector4.prototype.toString = function()
{
	return "("+this.x+", "+this.y+", "+this.z+", "+this.w+")";
}