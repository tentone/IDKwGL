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
}

Mesh.prototype = Object.create(Object3D.prototype);

//Draw Mesh to camera
Mesh.prototype.render = function(renderer, camera, scene)
{
	if(this.material instanceof Array)
	{
		if(this.material.length > 0)
		{
			this.material[0].render(renderer, camera, this);
		}
		else
		{
			console.log("Empty material array");
		}
	}
	else
	{
		this.material.render(renderer, camera, this);
	}

	/*
	if(this.material instanceof Array)
	{
		//Draw all faces w/ correspondent material
		for(var i = 0; i < this.faceMaterial.length; i += 3)
		{
			//Set texture
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.material[this.faceMaterial[i+2]].texture);
			gl.uniform1i(this.shader.program.textureSampler, 0);
			
			//Draw the triangles
			gl.drawElements(gl.TRIANGLES, this.faceMaterial[i+1], gl.UNSIGNED_SHORT, 0);
		}
	}
	else
	{
		//Set texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
		gl.uniform1i(this.shader.program.textureSampler, 0);
		
		//Draw the triangles
		gl.drawElements(gl.TRIANGLES, this.geometry.faces.length, gl.UNSIGNED_SHORT, 0);
	}
	*/
};

//Creates a copy of this model (keeps same vertex, buffer and texture data pointers)
Mesh.prototype.clone = function()
{
	var model = new Mesh();

	model.geometry = this.geometry;

	model.material = this.material;
	model.faceMaterial = this.faceMaterial;

	model.texture = this.texture;

	model.position.set(this.position.x, this.position.y, this.position.z);
	model.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
	model.scale.set(this.scale.x, this.scale.y, this.scale.z);

	return model;
};

//Attach texture image to this model
Mesh.prototype.setTexture = function(texture)
{
	this.material = new PhongMaterial();
	this.material.texture = texture;
};

//Get Bouding box created from vertex data
Mesh.prototype.getBox = function()
{
	//If not available calculate box from vertex data
	if(this.box === null)
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
