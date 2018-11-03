"use strict";

function GrassMaterial(name)
{
	PhongMaterial.call(this);

	this.type = "GrassMaterial";

	this.time = 0;
}

GrassMaterial.prototype = Object.create(PhongMaterial.prototype);
GrassMaterial.prototype.constructor = GrassMaterial;
GrassMaterial.id = MathUtils.generateID();

GrassMaterial.prototype.render = function(renderer, camera, object, scene)
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
	
	//Directinal lights
	for(var i = 0; i < scene.directionalLights.length && i < 8; i++)
	{
		var color = scene.directionalLights[i].color;
		gl.uniform3f(shader.uniforms["directionalLights[" + i + "].color"], color.r, color.g, color.b);

		var position = scene.directionalLights[i].position;
		gl.uniform3f(shader.uniforms["directionalLights[" + i + "].position"], position.x, position.y, position.z);
	}

	//Ambient lights
	for(var i = 0; i < scene.ambientLights.length && i < 8; i++)
	{
		var color = scene.ambientLights[i].color;
		gl.uniform3f(shader.uniforms["ambientLights[" + i + "].color"], color.r, color.g, color.b);
	}

	//Point lights
	for(var i = 0; i < scene.pointLights.length && i < 8; i++)
	{
		var color = scene.pointLights[i].color;
		gl.uniform3f(shader.uniforms["pointLights[" + i + "].color"], color.r, color.g, color.b);

		var position = scene.pointLights[i].position;
		gl.uniform3f(shader.uniforms["pointLights[" + i + "].position"], position.x, position.y, position.z);

		gl.uniform1f(shader.uniforms["pointLights[" + i + "].maxDistance"], scene.pointLights[i].maxDistance);
	}

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

GrassMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, GrassMaterial.fragmentShader, GrassMaterial.vertexShader);

	//Vertex attributes
	shader.registerVertexAttributeArray("vertexPosition");
	shader.registerVertexAttributeArray("vertexUV");
	shader.registerVertexAttributeArray("vertexNormal");

	//Lights
	for(var i = 0; i < 8; i++)
	{
		shader.registerUniform("ambientLights[" + i + "].color");
		
		shader.registerUniform("directionalLights[" + i + "].color");
		shader.registerUniform("directionalLights[" + i + "].position");

		shader.registerUniform("pointLights[" + i + "].color");
		shader.registerUniform("pointLights[" + i + "].position");
		shader.registerUniform("pointLights[" + i + "].maxDistance");
	}

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

GrassMaterial.fragmentLightFunctions = "\
\
vec3 pointLight(PointLight light, vec3 vertex, vec3 normal)\
{\
	return light.color * light.maxDistance / max(distance(light.position, vertex), 0.001);\
}\
\
vec3 directionalLight(DirectionalLight light, vec3 vertex, vec3 normal)\
{\
	return light.color;\
}";

GrassMaterial.vertexShader = MeshMaterial.vertexHeader + "\
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
GrassMaterial.fragmentShader = PhongMaterial.fragmentHeader + MeshMaterial.fragmentLightStructs + MeshMaterial.fragmentHeaderLights + GrassMaterial.fragmentLightFunctions + "\
\
void main(void)\
{\
	gl_FragColor = texture2D(texture, vec2(fragmentUV.s, fragmentUV.t));\
	\
	" + PhongMaterial.fragmentLightCalculation + MeshMaterial.alphaTest + "\
}"; 
