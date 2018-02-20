"use strict";

//Constructor from y size or x and y size and canvas
function OrthographicCamera(height, width)
{
	this.type = Camera.ORTHOGRAPHIC;

	this.aspect = width/height;
	this.size = new Vector2(width, height);

	//Position
	this.position = new Vector3(0,0,0); //Position
	this.rotation = new Vector3(0,0,0); //Rotation in degres
	this.scale = new Vector3(1,1,1);

	//Matrices
	this.projectionMatrix = new Matrix4();
	this.inverseTransformationMatrix = new Matrix4();
	this.transformationMatrix = new Matrix4();
}

//Call before start a frame on this camera
OrthographicCamera.prototype.updateMatrix = function()
{
	this.inverseTransformationMatrix.makeRotationFromEuler(this.rotation, "YZX");
	this.inverseTransformationMatrix.scale(this.scale);
	this.inverseTransformationMatrix.setPosition(this.position);
	
	this.transformationMatrix.getInverse(this.inverseTransformationMatrix);
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
	this.size = new Vector2(this.size.y * this.aspect, this.size.y);

	this.updateProjectionMatrix();
}

//Create string with camera info
OrthographicCamera.prototype.toString = function()
{
	return "OrthographicCamera (VirtualSize:"+this.size.toString()+" AspectRatio:"+this.aspect+")";
}

