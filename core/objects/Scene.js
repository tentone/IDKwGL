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
	
	this.pointLights = [];
	this.ambientLights = [];
	this.directionalLights = [];
}

Scene.prototype.constructor = Scene;

/**
 * Add object or lights to the scene.
 */
Scene.prototype.add = function(object)
{
	if(object.isObject3D)
	{
		this.objects.push(object);
	}
	else if(object.isPointLight)
	{
		this.pointLights.push(object);
	}
	else if(object.isDirectionalLight)
	{
		this.directionalLights.push(object);
	}
	else if(object.isAmbientLight)
	{
		this.ambientLights.push(object);
	}
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