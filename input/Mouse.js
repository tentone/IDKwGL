//Mouse Atached to camera
function Mouse()
{
	//Mouse Position Relative to camera
	this.raw_mouse_pos = new Vector2(0, 0);
	this.raw_mouse_pos_updated = false;

	this.pos = new Vector2(0, 0);
	this.pos_diff = new Vector2(0, 0);

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

//Functions Prototype
Mouse.prototype.buttonPressed = buttonPressed;
Mouse.prototype.updatePosition = updatePosition;
Mouse.prototype.updateKey = updateKey;
Mouse.prototype.toString = toString;
Mouse.prototype.update = update;

//Check if Mouse button is pressed
function buttonPressed(button)
{
	return this.keys[button].isPressed;
}

//Update Mouse Position
function updatePosition(x, y)
{
	this.raw_mouse_pos.set(x, y);
	this.raw_mouse_pos_updated = true;
}

//Update Mouse Key
function updateKey(button, action)
{
	this.keys[button].update(action);
}

//Update Mouse State (Calculate position diff)
function update()
{
	if(this.raw_mouse_pos_updated)
	{
		this.pos_diff.x = this.raw_mouse_pos.x - this.pos.x;
		this.pos_diff.y = this.raw_mouse_pos.y - this.pos.y;
		this.pos.x = this.raw_mouse_pos.x;
		this.pos.y = this.raw_mouse_pos.y;
		this.raw_mouse_pos_updated = false;
	}
	else
	{
		this.pos_diff.set(0, 0);
	}
}

//Return string with mouse position
function toString()
{
	return "Pos:" + this.pos.toString() + " Diff:" + this.pos_diff.toString();
}

