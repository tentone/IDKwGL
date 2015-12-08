//Empty model constructor
function Model()
{
	//Model Data
	this.vertex = []; //Vertex
	this.texture_coords = []; //Vertex Texture
	this.normals = []; //Vertex Normals
	this.faces = []; //Face <vertex>/<texture>/<normal>

	//Materials
	this.materials = [];

	//Buffers
	this.normalBuffer = null;
	this.vertexBuffer = null;
	this.textureCoordBuffer = null;
	this.facesBuffer = null;

	//Texture
	this.texture = Texture.generateSolidColorTexture(Color.RED);
	this.texture_alt = Texture.generateSolidColorTexture(Color.GREEN);

	//Tranformations Control
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Update model buffers
	this.updateBuffers();

	//Tranformation Matrix
	this.transformationMatrix = new Matrix(4,4);
}

//Function Prototypes
Model.prototype.draw = draw;
Model.prototype.update = update;
Model.prototype.clone = clone;
Model.prototype.updateBuffers = updateBuffers;
Model.prototype.setTexture = setTexture;
Model.prototype.loadOBJ = loadOBJ;
Model.prototype.loadMTL = loadMTL;
Model.prototype.toString = toString;
Model.prototype.computeVertexNormals = computeVertexNormals;
Model.prototype.transformOBJData = transformOBJData;
Model.prototype.getBox = getBox;

