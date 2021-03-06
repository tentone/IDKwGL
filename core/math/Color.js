"use strict";

function Color(r, g, b)
{
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = 1.0;
}

Color.prototype.constructor = Color;

Color.prototype.clone = function()
{
	return new Color(this.r, this.g, this.b);
};

Color.prototype.mulByConst = function(val)
{
	this.r *= val;
	this.g *= val;
	this.b *= val;
};

Color.prototype.mul = function(val)
{
	this.r *= val.r;
	this.g *= val.g;
	this.b *= val.b;
	this.a *= val.a;
};

Color.prototype.set = function(r, g, b)
{
	this.r = r;
	this.g = g;
	this.b = b;
};

Color.WHITE = new Color(1.0, 1.0, 1.0);
Color.BLACK = new Color(0, 0, 0);
Color.RED = new Color(1.0, 0, 0);
Color.YELLOW = new Color(1.0, 1.0, 0);
Color.BLUE = new Color(0, 0, 1.0);
Color.GREEN = new Color(0, 1.0, 0);
Color.PURPLE = new Color(1.0, 0.0, 1.0);
