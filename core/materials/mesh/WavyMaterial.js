"use strict";

function WavyMaterial(name)
{
	PhongMaterial.call(this);

	this.type = "WavyMaterial";

	this.time = 0;
}

WavyMaterial.prototype = Object.create(PhongMaterial.prototype);
WavyMaterial.prototype.constructor = WavyMaterial;
WavyMaterial.id = MathUtils.generateID();

WavyMaterial.prototype.render = function(renderer, camera, object)
{
	var gl = renderer.gl;
	var shader = renderer.getShader(this.constructor);

	this.time += 0.016;

	gl.useProgram(shader.program);

	//Alpha test
	gl.uniform1f(shader.uniforms["alphaTest"], this.alphaTest);

	//Time
	gl.uniform1f(shader.uniforms["time"], this.time);

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

	//Texture
	var texture = renderer.getTexture(this.texture);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shader.uniforms["texture"], 0);

	//Normal map
	if(this.normalMap !== null)
	{
		var normalMap = renderer.getTexture(this.normalMap);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, normalMap);
		gl.uniform1i(shader.uniforms["normalMap"], 0);
		gl.uniform1i(shader.uniforms["hasNormalMap"], 1);
	}
	else
	{
		gl.uniform1i(shader.uniforms["hasNormalMap"], 0);
	}

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
	gl.drawElements(gl.TRIANGLES, object.count, gl.UNSIGNED_SHORT, 0);

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

WavyMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, PhongMaterial.fragmentShader, WavyMaterial.vertexShader);

	//Vertex attributes
	shader.registerVertexAttributeArray("vertexPosition");
	shader.registerVertexAttributeArray("vertexUV");
	shader.registerVertexAttributeArray("vertexNormal");

	//Time
	shader.registerUniform("time");

	//Texture
	shader.registerUniform("texture");

	//Normal
	shader.registerUniform("hasNormalMap");
	shader.registerUniform("normalMap");

	//Matrices
	shader.registerUniform("view");
	shader.registerUniform("projection");
	shader.registerUniform("model");

	//Uniforms
	shader.registerUniform("alphaTest");
	shader.registerUniform("far");
	shader.registerUniform("near");

	return shader;
};

WavyMaterial.vertexShader = MeshMaterial.vertexHeader + "\
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

