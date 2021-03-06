"use strict";

function GrassMaterial(name)
{
	PhongMaterial.call(this);

	this.type = "GrassMaterial";

	/**
	 * Time in seconds used to update the grass wave animation.
	 */
	this.time = 0;
}

GrassMaterial.prototype = Object.create(PhongMaterial.prototype);
GrassMaterial.prototype.constructor = GrassMaterial;
GrassMaterial.id = MathUtils.generateID();

GrassMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, GrassMaterial.fragmentShader, GrassMaterial.vertexShader, PhongMaterial.extensions);

	GrassMaterial.registerUniforms(gl, shader);

	return shader;
};

GrassMaterial.registerUniforms = function(gl, shader)
{
	PhongMaterial.registerUniforms(gl, shader);

	shader.registerUniform("time");
};

GrassMaterial.prototype.updateUniforms = function(renderer, gl, shader, camera, object, scene)
{
	PhongMaterial.prototype.updateUniforms.call(this, renderer, gl, shader, camera, object, scene);

	this.time += 0.016;
	
	gl.uniform1f(shader.uniforms["time"], this.time);
};

GrassMaterial.fragmentLightFunctions = PhongMaterial.perturbNormal + "\
\
vec3 pointLight(PointLight light, vec3 vertex, vec3 normal, vec3 view)\
{\
	return light.color * light.maxDistance / max(distance(light.position, vertex), 0.001);\
}\
\
vec3 directionalLight(DirectionalLight light, vec3 vertex, vec3 normal)\
{\
	return light.color;\
}";

GrassMaterial.vertexShader = MeshMaterial.vertexHeader + PhongMaterial.vertexHeader + "\
\
uniform float time;\
\
void main(void)\
{\
	fragmentUV = vertexUV;\
	fragmentVertex = vertexPosition;\
	fragmentNormal = vertexNormal;\
	\
	float distance = distance(vertexPosition, vec3(0, 0, 0));\
	vec4 position = vec4(vertexPosition, 1.0);\
	\
	position.x += sin(distance + time / 3.0) * position.y / 4.0;\
	\
	gl_Position = projection * view * model * position;\
}";

/**
 * Full phong material fragment shader.
 */
GrassMaterial.fragmentShader = PhongMaterial.fragmentExtensions + PhongMaterial.fragmentHeader + MeshMaterial.fragmentLightStructs + MeshMaterial.fragmentHeaderLights + GrassMaterial.fragmentLightFunctions + "\
\
void main(void)\
{\
	" + BasicMaterial.fragmentBaseColor + PhongMaterial.fragmentLightCalculation + MeshMaterial.alphaTest + "\
}"; 
