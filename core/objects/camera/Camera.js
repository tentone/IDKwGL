"use strict";

function Camera()
{
	Object3D.call(this);

	this.type = "Camera";

	//Attributes
	this.near = 0.1;
	this.far = 2000;

	//Matrices
	this.projectionMatrix = new Matrix4();
	this.inverseTransformationMatrix = new Matrix4();
}

Camera.prototype = Object.create(Object3D.prototype);

Camera.prototype.constructor = Camera;

//Call before start a frame on this camera
Camera.prototype.updateMatrix = function()
{
	this.inverseTransformationMatrix.makeRotationFromEuler(this.rotation, "YZX");
	this.inverseTransformationMatrix.scale(this.scale);
	this.inverseTransformationMatrix.setPosition(this.position);
	
	this.transformationMatrix.getInverse(this.inverseTransformationMatrix);
};

//Calculate camera projection Matrix
Camera.prototype.updateProjectionMatrix = function(){};

//Called every time the canvas is resized
Camera.prototype.resize = function(x, y){};