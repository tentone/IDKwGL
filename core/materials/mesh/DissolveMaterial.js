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

	/**
	 * Color to be used in the dissolve border.
	 */
 	this.dissolveColor = new Color(1.0, 0.5, 0.0);

	this.time = 0;
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
		gl.uniform1i(shader.uniforms["dissolveMap"], 2);
		gl.uniform1i(shader.uniforms["hasDissolveMap"], 1);
	}
	else
	{
		gl.uniform1i(shader.uniforms["hasDissolveMap"], 0);
	}

	this.time += 0.016;
	gl.uniform1f(shader.uniforms["time"], this.time);

	gl.uniform3f(shader.uniforms["dissolveColor"], this.dissolveColor.r, this.dissolveColor.g, this.dissolveColor.b);
};

DissolveMaterial.createShader = function(gl)
{	
	var shader = new Shader(gl, DissolveMaterial.fragmentShader, PhongMaterial.vertexShader, PhongMaterial.extensions);

	DissolveMaterial.registerUniforms(gl, shader);

	return shader;
};

DissolveMaterial.registerUniforms = function(gl, shader)
{
	PhongMaterial.registerUniforms(gl, shader);

	shader.registerUniform("hasDissolveMap");
	shader.registerUniform("dissolveMap");

	shader.registerUniform("time");
	shader.registerUniform("dissolveColor");
};

DissolveMaterial.fragmentHeader = PhongMaterial.fragmentHeader + "\
\
uniform bool hasDissolveMap;\
uniform sampler2D dissolveMap;\
\
uniform float time;\
uniform vec3 dissolveColor;";


DissolveMaterial.fragmentDissolve = "\
if(hasDissolveMap)\
{\
	float dissolveValue = texture2D(dissolveMap, vec2(fragmentUV.s, fragmentUV.t)).r;\
	float progress = (cos(time * 0.2) + 1.0) / 2.0;\
	\
	if(dissolveValue < progress)\
	{\
		gl_FragColor.xyz = dissolveColor.xyz;\
	}\
	\
	if(dissolveValue < progress * 0.95)\
	{\
		discard;\
	}\
}";

DissolveMaterial.fragmentShader = PhongMaterial.fragmentExtensions + DissolveMaterial.fragmentHeader + MeshMaterial.fragmentLightStructs + MeshMaterial.fragmentHeaderLights + PhongMaterial.fragmentLightFunctions + "\
\
void main(void)\
{\
	" + BasicMaterial.fragmentBaseColor + PhongMaterial.fragmentLightCalculation + DissolveMaterial.fragmentDissolve + MeshMaterial.alphaTest + "\
}"; 
