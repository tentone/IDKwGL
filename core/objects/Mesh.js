"use strict";

function Mesh(geometry, material)
{
	Object3D.call(this);

	this.geometry = geometry !== undefined ? geometry : new Geometry();
	this.material = material !== undefined ? material : [];

	//Bounding box
	this.box = null;

	//Store relation between faces and materials 
	this.faceMaterial = []; //<Face Index Ini / Face Index End / Material>
	this.count = 0;
}

Mesh.prototype = Object.create(Object3D.prototype);

Mesh.prototype.constructor = Mesh;

/** 
 * Render this mesh to screen using its attached material.
 */
Mesh.prototype.render = function(renderer, camera, scene)
{
	if(this.material instanceof Array)
	{
		for(var i = 0; i < this.faceMaterial.length; i += 3)
		{
			this.offset = this.faceMaterial[i];
			this.count = this.faceMaterial[i+1];
			this.material[this.faceMaterial[i+2]].render(renderer, camera, this);
		}
	}
	else
	{
		this.count = this.geometry.faces.length;
		this.material.render(renderer, camera, this);
	}
};

/**
 * Creates a copy of this mesh.
 */
Mesh.prototype.clone = function()
{
	var model = new Mesh();

	model.geometry = this.geometry;
	model.material = this.material;

	model.faceMaterial = this.faceMaterial;

	model.position.set(this.position.x, this.position.y, this.position.z);
	model.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
	model.scale.set(this.scale.x, this.scale.y, this.scale.z);

	return model;
};

/** 
 * Get Bouding box created from vertex data.
 *
 * If not available calculate box from vertex data.
 */
Mesh.prototype.getBox = function(recalculate)
{
	if(this.box === null || recalculate === true)
	{
		var vertex = this.geometry.vertex;

		var min = new Vector3(vertex[0], vertex[1], vertex[2]);
		var max = new Vector3(vertex[0], vertex[1], vertex[2]);
		var buf = new Vector3(0,0,0);

		for(var i = 3; i < vertex.length; i += 3)
		{
			buf.set(vertex[i], vertex[i+1], vertex[i+2]);

			if(buf.x < min.x)
			{
				min.x = buf.x;
			}
			else if(buf.x > max.x)
			{
				max.x = buf.x;
			}
		
			if(buf.y < min.y)
			{
				min.y = buf.y;
			}
			else if(buf.y > max.y)
			{
				max.y = buf.y;
			}

			if(buf.z < min.z)
			{
				min.z = buf.z;
			}
			else if(buf.z > max.z)
			{
				max.z = buf.z;
			} 
		}

		//Set min and max to scale
		min.mul(this.scale);
		max.mul(this.scale);

		//Create box
		this.box = new Box();
		this.box.size.set(max.x-min.x, max.y-min.y, max.z-min.z);
		this.box.position.set(this.position.x, this.position.y, this.position.z);
		this.box.ori.set(-min.x,-min.y,-min.z);
	}
	
	return this.box;
};
