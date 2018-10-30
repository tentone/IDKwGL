"use strict";

/**
 * Ambient light does not have a position it is the base ilumination layer of the scene.
 */
function AmbientLight(color)
{
	this.type = "AmbientLight";
	
	this.color = color !== undefined ? color : new Color(0.3, 0.3, 0.3);
}

AmbientLight.prototype.constructor = AmbientLight;

AmbientLight.prototype.isAmbientLight = true;

AmbientLight.prototype.toArray = function()
{
	return [color.r, color.g, color.b];
};