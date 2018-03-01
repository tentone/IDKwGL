"use strict";

//The renderer is responsible for managing the whole WebGL context. It starts the rendering process and manages GL buffers and shaders.
function Renderer(canvas)
{
	this.canvas = canvas;
	this.gl = canvas.getContext("webgl");

	this.autoClear = true;
	this.clearColor = new Color(0, 0, 0);
}

Renderer.prototype.render = function(scene, camera)
{
	var gl = this.gl;

	//Clear canvas
	if(this.autoClear)
	{
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	//Enable depth test
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);
};

Renderer.prototype.initGL = function()
{
	try
	{
		this.gl = canvas.getContext("webgl", {alpha: false});
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}
	catch(e)
	{
		this.gl = null;
		console.error("Failed to create WebGL context (" + e + ")");		
	}
};