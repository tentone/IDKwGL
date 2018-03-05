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
	this.shaders = [];
	this.buffers = [];
	this.textures = [];

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
		this.resize(this.canvas.width, this.canvas.height);
	}
	catch(e)
	{
		this.gl = null;
		console.error("Failed to create WebGL context (" + e + ")");		
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
 * Render a scene using a camera.
 */
Renderer.prototype.render = function(scene, camera)
{
	var gl = this.gl;

	if(this.autoClear)
	{
		gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, 1);
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
		glTexture = texture.createTexture(gl);
		this.textures[texture.id] = glTexture;
	}
	return glTexture;
};

/**
 * Get GL buffers from geometry resource.
 */
Renderer.prototype.getGeometryBuffers = function(geometry)
{
	var buffers = this.shaders[geometry.id];
	if(buffers === undefined)
	{
		buffers = geometry.createBuffers(gl);
		this.shaders[geometry.id] = buffers;
	}
	return buffers;
};

/**
 * Get shader object from material resource.
 */
Renderer.prototype.getMaterialShader = function(material)
{
	var shader = this.shaders[material.id];
	if(shader === undefined)
	{
		shader = material.createShader(gl);
		this.shaders[material.id] = shader;
	}
	return shader;
};