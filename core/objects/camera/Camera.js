"use strict";

/**
 * Base camera object, used to implement other type of cameras.
 *
 * A camera stored a projection matrix and a inverse transformation.
 */
function Camera()
{
	Object3D.call(this);

	this.type = "Camera";

	/**
	 * Near plane.
	 */
	this.near = 0.1;

	/**
	 * Far plane.
	 */
	this.far = 2000;

	/**
	 * Projection matrix of the camera used to project drawable objects into the visualization plane.
	 */
	this.projectionMatrix = new Matrix4();

	/**
	 * Camera inverse matrix transformation.
	 */
	this.inverseTransformationMatrix = new Matrix4();
}

Camera.prototype = Object.create(Object3D.prototype);
Camera.prototype.constructor = Camera;
Camera.UP = new Vector3(0, 1, 0);

/**
 * Look into a direction defined by a vector.
 * 
 * Should be called before start a frame on this camera-
 */
Camera.prototype.lookAtDirection = function(direction)
{
	this.transformationMatrix.lookAt(this.position, direction, Camera.UP);
	this.transformationMatrix.setPosition(this.position);

	this.worldMatrix.copy(this.transformationMatrix);

	if(this.parent !== null)
	{
		this.worldMatrix.multiply(this.parent.worldMatrix);
	}
	
	this.inverseTransformationMatrix.getInverse(this.worldMatrix);
};


/**
 * Update the transformation and inverse transformation matrix of the camera.
 *
 * Should be called before start a frame on this camera.
 */
Camera.prototype.updateMatrix = function()
{
	this.transformationMatrix.makeRotationFromEuler(this.rotation, "YZX");
	this.transformationMatrix.setPosition(this.position);

	this.worldMatrix.copy(this.transformationMatrix);

	if(this.parent !== null)
	{
		this.worldMatrix.multiply(this.parent.worldMatrix);
	}

	this.inverseTransformationMatrix.getInverse(this.worldMatrix);
};

/**
 * Calculate camera projection matrix.
 */
Camera.prototype.updateProjectionMatrix = function(){};

/**
 *
 * Should be called every time the canvas is resized.
 */
Camera.prototype.resize = function(x, y){};