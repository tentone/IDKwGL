"use strict";

function Sprite()
{
	Object3D.call(this);

	//Texture
	this.texture = null;
}

Sprite.prototype = Object.create(Object3D.prototype);

Sprite.prototype.constructor = Sprite;

Sprite.id = MathUtils.generateID();

/**
 * Creates a copy of this sprite.
 */
Sprite.prototype.clone = function()
{
	var object = new Sprite();

	object.position.set(this.position.x, this.position.y, this.position.z);
	object.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
	object.scale.set(this.scale.x, this.scale.y, this.scale.z);
	object.texture = this.texture;
	return object;
};



//Attach texture image to this sprite
Sprite.prototype.setTexture = function(texture)
{
	this.texture = texture;
};

//Draw Mesh to camera
Sprite.prototype.render = function(renderer, camera, scene)
{
	var gl = renderer.gl;
	
	var shader = renderer.getShader(Sprite);

	gl.useProgram(shader.program);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	//Transformation matrices
	gl.uniformMatrix4fv(shader.uniforms["projection"], false, camera.projectionMatrix.flatten());
	gl.uniformMatrix4fv(shader.uniforms["view"], false, camera.transformationMatrix.flatten());
	gl.uniformMatrix4fv(shader.uniforms["model"], false, this.transformationMatrix.flatten());

	var buffers = renderer.getBuffers(Sprite);

	//Vertex position
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
	gl.vertexAttribPointer(shader.attributes["vertexPosition"], buffers.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Texture UV
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uvBuffer);
	gl.vertexAttribPointer(shader.attributes["vertexUV"], buffers.uvBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Faces
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.facesBuffer);

	var texture = renderer.getTexture(this.texture);

	//Set texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shader.uniforms["texture"], 0);
	
	//Draw the triangles
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

	gl.disable(gl.BLEND);
};

/**
 * Create sprite shader.
 */
Sprite.createShader = function(gl)
{
	var vertex = "attribute vec3 vertexPosition;\
	attribute vec2 vertexUV;\
	\
	uniform mat4 projection, view;\
	uniform mat4 model;\
	\
	varying vec2 pixelUV;\
	\
	void main(void)\
	{\
		pixelUV = vertexUV;\
		gl_Position = projection * view * model * vec4(vertexPosition, 1.0);\
	}";

	var fragment = "precision mediump float;\
	\
	varying vec2 pixelUV;\
	\
	uniform sampler2D texture;\
	\
	void main(void)\
	{\
		gl_FragColor = texture2D(texture, vec2(pixelUV.s, pixelUV.t));\
		\
		if(gl_FragColor.a < 0.3)\
		{\
			discard;\
		}\
	}";

	//Shader
	var shader = new Shader(gl, fragment, vertex);

	//Vertex attributes
	shader.registerVertexAttributeArray("vertexPosition");
	shader.registerVertexAttributeArray("vertexUV");

	//Texture
	shader.registerUniform("texture");

	//Matrices
	shader.registerUniform("view");
	shader.registerUniform("projection");
	shader.registerUniform("model");

	return shader;
};

//Recreate data buffers (Should be called after structural changes)
Sprite.createBuffers = function(gl)
{
	//Geometry
	var vertex = new Float32Array([-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0]);
	var uvs = new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
	var faces = new Uint16Array([0, 1, 2, 0, 2, 3]);

	//Vertex
	var vertexBuffer = gl.createBuffer();
	vertexBuffer.itemSize = 3;
	vertexBuffer.length = vertex.length/3;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);

	//Texture
	var uvBuffer = gl.createBuffer();
	uvBuffer.itemSize = 2;
	uvBuffer.length = uvs.length/2;
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

	//Faces
	var facesBuffer = gl.createBuffer();
	facesBuffer.itemSize = 1;
	facesBuffer.length = faces.length;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, facesBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);

	return {vertexBuffer:vertexBuffer, uvBuffer:uvBuffer, facesBuffer:facesBuffer};
};