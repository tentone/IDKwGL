"use strict";

function DepthMaterial(name)
{
	MeshMaterial.call(this);

	this.type = "DepthMaterial";
}

DepthMaterial.prototype = Object.create(MeshMaterial.prototype);

DepthMaterial.prototype.createShader = function(gl)
{
	var shader = new Shader(gl, DepthMaterial.fragmentShader, MeshMaterial.vertexShader);

	//Attributes
	shader.registerVertexAttributeArray("vertexPosition");
	shader.registerVertexAttributeArray("vertexUV");
	shader.registerVertexAttributeArray("vertexNormal");

	//Matrices
	shader.registerUniform("view");
	shader.registerUniform("projection");
	shader.registerUniform("model");

	//Camera
	shader.registerUniform("far");
	shader.registerUniform("near");

	return shader;
};

DepthMaterial.fragmentShader = "precision mediump float;\
\
varying vec2 fragmentUV;\
varying vec3 fragmentVertex;\
varying vec3 fragmentNormal;\
\
uniform float far, near;\
\
float linearize(float depth)\
{\
	float z = depth * 2.0 - 1.0; \
	return (2.0 * near * far) / (far + near - z * (far - near));\
}\
\
void main(void)\
{\
    float depth = linearize(gl_FragCoord.z) / far;\
    gl_FragColor = vec4(vec3(depth), 1.0);\
}";
