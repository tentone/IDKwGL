"use strict";

//Constructor from y size or x and y size and canvas
function OrthographicCamera(canvas, height, width)
{
	//Set camera type
	this.type = Camera.ORTHOGRAPHIC;

	//Collect size arguments
	if(width === undefined)
	{
		if(height === undefined)
		{
			this.aspect = 1;
			this.screenSize = new Vector2(1, 1);
			this.size = new Vector2(1, 1);
		}
		else
		{
			this.aspect = canvas.width/canvas.height; //x/y
			this.screenSize = new Vector2(canvas.width, canvas.height);
			this.size = new Vector2(height*this.aspect, height);
		}
	}
	else
	{
		this.aspect = width/height; //x/y
		this.screenSize = new Vector2(width, height);
		this.size = new Vector2(width, height);
	}

	//Camera Movement
	this.position = new Vector3(0,0,0); //Position
	this.rotation = 0; //Camera Rotation
	this.zoom = 1.0; //Camera Zoom

	//Camera projection and transformation matrices
	this.projectionMatrix = new Matrix4();
	this.transformationMatrix = new Matrix4();
}

//Call before start a frame on this camera
OrthographicCamera.prototype.updateMatrix = function()
{
	this.transformationMatrix.setPosition(this.position);
	this.transformationMatrix.getInverse(this.transformationMatrix);
}

//Calculate camera projection Matrix
OrthographicCamera.prototype.updateProjectionMatrix = function()
{
	this.projectionMatrix.makeOrthographic(-this.size.x, this.size.x, this.size.y, -this.size.y, near, far);
}

//Call every time the canvas is resized
OrthographicCamera.prototype.resize = function(x, y)
{
	this.aspect = x / y;
	this.screenSize.set(x, y);
	this.size = new Vector2(this.size.y * this.aspect, this.size.y);

	this.updateProjectionMatrix();
}

//Create string with camera info
OrthographicCamera.prototype.toString = function()
{
	return "OrthographicCamera (ScreenSize:"+this.screenSize.toString()+" VirtualSize:"+this.size.toString()+" AspectRatio:"+this.aspect+")";
}