//Draw Model to camera
function draw(camera)
{	
    //Clone Camera Global transformation Matrix and multiply
    var camTransformationMatrix = this.transformationMatrix.clone();
	camTransformationMatrix.mul(camera.transformationMatrix);

	//Normal matrix
	var normalMatrix = MathUtils.matrix3Invert(camTransformationMatrix);

	// Passing the Model View Matrix to apply the current transformation
	gl.uniformMatrix4fv(gl.getUniformLocation(camera.shader, "uMVMatrix"), false, camTransformationMatrix.flatten());
	gl.uniformMatrix3fv(gl.getUniformLocation(camera.shader, "uNMatrix"), false, normalMatrix.flatten());

	//Lights
    gl.uniform1i(camera.shader.useLightingUniform, true);
    gl.uniform3f(camera.shader.ambientColorUniform,0.4,0.4,0.4);
	gl.uniform3f(camera.shader.pointLightingLocationUniform,0.0,0.0,0.0);
    gl.uniform3f(camera.shader.pointLightingColorUniform,0.6,0.6,0.6);

    //Passing the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(camera.shader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Texture Coords
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.vertexAttribPointer(camera.shader.textureCoordAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    //Normal Coords
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.vertexAttribPointer(camera.shader.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Set texture to model
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(camera.shader.samplerUniform, 0);

    //The vertex indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
	
	//Drawing the triangles
	gl.drawElements(gl.TRIANGLES, this.facesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//Recalculate Tranformation Matrix (Should be called after changing position)
function update()
{
	this.transformationMatrix = MatrixGenerator.translation(this.position.x, this.position.y, this.position.z);
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(this.scale.x, this.scale.y, this.scale.z));
}

//Recreate data buffers (Should be called after structural changes)
function updateBuffers()
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
 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coords), gl.STATIC_DRAW);
    this.textureCoordBuffer.itemSize = 2;
    this.textureCoordBuffer.numItems = this.texture_coords.length/2;

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

//Creates a copy of this model (keeps same vertex, buffer and texture data)
function clone()
{
	var model = new Model();

	model.vertex = this.vertex;
	model.texture_coords = this.texture_coords;
	model.normals = this.normals;
	model.faces = this.faces;
	model.materials = this.materials;

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

//Attach texture image to this model
function setTexture(texture)
{
	this.texture = texture;
}

//OBJ file read from string
function loadOBJ(data)
{
	var lines = data.split("\n");

	//Clear Data
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
		else if(tokens[0] == "f") //Faces <vertex>/<texture>/<normal>
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
	}
	
	//If no coord found complete with "random" data
	if(this.texture_coords.length == 0)
	{
		//Full texture to all triangles
		this.texture_coords.push(0.0);
		this.texture_coords.push(0.0);

		this.texture_coords.push(1.0);
		this.texture_coords.push(1.0);

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
function transformOBJData()
{
	//Create temporary arrays to store all model data
	vertex = [];
	texture = [];
	normals = [];
	faces = [];
	
	//Transform Data
	for(var i = 0; i < this.faces.length; i += 3)
	{
		faces.push(i/3);

		vertex.push(this.vertex[(this.faces[i]-1)*3]);
		vertex.push(this.vertex[(this.faces[i]-1)*3+1]);
		vertex.push(this.vertex[(this.faces[i]-1)*3+2]);

		texture.push(this.texture_coords[(this.faces[i+1]-1)*2]);
		texture.push(this.texture_coords[(this.faces[i+1]-1)*2+1]);

		normals.push(this.normals[(this.faces[i+2]-1)*3]);
		normals.push(this.normals[(this.faces[i+2]-1)*3+1]);
		normals.push(this.normals[(this.faces[i+2]-1)*3+2]);
	}

	//Copy array pointer into main data and update bufffers
	this.faces = faces;
	this.vertex = vertex;
	this.texture_coords = texture;
	this.normals = normals;

	//Update Buffers
	this.updateBuffers();
}

//Read MTL data from String
function loadMTL(data)
{
	var lines = data.split("\n");

	//MTL File Spec
	/*define a material named 'Colored'
    newmtl Colored
    The ambient color of the material is declared using Ka.
    Ka 1.000 1.000 1.000     # white
    Similarly, the diffuse color is declared using Kd.
    Kd 1.000 1.000 1.000     # white
    The specular color is declared using Ks, and weighted using the specular exponent Ns.
    Ks 0.000 0.000 0.000     # black (off)
   		Ns 10.000                # ranges between 0 and 1000
   	Materials can be transparent.
   	d 0.9                    # some implementations use 'd'
    Tr 0.1                   # others use 'Tr' (inverted)*/

    //Read Data Lines
	for(var i = 0; i < lines.length; i++)
	{
	    var tokens = lines[i].split(/\s\s*/);

	    if(tokens[0] == "newmtl") //New Material
	    {
			//tokens[1] //Material name
	    }
	}
}

//Create string with model info
function toString()
{
	var s =  "Model(VertexCount:"+this.vertex.length+" NormalCount:"+this.normals.length+
		" TextureCount:"+this.texture_coords.length+" Faces Count:"+this.faces.length+")\n\nFaceList:\n[";
	
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

	for(i = 0; i < this.texture_coords.length; i+=2)
	{
		s+= "\n   ("+this.texture_coords[i]+", "+this.texture_coords[i+1]+")";
	}

	s+="\n]\n\nNormal List:\n[";

	for(i = 0; i < this.normals.length; i+=3)
	{
		s+= "\n   ("+this.normals[i]+", "+this.normals[i+1]+", "+this.normals[i+2]+")";
	}

	s+="\n]";
	return s;
}

//Computing the triangle unit normal vector to vertex 
function computeVertexNormals()
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

//Create Box (geometry) from vertex data
function getBox()
{
	var min = new Vector3(this.vertex[0], this.vertex[1], this.vertex[2]);
	var max = new Vector3(this.vertex[0], this.vertex[1], this.vertex[2]);
	var buf = new Vector3(0,0,0);

	for(var i = 3; i < this.vertex.length; i += 3)
	{
		buf.set(this.vertex[i], this.vertex[i+1], this.vertex[i+2]);

		if(buf.x < min.x)
			min.x = buf.x;
		else if(buf.x > max.x)
			max.x = buf.x;
	
		if(buf.y < min.y)
			min.y = buf.y;
		else if(buf.y > max.y)
			max.y = buf.y;
		
		if(buf.z < min.z)
			min.z = buf.z;
		else if(buf.z > max.z)
			max.z = buf.z; 
	}

	//Set min and max to scale
	min.mul(this.scale);
	max.mul(this.scale);

	//Create box
	var box = new Box();

	//Calculate Box Size
	box.size.set(max.x, max.y, max.z);
	box.size.sub(min);

	//Set position
	box.position.set(this.position.x, this.position.y, this.position.z);
	
	//Ori zero
	box.ori.set(0,0,0);
	box.ori.sub(min);
	
	return box;
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
		-1.0,  0.0,  0.0,
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

	model.computeVertexNormals();
	model.updateBuffers();

	return model;
}

