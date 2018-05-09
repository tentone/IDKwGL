"use strict";

function AmbientLight(color)
{
	this.type = "AmbientLight";
	
	this.color = color !== undefined ? color : new Color(0.3, 0.3, 0.3);
}

AmbientLight.prototype.constructor = AmbientLight;

AmbientLight.prototype.toArray = function()
{
	return [0, color.r, color.g, color.b];
};