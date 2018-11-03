"use strict";

function BasicMaterial(name)
{
	MeshMaterial.call(this);

	/**
	 * Color texture map.
	 */
	this.texture = null;

	/**
	 * Base color.
	 *
	 * TODO
	 */
	this.color = new Color(1.0, 1.0, 1.0);
}

BasicMaterial.prototype = Object.create(MeshMaterial.prototype);
BasicMaterial.prototype.constructor = BasicMaterial;
BasicMaterial.id = MathUtils.generateID();

BasicMaterial.createShader = function(gl)
{
	var fragmentShader = MeshMaterial.fragmentHeader + "\
	void main(void)\
	{\
		gl_FragColor = texture2D(texture, vec2(fragmentUV.s, fragmentUV.t));" + MeshMaterial.alphaTest +"\
	}";

	var shader = new Shader(gl, fragmentShader, MeshMaterial.vertexShader);

	BasicMaterial.registerUniforms(gl, shader);

	return shader;
};

BasicMaterial.registerUniforms = function(gl, shader)
{
	MeshMaterial.registerUniforms(gl, shader);

	//Texture
	shader.registerUniform("texture");
};