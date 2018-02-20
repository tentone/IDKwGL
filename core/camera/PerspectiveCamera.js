"use strict";

//Prespective camera constructor from canvas fov and zoom values
function PerspectiveCamera(aspect, fov, zoom)
{
	this.type = Camera.PERSPECTIVE;

	//Position
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Atributes
	this.aspect = aspect; //x/y
	this.fov = fov;

	//Matrices
	this.projectionMatrix = new Matrix4();
	this.inverseTransformationMatrix = new Matrix4();
	this.transformationMatrix = new Matrix4();

	//Update projection
	this.updateProjectionMatrix();
}

PerspectiveCamera.UP = new Vector3(0, 1, 0);

//Calculate camera transformation Matrix
PerspectiveCamera.prototype.updateMatrix = function()
{
	this.inverseTransformationMatrix.makeRotationFromEuler(this.rotation, "YZX");
	this.inverseTransformationMatrix.scale(this.scale);
	this.inverseTransformationMatrix.setPosition(this.position);
	
	this.transformationMatrix.getInverse(this.inverseTransformationMatrix);
}

//Calculate camera projection Matrix
PerspectiveCamera.prototype.updateProjectionMatrix = function()
{
	var near = 0.1;
	var far = 2000;

	var top = near * Math.tan(Conversion.degreesToRadians(this.fov)/2);
	var height = 2 * top;
	var width = this.aspect * height;
	var left = - 0.5 * width;
	
	this.projectionMatrix.makePerspective(left, left + width, top, top - height, near, far);
}

//Call every time the canvas is resized
PerspectiveCamera.prototype.resize = function(x, y)
{
	this.aspect = x / y;

	this.updateProjectionMatrix();
}

//Create Info String
PerspectiveCamera.prototype.toString = function()
{
	return "PerspectiveCamera\nPosition:"+this.position.toString()+"\nRotation:"+this.rotation.toString()+"\nFOV:"+this.fov+"\nAspectRatio:"+this.aspect;
}