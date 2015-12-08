function Vector3(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

//Method Prototypes
Vector3.prototype.toString = toString;
Vector3.prototype.add = add;
Vector3.prototype.sub = sub;
Vector3.prototype.mul = mul;
Vector3.prototype.div = div;
Vector3.prototype.equals = equals;
Vector3.prototype.set = set;
Vector3.prototype.clone = clone;
Vector3.prototype.normalize = normalize;
Vector3.prototype.mulConst = mulConst;
Vector3.prototype.roundCloseToZero = roundCloseToZero;

//Change all values at once
function set(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

//Clone vector3
function clone()
{
	return new Vector3(this.x, this.y, this.z);
}

//Normalize Vector
function normalize()
{
    var norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x /= norm;
    this.y /= norm;
    this.z /= norm;
}

//Compare values
function equals(val)
{
	if(typeof val != typeof this)
	{
		return false;
	}
	else if(this.x == val.x && this.y == val.y && this.z == val.z)
	{
		return true;
	}
}

//Add
function add(val)
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
	}
}

//Sub
function sub(val)
{
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		this.x -= val.x;
		this.y -= val.y;
		this.z -= val.z;
	}
}

//Mult
function mul(val)
{
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		this.x *= val.x;
		this.y *= val.y;
		this.z *= val.z;
	}
}

//Div
function div(val)
{
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		this.x /= val.x;
		this.y /= val.y;
		this.z /= val.z;
	}
}

//Mult by const
function mulConst(val)
{
	this.x *= val;
	this.y *= val;
	this.z *= val;
}

//String info
function toString()
{
	return "("+this.x+", "+this.y+", "+this.z+")";
}

//Round all values close to zero to zero
function roundCloseToZero()
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
