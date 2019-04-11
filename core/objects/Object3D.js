"use strict";

/**
 * Object 3D is used as the base for all the drawable objects.
 */
function Object3D()
{
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Object3D";
	
	/**
	 * Local position.
	 */
	this.position = new Vector3(0,0,0);

	/**
	 * Local euler rotation.
	 */
	this.rotation = new Vector3(0,0,0);

	/**
	 * Local scale.
	 */
	this.scale = new Vector3(1,1,1);

	/**
	 * Indicates if the matrix needs to be updated.
	 *
	 * If a parent matrix is updated all children need to be updated as well.
	 */
	this.matrixNeedsUpdate = true;

	/**
	 * Transformation matrix.
	 */
	this.transformationMatrix = new Matrix4();

	/** 
	 * World matrix to be used respecting the hierarchy of transformations.
	 *
	 * It is obtained by multiplying the parent matrix with the local transformation matrix.
	 */
	this.worldMatrix = new Matrix4();

	/**
	 * Parent object3d element.
	 *
	 * The parent transformation is applied to its children.
	 */
	this.parent = null;

	/**
	 * Children elements attached to this object.
	 *
	 * Children suffer the transformation applied to the parent object.
	 */
	this.children = [];
}

Object3D.prototype.constructor = Object3D;

Object3D.prototype.isObject3D = true;

/**
 * Render Object3D to a specific camera.
 */
Object3D.prototype.render = function(gl, camera, scene){};

/**
 * Add a object as child of this object.
 */
Object3D.prototype.add = function(child)
{
	child.parent = this;
	this.children.push(child);
};

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

	this.worldMatrix.copy(this.transformationMatrix);

	if(this.parent !== null)
	{
		this.worldMatrix.multiply(this.parent.worldMatrix);
	}
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
