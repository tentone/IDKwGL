"use strict";

//Constructor creates empty scene
function Scene()
{
	this.objects = [];
}

//Add object to the scene
Scene.prototype.add = function(object)
{
	this.objects.push(object);
}

//Render all objects
Scene.prototype.draw = function(camera, clear)
{
	if(clear)
	{
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);

	for(var i = 0; i < this.objects.length; i++)
	{
		this.objects[i].draw(camera, this);
	}
}