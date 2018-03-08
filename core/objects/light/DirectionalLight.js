"use strict";

function DirectionalLight(color)
{
	this.type = "DirectionalLight";
	
	this.color = color !== undefined ? color : new Color(0.3, 0.3, 0.3);
	this.position = new Vector3(0.0, 0.0, 0.0);
}