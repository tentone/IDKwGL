function Color(r, g, b)
{
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = 1.0;
}

//Function Prototype
Color.prototype.set = set;
Color.prototype.toString = toString;
Color.prototype.mul = mul;
Color.prototype.mulByConst = mulByConst;
Color.prototype.clone = clone;

function clone()
{
	return new Color(this.r, this.g, this.b);
}

function mulByConst(val)
{
	this.r *= val;
	this.g *= val;
	this.b *= val;
}

function mul(val)
{
	this.r *= val.r;
	this.g *= val.g;
	this.b *= val.b;
	this.a *= val.a;
}

function set(r, g, b)
{
	this.r = r;
	this.g = g;
	this.b = b;
}

function toString()
{
	return "Color R:"+this.r+" G:"+this.g+" B:"+this.b+" A:"+this.a;
}

Color.WHITE = new Color(1.0, 1.0, 1.0);
Color.BLACK = new Color(0, 0, 0);
Color.RED = new Color(1.0, 0, 0);
Color.BLUE = new Color(0, 0, 1.0);
Color.GREEN = new Color(0, 1.0, 0);
