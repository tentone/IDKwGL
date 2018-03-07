"use strict";

/** 
 * A mesh material is used to render 3D meshes.
 * 
 * A mesh is composed of a geometry and a material.
 * 
 * One mesh can have multiple materials attached.
 */
function MeshMaterial()
{
	Material.call(this);

	this.type = "MeshMaterial";

	this.faceCulling = MeshMaterial.BACK;
}

MeshMaterial.BACK = 100;
MeshMaterial.FRONT = 101;

MeshMaterial.prototype = Object.create(Material.prototype);

MeshMaterial.prototype.constructor = MeshMaterial;

MeshMaterial.vertexShader = "precision mediump float;\
\
attribute vec3 vertexPosition;\
attribute vec3 vertexNormal;\
attribute vec2 vertexUV;\
\
uniform mat4 projection, view;\
uniform mat4 model;\
\
uniform float far, near;\
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
