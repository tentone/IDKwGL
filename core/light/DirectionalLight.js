"use strict";

//Ambient Light Constructor
function DirectionalLight()
{
	this.enabled = true;
	this.type = Light.DIRECTIONAL;

	//Light Caracteristics
	this.ambient = new Vector3(0.2, 0.2, 0.2);
	this.color = new Color(0.2, 0.5, 0.3);
}