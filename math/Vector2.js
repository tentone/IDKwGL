function Vector2(x, y)
{
	this.x = x;
	this.y = y;
}

//Method Prototypes
Vector2.prototype.toString = toString;
Vector2.prototype.add = add;
Vector2.prototype.sub = sub;
Vector2.prototype.mul = mul;
Vector2.prototype.equals = equals;
Vector2.prototype.set = set;

function set(x, y)
{
	this.x = x;
	this.y = y;
}

function equals(val)
{
	if(typeof val != typeof this)
	{
		return false;
	}
	else if(this.x == val.x && this.y == val.y)
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
	}
}

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
	}
}

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
	}
}

function toString()
{
	return "("+this.x+", "+this.y+")";
}