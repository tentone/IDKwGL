function Shader(gl, fragment, vertex)
{
	//Initialize Shader
	this.fragmentShader = Shader.createFragmentShader(gl, fragment);
	this.vertexShader = Shader.createVertexShader(gl, vertex);
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

//Get shader program pointer
function get()
{
	return this.shaderProgram;
}

//Create vertex shader from string
Shader.createVertexShader = function(gl, str)
{
	//Create Shader object
	var shader = gl.createShader(gl.VERTEX_SHADER);

	//Compile Shader
	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		throw "Error in shader compilation ("+gl.getShaderInfoLog(shader)+")";
	}

	return shader;
}


//Create fragment shader from string
Shader.createFragmentShader = function(gl, str)
{
	//Create Shader object
	var shader = gl.createShader(gl.FRAGMENT_SHADER);;

	//Compile Shader
	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		throw "Error in shader compilation ("+gl.getShaderInfoLog(shader)+")";
	}

	return shader;
}

//Defaul shader with no surface shading
Shader.defaultShader = function()
{
	var sp = new Shader(gl, App.readFile("data/shaders/default-fragment.glsl"), App.readFile("data/shaders/default-vertex.glsl"));

	//Vertex Coordinates 
	sp.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(sp.shaderProgram.vertexPositionAttribute);

	//Texture coordinates
	sp.shaderProgram.textureCoordAttribute = gl.getAttribLocation(sp.shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(sp.shaderProgram.textureCoordAttribute);

	//Normals
	sp.shaderProgram.vertexNormalAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(sp.shaderProgram.vertexNormalAttribute);

	//The sampler
	sp.shaderProgram.samplerUniform = gl.getUniformLocation(sp.shaderProgram, "uSampler");
	sp.shaderProgram.pMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uPMatrix");
	sp.shaderProgram.mvMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uMVMatrix");
	sp.shaderProgram.nMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uNMatrix");
	
	return sp;
}

//Per pixel phong shading
Shader.lightPixelRenderShader = function()
{
	var sp = new Shader(gl, App.readFile("data/shaders/light-fragment.glsl"), App.readFile("data/shaders/light-vertex.glsl"));

	//Vertex Coordinates 
	sp.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(sp.shaderProgram.vertexPositionAttribute);

	//Texture coordinates
	sp.shaderProgram.textureCoordAttribute = gl.getAttribLocation(sp.shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(sp.shaderProgram.textureCoordAttribute);

	//Normals
	sp.shaderProgram.vertexNormalAttribute = gl.getAttribLocation(sp.shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(sp.shaderProgram.vertexNormalAttribute);

	//The sampler
	sp.shaderProgram.samplerUniform = gl.getUniformLocation(sp.shaderProgram, "uSampler");

	//The matrices
	sp.shaderProgram.pMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uPMatrix");
	sp.shaderProgram.mvMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uMVMatrix");
	sp.shaderProgram.nMatrixUniform = gl.getUniformLocation(sp.shaderProgram, "uNMatrix");

	//Light atributes
	sp.shaderProgram.useLightingUniform = gl.getUniformLocation(sp.shaderProgram, "uUseLighting");
	sp.shaderProgram.ambientColorUniform = gl.getUniformLocation(sp.shaderProgram, "uAmbientColor");
	sp.shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(sp.shaderProgram, "uPointLightingLocation");
	sp.shaderProgram.pointLightingColorUniform = gl.getUniformLocation(sp.shaderProgram, "uPointLightingColor");
	
	return sp;
}
