"use strict";

//Constructor from y size or x and y size and canvas
function OrthographicCamera(height, width)
{
	Camera.call(this);

	this.type = "OrthographicCamera";

	//Attributes
	this.aspect = width/height;
	this.size = new Vector2(width, height);

	this.updateProjectionMatrix();
}

OrthographicCamera.prototype = Object.create(Camera.prototype);

//Calculate camera projection Matrix
OrthographicCamera.prototype.updateProjectionMatrix = function()
{
	this.projectionMatrix.makeOrthographic(-this.size.x, this.size.x, this.size.y, -this.size.y, this.near, this.far);
};

//Call every time the canvas is resized
OrthographicCamera.prototype.resize = function(x, y)
{
	this.aspect = x / y;
	this.size = new Vector2(this.size.y * this.aspect, this.size.y);

	this.updateProjectionMatrix();
};
