"use strict";

function Object3D()
{
	//Attributes
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Object3D";
	
	//Transformation
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Matrix
	this.transformationMatrix = new Matrix4();
}

Object3D.prototype.constructor = Object3D;

Object3D.prototype.isObject3D = true;

/**
 * Render Object3D to a specific camera.
 */
Object3D.prototype.render = function(gl, camera, scene){};

/**
 * Calculate tranformation matrix.
 *
 * Should be called after changing world position.
 */
Object3D.prototype.updateMatrix = function()
{
	this.transformationMatrix.makeRotationFromEuler(this.rotation, "YZX");
	this.transformationMatrix.scale(this.scale);
	this.transformationMatrix.setPosition(this.position);
};

/**
 * Creates a copy of this model.
 */
Object3D.prototype.clone = function()
{
	var object = new Object3D();

	object.position.set(this.position.x, this.position.y, this.position.z);
	object.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
	object.scale.set(this.scale.x, this.scale.y, this.scale.z);

	return object;
};

