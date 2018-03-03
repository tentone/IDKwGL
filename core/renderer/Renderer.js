"use strict";

/**
 * The renderer is responsible for managing the whole WebGL context.
 *
 * It starts the rendering process and manages GL buffers and shaders.
 */
function Renderer(canvas)
{
	this.canvas = canvas;
	this.gl = null;
	
	this.size = new Vector2(1, 1);
	this.aspect = 1;

	this.autoClear = true;
	this.clearColor = new Color(0, 0, 0);
	
	this.initializeGLContext();
}

/**
 * Initializes WebGL context using the canvas attaached to the Renderer.
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

	//Clear canvas
	if(this.autoClear)
	{
		gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	//Enable depth test
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);

	//Render scene objects
	for(var i = 0; i < scene.objects.length; i++)
	{	
		scene.objects[i].draw(camera, scene);
	}
};	