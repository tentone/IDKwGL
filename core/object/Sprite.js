"use strict";

function Sprite()
{
	if(Sprite.shader === undefined)
	{
		Sprite.initializeBuffers();
		Sprite.initializeShaders();
	}
	
	Object3D.call(this);

	//Texture
	this.texture = null;
}

Sprite.prototype = Object.create(Object3D.prototype);

//Draw Mesh to camera
Sprite.prototype.render = function(renderer, camera, scene)
{
	var gl = renderer.gl;
	
	gl.useProgram(Sprite.shader.program);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	//Transformation matrices
	gl.uniformMatrix4fv(gl.getUniformLocation(Sprite.shader.program, "projection"), false, camera.projectionMatrix.flatten());
	gl.uniformMatrix4fv(gl.getUniformLocation(Sprite.shader.program, "view"), false, camera.transformationMatrix.flatten());
	gl.uniformMatrix4fv(gl.getUniformLocation(Sprite.shader.program, "model"), false, this.transformationMatrix.flatten());

	//Vertex position
	gl.bindBuffer(gl.ARRAY_BUFFER, Sprite.vertexBuffer);
	gl.vertexAttribPointer(Sprite.shader.program.vertexPositionAttribute, Sprite.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Texture UV
	gl.bindBuffer(gl.ARRAY_BUFFER, Sprite.UVBuffer);
	gl.vertexAttribPointer(Sprite.shader.program.vertexUVAttribute, Sprite.UVBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Faces
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Sprite.facesBuffer);

	//Set texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(Sprite.shader.program.textureSampler, 0);
	
	//Draw the triangles
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

	gl.disable(gl.BLEND);
};

Sprite.initializeShaders = function()
{
	//Shader
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
	Sprite.shader = new Shader(fragment, vertex);

	//Vertex
	Sprite.shader.program.vertexPositionAttribute = gl.getAttribLocation(Sprite.shader.program, "vertexPosition");
	gl.enableVertexAttribArray(Sprite.shader.program.vertexPositionAttribute);
	Sprite.shader.program.vertexUVAttribute = gl.getAttribLocation(Sprite.shader.program, "vertexUV");
	gl.enableVertexAttribArray(Sprite.shader.program.vertexUVAttribute);

	//Texture
	Sprite.shader.program.textureSampler = gl.getUniformLocation(Sprite.shader.program, "texture");
	
	//Matrices
	Sprite.shader.program.viewMatrixUniform = gl.getUniformLocation(Sprite.shader.program, "view");
	Sprite.shader.program.projectionMatrixUniform = gl.getUniformLocation(Sprite.shader.program, "projection");
	Sprite.shader.program.modelMatrixUniform = gl.getUniformLocation(Sprite.shader.program, "model");
};

//Recreate data buffers (Should be called after structural changes)
Sprite.initializeBuffers = function()
{
	//Geometry
	var vertex = new Float32Array([-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0]);
	var uvs = new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
	var faces = new Uint16Array([0, 1, 2, 0, 2, 3]);

	//Vertex
	Sprite.vertexBuffer = gl.createBuffer();
	Sprite.vertexBuffer.itemSize = 3;
	Sprite.vertexBuffer.numItems = vertex.length/3;
	gl.bindBuffer(gl.ARRAY_BUFFER, Sprite.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);

	//Texture
	Sprite.UVBuffer = gl.createBuffer();
	Sprite.UVBuffer.itemSize = 2;
	Sprite.UVBuffer.numItems = uvs.length/2;
	gl.bindBuffer(gl.ARRAY_BUFFER, Sprite.UVBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

	//Faces
	Sprite.facesBuffer = gl.createBuffer();
	Sprite.facesBuffer.itemSize = 1;
	Sprite.facesBuffer.numItems = faces.length;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Sprite.facesBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);
};

//Attach texture image to this sprite
Sprite.prototype.setTexture = function(texture)
{
	this.texture = texture;
};
