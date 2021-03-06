"use strict";

/**
 * Shader class is responsible for creating and managing the state of GLSL shaders in a specific WebGL context.
 */
function Shader(gl, fragmentShader, vertexShader, extensions)
{
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Shader";

	this.fragmentShader = fragmentShader;
	this.vertexShader = vertexShader; 

	this.gl = gl;

	this.fragmentProgram = null;
	this.vertexProgram = null;
	this.program = null;

	this.extensions = extensions !== undefined ? extensions : [];
	this.uniforms = {};
	this.attributes = {};

	this.compile();
}

/**
 * Register and enable vertex attribute array.
 */
Shader.prototype.registerVertexAttributeArray = function(name)
{
	this.attributes[name] = this.gl.getAttribLocation(this.program, name);
	this.gl.enableVertexAttribArray(this.attributes[name]);
};

/**
 * Register attribute location.
 */
Shader.prototype.registerAttribute = function(name)
{
	this.attributes[name] = this.gl.getAttribLocation(this.program, name);
};

/**
 * Register uniform location.
 */
Shader.prototype.registerUniform = function(name)
{
	this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
};

/** 
 * Compiles fragment and vertex shader and links them into a program.
 */
Shader.prototype.compile = function()
{
	var gl = this.gl;

	try
	{
		for(var i = 0; i < this.extensions.length; i++)
		{
			var extension = gl.getExtension(this.extensions[i]);
			if(extension === null)
			{
				throw new Error("IDKwGL: Extension " + this.extensions[i] + " is not supported.");
			}
		}

		this.fragmentProgram = Shader.compileFragmentShader(gl, this.fragmentShader);
		this.vertexProgram = Shader.compileVertexShader(gl, this.vertexShader);
		this.program = gl.createProgram();

		gl.attachShader(this.program, this.vertexProgram);
		gl.attachShader(this.program, this.fragmentProgram);
		gl.linkProgram(this.program);
	}
	catch(error)
	{
		console.error("IDKwGL: Error compiling shader.", this, error);
	}

	if(!gl.getProgramParameter(this.program, gl.LINK_STATUS))
	{
		console.error("IDKwGL: Could not initialize shader.", gl.getProgramInfoLog(this.program));
	}
};

/**
 * Create vertex shader from string.
 */
Shader.compileVertexShader = function(gl, code)
{
	var shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, code);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		console.error("IDKwGL: Error in shader compilation.", gl.getShaderInfoLog(shader), code);
	}

	return shader;
};


/**
 * Create fragment shader from string.
 */
Shader.compileFragmentShader = function(gl, code)
{
	var shader = gl.createShader(gl.FRAGMENT_SHADER);;
	gl.shaderSource(shader, code);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		console.error("IDKwGL: Error in shader compilation.", gl.getShaderInfoLog(shader), code);
	}

	return shader;
};
