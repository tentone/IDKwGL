"use strict";

//Prespective camera constructor from canvas fov and zoom values
function PerspectiveCamera(aspect, fov, zoom)
{
	Camera.call(this);

	this.type = "PerspectiveCamera";

	//Attributes
	this.aspect = aspect; //x/y
	this.fov = fov;

	this.updateProjectionMatrix();
}

PerspectiveCamera.prototype = Object.create(Camera.prototype);

PerspectiveCamera.prototype.constructor = PerspectiveCamera;

//Calculate camera projection Matrix
PerspectiveCamera.prototype.updateProjectionMatrix = function()
{
	var top = this.near * Math.tan(Conversion.degreesToRadians(this.fov)/2);
	var height = 2 * top;
	var width = this.aspect * height;
	var left = - 0.5 * width;
	
	this.projectionMatrix.makePerspective(left, left + width, top, top - height, this.near, this.far);
}

//Call every time the canvas is resized
PerspectiveCamera.prototype.resize = function(x, y)
{
	this.aspect = x / y;
	this.updateProjectionMatrix();
}
