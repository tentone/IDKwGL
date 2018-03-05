"use strict";

function MeshMaterial()
{
	Material.call(this);

	this.type = "MeshMaterial";
}

MeshMaterial.prototype = Object.create(Material.prototype);

MeshMaterial.prototype.id = MathUtils.randomInt();

MeshMaterial.prototype.render = function(renderer, camera, object)
{
	var gl = renderer.gl;

	var shader = renderer.shaders[this.id];
	if(shader === undefined)
	{
		shader = this.createShader(gl);
		renderer.shaders[this.id] = shader;
	}

	gl.useProgram(shader.program);

	//Enable backface culling
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);

	//Camera
	gl.uniform1f(shader.uniforms["near"], camera.near);
	gl.uniform1f(shader.uniforms["far"], camera.far);

	//Transformation matrices
	gl.uniformMatrix4fv(shader.uniforms["projection"], false, camera.projectionMatrix.flatten());
	gl.uniformMatrix4fv(shader.uniforms["view"], false, camera.transformationMatrix.flatten());
	gl.uniformMatrix4fv(shader.uniforms["model"], false, object.transformationMatrix.flatten());

	var buffers = renderer.shaders[object.geometry.id];
	if(buffers === undefined)
	{
		buffers = object.geometry.createBuffers(gl);
		renderer.shaders[object.geometry.id] = buffers;
	}

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

	//TODO <STORE GL TEXTURES IN RENDERER>
	var texture = this.texture;

	//Set texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shader.uniforms["texture"], 0);

	//Draw the triangles
	gl.drawElements(gl.TRIANGLES, buffers.facesBuffer.length, gl.UNSIGNED_SHORT, 0);

	//Disable cullface
	gl.disable(gl.CULL_FACE);
};

MeshMaterial.vertexShader = "precision mediump float;\
\
attribute vec3 vertexPosition;\
attribute vec3 vertexNormal;\
attribute vec2 vertexUV;\
\
uniform mat4 projection, view;\
uniform mat4 model;\
\
uniform float far, near;\
uniform float time;\
\
varying vec2 fragmentUV;\
varying vec3 fragmentVertex;\
varying vec3 fragmentNormal;\
\
void main(void)\
{\
	fragmentUV = vertexUV;\
	fragmentVertex = vertexPosition;\
	fragmentNormal = vertexNormal;\
	\
	gl_Position = projection * view * model * vec4(vertexPosition, 1.0);\
}";
