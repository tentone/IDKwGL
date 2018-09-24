"use strict";

function Material()
{
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Material";

	this.shader = null;

	this.useLights = false;
	this.ambientLights = 0;
	this.pointLights = 0;
	this.directionalLights = 0;
}

Material.prototype.constructor = Material;

Material.prototype.createShader = function(gl){};

Material.prototype.render = function(renderer, camera, object){};