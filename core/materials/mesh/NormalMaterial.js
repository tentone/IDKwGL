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

	gl.uniform1i(shader.uniforms["inModelSpace"], this.inModelSpace ? 1 : 0);
};

NormalMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, NormalMaterial.fragmentShader, NormalMaterial.vertexShader);

	NormalMaterial.registerUniforms(gl, shader);
	
	return shader;
};

NormalMaterial.registerUniforms = function(gl, shader)
{
	MeshMaterial.registerUniforms(gl, shader);

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
	\
	if(inModelSpace)\
	{\
		fragmentNormal = vertexNormal;\
	}\
	else\
	{\
		fragmentNormal = (projection * vec4(vertexNormal, 1.0)).xyz;\
	}\
	\
	gl_Position = projection * view * model * vec4(vertexPosition, 1.0);\
}";


NormalMaterial.fragmentHeader = BasicMaterial.fragmentHeader +  "\
\
uniform bool inModelSpace;";

NormalMaterial.fragmentShader = NormalMaterial.fragmentHeader + "\
\
void main(void)\
{\
	vec3 normal = fragmentNormal * 0.5 + 0.5;\
	gl_FragColor = vec4(normal, 1.0);\
}";