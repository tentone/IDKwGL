"use strict";

/**
 * Shader class is responsible for creating and managing the state of GLSL shaders in a specific WebGL context.
 */
function Shader(gl, fragmentShader, vertexShader)
{
	this.id = MathUtils.randomInt();
	this.name = "";
	this.type = "Shader";

	this.fragmentShader = fragmentShader;
	this.vertexShader = vertexShader; 

	this.gl = gl;

	this.fragmentProgram = null;
	this.vertexProgram = null;
	this.program = null;

	this.compile();
}

/**
 * Enable vertex attribute array.
 */
Shader.prototype.enableVertexAttributeArray = function(name)
{
	this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, name));
};

/**
 * Set uniform value (automatic type detection).
 */
Shader.prototype.setUniformValue = function(name, value)
{
	if(typeof value === "number")
	{
		this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), value);
	}
	else if(value instanceof Matrix4)
	{
		this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), false, value.flatten());
	}
};


/** 
 * Compiles fragment and vertex shader and links them into a program.
 */
Shader.prototype.compile = function()
{
	var gl = this.gl;

	this.fragmentProgram = Shader.compileFragmentShader(gl, this.fragmentShader);
	this.vertexProgram = Shader.compileVertexShader(gl, this.vertexShader);
	this.program = gl.createProgram();

	gl.attachShader(this.program, this.vertexProgram);
	gl.attachShader(this.program, this.fragmentProgram);
	gl.linkProgram(this.program);

	if(!gl.getProgramParameter(this.program, gl.LINK_STATUS))
	{
		throw "Could not initialize shader";
	}
};

/**
 * Create vertex shader from string.
 */
Shader.compileVertexShader = function(gl, str)
{
	var shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		throw "Error in shader compilation ("+gl.getShaderInfoLog(shader)+")";
	}

	return shader;
};


/**
 * Create fragment shader from string.
 */
Shader.compileFragmentShader = function(gl, str)
{
	var shader = gl.createShader(gl.FRAGMENT_SHADER);;
	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		throw "Error in shader compilation ("+gl.getShaderInfoLog(shader)+")";
	}

	return shader;
};
