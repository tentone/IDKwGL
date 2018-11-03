"use strict";

/**
 * Orthographic projection camera.
 *
 * Constructor from y size or x and y size and canvas
 */
function OrthographicCamera(height, width)
{
	Camera.call(this);

	this.type = "OrthographicCamera";

	/**
	 * Aspect ratio of the view.
	 */
	this.aspect = width / height;

	/**
	 * Virtual projection size.
	 */
	this.size = new Vector2(width, height);

	this.updateProjectionMatrix();
}

OrthographicCamera.prototype = Object.create(Camera.prototype);

OrthographicCamera.prototype.constructor = OrthographicCamera;

OrthographicCamera.prototype.updateProjectionMatrix = function()
{
	this.projectionMatrix.makeOrthographic(-this.size.x, this.size.x, this.size.y, -this.size.y, this.near, this.far);
};

OrthographicCamera.prototype.resize = function(x, y)
{
	this.aspect = x / y;
	this.size = new Vector2(this.size.y * this.aspect, this.size.y);

	this.updateProjectionMatrix();
};
