"use strict";

function BasicMaterial(name)
{
	MeshMaterial.call(this);
 
	this.texture = null;
}

BasicMaterial.prototype = Object.create(MeshMaterial.prototype);

BasicMaterial.prototype.constructor = Sprite;

BasicMaterial.prototype.createShader = function(gl)
{
	var shader = new Shader(gl, BasicMaterial.fragmentShader, MeshMaterial.vertexShader);

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

	//Camera
	shader.registerUniform("far");
	shader.registerUniform("near");

	return shader;
};

BasicMaterial.fragmentShader = "precision mediump float;\
\
varying vec2 fragmentUV;\
varying vec3 fragmentVertex;\
varying vec3 fragmentNormal;\
\
uniform sampler2D texture;\
uniform float time;\
\
void main(void)\
{\
	gl_FragColor = texture2D(texture, vec2(fragmentUV.s, fragmentUV.t));\
}";