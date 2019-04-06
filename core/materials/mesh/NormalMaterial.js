"use strict";

function NormalMaterial(name)
{
	MeshMaterial.call(this);

	this.type = "NormalMaterial";

	/**
	 * Normal vector map used for lighting calculation. 
	 */
	this.normalMap = null;

	/** 
	 * Apply the camera view matrix to the normal vector.
	 */
	this.inModelSpace = true;
}

NormalMaterial.prototype = Object.create(MeshMaterial.prototype);
NormalMaterial.prototype.constructor = NormalMaterial;
NormalMaterial.id = MathUtils.generateID();

NormalMaterial.prototype.updateUniforms = function(renderer, gl, shader, camera, object, scene)
{
	MeshMaterial.prototype.updateUniforms.call(this, renderer, gl, shader, camera, object, scene);

	if(this.normalMap !== null)
	{
		var normalMap = renderer.getTexture(this.normalMap);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, normalMap);
		gl.uniform1i(shader.uniforms["normalMap"], 0);
		gl.uniform1i(shader.uniforms["hasNormalMap"], 1);
	}
	else
	{
		gl.uniform1i(shader.uniforms["hasNormalMap"], 0);
	}

	gl.uniform1i(shader.uniforms["inModelSpace"], this.inModelSpace ? 1 : 0);
};

NormalMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, NormalMaterial.fragmentShader, NormalMaterial.vertexShader, PhongMaterial.extensions);

	NormalMaterial.registerUniforms(gl, shader);
	
	return shader;
};

NormalMaterial.registerUniforms = function(gl, shader)
{
	MeshMaterial.registerUniforms(gl, shader);
	
	shader.registerUniform("hasNormalMap");
	shader.registerUniform("normalMap");

	shader.registerUniform("inModelSpace");
};

NormalMaterial.vertexShader = MeshMaterial.vertexHeader + "\
\
uniform bool inModelSpace;\
\
void main(void)\
{\
	fragmentUV = vertexUV;\
	fragmentVertex = vertexPosition;\
	fragmentNormal = vertexNormal;\
	\
	gl_Position = projection * view * model * vec4(vertexPosition, 1.0);\
}";


NormalMaterial.fragmentHeader = BasicMaterial.fragmentHeader +  "\
\
uniform bool hasNormalMap;\
uniform sampler2D normalMap;\
\
uniform bool inModelSpace;";

NormalMaterial.fragmentShader = PhongMaterial.fragmentExtensions + NormalMaterial.fragmentHeader + PhongMaterial.perturbNormal + "\
\
void main(void)\
{\
	vec3 normal;\
	\
	if(hasNormalMap)\
	{\
		vec3 vertex = (model * vec4(fragmentVertex, 1.0)).xyz;\
		normal = perturb_normal(normalize(fragmentNormal), normalize(vertex.xyz), fragmentUV.st);\
	}\
	else\
	{\
		normal = fragmentNormal;\
	}\
	\
	gl_FragColor = vec4(normalize((normal + 1.0) * 2.0), 1.0);\
}";
