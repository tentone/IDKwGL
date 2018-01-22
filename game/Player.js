function Player(canvas)
{
	//Player Camera and rotation
	this.camera = new PrespectiveCamera(canvas, 70, 1);
	this.rotation = new Vector2(0.0, 0.0); //Horizontal / Vertical
	
	//Player Body
	this.box = new Box();
	this.box.size.set(6,6,6);
	this.box.ori.set(2,0,2);
	this.box.position.set(0,12,0);

	this.body = new Body(this.box);

	this.can_jump = true;
}

//Update player
Player.prototype.update = function(world)
{
	var angle = Conversion.degreesToRadians(this.rotation.x);

	var speed_walk = 0.5;
	var speed_jump = 1.4;

	//Keyboard input
	if(App.keyboard.isKeyPressed(Keyboard.SHIFT))
	{
		speed_walk = 0.8;
	}

	//Move WASD
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		this.body.speed.z += speed_walk * Math.cos(angle);
		this.body.speed.x -= speed_walk * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		this.body.speed.z -= speed_walk * Math.cos(angle);
		this.body.speed.x += speed_walk * Math.sin(angle);
	}

	angle += MathUtils.PID2;
	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		this.body.speed.z -= speed_walk * Math.cos(angle);
		this.body.speed.x += speed_walk * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		this.body.speed.z += speed_walk * Math.cos(angle);
		this.body.speed.x -= speed_walk * Math.sin(angle);
	}

	//Jump
	if(this.body.is_colliding.y == 1 && App.keyboard.isKeyJustPressed(Keyboard.SPACEBAR))
	{
		this.body.acceleration.y += speed_jump;
	}

	//Camera Mouse Movement
	this.rotation.x += Mouse.SENSITIVITY * App.mouse.pos_diff.x;
	this.rotation.y += Mouse.SENSITIVITY * App.mouse.pos_diff.y;

	//Limit Vertical Rotation
	if(this.rotation.y < -90)
	{
		this.rotation.y = -90;
	}
	else if(this.rotation.y > 90)
	{
		this.rotation.y = 90;
	}
	
	//Set camera rotation
	this.camera.setRotation(this.rotation.x, this.rotation.y);

	//Update player as a body
	this.body.update(world);
	this.camera.position.set(this.body.geometry.position.x, (this.body.geometry.position.y+10), this.body.geometry.position.z);
}

//Set ID for body
Player.prototype.setId = function(value)
{
	this.body.setId(value);
}

//Get body ID
Player.prototype.getId = function()
{
	return this.body.getId();
}

//Get Body Geometry
Player.prototype.getGeometry = function()
{
	return this.body.geometry;
}

//Set static
Player.prototype.setStatic = function(value)
{
	this.body.is_static = value;
}

//Set if it can collide
Player.prototype.setCollidable = function(collidable)
{
	this.body.collidable = collidable;
}

//Return string with player info
Player.prototype.toString = function()
{
	return "Player\nPosition:"+this.box.position.toString()+"\nRotation:"+this.rotation.toString();
}
