"use strict";

/** 
 * A mesh material is used to render 3D meshes.
 * 
 * A mesh is composed of a geometry and a material, a mesh can have multiple materials attached.
 * 
 * Is used as base for other mesh materials
 */
function MeshMaterial()
{
	Material.call(this);

	this.type = "MeshMaterial";

	/**
	 * Enable triangle face culling.
	 */
	this.faceCulling = true;

	/**
	 * Face culling mode, used to cull/hide back or fontal faces.
	 */
	this.faceCullingMode = MeshMaterial.BACK;

	/**
	 * Enable blending functions.
	 */
	this.blending = false;

	/**
	 * Color blending mode, only used if bleding set to true.
	 */
	this.blendingMode = MeshMaterial.ONE_MINUS_SRC_ALPHA;

	/**
	 * Alpha test value, if opacity is bellow the alpha test value the pixel is discarded.
	 */
	this.alphaTest = 0.0;
}

MeshMaterial.BACK = 1029;
MeshMaterial.FRONT = 1028;
MeshMaterial.FRONT_AND_BACK = 1032;

MeshMaterial.ONE_MINUS_SRC_ALPHA = 771;

MeshMaterial.prototype = Object.create(Material.prototype);
MeshMaterial.prototype.constructor = MeshMaterial;

MeshMaterial.registerUniforms = function(gl, shader)
{
	//Lights
	//if(this.useLights)
	{		
		for(var i = 0; i < 8; i++)
		{
			//Ambient
			shader.registerUniform("ambientLights[" + i + "].color");
				
			//Directional
			shader.registerUniform("directionalLights[" + i + "].color");
			shader.registerUniform("directionalLights[" + i + "].position");

			//Point
			shader.registerUniform("pointLights[" + i + "].color");
			shader.registerUniform("pointLights[" + i + "].position");
			shader.registerUniform("pointLights[" + i + "].maxDistance");
		}
	}

	//Vertex attributes
	shader.registerVertexAttributeArray("vertexPosition");
	shader.registerVertexAttributeArray("vertexUV");
	shader.registerVertexAttributeArray("vertexNormal");

	//Matrices
	shader.registerUniform("view");
	shader.registerUniform("projection");
	shader.registerUniform("model");

	//Uniforms
	shader.registerUniform("alphaTest");
	shader.registerUniform("far");
	shader.registerUniform("near");
}

MeshMaterial.prototype.render = function(renderer, camera, object, scene)
{
	var gl = renderer.gl;

	var shader = renderer.getShader(this.constructor);

	gl.useProgram(shader.program);

	//Alpha test
	gl.uniform1f(shader.uniforms["alphaTest"], this.alphaTest);

	//Camera
	gl.uniform1f(shader.uniforms["near"], camera.near);
	gl.uniform1f(shader.uniforms["far"], camera.far);

	//Transformation matrices
	gl.uniformMatrix4fv(shader.uniforms["projection"], false, camera.projectionMatrix.flatten());
	gl.uniformMatrix4fv(shader.uniforms["view"], false, camera.transformationMatrix.flatten());
	gl.uniformMatrix4fv(shader.uniforms["model"], false, object.transformationMatrix.flatten());

	var buffers = renderer.getBuffers(object.geometry);

	//Vertex position
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
	gl.vertexAttribPointer(shader.attributes["vertexPosition"], buffers.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Vertex normal
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalBuffer);
	gl.vertexAttribPointer(shader.attributes["vertexNormal"], buffers.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	//Texture UV
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uvBuffer);
	gl.vertexAttribPointer(shader.attributes["vertexUV"], buffers.uvBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Faces
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.facesBuffer);

	//Enable backface culling
	var texture = renderer.getTexture(this.texture);

	//Set texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shader.uniforms["texture"], 0);

	//Enable backface culling
	if(this.faceCulling)
	{
		gl.enable(gl.CULL_FACE);
		gl.cullFace(this.faceCullingMode);
	}

	if(this.blending)
	{
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, this.blendingMode);
	}

	//Draw the triangles
	gl.drawElements(object.mode, object.count, gl.UNSIGNED_SHORT, 0);

	//Disable cullface
	if(this.faceCulling)
	{
		gl.disable(gl.CULL_FACE);	
	}
	if(this.blending)
	{
		gl.disable(gl.BLEND);
	}
};

/**
 * Header lights structs declaration.
 */
MeshMaterial.fragmentLightStructs = "\
struct PointLight\
{\
	vec3 color;\
	vec3 position;\
	float maxDistance;\
};\
\
struct DirectionalLight\
{\
	vec3 color;\
	vec3 position;\
};\
\
struct AmbientLight\
{\
	vec3 color;\
};";

/**
 * Header lights uniform declaration.
 */
MeshMaterial.fragmentHeaderLights = "\
uniform PointLight pointLights[" + Material.MAX_LIGHTS + "];\
uniform AmbientLight ambientLights[" + Material.MAX_LIGHTS + "];\
uniform DirectionalLight directionalLights[" + Material.MAX_LIGHTS + "];";

MeshMaterial.fragmentHeader = "\
precision mediump float;\
\
varying vec2 fragmentUV;\
varying vec3 fragmentVertex;\
varying vec3 fragmentNormal;\
\
uniform sampler2D texture;\
\
uniform mat4 model;\
\
uniform float alphaTest;\
uniform float far, near;";

MeshMaterial.alphaTest = "if(gl_FragColor.a < alphaTest) discard;"

MeshMaterial.vertexHeader = "\
precision mediump float;\
\
attribute vec3 vertexPosition;\
attribute vec3 vertexNormal;\
attribute vec2 vertexUV;\
\
uniform mat4 projection, view;\
uniform mat4 model;\
\
uniform float far, near;\
uniform float alphaTest;\
\
varying vec2 fragmentUV;\
varying vec3 fragmentVertex;\
varying vec3 fragmentNormal;";

MeshMaterial.vertexShader = MeshMaterial.vertexHeader + "\
\
void main(void)\
{\
	fragmentUV = vertexUV;\
	fragmentVertex = vertexPosition;\
	fragmentNormal = vertexNormal;\
	\
	gl_Position = projection * view * model * vec4(vertexPosition, 1.0);\
}";
