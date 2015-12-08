function Player(canvas)
{
	//Player Camera and rotation
	this.camera = new PrespectiveCamera(canvas, 70, 1);
	this.rotation = new Vector2(0.0, 0.0); //Horizontal / Vertical
	
	//Player Body
	this.box = new Box();
	this.box.size.set(2,4,2);
	this.box.position.set(0,8,0);

	this.body = new Body(this.box);

	this.can_jump = true;
}

//Player class function prototypes
Player.prototype.toString = toString;
Player.prototype.update = update;
Player.prototype.setCollidable = setCollidable;
Player.prototype.getGeometry = getGeometry;
Player.prototype.setStatic = setStatic;
Player.prototype.setId = setId;
Player.prototype.getId = getId;

//Update player
function update(world)
{
	var angle = Conversion.degreesToRadians(this.rotation.x);
	var speed_walk = 0.025;
	var speed_jump = 0.1;

	if(App.keyboard.isKeyPressed(Keyboard.SHIFT))
	{
		speed_walk = 0.04;
	}

	//Camera Rotate Test
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		this.body.acceleration.z += speed_walk * Math.cos(angle);
		this.body.acceleration.x += speed_walk * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		this.body.acceleration.z -= speed_walk * Math.cos(angle);
		this.body.acceleration.x -= speed_walk * Math.sin(angle);
	}
 
	angle += MathUtils.PID2;
	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		this.body.acceleration.z -= speed_walk * Math.cos(angle);
		this.body.acceleration.x -= speed_walk * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		this.body.acceleration.z += speed_walk * Math.cos(angle);
		this.body.acceleration.x += speed_walk * Math.sin(angle);
	}

	//Camera Move UP/DOWN
	if(App.keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		this.body.acceleration.y += speed_jump;
	}

	if(App.keyboard.isKeyPressed(Keyboard.C))
	{
		this.body.acceleration.y -= speed_jump;
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

	//Update Camera Rotation Values
	var angle = Conversion.degreesToRadians(this.rotation.x);
	this.camera.rotation.y = this.rotation.x;
	this.camera.rotation.z = this.rotation.y * Math.sin(angle);
	this.camera.rotation.x = this.rotation.y * Math.cos(angle);

	//Update player as a body
	this.body.update(world);
	this.camera.position.set(this.body.geometry.position.x, (this.body.geometry.position.y+10), this.body.geometry.position.z);
}

//Set ID for body
function setId(value)
{
	this.body.setId(value);
}

//Get body ID
function getId()
{
	return this.body.getId();
}

//Get Body Geometry
function getGeometry()
{
	return this.body.geometry;
}

//Set static
function setStatic(value)
{
	this.body.is_static = value;
}

//Set if it can collide
function setCollidable(collidable)
{
	this.body.collidable = collidable;
}

//Return string with player info
function toString()
{
	return "Position:"+this.position.toString()+" Rotation:"+this.rotation.toString();
}
