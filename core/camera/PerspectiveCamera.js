"use strict";

//Prespective camera constructor from canvas fov and zoom values
function PerspectiveCamera(canvas, fov, zoom)
{
	//Camera type
	this.type = Camera.PERSPECTIVE;

	//Camera Screen Interface
	this.aspect = canvas.width/canvas.height; //x/y
	this.screenSize = new Vector2(canvas.width, canvas.height);

	//Camera Movement
	this.position = new Vector3(0,0,0); //Position
	this.rotation = new Vector3(0,0,0); //Rotation in degres
	this.scale = new Vector3(1,1,1);

	//Camera Properties
	this.zoom = zoom;
	this.fov = fov;

	//Camera Transformation Matrix
	this.projectionMatrix = new Matrix4();
	this.inverseTransformationMatrix = new Matrix4();
	this.transformationMatrix = new Matrix4();

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

//Change Camera Field of View
PerspectiveCamera.prototype.setFov = function(fov)
{
	this.fov = fov;
	this.updateProjectionMatrix();
}

//Call every time the canvas is resized
PerspectiveCamera.prototype.resize = function(x, y)
{
	this.aspect = x / y;
	this.screenSize.set(x, y);
	this.updateProjectionMatrix();
}

//Create Info String
PerspectiveCamera.prototype.toString = function()
{
	return "PerspectiveCamera\nPosition:"+this.position.toString()+"\nRotation:"+this.rotation.toString()+"\nFOV:"+this.fov+"\nScreenSize:"+this.screenSize.toString()+"\nAspectRatio:"+this.aspect;
}