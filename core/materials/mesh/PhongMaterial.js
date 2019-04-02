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


PhongMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, PhongMaterial.fragmentShader, PhongMaterial.vertexShader);

	PhongMaterial.registerUniforms(gl, shader);

	return shader;
};

PhongMaterial.registerUniforms = function(gl, shader)
{
	BasicMaterial.registerUniforms(gl, shader);

	shader.registerUniform("hasNormalMap");
	shader.registerUniform("normalMap");

	shader.registerVertexAttributeArray("vertexTangent");
};


PhongMaterial.vertexHeader = "\
uniform bool hasNormalMap;\
\
attribute vec3 vertexTangent;\
\
varying mat3 fragmentTBN;"

PhongMaterial.vertexShader = MeshMaterial.vertexHeader + PhongMaterial.vertexHeader + "\
\
void main(void)\
{\
	if(hasNormalMap)\
	{\
		vec3 T = normalize(vec3(model * vec4(vertexTangent, 0.0)));\
		vec3 N = normalize(vec3(model * vec4(vertexNormal, 0.0)));\
		vec3 B = cross(N, T);\
		\
		/*re-orthogonalize T with respect to N*/\
		T = normalize(T - dot(T, N) * N);\
		\
		fragmentTBN = mat3(T, B, N);\
	}\
\
	fragmentUV = vertexUV;\
	fragmentVertex = vertexPosition;\
	fragmentNormal = vertexNormal;\
	\
	gl_Position = projection * view * model * vec4(vertexPosition, 1.0);\
}";


/**
 * Phong material fragment shader header.
 */
PhongMaterial.fragmentHeader = BasicMaterial.fragmentHeader +  "\
\
varying mat3 fragmentTBN;\
\
uniform bool hasNormalMap;\
uniform sampler2D normalMap;";

/**
 * Light calculation methods.
 */
PhongMaterial.fragmentLightFunctions = "\
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
if(hasNormalMap)\
{\
	normal = texture2D(normalMap, vec2(fragmentUV.s, fragmentUV.t)).rgb;\
	normal = normalize(normal * 2.0 - 1.0); /*Tranform to -1, 1*/\
	normal = normalize(fragmentTBN * normal);\
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
PhongMaterial.fragmentShader = PhongMaterial.fragmentHeader + MeshMaterial.fragmentLightStructs + MeshMaterial.fragmentHeaderLights + PhongMaterial.fragmentLightFunctions + "\
\
void main(void)\
{\
	" + BasicMaterial.fragmentBaseColor + PhongMaterial.fragmentLightCalculation + MeshMaterial.alphaTest + "\
}"; 
