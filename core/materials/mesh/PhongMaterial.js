"use strict";

function PhongMaterial(name)
{
	MeshMaterial.call(this);

	this.name = name;
	this.type = "PhongMaterial";

	this.texture = null;
	this.normalMap = null;
	this.bumpMap = null;
	this.specularMap = null;

	this.ambient = new Color(1,1,1); //Ambient Value
	this.diffuse = new Color(1,1,1); //Diffuse Value
	this.specular = new Color(1,1,1); //Specular Value
	this.specularIntensity = 1; //Specular Intensity (Phong constant) range [1, 1000]
	
	this.alpha = 1; //Alpha Value
}

PhongMaterial.prototype = Object.create(MeshMaterial.prototype);
PhongMaterial.prototype.constructor = PhongMaterial;
PhongMaterial.id = MathUtils.generateID();

PhongMaterial.prototype.render = function(renderer, camera, object)
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

PhongMaterial.createShader = function(gl)
{
	var shader = new Shader(gl, PhongMaterial.fragmentShader, MeshMaterial.vertexShader);

	//Vertex attributes
	shader.registerVertexAttributeArray("vertexPosition");
	shader.registerVertexAttributeArray("vertexUV");
	shader.registerVertexAttributeArray("vertexNormal");

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

/**
 * Phong material fragment shader header.
 */
PhongMaterial.fragmentHeader = MeshMaterial.fragmentHeader + "\
\
uniform bool hasNormalMap;\
uniform sampler2D normalMap;";

/**
 * Full phong material fragment shader.
 */
PhongMaterial.fragmentShader = PhongMaterial.fragmentHeader + "\
\
struct PointLight\
{\
	vec3 position;\
	vec3 color;\
	float maxDistance;\
};\
\
struct DirectionalLight\
{\
	vec3 position;\
	vec3 color;\
};\
\
struct AmbientLight\
{\
	vec3 color;\
};\
\
vec3 pointLight(PointLight light, vec3 vertex, vec3 normal)\
{\
	vec3 lightDirection = normalize(light.position - vertex);\
	return light.color * max(dot(normalize(normal), lightDirection), 0.0) * light.maxDistance / max(distance(light.position, vertex), 0.001);\
}\
\
vec3 directionalLight(DirectionalLight light, vec3 vertex, vec3 normal)\
{\
	return light.color * dot(normal, light.position);\
}\
\
void main(void)\
{\
	/* Fragment normal */\
	vec3 normal;\
	if(hasNormalMap)\
	{\
		vec3 normalValue = texture2D(normalMap, vec2(fragmentUV.s, fragmentUV.t)).rgb;\
		normalValue = normalize(normalValue * 2.0 - 1.0);\
		\
		vec4 temp = model * vec4(normalValue, 0.0);\
		normal = normalize(temp.xyz);\
	}\
	else\
	{\
		normal = normalize(vec3((model * vec4(fragmentNormal, 0.0)).xyz));\
	}\
	\
	/* Fragment position */\
	vec3 vertex = (model * vec4(fragmentVertex, 1.0)).xyz;\
	\
	/* Directional light */\
	DirectionalLight direct;\
	direct.color = vec3(0.3, 0.3, 0.3);\
	direct.position = vec3(0.0, 2.0, 1.0);\
	vec3 directional = directionalLight(direct, vertex, normal);\
	\
	/* Ambient light */\
	vec3 ambient = vec3(0.6, 0.6, 0.6);\
	\
	/* Point light A*/\
	PointLight light;\
	light.color = vec3(2.0, 0.0, 0.0);\
	light.position = vec3(-50.0, 30.0, -50.0);\
	light.maxDistance = 20.0;\
	vec3 pointA = pointLight(light, vertex, normal);\
	\
	/* Point light B*/\
	light.color = vec3(0.0, 2.0, 0.0);\
	light.position = vec3(-50.0, 30.0, 50.0);\
	light.maxDistance = 20.0;\
	vec3 pointB = pointLight(light, vertex, normal);\
	\
	/* Point light C*/\
	light.color = vec3(0.0, 0.0, 2.0);\
	light.position = vec3(50.0, 30.0, -50.0);\
	light.maxDistance = 20.0;\
	vec3 pointC = pointLight(light, vertex, normal);\
	\
	gl_FragColor = texture2D(texture, vec2(fragmentUV.s, fragmentUV.t));\
	gl_FragColor.rgb *= ambient + directional + pointA + pointB + pointC;" + MeshMaterial.alphaTest + "\
}"; 
