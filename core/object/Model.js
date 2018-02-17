"use strict";

//Empty model constructor
function Model()
{
	//Model Data
	this.vertex = []; //Vertex
	this.uvs = []; //Vertex Texture
	this.normals = []; //Vertex Normals
	this.faces = []; //Face <vertex / texture / normal>

	//Bounding box
	this.box = null;

	//Store relation between faces and materials 
	this.faceMaterial = []; //<Face Index Ini / Face Index End / Material>
	this.material = []; //Material Array

	//Buffers
	this.normalBuffer = null;
	this.vertexBuffer = null;
	this.textureCoordBuffer = null;
	this.facesBuffer = null;

	//Texture
	this.texture = Texture.generateSolidColorTexture(Color.RED);

	//Tranformations Control
	this.origin = new Vector3(0,0,0);
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Update model buffers
	this.updateBuffers();

	//Tranformation Matrix
	this.transformationMatrix = new Matrix(4,4);

	//Shader
	var fragment = "precision mediump float;\
	\
	varying vec2 vTextureCoord;\
	varying vec3 vTransformedNormal;\
	varying vec4 vPosition;\
	\
	uniform sampler2D uSampler;\
	\
	void main(void)\
	{\
		vec3 direction = vec3(0, 1, 0);\
		vec3 directionalColor = vec3(0.0, 0.0, 0.0);\
		vec3 ambientColor = vec3(1.0, 1.0, 1.0);\
	\
		vec3 lightWeighting = ambientColor + directionalColor * max(dot(normalize(vTransformedNormal), direction), 0.0);\
	\
		vec4 fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\
	\
		gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);\
	}";

	var vertex = "attribute vec3 aVertexPosition;\
	attribute vec3 aVertexNormal;\
	attribute vec2 aTextureCoord;\
	\
	uniform mat4 uMVMatrix;\
	uniform mat4 uPMatrix;\
	uniform mat3 uNMatrix;\
	\
	varying vec2 vTextureCoord;\
	varying vec3 vTransformedNormal;\
	varying vec4 vPosition;\
	\
	void main(void)\
	{\
		vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\
		vTextureCoord = aTextureCoord;\
		vTransformedNormal = uNMatrix * aVertexNormal;\
		gl_Position = uPMatrix * vPosition;\
	}";

	//Shader
	this.shader = new Shader(fragment, vertex);

	//Vertex Coordinates 
	this.shader.program.vertexPositionAttribute = gl.getAttribLocation(this.shader.program, "aVertexPosition");
	gl.enableVertexAttribArray(this.shader.program.vertexPositionAttribute);

	//Texture coordinates
	this.shader.program.textureCoordAttribute = gl.getAttribLocation(this.shader.program, "aTextureCoord");
	gl.enableVertexAttribArray(this.shader.program.textureCoordAttribute);

	//Normals
	this.shader.program.vertexNormalAttribute = gl.getAttribLocation(this.shader.program, "aVertexNormal");
	gl.enableVertexAttribArray(this.shader.program.vertexNormalAttribute);

	//The sampler
	this.shader.program.samplerUniform = gl.getUniformLocation(this.shader.program, "uSampler");
	this.shader.program.pMatrixUniform = gl.getUniformLocation(this.shader.program, "uPMatrix");
	this.shader.program.mvMatrixUniform = gl.getUniformLocation(this.shader.program, "uMVMatrix");
	this.shader.program.nMatrixUniform = gl.getUniformLocation(this.shader.program, "uNMatrix");
	
}

//Draw Model to camera
Model.prototype.draw = function(camera, scene)
{
	gl.useProgram(this.shader.program);
	gl.uniformMatrix4fv(gl.getUniformLocation(this.shader.program, "uPMatrix"), false, camera.projectionMatrix.flatten());

	//Clone Camera Global transformation Matrix and multiply
	var camTransformationMatrix = Matrix.mulTranspose(this.transformationMatrix, camera.transformationMatrix);

	//Normal matrix
	var normalMatrix = MathUtils.matrix3Invert(camTransformationMatrix);

	// Passing the Model View Matrix to apply the current transformation
	gl.uniformMatrix4fv(gl.getUniformLocation(this.shader.program, "uMVMatrix"), false, camTransformationMatrix.flatten());
	gl.uniformMatrix3fv(gl.getUniformLocation(this.shader.program, "uNMatrix"), false, normalMatrix.flatten());

	//Vertex buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Texture Coords buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.vertexAttribPointer(this.shader.program.textureCoordAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Normal Coords buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Faces buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);

	//Draw trough all texture
	for(var i = 0; i < this.faceMaterial.length; i += 3)
	{
		//Set texture to model
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.material[this.faceMaterial[i+2]].texture);
		gl.uniform1i(this.shader.program.samplerUniform, 0);
		
		//Drawing the triangles
		gl.drawElements(gl.TRIANGLES, this.faceMaterial[i+1], gl.UNSIGNED_SHORT, 0);
	}
}

