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
	 * Is mixed up with the texture map when available
	 */
	this.color = new Color(1.0, 1.0, 1.0);

	/**
	 * Emissive color
	 *
	 * Added to the base color as if the surface is self lighted.
	 */
	this.emissive = new Color(0.0, 0.0, 0.0);
}

BasicMaterial.prototype = Object.create(MeshMaterial.prototype);
BasicMaterial.prototype.constructor = BasicMaterial;
BasicMaterial.id = MathUtils.generateID();

BasicMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, BasicMaterial.fragmentShader, MeshMaterial.vertexShader);

	BasicMaterial.registerUniforms(gl, shader);

	return shader;
};

BasicMaterial.registerUniforms = function(gl, shader)
{
	MeshMaterial.registerUniforms(gl, shader);

	//Color
	shader.registerUniform("color");
	shader.registerUniform("emissive");

	//Texture
	shader.registerUniform("texture");
	shader.registerUniform("hasTextureMap");
};

BasicMaterial.prototype.updateUniforms = function(renderer, gl, shader, camera, object, scene)
{
	MeshMaterial.prototype.updateUniforms.call(this, renderer, gl, shader, camera, object, scene);

	gl.uniform3f(shader.uniforms["emissive"], this.emissive.r, this.emissive.g, this.emissive.b);
	gl.uniform3f(shader.uniforms["color"], this.color.r, this.color.g, this.color.b);

	if(this.texture !== null)
	{
		var texture = renderer.getTexture(this.texture);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(shader.uniforms["texture"], 0);
		gl.uniform1i(shader.uniforms["hasTextureMap"], 1);
	}
	else
	{
		gl.uniform1i(shader.uniforms["hasTextureMap"], 0);
	}
};

BasicMaterial.fragmentHeader = MeshMaterial.fragmentHeader +  "\
\
uniform vec3 color;\
uniform vec3 emissive;\
\
uniform bool hasTextureMap;\
uniform sampler2D texture;";

BasicMaterial.fragmentBaseColor = "\
\
if(hasTextureMap)\
{\
	gl_FragColor = texture2D(texture, fragmentUV.st);\
	gl_FragColor.xyz *= color.xyz;\
}\
else\
{\
	gl_FragColor.xyz = color.xyz;\
}\
\
gl_FragColor.xyz += emissive.xyz;";

BasicMaterial.fragmentShader = BasicMaterial.fragmentHeader + "\
\
void main(void)\
{\
	" + BasicMaterial.fragmentBaseColor + "\n" + MeshMaterial.alphaTest +"\
}";