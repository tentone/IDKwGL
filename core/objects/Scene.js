"use strict";

/**
 * Used to represent a scene.
 * 
 * A scene is composed of objects (of various types) and light sources.
 * 
 * Scenes can be renderer using the Renderer object.
 */
function Scene()
{
	this.objects = [];
	this.lights = [];
}

Scene.prototype.constructor = Scene;

/**
 * Add light to the scene.
 */
Scene.prototype.addLight = function(light)
{
	this.lights.push(light);
};

/**
 * Add object to the scene.
 */
Scene.prototype.add = function(object)
{
	this.objects.push(object);
};

/**
 * Remove object from the scene.
 */
Scene.prototype.remove = function(object)
{
	var index = this.objects.indexOf(object)

	if(index > -1)
	{
		this.objects.splice(index, 1);
		return true;
	}

	return false;
};