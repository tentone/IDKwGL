function Shader(gl, fragment, vertex)
{
	//Initialize Shader
	this.fragmentShader = Shader.getShader(gl, fragment);
	this.vertexShader = Shader.getShader(gl, vertex);
	this.shaderProgram = gl.createProgram();
	
	gl.attachShader(this.shaderProgram, this.vertexShader);
	gl.attachShader(this.shaderProgram, this.fragmentShader);
	gl.linkProgram(this.shaderProgram);

	if(!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS))
	{
		throw "Could not initialise shaders";
	}

	//Set Shader to GL
	gl.useProgram(this.shaderProgram);
}

//Function Prototypes
Shader.prototype.get = get;

function get()
{
	return this.shaderProgram;
}

//Read shader and compile
Shader.getShader = function(gl, id)
{
	//Read shader text
	var shaderScript = document.getElementById(id);
	if (!shaderScript)
	{
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while(k)
	{
		if (k.nodeType == 3)
		{
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	//Create Shader object
	var shader;
	if(shaderScript.type == "x-shader/x-fragment")
	{
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}
	else if(shaderScript.type == "x-shader/x-vertex")
	{
		shader = gl.createShader(gl.VERTEX_SHADER);
	}
	else
	{
		throw "Invalid shader";
	}

	//Compile Shader
	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		throw "Error in shader compilation ("+gl.getShaderInfoLog(shader)+")";
	}

	return shader;
}


Shader.colorRenderShader = function()
{
	var sp = new Shader(gl, "shader-vertex-color", "shader-fragment-color");

	// Coordinates 
	sp.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(sp.shaderProgram.vertexPositionAttribute);

	// Colors 
	sp.shaderProgram.vertexColorAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(sp.shaderProgram.vertexColorAttribute);

	return sp;
}

Shader.textureRenderShader = function()
{
	var sp = new Shader(gl, "shader-vertex-texture", "shader-fragment-texture");

	// Coordinates 
	sp.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(sp.shaderProgram.vertexPositionAttribute);

	//Texture coordinates
    sp.shaderProgram.textureCoordAttribute = gl.getAttribLocation(sp.shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(sp.shaderProgram.textureCoordAttribute);

	//The matrices
    sp.shaderProgram.pMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uPMatrix");
    sp.shaderProgram.mvMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uMVMatrix");
    
    //The sampler
    sp.shaderProgram.samplerUniform = gl.getUniformLocation(sp.shaderProgram, "uSampler");

	return sp;
}
