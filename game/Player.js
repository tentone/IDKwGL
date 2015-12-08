function Player(canvas)
{
	this.camera = new PrespectiveCamera(canvas, 70, 1);
	this.rotation = new Vector2(0.0, 0.0); //Horizontal / Vertical
}

//Player class function prototypes
Player.prototype.updatePosition = updatePosition;
Player.prototype.toString = toString;
Player.prototype.update = update;

//Update Player Status
function update()
{
	var angle = Conversion.degreesToRadians(this.rotation.x);

	//Camera Rotate Test
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		this.camera.position.z += 0.1 * Math.cos(angle);
		this.camera.position.x += 0.1 * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		this.camera.position.z -= 0.1 * Math.cos(angle);
		this.camera.position.x -= 0.1 * Math.sin(angle);
	}

	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		this.camera.position.z -= 0.1 * Math.cos(angle+MathUtils.PID2);
		this.camera.position.x -= 0.1 * Math.sin(angle+MathUtils.PID2);
	}
	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		this.camera.position.z += 0.1 * Math.cos(angle+MathUtils.PID2);
		this.camera.position.x += 0.1 * Math.sin(angle+MathUtils.PID2);
	}

	//Camera Keyboard Movement
	if(App.keyboard.isKeyPressed(Keyboard.Q))
	{
		this.rotation.x -= 3;
	}
	if(App.keyboard.isKeyPressed(Keyboard.E))
	{
		this.rotation.x += 3;
	}

	//Camera Mouse Movement
	if(App.isMouseLocked())
	{
		this.rotation.x += 0.2 * App.mouse.pos_diff.x;
		this.rotation.y += 0.2 * App.mouse.pos_diff.y;
	}
	else if(App.mouse.buttonPressed(Mouse.LEFT))
	{
		this.rotation.x += 0.2 * App.mouse.pos_diff.x;
		this.rotation.y += 0.2 * App.mouse.pos_diff.y;
	}

	//Camera Move UP/DOWN
	if(App.keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		this.camera.position.y += 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.CTRL))
	{
		this.camera.position.y -= 0.1;
	}
}

//Update camera with player movement
function updatePosition()
{
	//Limit Vertical Rotation
	if(this.rotation.y < -90)
	{
		this.rotation.y = -90;
	}
	else if(this.rotation.y > 90)
	{
		this.rotation.y = 90;
	}

	//Update Camera Rotation Values
	var angle = Conversion.degreesToRadians(this.rotation.x);
	this.camera.rotation.y = this.rotation.x;
	this.camera.rotation.z = this.rotation.y * Math.sin(angle);
	this.camera.rotation.x = this.rotation.y * Math.cos(angle);
}

//Return string with player info
function toString()
{
	return "Position:"+this.position.toString()+" Rotation:"+this.rotation.toString();
}
