"use strict";

//Constructor
function Key()
{
	this.isPressed = false;
	this.justPressed = false;
	this.justReleased = false;
}

//Action List
Key.KEY_DOWN = 0;
Key.KEY_UP = 1;

//Update Key status based new state
Key.prototype.update = function(action)
{
	this.justPressed = false;
	this.justReleased = false;

	if(action === 0) //Key Down
	{
		if(!this.isPressed)
		{
			this.justPressed = true;
		}
		this.isPressed = true;
	}
	else //Key Up
	{
		if(this.isPressed)
		{
			this.justReleased = true;
		}
		this.isPressed = false;
	}
}

//True if key is currently pressed
Key.prototype.isPressed = function()
{
	return this.isPressed;
}

//True if key was just pressed
Key.prototype.justPressed = function()
{
	return this.justPressed;
}

//True if key was just released
Key.prototype.justReleased = function()
{
	return this.justReleased;
}

//Set key values
Key.prototype.set = function(justPressed, isPressed, justReleased)
{
	this.justPressed = justPressed;
	this.isPressed = isPressed;
	this.justReleased = justReleased;
}

//Print Key
Key.prototype.toString = function()
{
	return "Pressed:" + this.isPressed + " JustPressed:" + this.justPressed + " JustReleased:" + this.justReleased;
}