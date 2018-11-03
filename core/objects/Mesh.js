"use strict";

/**
 * Mesh is used to combine a geometry and a material.
 */
function Mesh(geometry, material)
{
	Object3D.call(this);

	/**
	 * Geometry object.
	 */
	this.geometry = geometry !== undefined ? geometry : new Geometry();

	/**
	 * Material object or array of materials, used to draw the geometry.
	 */
	this.material = material !== undefined ? material : [];
	
	/**
	 * GL drawing mode.
	 */
	this.mode = Mesh.TRIANGLES;

	/**
	 * Bounding box surrounding the mesh.
	 */
	this.box = null;

	/**
	 * Store relation between faces and materials.
	 *
	 * <Face Index Ini / Face Index End / Material>
	 */
	this.faceMaterial = [];
	this.count = 0;
}

Mesh.prototype = Object.create(Object3D.prototype);

Mesh.POINTS = 0x0000;
Mesh.LINES = 0x0001;
Mesh.LINE_LOOP = 0x0002;
Mesh.LINE_STRIP = 0x0003;
Mesh.TRIANGLES = 0x0004;
Mesh.TRIANGLE_STRIP = 0x0005;
Mesh.TRIANGLE_FAN = 0x0006;

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
			this.material[this.faceMaterial[i+2]].render(renderer, camera, this, scene);
		}
	}
	else
	{
		this.count = this.geometry.faces.length;
		this.material.render(renderer, camera, this, scene);
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
