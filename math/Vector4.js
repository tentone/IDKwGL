function Vector4(x, y, z, w)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
}

//Method Prototypes
Vector4.prototype.toString = toString;
Vector4.prototype.add = add;
Vector4.prototype.sub = sub;
Vector4.prototype.mul = mul;
Vector4.prototype.equals = equals;
Vector4.prototype.set = set;
Vector4.prototype.normalize = normalize;
Vector4.prototype.toVector3 = toVector3;

//Returns a new vector3 with values without w
function toVector3()
{
	return new Vector3(this.x, this.y, this.z);
}

function set(x, y, z, w)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
}

function normalize()
{
    var norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x /= norm;
    this.y /= norm;
    this.z /= norm;
}


function equals(val)
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
		this.w += val.w;
	}
}

//Subtract Vector
function sub(val)
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
function mul(val)
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
function toString()
{
	return "("+this.x+", "+this.y+", "+this.z+", "+this.w+")";
}