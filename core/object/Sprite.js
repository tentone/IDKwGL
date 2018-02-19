"use strict";

function Sprite()
{
	//Square single sided sprite data
	this.vertex = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,  0.0];
	this.uvs = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
	this.faces = [0, 1, 2, 0, 2, 3]; //Face <vertex / texture / normal>

	//Auto Rotate Flags
	this.followCameraRotation = false;

	//Buffers
	this.normalBuffer = null;
	this.vertexBuffer = null;
	this.textureCoordBuffer = null;
	this.facesBuffer = null;

	//Texture
	this.texture = Texture.generateSolidColorTexture(gl, Color.RED);

	//Tranformations Control
	this.origin = new Vector3(0,0,0);
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Update sprite buffers
	this.updateBuffers();

	//Tranformation Matrix
	this.transformationMatrix = new Matrix(4,4);

	var fragment = "precision mediump float;\
	\
	varying vec2 vTextureCoord;\
	varying vec4 vPosition;\
	\
	uniform sampler2D uSampler;\
	\
	void main(void)\
	{\
		gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\
		\
		if(gl_FragColor.a < 0.3)\
		{\
			discard;\
		}\
	}";

	var vertex = "attribute vec3 aVertexPosition;\
	attribute vec2 aTextureCoord;\
	\
	uniform mat4 uMVMatrix;\
	uniform mat4 uPMatrix;\
	uniform mat3 uNMatrix;\
	\
	varying vec2 vTextureCoord;\
	varying vec4 vPosition;\
	\
	void main(void)\
	{\
		vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\
		vTextureCoord = aTextureCoord;\
		gl_Position = uPMatrix * vPosition;\
	}";
	//Shader
	this.shader = new Shader(fragment, vertex);

	//Vertex Coordinates
	this.shader.program.vertexPositionAttribute = gl.getAttribLocation(this.shader.program, "aVertexPosition");
	gl.enableVertexAttribArray(this.shader.program.vertexPositionAttribute);

	//Texture coordinates
	this.shader.program.textureCoordAttribute = gl.getAttribLocation(this.shader.program, "aTextureCoord");
	gl.enableVertexAttribArray(this.shader.program.textureCoordAttribute);

	//The sampler
	this.shader.program.samplerUniform = gl.getUniformLocation(this.shader.program, "uSampler");
	this.shader.program.pMatrixUniform = gl.getUniformLocation(this.shader.program, "uPMatrix");
	this.shader.program.mvMatrixUniform = gl.getUniformLocation(this.shader.program, "uMVMatrix");
	this.shader.program.nMatrixUniform = gl.getUniformLocation(this.shader.program, "uNMatrix");
}

//Draw sprite to camera
Sprite.prototype.draw = function(camera, scene)
{
	//gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	if(this.followCameraRotation && camera.type === Camera.PERSPECTIVE)
	{
		this.rotation.y = -camera.rotation.y;
		this.updateMatrix();
	}

	//Clone Camera Global transformation Matrix and multiply
	var camTransformationMatrix = Matrix.mul(this.transformationMatrix, camera.transformationMatrix).transpose();
	
	//Normal matrix
	var normalMatrix = MathUtils.matrix3Invert(camTransformationMatrix);

	gl.useProgram(this.shader.program);
	gl.uniformMatrix4fv(gl.getUniformLocation(this.shader.program, "uPMatrix"), false, camera.projectionMatrix.flatten());
	gl.uniformMatrix4fv(gl.getUniformLocation(this.shader.program, "uMVMatrix"), false, camTransformationMatrix.flatten());
	gl.uniformMatrix3fv(gl.getUniformLocation(this.shader.program, "uNMatrix"), false, normalMatrix.flatten());
	
	//Vertex buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Texture Coords buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.vertexAttribPointer(this.shader.program.textureCoordAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Faces buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);

	//Set texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(this.shader.program.samplerUniform, 0);
	
	//Drawing the triangles
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

	gl.disable(gl.BLEND);
};

//Recalculate Tranformation Matrix (Should be called after changing position)
Sprite.prototype.updateMatrix = function()
{
	this.transformationMatrix = MatrixGenerator.scalingMatrix(this.scale.x, this.scale.y, this.scale.z);
	this.transformationMatrix.mul(MatrixGenerator.translation(-this.origin.x, -this.origin.y, -this.origin.z));
	this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
	this.transformationMatrix.mul(MatrixGenerator.translation(this.position.x, this.position.y, this.position.z));
};

//Recreate data buffers (Should be called after structural changes)
Sprite.prototype.updateBuffers = function()
{
	//Vertex
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = this.vertex.length/3;						

	//Texture
	this.textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
	this.textureCoordBuffer.itemSize = 2;
	this.textureCoordBuffer.numItems = this.uvs.length/2;

	//Vertex indices
	this.facesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
	this.facesBuffer.itemSize = 1;
	this.facesBuffer.numItems = this.faces.length;
};

//Creates a copy of this sprite (keeps same vertex, buffer and texture data pointers)
Sprite.prototype.clone = function()
{
	var sprite = new Sprite();

	sprite.texture = this.texture;
	sprite.followCameraRotation = this.followCameraRotation;
	sprite.position.set(this.position.x, this.position.y, this.position.z);
	sprite.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
	sprite.scale.set(this.scale.x, this.scale.y, this.scale.z);
	sprite.origin.set(this.origin.x, this.origin.y, this.origin.z);

	return sprite;
};

//Set sprite size with absolute values
Sprite.prototype.setSize = function(x, y)
{
	this.scale.set(x, y, 1);
};

//Attach texture image to this sprite
Sprite.prototype.setTexture = function(texture)
{
	this.texture = texture;
};
