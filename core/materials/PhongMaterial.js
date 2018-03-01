"use strict";

function PhongMaterial(name)
{
	MeshMaterial.call(this);

	this.name = name;
	this.type = "PhongMaterial";

	this.texture = null;
	this.normalMap = null;
	this.bumpMap = null;
	this.specularMap = null;

	this.ambient = new Color(1,1,1); //Ambient Value
	this.diffuse = new Color(1,1,1); //Diffuse Value
	this.specular = new Color(1,1,1); //Specular Value
	this.specularIntensity = 1; //Specular Intensity (Phong constant) range [1, 1000]
	
	this.alpha = 1; //Alpha Value
}

PhongMaterial.prototype = Object.create(MeshMaterial.prototype);

PhongMaterial.vertexShader = MeshMaterial.vertexShader;

PhongMaterial.fragmentShader = "precision mediump float;\
\
varying vec2 fragmentUV;\
varying vec3 fragmentVertex;\
varying vec3 fragmentNormal;\
\
uniform sampler2D texture;\
\
uniform float time;\
uniform float far, near;\
\
void main(void)\
{\
	\
	\ /* Directional light */\
	vec3 normal = normalize(fragmentNormal);\
	float light = dot(fragmentNormal, vec3(0, 1, 0.5)) * 0.5;\
	\
	\ /* Ambient light */\
	\ light += 0.5;\
	\
	gl_FragColor = texture2D(texture, vec2(fragmentUV.s, fragmentUV.t));\
	\
	if(gl_FragColor.a < 0.3)\
	{\
		discard;\
	}\
	\
	gl_FragColor.rgb *= light;\
}";