//Recalculate Tranformation Matrix (Should be called after changing position)
Model.prototype.update = function()
{
	this.transformationMatrix = MatrixGenerator.scalingMatrix(this.scale.x, this.scale.y, this.scale.z);
	this.transformationMatrix.mul(MatrixGenerator.translation(-this.origin.x, -this.origin.y, -this.origin.z));
	this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
	this.transformationMatrix.mul(MatrixGenerator.translation(this.position.x, this.position.y, this.position.z));
}

//Recreate data buffers (Should be called after structural changes)
Model.prototype.updateBuffers = function()
{
	//Vertex
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = this.vertex.length/3;						

	//Texture
	this.textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
	this.textureCoordBuffer.itemSize = 2;
	this.textureCoordBuffer.numItems = this.uvs.length/2;

	//Normals
	this.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
	this.normalBuffer.itemSize = 3;
	this.normalBuffer.numItems = this.normals.length/3;			

	//Vertex indices
	this.facesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
	this.facesBuffer.itemSize = 1;
	this.facesBuffer.numItems = this.faces.length;
}

//Creates a copy of this model (keeps same vertex, buffer and texture data pointers)
Model.prototype.clone = function()
{
	var model = new Model();

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
}

//Set model size with absolute values
Model.prototype.setSize = function(x, y, z)
{
	this.scale.set(x,y,z);
	this.scale.div(this.getBox().size);
}

//Attach texture image to this model
Model.prototype.setTexture = function(texture)
{
	this.texture = texture;

	this.material = [];
	this.material[0] = new Material("mat");
	this.material[0].texture = texture;

	this.faceMaterial = [];
	this.faceMaterial[0] = 0 ;
	this.faceMaterial[1] = this.faces.length;
	this.faceMaterial[2] = 0;
}

