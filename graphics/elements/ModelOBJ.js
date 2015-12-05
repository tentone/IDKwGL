//Empty model constructor
function ModelObj()
{
	//Model Data
	this.size = 0; //Size amount of triangles

	this.vertex = []; //Vertex
	this.texture_coords = []; //Vertex Texture
	this.faces = []; //Face <vertex>/[texture]/<normal>

	//Old Not Used
	this.normals = []; //Vertex Normals
	this.colors = []; //Color Arrays

	//Buffers
	this.vertexPosBuffer = [];
	this.vertexIndexBuffer = [];
	this.vertexTextureBuffer = [];

	//Texture
	this.texture = new Texture("data/texture/crate.jpg").texture;

	//Tranformations Control
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Tranformation Matrix
	this.transformationMatrix = new Matrix(4,4);
	this.updateBuffers();
}

//Function Prototypes
ModelObj.prototype.draw = draw;
ModelObj.prototype.update = update;
ModelObj.prototype.updateBuffers = updateBuffers;
ModelObj.prototype.attachTexture = attachTexture;
ModelObj.prototype.loadOBJ = loadOBJ;
ModelObj.prototype.toString = toString;
ModelObj.prototype.computeVertexNormals = computeVertexNormals;

//Draw Model to camera
function draw(camera)
{	
    //Clone Camera Global transformation Matrix and multiply
    camTransformationMatrix = this.transformationMatrix.clone();
	camTransformationMatrix.mul(camera.transformationMatrix);

	// Passing the Model View Matrix to apply the current transformation
	gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram.get(), "uMVMatrix"), false, camTransformationMatrix.flatten());

    //Passing the buffers
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
    gl.vertexAttribPointer(shaderProgram.get().vertexPositionAttribute, this.vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Textures
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureBuffer);
    gl.vertexAttribPointer(shaderProgram.get().textureCoordAttribute, this.vertexTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
   
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.get().samplerUniform, 0);
    
    //The vertex indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

	//Drawing the triangles
	gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//Recalculate Tranformation Matrix
function update()
{
	this.transformationMatrix = MatrixGenerator.translation(this.position.x, this.position.y, this.position.z);
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(this.scale.x, this.scale.y, this.scale.z));
}

//Attach texture image to this model
function attachTexture(texture)
{
	this.texture = texture.texture;
}

function updateBuffers()
{
	//Vertex
	this.vertexPosBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW);
	this.vertexPosBuffer.itemSize = 3;
	this.vertexPosBuffer.numItems = this.vertex.length/3;			

	//Texture
    this.vertexTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureBuffer);
 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coords), gl.STATIC_DRAW);
    this.vertexTextureBuffer.itemSize = 2;
    this.vertexTextureBuffer.numItems = this.texture_coords.length/2;			

	//Vertex indices
    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = this.faces.length;
}

//OBJ file read from string
function loadOBJ(data)
{
	var lines = data.split("\n");

	//Clear Data
	this.size = 0; //Size amount of triangles
	this.vertex = []; //Vertex
	this.normals = []; //Vertex Normals
	this.texture_coords = []; //Vertex Terure
	this.faces = []; //Face

	// Check every line and store 
	for(var i = 0; i < lines.length; i++)
	{
		// The tokens/values in each line Separation between tokens is 1 or mode whitespaces
	    var tokens = lines[i].split(/\s\s*/);

	    if(tokens[0] == "v") //Vertices
	    {
	    	this.vertex.push(parseFloat(tokens[1]));
	    	this.vertex.push(parseFloat(tokens[2]));
	    	this.vertex.push(parseFloat(tokens[3]));
	    	this.size += 3;
		}
	    else if(tokens[0] == "vn") //Normals
	    {
	    	this.normals.push(parseFloat(tokens[1]));
	    	this.normals.push(parseFloat(tokens[2]));
	    	this.normals.push(parseFloat(tokens[3]));
		}
		else if(tokens[0] == "vt") //Texture
		{
			this.texture_coords.push(parseFloat(tokens[1]));
	    	this.texture_coords.push(parseFloat(tokens[2]));
		}
		else if(tokens[0] == "f") //Faces <vertex>/[texture]/<normal>
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
			//4 vertex face Quad)
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
	}
	
	// Checking to see if the normals are defined on the file
	/*if(this.normals.length == 0)
	{
		this.computeVertexNormals();
	}*/
	
	// Reset Tranformations Control
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);
}

//Computing the triangle unit normal vector to vertex 
function computeVertexNormals()
{
	//Clearing the new normals array
	this.normals = [];
	
    //Taking 3 vertices from the coordinates array 
    for(i = 0; i < this.vertex.length; i += 9)
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

//Create string with model info
function toString()
{
	return "ModelObj(Size:"+this.size+" VertexCount:"+this.vertex.length+" NormalCount:"+this.normals.length+" TextureCount:"+this.textures.length+" Faces Count:"+this.faces.length+")"; 
}

//Test Function that creates a cube with texture and retuns it
ModelObj.test = function()
{
	var model = new ModelObj();
	model.texture = new Texture("data/texture/crate.jpg").texture;
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

	model.texture_coords =
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
		0.0, 1.0,
	];

	model.faces =
	[
		0, 1, 2,      0, 2, 3,    // Front face
		4, 5, 6,      4, 6, 7,    // Back face
		8, 9, 10,     8, 10, 11,  // Top face
		12, 13, 14,   12, 14, 15, // Bottom face
		16, 17, 18,   16, 18, 19, // Right face
		20, 21, 22,   20, 22, 23  // Left face
	];
	model.updateBuffers();
	return model;
}

