"use strict";

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