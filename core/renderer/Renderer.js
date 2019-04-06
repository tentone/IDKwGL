"use strict";

/**
 * The renderer is responsible for managing the whole WebGL context.
 *
 * It starts the rendering process and manages GL buffers and shaders.
 */
function Renderer(canvas)
{
	if(canvas === undefined)
	{
		canvas = document.createElement("canvas");
		canvas.style.position = "absolute";
		canvas.style.top = "0px";
		canvas.style.left = "0px";
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
		document.body.appendChild(canvas);
	}

	this.gl = null;
	
	//Rendering canvas
	this.canvas = canvas;
	this.size = new Vector2(1, 1);
	this.aspect = 1;

	//Screen clear
	this.autoClear = true;
	this.clearColor = new Color(0, 0, 0);

	//Runtime
	this.shaders = {};
	this.buffers = {};
	this.textures = {};

	this.initializeGLContext();
}

/**
 * Initializes WebGL context using the canvas attached to the Renderer.
 */
Renderer.prototype.initializeGLContext = function()
{
	try
	{
		this.gl = this.canvas.getContext("webgl", {alpha: false});
		this.gl.getExtension("OES_standard_derivatives");

		this.resize(this.canvas.width, this.canvas.height);
	}
	catch(error)
	{
		this.gl = null;
		console.error("IDKwGL: Failed to create WebGL context.", error);		
	}
};

/**
 * Set render viewport.
 */
Renderer.prototype.setViewport = function(x, y, width, height)
{
	this.gl.viewport(x, y, width, height);
};

/**
 * Resize renderer.
 */
Renderer.prototype.resize = function(width, height)
{
	this.size.set(width, height);
	this.aspect = width / height;
	this.setViewport(0, 0, width, height);
};

/**
 * Clean the rendering buffers manually.
 * 
 * Usefull for rendering from multiple cameras w/ autoClear set false.
 */
Renderer.prototype.clear = function(color, depth, stencil)
{
	var clear = 0;

	if(color === true)
	{
		gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, 1.0);
		clear |= gl.COLOR_BUFFER_BIT;
	}
	if(depth === true)
	{
		clear |= gl.DEPTH_BUFFER_BIT;
	}
	if(stencil === true)
	{
		clear |= gl.STENCIL_BUFFER_BIT;
	}

	gl.clear(clear);
};

/**
 * Render a scene using a camera.
 */
Renderer.prototype.render = function(scene, camera)
{
	var gl = this.gl;

	if(this.autoClear)
	{
		gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
	}

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);

	for(var i = 0; i < scene.objects.length; i++)
	{
		scene.objects[i].render(this, camera, scene);
	}

	gl.disable(gl.DEPTH_TEST);
};

/**
 * Get GL texture from texture resource.
 */
Renderer.prototype.getTexture = function(texture)
{
	var glTexture = this.textures[texture.id];
	if(glTexture === undefined)
	{
		glTexture = texture.createTexture(this.gl);
		this.textures[texture.id] = glTexture;
	}
	return glTexture;
};

/**
 * Get GL buffers from object or geometry resource.
 */
Renderer.prototype.getBuffers = function(object)
{
	var buffers = this.buffers[object.id];
	if(buffers === undefined)
	{
		buffers = object.createBuffers(this.gl);
		this.buffers[object.id] = buffers;
	}
	return buffers;
};

/**
 * Get shader object from material or object.
 */
Renderer.prototype.getShader = function(object)
{
	var shader = this.shaders[object.id];
	if(shader === undefined)
	{
		shader = object.createShader(this.gl);
		this.shaders[object.id] = shader;
	}
	return shader;
};
