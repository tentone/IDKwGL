//Empty model constructor
function Model()
{
	//Model Data
	this.size = 0; //Size amount of triangles
	this.vertex = [];
	this.normals = [];
	this.colors = [];

	//Tranformations Control
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Tranformation Matrix
	this.transformationMatrix = new Matrix(4,4);
}

//Function Prototypes
Model.prototype.loadOBJ = loadOBJ;
Model.prototype.draw = draw;
Model.prototype.toString = toString;

//Draw Model to camera
function draw(camera)
{	
	//Recalculate Tranformation Matrix (Can be done inside of set events of control variables)
	this.transformationMatrix = MatrixGenerator.translation(this.position.x, this.position.y, this.position.z);
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(this.scale.x, this.scale.y, this.scale.z));
	
    //Clone Camera Global transformation Matrix and multiply
    camTransformationMatrix = this.transformationMatrix.clone();
	camTransformationMatrix.mul(camera.transformationMatrix);

	// Passing the Model View Matrix to apply the current transformation
	gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMVMatrix"), false, camTransformationMatrix.flatten());

	// Vertex
	var triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW);
	
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = this.vertex.length / 3;			

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	// Colors
	var triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = this.colors.length / 3;			

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Draw Model into screen
	gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems); 	
}

// OBJ file read (from data_string), file load has to be handled somewhere else (From classes)
function loadOBJ(data_string)
{
	var lines = data_string.split("\n");

	//Clear Data
	this.vertex = [];
	this.normals = [];
	this.colors = [];
	this.size = 0;

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

	    	//TODO <READ COLOR FROM OBJ FILE>
	    	this.colors.push(Math.random());
	    	this.colors.push(Math.random());
	    	this.colors.push(Math.random());
	    	this.size += 3;
		}
	    else if(tokens[0] == "vn") //Normals
	    {
	    	this.normals.push(parseFloat(tokens[1]));
	    	this.normals.push(parseFloat(tokens[2]));
	    	this.normals.push(parseFloat(tokens[3]));
		}
	}
	
	// Checking to see if the normals are defined on the file
	if(this.normals.length == 0)
	{
		computeVertexNormals(this.vertex, this.normals);
	}
	
	// Reset Tranformations Control
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);
}

function toString()
{
	return "Model (Size:"+this.size+" VertexCount:"+this.vertex.length+" NormalCount:"+this.normals.length+" ColorsCount:"+this.colors.length+")"; 
}

//-----------------------------TEST MODELS------------------------------------------------
//Test Model (Triangle)
/*this.size = 3;
this.vertex = [-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5];
this.normals = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0];
this.colors = [1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0];*/

//Teste Model (Cube)
/*this.size = 36;
this.normals = [];
this.vertex =
[
	// FRONT FACE
	-0.25, -0.25,  0.25,0.25, -0.25,  0.25,0.25,  0.25,  0.25, 0.25,  0.25,  0.25,-0.25,  0.25,  0.25, -0.25, -0.25,  0.25,
	// TOP FACE
	-0.25,  0.25,  0.25, 0.25,  0.25,  0.25,0.25,  0.25, -0.25,0.25,  0.25, -0.25,-0.25,  0.25, -0.25,-0.25,  0.25,  0.25,
	// BOTTOM FACE
	 -0.25, -0.25, -0.25, 0.25, -0.25, -0.25, 0.25, -0.25,  0.25, 0.25, -0.25,  0.25,-0.25, -0.25,  0.25,-0.25, -0.25, -0.25,
	// LEFT FACE 
	-0.25,  0.25,  0.25,-0.25, -0.25, -0.25,-0.25, -0.25,  0.25,-0.25,  0.25,  0.25,-0.25,  0.25, -0.25,-0.25, -0.25, -0.25,
	// RIGHT FACE 
	 0.25,  0.25, -0.25, 0.25, -0.25,  0.25, 0.25, -0.25, -0.25, 0.25,  0.25, -0.25, 0.25,  0.25,  0.25, 0.25, -0.25,  0.25,
	// BACK FACE 
	-0.25,  0.25, -0.25, 0.25, -0.25, -0.25,-0.25, -0.25, -0.25,-0.25,  0.25, -0.25, 0.25,  0.25, -0.25, 0.25, -0.25, -0.25			 
];

this.colors =
[
	 // FRONT FACE
	 1.00,  0.00,  0.00, 1.00,  0.00,  0.00, 1.00,  0.00,  0.00, 1.00,  1.00,  0.00, 1.00,  1.00,  0.00, 1.00,  1.00,  0.00,			 
	 // TOP FACE
	 0.00,  0.00,  0.00, 0.00,  0.00,  0.00, 0.00,  0.00,  0.00, 0.50,  0.50,  0.50, 0.50,  0.50,  0.50, 0.50,  0.50,  0.50,		 
	 // BOTTOM FACE
	 0.00,  1.00,  0.00, 0.00,  1.00,  0.00,0.00,  1.00,  0.00, 0.00,  1.00,  1.00, 0.00,  1.00,  1.00, 0.00,  1.00,  1.00,			 
	 // LEFT FACE
	 0.00,  0.00,  1.00, 0.00,  0.00,  1.00, 0.00,  0.00,  1.00,1.00,  0.00,  1.00, 1.00,  0.00,  1.00, 1.00,  0.00,  1.00,			 
	 // RIGHT FACE
	 0.25,  0.50,  0.50, 0.25,  0.50,  0.50, 0.25,  0.50,  0.50, 0.50,  0.25,  0.00, 0.50,  0.25,  0.00, 0.50,  0.25,  0.00,		 
	 // BACK FACE
	 0.25,  0.00,  0.75, 0.25,  0.00,  0.75, 0.25,  0.00,  0.75, 0.50,  0.35,  0.35, 0.50,  0.35,  0.35, 0.50,  0.35,  0.35		 			 
];*/

//-----------------------------TODO <CLASS CODE / CHECK THIS>---------------------------------
// Loading 3D Model from Text file (As used in classes)
// Adapted from: http://stackoverflow.com/questions/23331546/how-to-use-javascript-to-read-local-text-file-and-read-line-by-line
/*document.getElementById("text-file").onchange = function()
{
	var file = this.files[0];
	var reader = new FileReader();
	
	reader.onload = function( progressEvent )
	{ 
		// Entire file read as a string, the tokens/values in the file separation between values is 1 or more whitespaces
		var tokens = this.result.split(/\s\s* /);

		// Array of values; each value is a string
		var numVertices = parseInt( tokens[0] );
		
		// For every vertex we have 3 floating point values
		var i, j;
		var aux = 1;
		var newVertices = [];
		
		for( i = 0; i < numVertices; i++ )
		{
			for( j = 0; j < 3; j++ )
			{
				newVertices[ 3 * i + j ] = parseFloat( tokens[ aux++ ] );
			}
		}
				
		// Assigning to the current model
		vertex = newVertices.slice();
		
		// Computing the triangle normal vector for every vertex
		computeVertexNormals( vertex, normals );
		
		// To render the model just read
		initBuffers();

		// RESET the transformations - NEED AUXILIARY FUNCTION !!
		t.x = t.y = t.z = 0.0;			
		angle.x = angle.y = angle.z = 0.0;
		s.x = s.y = s.z = 0.5;
	};
	
	// Entire file read as a string
	reader.readAsText( file );		
}*/