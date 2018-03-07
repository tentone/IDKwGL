"use strict";

function BasicMaterial(name)
{
	MeshMaterial.call(this);
 
	this.texture = null;
}

BasicMaterial.prototype = Object.create(MeshMaterial.prototype);
BasicMaterial.prototype.constructor = BasicMaterial;
BasicMaterial.id = MathUtils.generateID();

BasicMaterial.createShader = function(gl)
{
	var fragmentShader = MeshMaterial.fragmentHeader + "void main(void){gl_FragColor = texture2D(texture, vec2(fragmentUV.s, fragmentUV.t));" + MeshMaterial.alphaTest  +"}";

	var shader = new Shader(gl, fragmentShader, MeshMaterial.vertexShader);

	//Vertex attributes
	shader.registerVertexAttributeArray("vertexPosition");
	shader.registerVertexAttributeArray("vertexUV");
	shader.registerVertexAttributeArray("vertexNormal");

	//Texture
	shader.registerUniform("texture");

	//Matrices
	shader.registerUniform("view");
	shader.registerUniform("projection");
	shader.registerUniform("model");

	//Uniforms
	shader.registerUniform("alphaTest");
	shader.registerUniform("far");
	shader.registerUniform("near");

	return shader;
};
