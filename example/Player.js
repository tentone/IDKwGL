"use strict";

function Player()
{
	var box = new Box();
	box.size.set(6,6,6);
	box.ori.set(2,0,2);
	box.position.set(0,12,0);

	Body.call(this, box);

	//Camera
	this.camera = new PerspectiveCamera(1, 70, 1);
	this.camera.autoUpdateMatrix = false;
	this.camera.position.set(0, 2, 0);

	//Orientation
	this.rotation = new Vector2(0, 0); //Horizontal / Vertical
}

Player.prototype = Object.create(Body.prototype);

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
		this.speed.z -= speedWalk * Math.cos(this.rotation.x);
		this.speed.x -= speedWalk * Math.sin(this.rotation.x);
	}
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		this.speed.z += speedWalk * Math.cos(this.rotation.x);
		this.speed.x += speedWalk * Math.sin(this.rotation.x);
	}

	var rotation = this.rotation.x + MathUtils.PID2;

	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		this.speed.z += speedWalk * Math.cos(rotation);
		this.speed.x += speedWalk * Math.sin(rotation);
	}
	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		this.speed.z -= speedWalk * Math.cos(rotation);
		this.speed.x -= speedWalk * Math.sin(rotation);
	}

	//Jump
	if(this.isColliding.y === 1 && App.keyboard.isKeyJustPressed(Keyboard.SPACEBAR))
	{
		this.acceleration.y += speedJump;
	}

	this.camera.position.set(this.geometry.position.x, (this.geometry.position.y + 10), this.geometry.position.z);

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
	Body.prototype.update.call(this, world);

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
