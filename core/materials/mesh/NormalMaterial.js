"use strict";

function NormalMaterial(name)
{
	MeshMaterial.call(this);

	this.type = "NormalMaterial";
}

NormalMaterial.prototype = Object.create(MeshMaterial.prototype);
NormalMaterial.prototype.constructor = NormalMaterial;
NormalMaterial.id = MathUtils.generateID();

NormalMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, NormalMaterial.fragmentShader, MeshMaterial.vertexShader);

	NormalMaterial.registerUniforms(gl, shader);
	
	return shader;
};

NormalMaterial.registerUniforms = function(gl, shader)
{
	MeshMaterial.registerUniforms(gl, shader);
};

NormalMaterial.fragmentShader = MeshMaterial.fragmentHeader + "\
\
void main(void)\
{\
	gl_FragColor = vec4(fragmentNormal, 1.0);\
}";