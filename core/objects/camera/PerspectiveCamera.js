"use strict";

/**
 * Prespective camera constructor from canvas fov and zoom values.
 */
function PerspectiveCamera(aspect, fov, zoom)
{
	Camera.call(this);

	this.type = "PerspectiveCamera";

	/**
	 * Aspect ratio of the camera.
	 */
	this.aspect = aspect; //x/y

	/**
	 * Horizontal field of view of the camera.
	 */
	this.fov = fov;

	this.updateProjectionMatrix();
}

PerspectiveCamera.prototype = Object.create(Camera.prototype);

PerspectiveCamera.prototype.constructor = PerspectiveCamera;

PerspectiveCamera.prototype.updateProjectionMatrix = function()
{
	var top = this.near * Math.tan(Conversion.degreesToRadians(this.fov)/2);
	var height = 2 * top;
	var width = this.aspect * height;
	var left = - 0.5 * width;
	
	this.projectionMatrix.makePerspective(left, left + width, top, top - height, this.near, this.far);
}

PerspectiveCamera.prototype.resize = function(x, y)
{
	this.aspect = x / y;
	this.updateProjectionMatrix();
}
