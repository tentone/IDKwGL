"use strict";

function MeshMaterial()
{
	Material.call(this);
}

MeshMaterial.prototype = Object.create(Material.prototype);

MeshMaterial.vertexShader = "precision mediump float;\
\
attribute vec3 vertexPosition;\
attribute vec3 vertexNormal;\
attribute vec2 vertexUV;\
\
uniform mat4 projection, view;\
uniform mat4 model;\
uniform float time;\
\
varying vec2 fragmentUV;\
varying vec3 fragmentVertex;\
varying vec3 fragmentNormal;\
\
void main(void)\
{\
	fragmentUV = vertexUV;\
	fragmentVertex = vertexPosition;\
	fragmentNormal = vertexNormal;\
	\
	gl_Position = projection * view * model * vec4(vertexPosition, 1.0);\
}";

MeshMaterial.fragmentShader = "precision mediump float;\
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
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\
}";