"use strict";

/**
 * Implements the phong shading model.
 *
 * Compatible with point, ambient and directional lights.
 */
function DissolveMaterial(name)
{
	PhongMaterial.call(this);

	this.name = name;
	this.type = "DissolveMaterial";

	/**
	 * Dissolve map is used to selectively dissolve the geometry.
	 *
	 * A sinosoidal function is used, fragments with value bellow the dissolve map intensity are discarded and a border is drawn.
	 */
	this.dissolveMap = null;
}

DissolveMaterial.prototype = Object.create(PhongMaterial.prototype);
DissolveMaterial.prototype.constructor = DissolveMaterial;
DissolveMaterial.id = MathUtils.generateID();

DissolveMaterial.prototype.updateUniforms = function(renderer, gl, shader, camera, object, scene)
{
	PhongMaterial.prototype.updateUniforms.call(this, renderer, gl, shader, camera, object, scene);

	if(this.dissolveMap !== null)
	{
		var normalMap = renderer.getTexture(this.dissolveMap);
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, normalMap);
		gl.uniform1i(shader.uniforms["dissolveMap"], 0);
		gl.uniform1i(shader.uniforms["hasDissolveMap"], 1);
	}
	else
	{
		gl.uniform1i(shader.uniforms["hasDissolveMap"], 0);
	}
};

DissolveMaterial.createShader = function(gl)
{	
	var shader = new Shader(gl, DissolveMaterial.fragmentShader, MeshMaterial.vertexShader);

	DissolveMaterial.registerUniforms(gl, shader);

	return shader;
};

DissolveMaterial.registerUniforms = function(gl, shader)
{
	PhongMaterial.registerUniforms(gl, shader);

	shader.registerUniform("hasDissolveMap");
	shader.registerUniform("dissolveMap");
};

DissolveMaterial.fragmentHeader = PhongMaterial.fragmentHeader + "\
\
uniform bool hasDissolveMap;\
uniform sampler2D dissolveMap;";

DissolveMaterial.fragmentShader = DissolveMaterial.fragmentHeader + MeshMaterial.fragmentLightStructs + MeshMaterial.fragmentHeaderLights + PhongMaterial.fragmentLightFunctions + "\
\
void main(void)\
{\
	" + BasicMaterial.fragmentBaseColor + PhongMaterial.fragmentLightCalculation + MeshMaterial.alphaTest + "\
}"; 
