"use strict";

function Vector2(x, y)
{
	this.x = x;
	this.y = y;
}

Vector2.prototype.constructor = Vector2;

Vector2.prototype.clone = function()
{
	return new Vector2(this.x, this.y);
};

Vector2.prototype.set = function(x, y)
{
	this.x = x;
	this.y = y;
};

Vector2.prototype.equals = function(val)
{
	return (this.x === val.x && this.y === val.y)
};

Vector2.prototype.add = function(x, y)
{
	this.x += x;
	this.y += y;
};

Vector2.prototype.add = function(val)
{
	this.x += val.x;
	this.y += val.y;
};

Vector2.prototype.sub = function(val)
{
	this.x -= val.x;
	this.y -= val.y;
};

Vector2.prototype.mul = function(val)
{
	this.x *= val.x;
	this.y *= val.y;
};

Vector2.prototype.div = function(val)
{
	this.x /= val.x;
	this.y /= val.y;
};
