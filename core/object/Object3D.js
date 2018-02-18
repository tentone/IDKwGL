"use strict";

function Object3D()
{
	this.origin = new Vector3(0,0,0);
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Tranformation matrix
	this.transformationMatrix = new Matrix(4,4);
}
