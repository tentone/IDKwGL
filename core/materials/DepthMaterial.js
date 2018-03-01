"use strict";

function DepthMaterial(name)
{
	MeshMaterial.call(this);

	this.type = "DepthMaterial";
}

DepthMaterial.prototype = Object.create(MeshMaterial.prototype);

DepthMaterial.fragmentShader = "precision mediump float;\
\
varying vec2 fragmentUV;\
varying vec3 fragmentVertex;\
varying vec3 fragmentNormal;\
\
uniform sampler2D texture;\
uniform float time;\
uniform float cameraFar, cameraNear;\
\
float linearize(float depth)\
{\
	float z = depth * 2.0 - 1.0; \
	return (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - z * (cameraFar - cameraNear));\
}\
\
void main(void)\
{\
    float depth = linearize(gl_FragCoord.z) / cameraFar;\
    gl_FragColor = vec4(vec3(depth), 1.0);\
}";

DepthMaterial.vertexShader = MeshMaterial.vertexShader;