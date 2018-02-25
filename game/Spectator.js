"use strict";

function Spectator(canvas)
{
	this.camera = new PerspectiveCamera(canvas.width/canvas.height, 70, 1);
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

	//Camera Move UP/DOWN
	if(App.keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		this.camera.position.y += speed;
	}
	if(App.keyboard.isKeyPressed(Keyboard.CTRL))
	{
		this.camera.position.y -= speed;
	}
};