//OBJ file read from string
Model.prototype.loadOBJ = function(data)
{
	var lines = data.split("\n");

	//Clear Data
	this.vertex = []; //Vertex Points
	this.normals = []; //Vertex Normals
	this.uvs = []; //Vertex Texture Coords
	this.faces = []; //Face
	this.faceMaterial = []; //Face range and material
	this.box = null; //Bounding Box

	// Check every line and store 
	for(var i = 0; i < lines.length; i++)
	{
		// The tokens/values in each line Separation between tokens is 1 or mode whitespaces
		var tokens = lines[i].split(/\s\s*/);

		//Vertices
		if(tokens[0] == "v")
		{
			this.vertex.push(parseFloat(tokens[1]));
			this.vertex.push(parseFloat(tokens[2]));
			this.vertex.push(parseFloat(tokens[3]));
		}
		//Normals
		else if(tokens[0] == "vn")
		{
			this.normals.push(parseFloat(tokens[1]));
			this.normals.push(parseFloat(tokens[2]));
			this.normals.push(parseFloat(tokens[3]));
		}
		//Texture coords
		else if(tokens[0] == "vt")
		{
			this.uvs.push(parseFloat(tokens[1]));
			this.uvs.push(parseFloat(tokens[2]));
		}
		//Faces <vertex>/<texture>/<normal>
		else if(tokens[0] == "f")
		{
			//3 vertex face
			//f 16/92/11 14/101/22 1/69/1
			if(tokens.length == 4)
			{
				var val = tokens[1].split("/");
				this.faces.push(parseInt(val[0])); //Vertex
				this.faces.push(parseInt(val[1])); //Texture
				this.faces.push(parseInt(val[2]));; //Normal

				val = tokens[2].split("/");
				this.faces.push(parseInt(val[0])); //Vertex
				this.faces.push(parseInt(val[1])); //Texture
				this.faces.push(parseInt(val[2]));; //Normal

				val = tokens[3].split("/");
				this.faces.push(parseInt(val[0])); //Vertex
				this.faces.push(parseInt(val[1])); //Texture
				this.faces.push(parseInt(val[2]));; //Normal
			}
			//4 vertex face (Quad)
			//f 16/92/11 40/109/40 38/114/38 14/101/22
			else if(tokens.length == 5)
			{
				var val = tokens[1].split("/");
				this.faces.push(val[0]); //Vertex
				this.faces.push(val[1]); //Texture
				this.faces.push(val[2]); //Normal

				val = tokens[2].split("/");
				this.faces.push(val[0]); //Vertex
				this.faces.push(val[1]); //Texture
				this.faces.push(val[2]); //Normal

				val = tokens[3].split("/");
				this.faces.push(val[0]); //Vertex
				this.faces.push(val[1]); //Texture
				this.faces.push(val[2]); //Normal

				val = tokens[1].split("/");
				this.faces.push(val[0]); //Vertex
				this.faces.push(val[1]); //Texture
				this.faces.push(val[2]); //Normal

				val = tokens[3].split("/");
				this.faces.push(val[0]); //Vertex
				this.faces.push(val[1]); //Texture
				this.faces.push(val[2]); //Normal

				val = tokens[4].split("/");
				this.faces.push(val[0]); //Vertex
				this.faces.push(val[1]); //Texture
				this.faces.push(val[2]); //Normal
			}
		}
		//Material
		else if(tokens[0] == "usemtl")
		{
			//Search MTL index
			for(var j = 0; j < this.material.length; j++)
			{
				if(this.material[j].name == tokens[1])
				{
					break;
				}
			}

			//Check if material was found and add to list
			if(j != this.material.length)
			{
				//If faces material has elements add last index
				if(this.faceMaterial.length != 0)
				{
					this.faceMaterial[this.faceMaterial.length-2] = this.faces.length/3;
				}

				//Add new material
				this.faceMaterial.push(this.faces.length/3); //Ini Position
				this.faceMaterial.push(this.faces.length/3); //End Position (temporary)
				this.faceMaterial.push(j); //Material Index
			}
		}
	}
	
	if(this.faceMaterial.length > 0)
	{
		this.faceMaterial[this.faceMaterial.length-2] = this.faces.length/3;
	}

	//If no coord found complete with data
	if(this.uvs.length == 0)
	{
		//Full texture to all triangles
		this.uvs.push(0.0);
		this.uvs.push(0.0);

		this.uvs.push(1.0);
		this.uvs.push(1.0);

		//Add Texture Component to all faces
		for(i = 1; i < this.faces.length; i+=3)
		{
			if(isNaN(this.faces[i]))
			{
				if(i%2 == 0)
				{
					this.faces[i] = 1;
				}
				else
				{
					this.faces[i] = 2;
				}
			}
		}
	}

	// Checking to see if the normals are defined on the file
	if(this.normals.length == 0)
	{
		this.computeVertexNormals();
	}

	//Covert collected data
	this.transformOBJData();
}

//Tranform OBJ file to single hash level as used in classes
Model.prototype.transformOBJData = function()
{
	//Create temporary arrays to store all model data
	var vertex = [];
	var texture = [];
	var normals = [];
	var faces = [];
	
	//Transform Data
	for(var i = 0; i < this.faces.length; i += 3)
	{
		faces.push(i/3);

		vertex.push(this.vertex[(this.faces[i]-1)*3]);
		vertex.push(this.vertex[(this.faces[i]-1)*3+1]);
		vertex.push(this.vertex[(this.faces[i]-1)*3+2]);

		texture.push(this.uvs[(this.faces[i+1]-1)*2]);
		texture.push(this.uvs[(this.faces[i+1]-1)*2+1]);

		normals.push(this.normals[(this.faces[i+2]-1)*3]);
		normals.push(this.normals[(this.faces[i+2]-1)*3+1]);
		normals.push(this.normals[(this.faces[i+2]-1)*3+2]);
	}

	//Copy array pointer into main data and update bufffers
	this.faces = faces;
	this.vertex = vertex;
	this.uvs = texture;
	this.normals = normals;

	//Update Buffers
	this.updateBuffers();
}

