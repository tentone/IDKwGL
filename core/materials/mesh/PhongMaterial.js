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

	var shader = renderer.getShader(PhongMaterial);

	gl.useProgram(shader.program);

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
	gl.enable(gl.CULL_FACE);
	gl.cullFace(this.faceCullingMode === MeshMaterial.BACK ? gl.BACK : gl.FRONT);

	//Draw the triangles
	gl.drawElements(gl.TRIANGLES, object.count, gl.UNSIGNED_SHORT, 0);

	//Disable cullface
	gl.disable(gl.CULL_FACE);
};

PhongMaterial.createShader = function(gl)
{
	var fragmentShader = MeshMaterial.fragmentHeader + "void main(void)\
	{\
		\
		\ /* Directional light */\
		vec3 normal = normalize(fragmentNormal);\
		float light = dot(fragmentNormal, vec3(0, 1, 0.5)) * 0.5;\
		\
		\ /* Ambient light */\
		\ light += 0.5;\
		\
		gl_FragColor = texture2D(texture, vec2(fragmentUV.s, fragmentUV.t));\
		\
		gl_FragColor.rgb *= light;" + MeshMaterial.alphaTest + "\
	}";

	var shader = new Shader(gl, fragmentShader, MeshMaterial.vertexShader);

	//Vertex attributes
	shader.registerVertexAttributeArray("vertexPosition");
	shader.registerVertexAttributeArray("vertexUV");
	shader.registerVertexAttributeArray("vertexNormal");

	//Texture
	shader.registerUniform("texture");

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
