"use strict";

/**
 * Implements the phong shading model.
 *
 * Compatible with point, ambient and directional lights.
 */
function PhongMaterial(name)
{
	BasicMaterial.call(this);

	this.name = name;
	this.type = "PhongMaterial";
	this.useLights = true;

	/**
	 * Normal vector map used for lighting calculation. 
	 */
	this.normalMap = null;

	/**
	 * Specular highlight color
	 */
	this.specular = new Color(1.0, 1.0, 1.0);

	/**
	 * Specular color intensity, phong constant range.
	 */
	this.specularIntensity = 500;

	/** 
	 * The specular map stores the specular intensity.
	 */
	 this.specularMap = null;

	/**
	 * Bump map stored elevations relative to the surface.
	 * 
	 * Can be used for light calculation or to deformate the surface.
	 */
	this.bumpMap = null;
		
	/**
	 * Bump map scale, indicates the maximum bump deformation allowed.
	 *
	 * Can be negative to compress the geometry surface.
	 */
	this.bumpScale = 2.0;

	/**
	 * Indicates if the material is transparent.
	 *
	 * TODO <NOT USED>
	 */
	this.transparent = false;

	/**
	 * Level of alpha of the material.
	 *
	 * Only applied if the material is transparent.
	 *
	 * TODO <NOT USED>
	 */
	this.alpha = 1.0;
}

PhongMaterial.prototype = Object.create(BasicMaterial.prototype);
PhongMaterial.prototype.constructor = PhongMaterial;
PhongMaterial.id = MathUtils.generateID();

PhongMaterial.prototype.updateUniforms = function(renderer, gl, shader, camera, object, scene)
{
	BasicMaterial.prototype.updateUniforms.call(this, renderer, gl, shader, camera, object, scene);

	var buffers = renderer.getBuffers(object.geometry);

	//Tangent vectors
	if(buffers.tangentBuffer !== null)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangentBuffer);
		gl.vertexAttribPointer(shader.attributes["vertexTangent"], buffers.tangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
	}

	//Normal map
	if(this.normalMap !== null)
	{
		var normalMap = renderer.getTexture(this.normalMap);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, normalMap);
		gl.uniform1i(shader.uniforms["normalMap"], 1);
		gl.uniform1i(shader.uniforms["hasNormalMap"], 1);

	}
	else
	{
		gl.uniform1i(shader.uniforms["hasNormalMap"], 0);
	}

	gl.uniform3f(shader.uniforms["specular"], this.specular.r, this.specular.g, this.specular.b);
	gl.uniform1f(shader.uniforms["specularIntensity"], this.specularIntensity);

	//Specular map
	if(this.specularMap !== null)
	{
		var specularMap = renderer.getTexture(this.specularMap);
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, specularMap);
		gl.uniform1i(shader.uniforms["specularMap"], 2);
		gl.uniform1i(shader.uniforms["hasSpecularMap"], 1);
	}
	else
	{
		gl.uniform1i(shader.uniforms["hasSpecularMap"], 0);
	}

	//Bump map
	if(this.bumpMap !== null)
	{
		var bumpMap = renderer.getTexture(this.bumpMap);
		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, bumpMap);
		gl.uniform1i(shader.uniforms["bumpMap"], 3);
		gl.uniform1i(shader.uniforms["hasBumpMap"], 1);
	}
	else
	{
		gl.uniform1i(shader.uniforms["hasBumpMap"], 0);
	}

};

PhongMaterial.extensions = ["OES_standard_derivatives"];

PhongMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, PhongMaterial.fragmentShader, PhongMaterial.vertexShader, PhongMaterial.extensions);

	PhongMaterial.registerUniforms(gl, shader);

	return shader;
};

PhongMaterial.registerUniforms = function(gl, shader)
{
	BasicMaterial.registerUniforms(gl, shader);

	//shader.registerVertexAttributeArray("vertexTangent");

	shader.registerUniform("hasNormalMap");
	shader.registerUniform("normalMap");

	shader.registerUniform("specular");
	shader.registerUniform("specularIntensity");

	shader.registerUniform("hasSpecularMap");
	shader.registerUniform("specularMap");

	shader.registerUniform("hasBumpMap");
	shader.registerUniform("bumpMap");
	shader.registerUniform("bumpScale");
};

PhongMaterial.fragmentExtensions = "\
\
#extension GL_OES_standard_derivatives : enable\n";


PhongMaterial.vertexHeader = "\
\
/* attribute vec3 vertexTangent; */\
\
uniform bool hasBumpMap;\
uniform sampler2D bumpMap;\
uniform float bumpScale;\
\
varying vec3 fragmentTangent;";

/**
 * Phong material fragment shader header.
 */
PhongMaterial.fragmentHeader = BasicMaterial.fragmentHeader + "\
\
/* varying vec3 fragmentTangent; */\
\
uniform bool hasNormalMap;\
uniform sampler2D normalMap;\
\
uniform vec3 specular;\
uniform float specularIntensity;\
\
uniform bool hasSpecularMap;\
uniform sampler2D specularMap;\
\
uniform bool hasBumpMap;\
uniform sampler2D bumpMap;";

