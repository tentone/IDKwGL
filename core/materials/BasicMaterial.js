"use strict";

function BasicMaterial(name)
{
	MeshMaterial.call(this);
 
	this.texture = null;
	

}

BasicMaterial.prototype = Object.create(MeshMaterial.prototype);

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

BasicMaterial.vertexShader = MeshMaterial.vertexShader;