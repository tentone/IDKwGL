function Spectator(canvas)
{
	this.camera = new PrespectiveCamera(canvas, 70, 1);
	this.rotation = new Vector2(0.0, 0.0); //Horizontal / Vertical
}

//Class function prototypes
Spectator.prototype.update = update;
Spectator.prototype.toString = toString;

//Update Spectator
function update()
{
	var angle = Conversion.degreesToRadians(this.rotation.x);
	var speed = 1.5;

	//Camera Rotate Test
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		this.camera.position.z += speed * Math.cos(angle);
		this.camera.position.x += speed * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		this.camera.position.z -= speed * Math.cos(angle);
		this.camera.position.x -= speed * Math.sin(angle);
	}
 
	angle += MathUtils.PID2;
	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		this.camera.position.z -= speed * Math.cos(angle);
		this.camera.position.x -= speed * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		this.camera.position.z += speed * Math.cos(angle);
		this.camera.position.x += speed * Math.sin(angle);
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
	this.rotation.x += Mouse.SENSITIVITY * App.mouse.pos_diff.x;
	this.rotation.y += Mouse.SENSITIVITY * App.mouse.pos_diff.y;

	//Camera Move UP/DOWN
	if(App.keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		this.camera.position.y += speed;
	}
	if(App.keyboard.isKeyPressed(Keyboard.CTRL))
	{
		this.camera.position.y -= speed;
	}

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
