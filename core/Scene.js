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

/**
 * Add object to the scene.
 */
Scene.prototype.add = function(object)
{
	this.objects.push(object);
};
