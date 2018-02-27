"use strict";

function Text(text, font)
{
	Object3D.call(this);

	//Text 
	this.text = text;
	this.font = font;

	//Square single sided text data
	this.vertex = [];
	this.uvs = [];
	this.normals = [];
	this.faces = [];

	//GL Buffers
	this.normalBuffer = null;
	this.vertexBuffer = null;
	this.textureCoordBuffer = null;
	this.facesBuffer = null;

	//Texture
	this.texture = font.pageTexture[0];

	//Set text
	this.setText(text);

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
	this.shader = new Shader(fragment, vertex);

	//Vertex Coordinates 
	this.shader.program.vertexPositionAttribute = gl.getAttribLocation(this.shader.program, "vertexPosition");
	gl.enableVertexAttribArray(this.shader.program.vertexPositionAttribute);

	//Texture coordinates
	this.shader.program.vertexUVAttribute = gl.getAttribLocation(this.shader.program, "vertexUV");
	gl.enableVertexAttribArray(this.shader.program.vertexUVAttribute);

	//The sampler
	this.shader.program.textureSampler = gl.getUniformLocation(this.shader.program, "texture");
	this.shader.program.viewMatrixUniform = gl.getUniformLocation(this.shader.program, "view");
	this.shader.program.projectionMatrixUniform = gl.getUniformLocation(this.shader.program, "projection");
	this.shader.program.modelMatrixUniform = gl.getUniformLocation(this.shader.program, "model");
}

Text.prototype = Object.create(Object3D.prototype);

//Draw text to camera
Text.prototype.draw = function(camera, scene)
{
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
	gl.useProgram(this.shader.program);

	//Transformation matrices
	gl.uniformMatrix4fv(gl.getUniformLocation(this.shader.program, "projection"), false, camera.projectionMatrix.flatten());
	gl.uniformMatrix4fv(gl.getUniformLocation(this.shader.program, "view"), false, camera.transformationMatrix.flatten());
	gl.uniformMatrix4fv(gl.getUniformLocation(this.shader.program, "model"), false, this.transformationMatrix.flatten());

	//Vertex position
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Texture UV
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexUVAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Faces
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);

	//Set texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(this.shader.program.textureSampler, 0);
	
	//Draw the triangles
	gl.drawElements(gl.TRIANGLES, this.faces.length, gl.UNSIGNED_SHORT, 0);

	gl.disable(gl.BLEND);
};

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

	//Vertex indices
	this.facesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
	this.facesBuffer.itemSize = 1;
	this.facesBuffer.numItems = this.faces.length;
};

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
};
