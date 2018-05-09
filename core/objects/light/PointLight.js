"use strict";

function PointLight(color)
{
	this.type = "PointLight";

	this.color = color !== undefined ? color : new Color(0.3, 0.3, 0.3);
	this.position = new Vector3(0.0, 0.0, 0.0);
}

PointLight.prototype.constructor = PointLight;

PointLight.prototype.toArray = function()
{
	return [0, color.r, color.g, color.b, position.x, position.y, position.z];
};