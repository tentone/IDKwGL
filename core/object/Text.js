"use strict";

function Text(text, font)
{
	//Text 
	this.text = text;
	this.font = font;

	//Square single sided text data
	this.vertex = [];
	this.uvs = [];
	this.normals = [];
	this.faces = [];

	//Buffers
	this.normalBuffer = null;
	this.vertexBuffer = null;
	this.textureCoordBuffer = null;
	this.facesBuffer = null;

	//Texture
	this.texture = font.pageTexture[0];

	//Tranformations Control
	this.origin = new Vector3(0,0,0);
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Tranformation Matrix
	this.transformationMatrix = new Matrix(4,4);

	//Set text
	this.setText(text);

	var fragment = "precision mediump float;\
	\
	varying vec2 vTextureCoord;\
	varying vec3 vTransformedNormal;\
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
	attribute vec3 aVertexNormal;\
	attribute vec2 aTextureCoord;\
	\
	uniform mat4 uMVMatrix;\
	uniform mat4 uPMatrix;\
	uniform mat3 uNMatrix;\
	\
	varying vec2 vTextureCoord;\
	varying vec3 vTransformedNormal;\
	varying vec4 vPosition;\
	\
	void main(void)\
	{\
		vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\
		vTextureCoord = aTextureCoord;\
		vTransformedNormal = uNMatrix * aVertexNormal;\
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

	//Normals
	this.shader.program.vertexNormalAttribute = gl.getAttribLocation(this.shader.program, "aVertexNormal");
	gl.enableVertexAttribArray(this.shader.program.vertexNormalAttribute);

	//The sampler
	this.shader.program.samplerUniform = gl.getUniformLocation(this.shader.program, "uSampler");
	this.shader.program.pMatrixUniform = gl.getUniformLocation(this.shader.program, "uPMatrix");
	this.shader.program.mvMatrixUniform = gl.getUniformLocation(this.shader.program, "uMVMatrix");
	this.shader.program.nMatrixUniform = gl.getUniformLocation(this.shader.program, "uNMatrix");
}

//Set text
Text.prototype.setText = function(text)
{
	//Clear old data
	this.vertex = [];
	this.uvs = [];
	this.normals = [];
	this.faces = [];

	//Fill new vertex data
	for(var i = 0; i < text.length; i++)
	{
		this.vertex.push(0.0 + i);
		this.vertex.push(0.0);
		this.vertex.push(0.0);
		this.vertex.push(1.0 + i);
		this.vertex.push(0.0);
		this.vertex.push(0.0);
		this.vertex.push(1.0 + i);
		this.vertex.push(1.0);
		this.vertex.push(0.0);
		this.vertex.push(0.0 + i);
		this.vertex.push(1.0);
		this.vertex.push(0.0);

		var char = text.charCodeAt(i);
		var pos =  new Vector2(font.charPos[char].x, font.charPos[char].y);
		pos.sub(font.charOffset[char]);
		pos.y += font.lineHeight;
		pos.div(font.scale);
		
		pos.y =  font.scale.y - pos.y;

		var size = new Vector2(font.charSize[char].x, font.charSize[char].y);
		size.div(font.scale);

		//Add texture coords
		this.uvs.push(pos.x);
		this.uvs.push(pos.y);
		this.uvs.push(pos.x + size.x);
		this.uvs.push(pos.y);
		this.uvs.push(pos.x + size.x);
		this.uvs.push(pos.y + size.y);
		this.uvs.push(pos.x);
		this.uvs.push(pos.y + size.y);
		
		//Normal coords
		this.normals.push(0.0);
		this.normals.push(0.0);
		this.normals.push(-1.0);
		this.normals.push(0.0);
		this.normals.push(0.0);
		this.normals.push(-1.0);
		this.normals.push(0.0);
		this.normals.push(0.0);
		this.normals.push(-1.0);
		this.normals.push(0.0);
		this.normals.push(0.0);
		this.normals.push(-1.0);

		//Face order
		var off = i*4;
		this.faces.push(0 + off);
		this.faces.push(1 + off);
		this.faces.push(2 + off);
		this.faces.push(0 + off);
		this.faces.push(2 + off);
		this.faces.push(3 + off);
	}

	//Update buffers
	this.updateBuffers();
}

//Draw text to camera
Text.prototype.draw = function(camera, scene)
{
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
	//Clone Camera Global transformation Matrix and multiply
	var camTransformationMatrix = Matrix.mulTranspose(this.transformationMatrix, camera.transformationMatrix);

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

	//Normal Coords buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Faces buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);

	//Set texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(this.shader.program.samplerUniform, 0);

	//Drawing the triangles
	gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_SHORT, 0);

	gl.disable(gl.BLEND);
}

//Recalculate Tranformation Matrix (Should be called after changing position)
Text.prototype.updateMatrix = function()
{
	this.transformationMatrix = MatrixGenerator.scalingMatrix(this.scale.x, this.scale.y, this.scale.z);
	this.transformationMatrix.mul(MatrixGenerator.translation(-this.origin.x, -this.origin.y, -this.origin.z));
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    this.transformationMatrix.mul(MatrixGenerator.translation(this.position.x, this.position.y, this.position.z));
}

//Recreate data buffers
Text.prototype.updateBuffers = function()
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

    //Normals
	this.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
	this.normalBuffer.itemSize = 3;
	this.normalBuffer.numItems = this.normals.length/3;			

	//Vertex indices
    this.facesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
    this.facesBuffer.itemSize = 1;
    this.facesBuffer.numItems = this.faces.length;
}

//Creates a copy of this text (keeps same vertex, buffer and texture data pointers)
Text.prototype.clone = function()
{
	var text = new Text();

	text.text = this.text;
	text.font = this.font;

	text.texture = this.texture;

	text.position.set(this.position.x, this.position.y, this.position.z);
	text.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
	text.scale.set(this.scale.x, this.scale.y, this.scale.z);
	text.origin.set(this.origin.x, this.origin.y, this.origin.z);

	return text;
}
