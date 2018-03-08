"use strict";

function AmbientLight(color)
{
	this.type = "AmbientLight";
	
	this.color = color !== undefined ? color : new Color(0.3, 0.3, 0.3);
}
