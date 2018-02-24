"use strict";

//Material Constructor
function PhongMaterial(name)
{
	Material.call(this);

	this.name = name;
	
	this.texture = null; //Texture
	this.bumpMap = null; //Bump Map
	this.specularMap = null; //Specular map

	this.ka = new Color(1,1,1); //Ambient Value
	this.kd = new Color(1,1,1); //Diffuse Value
	this.ks = new Color(1,1,1); //Specular Value
	this.ns = 1; //Specular Intensity (Phong constant) range [1, 1000]
	
	this.alpha = 1; //Alpha Value
}