//Read MTL data from String
Model.prototype.loadMTL = function(data, textureFolder)
{
	var lines = data.split("\n");
	var index = -1;

	//Clear material list
	this.material = [];

	//Read Data lines
	for(var i = 0; i < lines.length; i++)
	{
		var tokens = lines[i].split(/\s\s*/);

		//New Material
		if(tokens[0] == "newmtl")
		{
			index++;
			this.material[index] = new Material(tokens[1]);
		}

		//If material found
		if(index >= 0)
		{
			var offset = 0
			while(offset < tokens.length && tokens[offset] == "")
			{
				offset++;
			}

			//Texture
			if(tokens[offset] == "map_Kd" || tokens[offset] == "map_Ka")
			{
				this.material[index].texture = Texture.createTexture(textureFolder + "/" + tokens[1+offset]);
			}
			//Bump map
			else if(tokens[offset] == "mapBump" || tokens[offset] == "bump")
			{
				this.material[index].bumpMap = Texture.createTexture(textureFolder + "/" + tokens[1+offset]);
			}
			//Ambient color
			else if(tokens[offset] == "Ka")
			{
				this.material[index].ka.r = parseFloat(tokens[offset+1]);
				this.material[index].ka.g = parseFloat(tokens[offset+2]);
				this.material[index].ka.b = parseFloat(tokens[offset+3]);
			}
			//Diffuse color
			else if(tokens[offset] == "Kd")
			{
				this.material[index].kd.r = parseFloat(tokens[offset+1]);
				this.material[index].kd.g = parseFloat(tokens[offset+2]);
				this.material[index].kd.b = parseFloat(tokens[offset+3]);
			}
			//Specular color
			else if(tokens[offset] == "Ks")
			{
				this.material[index].ks.r = parseFloat(tokens[offset+1]);
				this.material[index].ks.g = parseFloat(tokens[offset+2]);
				this.material[index].ks.b = parseFloat(tokens[offset+3]);
			}
			//Specular intensity
			else if(tokens[offset] == "Ns")
			{
				this.material[index].ns = parseFloat(tokens[offset+1]);
			}
		}
	}
}

//Mult values by texture coords
Model.prototype.mulTextureCoords = function(x, y)
{
	for(var i = 0; i < this.uvs.length; i += 2)
	{
		this.uvs[i] *= x;
		this.uvs[i+1] *= y;
	}
	this.updateBuffers();
}

//Computing the triangle unit normal vector to vertex 
Model.prototype.computeVertexNormals = function()
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
}

//Get Bouding box created from vertex data
Model.prototype.getBox = function()
{
	//If not available calculate box from vertex data
	if(this.box == null)
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
}

//Create string with model info
Model.prototype.toString = function()
{
	var s = "Model\n   VertexCount:"+this.vertex.length+"\n   NormalCount:"+this.normals.length+
		"\n   TextureCount:"+this.uvs.length+"\n   Faces Count:"+this.faces.length+
		"\n\n   FaceList:\n[";
	
	for(var i = 0; i < this.faces.length; i+=9)
	{
		s+= "\n   ("+this.faces[i]+", "+this.faces[i+1]+", "+this.faces[i+2]+")  ";
		s+= "("+this.faces[i+3]+", "+this.faces[i+4]+", "+this.faces[i+5]+")  ";
		s+= "("+this.faces[i+6]+", "+this.faces[i+7]+", "+this.faces[i+8]+")";
	}

	s+="\n]\n\nVertex List:\n["

	for(i = 0; i < this.vertex.length; i+=3)
	{
		s+= "\n   ("+this.vertex[i]+", "+this.vertex[i+1]+", "+this.vertex[i+2]+")";
	}

	s+="\n]\n\nTexture Coords List:\n["

	for(i = 0; i < this.uvs.length; i+=2)
	{
		s+= "\n   ("+this.uvs[i]+", "+this.uvs[i+1]+")";
	}

	s+="\n]\n\nNormal List:\n[";

	for(i = 0; i < this.normals.length; i+=3)
	{
		s+= "\n   ("+this.normals[i]+", "+this.normals[i+1]+", "+this.normals[i+2]+")";
	}
	
	s+="\n]\n\nMaterial List:\n[";

	for(i = 0; i < this.material.length; i++)
	{
		s+= "\n   ("+this.material.toString()+")";
	}

	s+="\n]\n\nFace Material List:\n[";

	for(i = 0; i < this.faceMaterial.length; i+=3)
	{
		s+= "\n   ("+this.faceMaterial[i]+", "+this.faceMaterial[i+1]+", "+this.faceMaterial[i+2]+")";
	}
	s+="\n]";
	return s;
}

//Test Function that creates a cube with texture and retuns it
Model.cube = function()
{
	var model = new Model();

	model.texture = Texture.generateSolidColorTexture(Color.GREEN);

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
}

//Test Function that creates a cube with texture and retuns it
Model.plane = function()
{
	var model = new Model();

	model.texture = Texture.generateSolidColorTexture(Color.GREEN);

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
}
