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
Scene.prototype.draw = function(camera)
{
	for(var i = 0; i < this.objects.length; i++)
	{
		this.objects[i].draw(camera, this);
	}
}
