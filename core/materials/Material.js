"use strict";

function Material()
{
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Material";

	this.shader = null;
}

Material.prototype.constructor = Material;

Material.prototype.createShader = function(gl){};

Material.prototype.render = function(renderer, camera, object){};