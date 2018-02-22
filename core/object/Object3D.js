"use strict";

//Empty model constructor
function Object3D()
{
	//Attributes
	this.id = MathUtils.randomInt();
	this.name = "";
	this.type = "Object3D";
	
	//Transformation
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Matrix
	this.transformationMatrix = new Matrix4();
}

//Calculate tranformation Matrix (should be called after changing position)
Object3D.prototype.updateMatrix = function()
{
	this.transformationMatrix.makeRotationFromEuler(this.rotation, "YZX");
	this.transformationMatrix.scale(this.scale);
	this.transformationMatrix.setPosition(this.position);
};

//Creates a copy of this model (keeps same vertex, buffer and texture data pointers)
Object3D.prototype.clone = function()
{
	var object = new Object3D();

	object.position.set(this.position.x, this.position.y, this.position.z);
	object.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
	object.scale.set(this.scale.x, this.scale.y, this.scale.z);

	return object;
};