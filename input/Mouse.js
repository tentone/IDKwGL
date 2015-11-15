//Mouse Atached to camera
function Mouse()
{
	//Mouse Position Relative to camera
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
Mouse.RIGHT = 1;
Mouse.MIDDLE = 2;

//Functions Prototype
Mouse.prototype.update = update;
Mouse.prototype.updateKey = updateKey;

//Update Mouse Position
function update(camera, x, y)
{
	//TODO <ADD CODE HERE>
}

//Update Mouse Key
function updateKey(key, action)
{
	this.keys[key].update(action);
}


