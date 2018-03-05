"use strict";

function Material()
{
	this.id = MathUtils.randomInt();
	this.name = "";
	this.type = "Material";

	this.shader = null;
}

Material.prototype.createShader = function(gl){};

Material.prototype.render = function(renderer, camera, object){};