"use strict";

function NormalMaterial(name)
{
	MeshMaterial.call(this);

	this.type = "NormalMaterial";

	this.inModelSpace = false;
}

NormalMaterial.prototype = Object.create(MeshMaterial.prototype);
NormalMaterial.prototype.constructor = NormalMaterial;
NormalMaterial.id = MathUtils.generateID();

NormalMaterial.prototype.updateUniforms = function(renderer, gl, shader, camera, object, scene)
{
	MeshMaterial.prototype.updateUniforms.call(this, renderer, gl, shader, camera, object, scene);

	gl.uniform1i(shader.uniforms["inModelSpace"], this.inModelSpace ? 1 : 0);
};

NormalMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, NormalMaterial.fragmentShader, MeshMaterial.vertexShader);

	NormalMaterial.registerUniforms(gl, shader);
	
	return shader;
};

NormalMaterial.registerUniforms = function(gl, shader)
{
	MeshMaterial.registerUniforms(gl, shader);

	shader.registerUniform("inModelSpace");
};

NormalMaterial.fragmentHeader = BasicMaterial.fragmentHeader +  "\
\
uniform bool inModelSpace;";

NormalMaterial.fragmentShader = NormalMaterial.fragmentHeader + "\
\
void main(void)\
{\
	if(inModelSpace)\
	{\
		vec3 normal = fragmentNormal * 0.5 + 0.5;\
		gl_FragColor = vec4(normal, 1.0);\
	}\
	else\
	{\
		/* TODO */\
		vec3 normal = fragmentNormal * 0.5 + 0.5;\
		gl_FragColor = vec4(normal, 1.0);\
	}\
}";