"use strict";

function Shader(fragmentShader, vertexShader)
{
	this.id = MathUtils.randomInt();
	this.name = "";
	this.type = "Shader";

	this.fragmentShader = fragmentShader;
	this.vertexShader = vertexShader; 

	this.fragmentProgram = null;
	this.vertexProgram = null;
	this.program = null;

	this.compile(gl);
}

//Compiles fragment and vertex shader and links them into a program
Shader.prototype.compile = function(gl)
{
	this.fragmentProgram = Shader.compileFragmentShader(gl, this.fragmentShader);
	this.vertexProgram = Shader.compileVertexShader(gl, this.vertexShader);
	this.program = gl.createProgram();

	gl.attachShader(this.program, this.vertexProgram);
	gl.attachShader(this.program, this.fragmentProgram);
	gl.linkProgram(this.program);

	if(!gl.getProgramParameter(this.program, gl.LINK_STATUS))
	{
		throw "Could not initialise shader";
	}
};

//Create vertex shader from string
Shader.compileVertexShader = function(gl, str)
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
};


//Create fragment shader from string
Shader.compileFragmentShader = function(gl, str)
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
};
