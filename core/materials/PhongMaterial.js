"use strict";

//Material Constructor
function PhongMaterial(name)
{
	Material.call(this);

	this.name = name;
	
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


PhongMaterial.fragment = "precision mediump float;\
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
	\ /* Fade effect */\
	float value = (cos(time) + 1.0) * gl_FragColor.r * gl_FragColor.g;\
	if(value > 0.6)\
	{\
		discard;\
	}\
	if(value > 0.55)\
	{\
		gl_FragColor.rgb = vec3(1.0, 1.0, 0.0);\
		return;\
	}\
	\
	if(gl_FragColor.a < 0.3)\
	{\
		discard;\
	}\
	\
	gl_FragColor.rgb *= light;\
}";

PhongMaterial.vertex = "precision mediump float;\
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
	vec4 position = model * vec4(vertexPosition, 1.0);\
	\
	float dist = distance(position, vec4(0,0,0,0));\
	position.y += cos(time + dist);\
	\
	gl_Position = projection * view * position;\
}";