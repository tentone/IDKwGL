"use strict";

function Vector2(x, y)
{
	this.x = x;
	this.y = y;
}

Vector2.prototype.set = function(x, y)
{
	this.x = x;
	this.y = y;
}

Vector2.prototype.equals = function(val)
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

Vector2.prototype.add = function(x, y)
{
	this.x += x;
	this.y += y;
}

Vector2.prototype.add = function(val)
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

Vector2.prototype.sub = function(val)
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

Vector2.prototype.mul = function(val)
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

Vector2.prototype.div = function(val)
{
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		this.x /= val.x;
		this.y /= val.y;
	}
}

Vector2.prototype.toString = function()
{
	return "("+this.x+", "+this.y+")";
}