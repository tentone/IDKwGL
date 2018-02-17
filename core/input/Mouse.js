//Mouse Atached to camera
function Mouse()
{
	//Mouse Position Relative to camera
	this.rawMouse_pos = new Vector2(0,0);
	this.rawMouse_movement = new Vector2(0,0);
	this.rawMouse_posUpdated = false;

	this.pos = new Vector2(0,0);
	this.posDiff = new Vector2(0,0);

	//Raw Mouse Buttons
	this.rawKeys = [];
	this.rawKeys[0] = new Key();
	this.rawKeys[1] = new Key();
	this.rawKeys[2] = new Key();

	//Mouse Buttons
	this.keys = [];
	this.keys[0] = new Key();
	this.keys[1] = new Key();
	this.keys[2] = new Key();
}

//Mouse Buttons
Mouse.LEFT = 0;
Mouse.MIDDLE = 1;
Mouse.RIGHT = 2;

//Mouse Configuration Values
Mouse.SENSITIVITY = 0.2;

//Check if Mouse button is pressed
Mouse.prototype.buttonPressed = function(button)
{
	return this.keys[button].isPressed;
}

//Check if a mouse button was just pressed
Mouse.prototype.buttonJustPressed = function(button)
{
	return this.keys[button].justPressed;
}

//Check if a mouse button was just released
Mouse.prototype.buttonJustReleased = function(button)
{
	return this.keys[button].justReleased;
}

//Update Mouse Position
Mouse.prototype.updatePosition = function(x, y, xDiff, yDiff)
{
	this.rawMouse_pos.set(x, y);
	this.rawMouse_movement.x += xDiff;
	this.rawMouse_movement.y += yDiff;
	this.rawMouse_posUpdated = true;
}

//Update Mouse Key
Mouse.prototype.updateKey = function(button, action)
{
	this.rawKeys[button].update(action);
}

//Update Mouse State (Calculate position diff)
Mouse.prototype.update = function()
{
	//Update mouse keys state
	for(var i = 0; i < this.rawKeys.length; i++)
	{
		if(this.rawKeys[i].justPressed && this.keys[i].justPressed)
		{
			this.rawKeys[i].justPressed = false;
		}
		if(this.rawKeys[i].justReleased && this.keys[i].justReleased)
		{
			this.rawKeys[i].justReleased = false;
		}
		this.keys[i].set(this.rawKeys[i].justPressed, this.rawKeys[i].isPressed, this.rawKeys[i].justReleased);
	}

	//Update Mouse Position if needed
	if(this.rawMouse_posUpdated)
	{
		this.posDiff.x = this.rawMouse_movement.x;
		this.posDiff.y = this.rawMouse_movement.y;
		this.rawMouse_movement.set(0,0);

		this.pos.x = this.rawMouse_pos.x;
		this.pos.y = this.rawMouse_pos.y;
		this.rawMouse_posUpdated = false;
	}
	else
	{
		this.posDiff.x = 0;
		this.posDiff.y = 0;
	}
}

//Return string with mouse position
Mouse.prototype.toString = function()
{
	return "Pos:" + this.pos.toString() + " Diff:" + this.posDiff.toString() + "\n   Left: " + this.keys[0].toString() + "\n   Middle: " + this.keys[1].toString() + "\n   Right: " + this.keys[2].toString();
}

