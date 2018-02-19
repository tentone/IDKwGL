"use strict";

function Spectator(canvas)
{
	this.camera = new PerspectiveCamera(canvas, 70, 1);
	this.rotation = new Vector2(0.0, 0.0); //Horizontal / Vertical
}

//Update Spectator
Spectator.prototype.update = function()
{
	var angle = Conversion.degreesToRadians(this.rotation.x);
	var speed = 1.5;

	//Camera Rotate Test
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		this.camera.position.z += speed * Math.cos(angle);
		this.camera.position.x -= speed * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		this.camera.position.z -= speed * Math.cos(angle);
		this.camera.position.x += speed * Math.sin(angle);
	}
 
	angle += MathUtils.PID2;
	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		this.camera.position.z -= speed * Math.cos(angle);
		this.camera.position.x += speed * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		this.camera.position.z += speed * Math.cos(angle);
		this.camera.position.x -= speed * Math.sin(angle);
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
	this.rotation.x += 0.001 * App.mouse.posDiff.x;
	this.rotation.y += 0.001 * App.mouse.posDiff.y;

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
	if(this.rotation.y < -1.57)
	{
		this.rotation.y = -1.57;
	}
	else if(this.rotation.y > 1.57)
	{
		this.rotation.y = 1.57;
	}

	//Set camera rotation
	this.camera.setRotation(this.rotation.x, this.rotation.y);
}

//Return string with player info
Spectator.prototype.toString = function()
{
	return "Position:"+this.position.toString()+" Rotation:"+this.rotation.toString();
}
