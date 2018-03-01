"use strict";

//Empty model constructor
function Mesh(geometry, material)
{
	Object3D.call(this);

	this.geometry = geometry !== undefined ? geometry : new Geometry();
	this.material = material !== undefined ? material : [];

	//Bounding box
	this.box = null;

	//Store relation between faces and materials 
	this.faceMaterial = []; //<Face Index Ini / Face Index End / Material>
	this.material = []; //Material Array

	//Time
	this.time = 0;
	
	//Shader
	this.shader = new Shader(BasicMaterial.fragmentShader, BasicMaterial.vertexShader);

	//Vertex attributes
	this.shader.program.vertexPositionAttribute = gl.getAttribLocation(this.shader.program, "vertexPosition");
	gl.enableVertexAttribArray(this.shader.program.vertexPositionAttribute);

	this.shader.program.vertexUVAttribute = gl.getAttribLocation(this.shader.program, "vertexUV");
	gl.enableVertexAttribArray(this.shader.program.vertexUVAttribute);

	this.shader.program.vertexNormalAttribute = gl.getAttribLocation(this.shader.program, "vertexNormal");
	gl.enableVertexAttribArray(this.shader.program.vertexNormalAttribute);

	//Texture
	this.shader.program.textureSampler = gl.getUniformLocation(this.shader.program, "texture");

	//Matrices
	this.shader.program.viewMatrixUniform = gl.getUniformLocation(this.shader.program, "view");
	this.shader.program.projectionMatrixUniform = gl.getUniformLocation(this.shader.program, "projection");
	this.shader.program.modelMatrixUniform = gl.getUniformLocation(this.shader.program, "model");

	this.shader.program.time = gl.getUniformLocation(this.shader.program, "time");
}

Mesh.prototype = Object.create(Object3D.prototype);

//Draw Mesh to camera
Mesh.prototype.draw = function(camera, scene)
{
	this.time += 0.016;

	gl.useProgram(this.shader.program);

	//Enable backface culling
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);

	//Time
	gl.uniform1f(this.shader.program.time, this.time);

	//Transformation matrices
	gl.uniformMatrix4fv(this.shader.program.projectionMatrixUniform, false, camera.projectionMatrix.flatten());
	gl.uniformMatrix4fv(this.shader.program.viewMatrixUniform, false, camera.transformationMatrix.flatten());
	gl.uniformMatrix4fv(this.shader.program.modelMatrixUniform, false, this.transformationMatrix.flatten());

	//Vertex position
	gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.vertexBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexPositionAttribute, this.geometry.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Vertex normal
	gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.normalBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexNormalAttribute, this.geometry.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	//Texture UV
	gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.textureCoordBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexUVAttribute, this.geometry.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Faces
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.facesBuffer);

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

	gl.disable(gl.CULL_FACE);
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
	this.material = new PhongMaterial("mat");
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

//Test Function that creates a cube with texture and retuns it
Mesh.cube = function()
{
	var model = new Mesh();

	model.geometry.vertex =
	[
		// Front face
		-1.0, -1.0,  1.0,
		1.0, -1.0,  1.0,
		1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,
		// Back face
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		1.0,  1.0, -1.0,
		1.0, -1.0, -1.0,
		// Top face
		-1.0,  1.0, -1.0,
		-1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,
		1.0,  1.0, -1.0,
		// Bottom face
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0,  1.0,
		-1.0, -1.0,  1.0,
		// Right face
		1.0, -1.0, -1.0,
		1.0,  1.0, -1.0,
		1.0,  1.0,  1.0,
		1.0, -1.0,  1.0,
		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0,  1.0, -1.0
	];

	model.geometry.uvs =
	[
		// Front face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Back face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		// Top face
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		// Bottom face
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,
		// Right face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		// Left face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	];

	model.geometry.normals  =
	[
		//Front face
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		// Back face
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		//Top face
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		//Bottom face
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		//Right face
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		//Left face
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0
	];


	model.geometry.faces =
	[
		//Front face
		0, 1, 2, 0, 2, 3,    
		//Back face
		4, 5, 6, 4, 6, 7,    
		//Top face
		8, 9, 10, 8, 10, 11,
		//Bottom face
		12, 13, 14, 12, 14, 15,
		//Right face
		16, 17, 18, 16, 18, 19,
		//Left face
		20, 21, 22, 20, 22, 23
	];

	model.geometry.updateBuffers();

	return model;
};

//Test Function that creates a cube with texture and retuns it
Mesh.plane = function()
{
	var model = new Mesh();

	model.geometry.vertex =
	[
		-1.0, -1.0,  0.0,
		1.0, -1.0,  0.0,
		1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0
	];

	model.geometry.uvs =
	[
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	];

	model.geometry.normals =
	[
		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0
	];

	model.geometry.faces =
	[
		0, 1, 2, 0, 2, 3
	];
	
	model.geometry.updateBuffers();

	return model;
};
