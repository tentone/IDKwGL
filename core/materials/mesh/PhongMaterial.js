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
	 * Bump map stored elevations relative to the surface.
	 * 
	 * Can be used for light calculation or to deformate the surface.
	 *
	 * TODO <NOT USED>
	 */
	this.bumpMap = null;
	
	/** 
	 * The specular map stores the specular intensity.
	 *
	 * TODO <NOT USED>
	 */
	 this.specularMap = null;

	/**
	 * Specular highlight color
	 *
	 * TODO <NOT USED>
	 */
	this.specular = new Color(1.0, 1.0, 1.0);

	/**
	 * Specular color intensity, phong constant range [1, 1000].
	 *
	 * TODO <NOT USED>
	 */
	this.specularIntensity = 1;
	
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

	if(this.normalMap !== null)
	{
		var normalMap = renderer.getTexture(this.normalMap);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, normalMap);
		gl.uniform1i(shader.uniforms["normalMap"], 0);
		gl.uniform1i(shader.uniforms["hasNormalMap"], 1);

		var buffers = renderer.getBuffers(object.geometry);

		//Tangent vectors
		if(buffers.tangentBuffer !== null)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangentBuffer);
			gl.vertexAttribPointer(shader.attributes["vertexTangent"], buffers.tangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}
	}
	else
	{
		gl.uniform1i(shader.uniforms["hasNormalMap"], 0);
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

	shader.registerUniform("hasNormalMap");
	shader.registerUniform("normalMap");

	//shader.registerVertexAttributeArray("vertexTangent");
};


PhongMaterial.vertexHeader = "\
\
/* attribute vec3 vertexTangent; */\
\
varying vec3 fragmentTangent;";

PhongMaterial.vertexShader = MeshMaterial.vertexHeader + PhongMaterial.vertexHeader + "\
\
void main(void)\
{\
	fragmentUV = vertexUV;\
	fragmentVertex = vertexPosition;\
	fragmentNormal = vertexNormal;\
	/* fragmentTangent = vertexTangent; */\
	\
	gl_Position = projection * view * model * vec4(vertexPosition, 1.0);\
}";


PhongMaterial.fragmentExtensions = "\
\
#extension GL_OES_standard_derivatives : enable\n";

/**
 * Phong material fragment shader header.
 */
PhongMaterial.fragmentHeader = BasicMaterial.fragmentHeader + "\
\
/* varying vec3 fragmentTangent; */\
\
uniform bool hasNormalMap;\
uniform sampler2D normalMap;";

/**
 * Method to compute normal mapping without pre calculated tangent data.
 */
PhongMaterial.perturbNormal = "\
\
/* Followup: Normal Mapping Without Precomputed Tangents from http://www.thetenthplanet.de/archives/1180*/\
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
vec3 pointLight(PointLight light, vec3 vertex, vec3 normal)\
{\
	vec3 lightDirection = normalize(light.position - vertex);\
	return light.color * max(dot(normalize(normal), lightDirection), 0.0) * light.maxDistance / max(distance(light.position, vertex), 0.001);\
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
if(hasNormalMap)\
{\
	/* vec3 T = normalize(vec3((model * vec4(fragmentTangent, 0.0)).xyz)); */\
	/* vec3 N = normalize(vec3((model * vec4(fragmentNormal, 0.0)).xyz)); */\
	/* T = normalize(T - dot(T, N) * N); */\
	/* vec3 B = cross(N, T); */\
	/* mat3 TBN = mat3(T, B, N); */\
	/* normal = texture2D(normalMap, fragmentUV.st).rgb * 2.0 - 1.0; */ /*Tranform to -1, 1*/\
	/* normal = normalize(TBN * normal); */\
	\
	vec3 viewDirection = vec3(0.0, 0.0, 1.0);\
	\
	normal = perturb_normal(normalize(fragmentNormal), normalize(viewDirection), fragmentUV.st);\
	\
}\
else\
{\
	normal = normalize(vec3((model * vec4(fragmentNormal, 0.0)).xyz));\
}\
\
/* Fragment position */\
vec3 vertex = (model * vec4(fragmentVertex, 1.0)).xyz;\
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
	lighIntesity += directionalLight(directionalLights[i], vertex, normal);\
}\
\
/* Point light */\
for(int i = 0; i < " + Material.MAX_LIGHTS + "; i++)\
{\
	lighIntesity += pointLight(pointLights[i], vertex, normal);\
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
	" + BasicMaterial.fragmentBaseColor + PhongMaterial.fragmentLightCalculation + MeshMaterial.alphaTest + "\
}"; 
