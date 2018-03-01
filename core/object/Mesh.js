"use strict";

//Empty model constructor
function Mesh()
{
	Object3D.call(this);

	//Mesh Data
	this.vertex = []; //Vertex
	this.uvs = []; //Vertex Texture
	this.normals = []; //Vertex Normals
	this.faces = []; //Face <vertex / texture / normal>

	//Bounding box
	this.box = null;

	//Store relation between faces and materials 
	this.faceMaterial = []; //<Face Index Ini / Face Index End / Material>
	this.material = []; //Material Array

	//GL Buffers
	this.normalBuffer = null;
	this.vertexBuffer = null;
	this.textureCoordBuffer = null;
	this.facesBuffer = null;

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

	//Time
	this.time = 0;
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
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Vertex normal
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	//Texture UV
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexUVAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Faces
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);

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

	gl.disable(gl.CULL_FACE);
};

//Recreate data buffers (Should be called after structural changes)
Mesh.prototype.updateBuffers = function()
{
	//Vertex
	this.vertexBuffer = gl.createBuffer();
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = this.vertex.length/3;						
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW);

	//Texture
	this.textureCoordBuffer = gl.createBuffer();
	this.textureCoordBuffer.itemSize = 2;
	this.textureCoordBuffer.numItems = this.uvs.length/2;
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);

	//Normals
	this.normalBuffer = gl.createBuffer();
	this.normalBuffer.itemSize = 3;
	this.normalBuffer.numItems = this.normals.length/3;			
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

	//Faces
	this.facesBuffer = gl.createBuffer();
	this.facesBuffer.itemSize = 1;
	this.facesBuffer.numItems = this.faces.length;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
};

//Creates a copy of this model (keeps same vertex, buffer and texture data pointers)
Mesh.prototype.clone = function()
{
	var model = new Mesh();

	model.vertex = this.vertex;
	model.uvs = this.uvs;
	model.normals = this.normals;
	model.faces = this.faces;
	model.material = this.material;
	model.faceMaterial = this.faceMaterial;

	model.textureCoordBuffer = this.textureCoordBuffer;
	model.normalBuffer = this.normalBuffer;
	model.vertexBuffer = this.vertexBuffer;
	model.facesBuffer = this.facesBuffer;

	model.texture = this.texture;

	model.position.set(this.position.x, this.position.y, this.position.z);
	model.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
	model.scale.set(this.scale.x, this.scale.y, this.scale.z);

	return model;
};

//Attach texture image to this model
Mesh.prototype.setTexture = function(texture)
{
	this.texture = texture;

	this.material = [];
	this.material[0] = new PhongMaterial("mat");
	this.material[0].texture = texture;

	this.faceMaterial = [];
	this.faceMaterial[0] = 0 ;
	this.faceMaterial[1] = this.faces.length;
	this.faceMaterial[2] = 0;
};

//Mult values by texture coords
Mesh.prototype.mulTextureCoords = function(x, y)
{
	for(var i = 0; i < this.uvs.length; i += 2)
	{
		this.uvs[i] *= x;
		this.uvs[i+1] *= y;
	}

	this.updateBuffers();
};

//Computing the triangle unit normal vector to vertex 
Mesh.prototype.computeVertexNormals = function()
{
	//Clearing the new normals array
	this.normals.length = 0;
	
	//Taking 3 vertices from the coordinates array 
	for(var i = 0; i < this.vertex.length; i += 9)
	{
		//Compute unit normal vector for each triangle
		var normalVector = MathUtils.computeNormalVector(new Vector3(this.vertex[i], this.vertex[i+1], this.vertex[i+2]), new Vector3(this.vertex[i+3], this.vertex[i+4], this.vertex[i+5]), new Vector3(this.vertex[i+6], this.vertex[i+7], this.vertex[i+8]));

		//Store normal 3 times
		this.normals.push(normalVector.x);
		this.normals.push(normalVector.y);
		this.normals.push(normalVector.z);
		this.normals.push(normalVector.x);
		this.normals.push(normalVector.y);
		this.normals.push(normalVector.z);
		this.normals.push(normalVector.x);
		this.normals.push(normalVector.y);
		this.normals.push(normalVector.z);
	}
};

//Get Bouding box created from vertex data
Mesh.prototype.getBox = function()
{
	//If not available calculate box from vertex data
	if(this.box === null)
	{
		var min = new Vector3(this.vertex[0], this.vertex[1], this.vertex[2]);
		var max = new Vector3(this.vertex[0], this.vertex[1], this.vertex[2]);
		var buf = new Vector3(0,0,0);

		for(var i = 3; i < this.vertex.length; i += 3)
		{
			buf.set(this.vertex[i], this.vertex[i+1], this.vertex[i+2]);

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

		//Set Box size position and origin point
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

	model.texture = Texture.generateSolidColorTexture(gl, Color.GREEN);

	model.vertex =
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

	model.uvs =
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

	model.normals  =
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


	model.faces =
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

	model.updateBuffers();

	return model;
};

//Test Function that creates a cube with texture and retuns it
Mesh.plane = function()
{
	var model = new Mesh();

	model.texture = Texture.generateSolidColorTexture(gl, Color.GREEN);

	model.vertex =
	[
		-1.0, -1.0,  0.0,
		1.0, -1.0,  0.0,
		1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0
	];

	model.uvs =
	[
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	];

	model.normals =
	[
		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0,
		0.0,  0.0,  -1.0
	];

	model.faces =
	[
		0, 1, 2, 0, 2, 3
	];
	
	model.updateBuffers();
	return model;
};
