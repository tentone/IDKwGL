"use strict";

function DepthMaterial(name)
{
	MeshMaterial.call(this);

	this.type = "DepthMaterial";
}

DepthMaterial.prototype = Object.create(MeshMaterial.prototype);
DepthMaterial.prototype.constructor = DepthMaterial;
DepthMaterial.id = MathUtils.generateID();

DepthMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, DepthMaterial.fragmentShader, MeshMaterial.vertexShader);

	DepthMaterial.registerUniforms(gl, shader);
	
	return shader;
};

DepthMaterial.registerUniforms = function(gl, shader)
{
	MeshMaterial.registerUniforms(gl, shader);
};

DepthMaterial.fragmentShader = MeshMaterial.fragmentHeader + "\
\
float linearize(float depth)\
{\
	float z = depth * 2.0 - 1.0; \
	return (2.0 * near * far) / (far + near - z * (far - near));\
}\
\
void main(void)\
{\
	float depth = linearize(gl_FragCoord.z) / far;\
	gl_FragColor = vec4(vec3(depth), 1.0);\
}";