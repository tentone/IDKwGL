"use strict";

function PointLight()
{
	this.type = Light.POINT;

	this.color = new Color(0.0, 0.0, 0.0);
	this.position = new Vector3(0.0, 0.0, 0.0);
}

PointLight.prototype.toString = function()
{
	return "Point Light\nEnabled:"+this.enabled+"\nPosition:"+this.position.toString()+"\nColor:"+this.color.toString();
}
