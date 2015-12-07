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
		throw "Could not initialise shader";
	}
}

//Function Prototypes
Shader.prototype.get = get;

function get()
{
	return this.shaderProgram;
}

//Read shader and compile it
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

//Shader to render models using color (as used in classes)
Shader.colorRenderShader = function()
{
	var sp = new Shader(gl, "shader-vertex-color", "shader-fragment-color");

	//Vertex Coordinates 
	sp.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(sp.shaderProgram.vertexPositionAttribute);

	//Vertex Colors 
	sp.shaderProgram.vertexColorAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(sp.shaderProgram.vertexColorAttribute);

	return sp;
}

//Shader to render textured models
Shader.textureRenderShader = function()
{
	var sp = new Shader(gl, "shader-vertex-texture", "shader-fragment-texture");

	//Vertex Coordinates 
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


Shader.lightRenderShader = function()
{
	var sp = new Shader(gl, "shader-vertex-light", "shader-fragment-light");

	//Vertex Coordinates 
	sp.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(sp.shaderProgram.vertexPositionAttribute);

	//Texture coordinates
    sp.shaderProgram.textureCoordAttribute = gl.getAttribLocation(sp.shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(sp.shaderProgram.textureCoordAttribute);

    //Normals
	sp.shaderProgram.vertexNormalAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(sp.shaderProgram.vertexNormalAttribute);

	//The matrices
    sp.shaderProgram.pMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uPMatrix");
    sp.shaderProgram.mvMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uMVMatrix");
    sp.shaderProgram.nMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uNMatrix");

    sp.shaderProgram.useLightingUniform = gl.getUniformLocation(sp.shaderProgram, "uUseLighting");
    sp.shaderProgram.ambientColorUniform = gl.getUniformLocation(sp.shaderProgram, "uAmbientColor");
    sp.shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(sp.shaderProgram, "uPointLightingLocation");
    sp.shaderProgram.pointLightingColorUniform = gl.getUniformLocation(sp.shaderProgram, "uPointLightingColor");
    
    //The sampler
    sp.shaderProgram.samplerUniform = gl.getUniformLocation(sp.shaderProgram, "uSampler");

	return sp;
}