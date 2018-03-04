"use strict";

function BasicMaterial(name)
{
	MeshMaterial.call(this);
 
	this.texture = null;
}

BasicMaterial.prototype = Object.create(MeshMaterial.prototype);

BasicMaterial.prototype.createShader = function(renderer)
{
	var shader = new Shader(gl, BasicMaterial.fragmentShader, BasicMaterial.vertexShader);

	//Vertex attributes
	//shader.program.vertexPositionAttribute = gl.getAttribLocation(shader.program, "vertexPosition");
	gl.enableVertexAttribArray(gl.getAttribLocation(shader.program, "vertexPosition"));

	//shader.program.vertexUVAttribute = gl.getAttribLocation(shader.program, "vertexUV");
	gl.enableVertexAttribArray(gl.getAttribLocation(shader.program, "vertexUV"));

	//shader.program.vertexNormalAttribute = gl.getAttribLocation(shader.program, "vertexNormal");
	gl.enableVertexAttribArray(gl.getAttribLocation(shader.program, "vertexNormal"));

	//Texture
	/*shader.program.textureSampler = gl.getUniformLocation(shader.program, "texture");

	//Matrices
	shader.program.viewMatrixUniform = gl.getUniformLocation(shader.program, "view");
	shader.program.projectionMatrixUniform = gl.getUniformLocation(shader.program, "projection");
	shader.program.modelMatrixUniform = gl.getUniformLocation(shader.program, "model");

	shader.program.time = gl.getUniformLocation(shader.program, "time");
	shader.program.far = gl.getUniformLocation(shader.program, "far");
	shader.program.near = gl.getUniformLocation(shader.program, "near");*/

	return shader;
};

BasicMaterial.fragmentShader = "precision mediump float;\
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
	gl_FragColor = texture2D(texture, vec2(fragmentUV.s, fragmentUV.t));\
}";

BasicMaterial.vertexShader = MeshMaterial.vertexShader;