PhongMaterial.vertexShader = MeshMaterial.vertexHeader + PhongMaterial.vertexHeader + "\
\
void main(void)\
{\
	fragmentUV = vertexUV;\
	fragmentVertex = vertexPosition;\
	fragmentNormal = vertexNormal;\
	\
	if(hasBumpMap)\
	{\
		fragmentVertex.xyz += normalize(fragmentNormal).xyz * texture2D(bumpMap, fragmentUV).xyz;\
		\
		float d = 0.01;\
		vec2 dx = vec2(d, 0.0);\
		vec2 dy = vec2(0.0, d);\
		\
		fragmentNormal.x += texture2D(bumpMap, fragmentUV + dx).x - texture2D(bumpMap, fragmentUV - dx).x;\
		fragmentNormal.z += texture2D(bumpMap, fragmentUV + dy).x - texture2D(bumpMap, fragmentUV - dy).x;\
		fragmentNormal = normalize(fragmentNormal);\
	}\
	\
	gl_Position = projection * view * model * vec4(fragmentVertex, 1.0);\
}";

/**
 * Method to compute normal mapping without pre calculated tangent data.
 */
PhongMaterial.perturbNormal = "\
\
/* Normal Mapping Without Precomputed Tangents (http://www.thetenthplanet.de/archives/1180) */\
mat3 cotangent_frame(vec3 N, vec3 p, vec2 uv)\
{\
	/* Get edge vectors of the pixel triangle */\
	vec3 dp1 = dFdx(p);\
	vec3 dp2 = dFdy(p);\
	vec2 duv1 = dFdx(uv);\
	vec2 duv2 = dFdy(uv);\
	\
	/* Solve the linear system */\
	vec3 dp2perp = cross(dp2, N);\
	vec3 dp1perp = cross(N, dp1);\
	vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;\
	vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;\
	\
	/* Construct a scale invariant frame */\
	float invmax = inversesqrt(max(dot(T, T), dot(B, B)));\
	return mat3(T * invmax, B * invmax, N);\
}\
\
/* Calculat the normal vector from normal map without the face tagent vector. */\
vec3 perturb_normal(vec3 N, vec3 V, vec2 uv)\
{\
	/* Assume N, the interpolated vertex normal and V, the view vector (vertex to eye) */\
	vec3 map = texture2D(normalMap, uv).rgb;\
	\
	/* Unsigned RGB normal map */\
	map = map * 2.0 - 1.0;\
	\
	/* 2 channel normal map */\
	/* map.z = sqrt(1.0 - dot(map.xy, map.xy)); */\
	\
	/* Normal map with green up */\
	/* map.y = -map.y; */\
	\
	mat3 TBN = cotangent_frame(N, -V, uv);\
	\
	return normalize(TBN * map);\
}";

/**
 * Light calculation methods.
 */
PhongMaterial.fragmentLightFunctions = PhongMaterial.perturbNormal + "\
\
/* Calculate point light from light data, surface position, normal vector and view position. */\
vec3 pointLight(PointLight light, vec3 vertex, vec3 normal, vec3 view)\
{\
	vec3 lightDirection = normalize(light.position - vertex);\
	\
	/* Base light */\
	float distanceFactor = light.maxDistance / max(distance(light.position, vertex), 0.001);\
	float baseLight = max(dot(normal, lightDirection), 0.0) * distanceFactor;\
	\
	/* Specular light */\
	float specularLight = 0.0;\
	if(baseLight > 0.0)\
	{\
		vec3 lightReflection = reflect(-lightDirection, normal);\
		vec3 viewDirection = normalize(view - vertex);\
		\
		float specularAngle = max(dot(lightReflection, viewDirection), 0.0);\
		specularLight = pow(specularAngle, specularIntensity);\
	}\
	\
	return (specular * light.color * specularLight) + (light.color * baseLight);\
}\
\
vec3 directionalLight(DirectionalLight light, vec3 vertex, vec3 normal)\
{\
	return light.color * dot(normal, light.position);\
}";

/**
 * Phong light calculation, done after the albedo color is set.
 */
PhongMaterial.fragmentLightCalculation = "\
\
/* Light Intensity */\
vec3 lighIntesity = vec3(0.0, 0.0, 0.0);\
\
/* Fragment normal */\
vec3 normal;\
\
/* Fragment position */\
vec3 modelPosition = (model * vec4(fragmentVertex, 1.0)).xyz;\
\
/* View position */\
vec3 viewPosition = (camera * vec4(0.0, 0.0, 0.0, 1.0)).xyz;\
\
if(hasNormalMap)\
{\
	normal = perturb_normal(normalize(fragmentNormal), normalize(viewPosition - modelPosition), fragmentUV.st);\
}\
else\
{\
	normal = normalize(vec3((model * vec4(fragmentNormal, 0.0)).xyz));\
}\
\
/* Ambient light */\
for(int i = 0; i < " + Material.MAX_LIGHTS + "; i++)\
{\
	lighIntesity += ambientLights[i].color;\
}\
\
/* Directinal light */\
for(int i = 0; i < " + Material.MAX_LIGHTS + "; i++)\
{\
	lighIntesity += directionalLight(directionalLights[i], modelPosition, normal);\
}\
\
/* Point light */\
for(int i = 0; i < " + Material.MAX_LIGHTS + "; i++)\
{\
	lighIntesity += pointLight(pointLights[i], modelPosition, normal, viewPosition);\
}\
\
gl_FragColor.rgb *= lighIntesity;";

/**
 * Full phong material fragment shader.
 */
PhongMaterial.fragmentShader = PhongMaterial.fragmentExtensions + PhongMaterial.fragmentHeader + MeshMaterial.fragmentLightStructs + MeshMaterial.fragmentHeaderLights + PhongMaterial.fragmentLightFunctions + "\
\
void main(void)\
{\
	" + BasicMaterial.fragmentBaseColor + "\
	\
	" + PhongMaterial.fragmentLightCalculation + MeshMaterial.alphaTest + "\
}"; 


