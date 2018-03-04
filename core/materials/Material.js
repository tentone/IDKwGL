"use strict";

function Material()
{
	this.id = MathUtils.randomInt();
	this.name = "";
	this.type = "Material";

	this.shader = null;
}

Material.prototype.createShader = function(gl)
{
	//TODO <ADD CODE HERE>
};

Material.render = function(gl, shdader, renderer, camera, object)
{
	//TODO <ADD CODE HERE>
};