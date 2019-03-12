"use strict";

function Player()
{
	//Camera
	this.camera = new PerspectiveCamera(1, 70, 1);
	this.camera.position.set(0, 2, 0);

	this.rotation = new Vector2(0, 0); //Horizontal / Vertical
	
	//Physics
	this.box = new Box();
	this.box.size.set(6,6,6);
	this.box.ori.set(2,0,2);
	this.box.position.set(0,12,0);
	this.body = new Body(this.box);
}

//Update player
Player.prototype.update = function(world)
{
	var speedWalk = 0.4;
	var speedJump = 1.4;

	//Keyboard input
	if(App.keyboard.isKeyPressed(Keyboard.SHIFT))
	{
		speedWalk = 0.8;
	}

	//Move WASD
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		this.body.speed.z -= speedWalk * Math.cos(this.rotation.x);
		this.body.speed.x -= speedWalk * Math.sin(this.rotation.x);
	}
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		this.body.speed.z += speedWalk * Math.cos(this.rotation.x);
		this.body.speed.x += speedWalk * Math.sin(this.rotation.x);
	}

	var rotation = this.rotation.x + MathUtils.PID2;

	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		this.body.speed.z += speedWalk * Math.cos(rotation);
		this.body.speed.x += speedWalk * Math.sin(rotation);
	}
	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		this.body.speed.z -= speedWalk * Math.cos(rotation);
		this.body.speed.x -= speedWalk * Math.sin(rotation);
	}

	//Jump
	if(this.body.isColliding.y === 1 && App.keyboard.isKeyJustPressed(Keyboard.SPACEBAR))
	{
		this.body.acceleration.y += speedJump;
	}

	this.camera.position.set(this.body.geometry.position.x, (this.body.geometry.position.y + 10), this.body.geometry.position.z);

	//Camera Mouse Movement
	this.rotation.x -= 0.001 * App.mouse.posDiff.x;
	this.rotation.y -= 0.001 * App.mouse.posDiff.y;

	//Limit Vertical Rotation
	if(this.rotation.y < -1.57)
	{
		this.rotation.y = -1.57;
	}
	else if(this.rotation.y > 1.57)
	{
		this.rotation.y = 1.57;
	}

	var direction = this.getDirection();
	direction.add(this.camera.position);

	//Physics update
	this.body.update(world);

	//Update camera
	this.camera.lookAtDirection(direction);
};

/** 
 * Get player camera direction vector.
 */
Player.prototype.getDirection = function()
{
	var cos = Math.cos(this.rotation.y);
	return new Vector3(Math.sin(this.rotation.x + Math.PI) * cos, Math.sin(this.rotation.y), Math.cos(this.rotation.x + Math.PI) * cos);
}

//Set ID for body
Player.prototype.setId = function(value)
{
	this.body.setId(value);
};

//Get body ID
Player.prototype.getId = function()
{
	return this.body.getId();
};

//Get Body Geometry
Player.prototype.getGeometry = function()
{
	return this.body.geometry;
};

//Set static
Player.prototype.setStatic = function(value)
{
	this.body.isStatic = value;
};

//Set if it can collide
Player.prototype.setCollidable = function(collidable)
{
	this.body.collidable = collidable;
};
