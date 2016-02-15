function Text(text, font)
{
	//Text 
	this.text = text;
	this.font = font;

	//Square single sided text data
	this.vertex = [];
	this.texture_coords = [];
	this.normals = [];
	this.faces = [];

	//Buffers
	this.normalBuffer = null;
	this.vertexBuffer = null;
	this.textureCoordBuffer = null;
	this.facesBuffer = null;

	//Texture
	this.texture = font.page_texture[0];

	//Tranformations Control
	this.origin = new Vector3(0,0,0);
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Tranformation Matrix
	this.transformationMatrix = new Matrix(4,4);

	//Set text
	this.setText(text);
}

//Function Prototypes
Text.prototype.setText = setText;
Text.prototype.draw = draw;
Text.prototype.update = update;
Text.prototype.clone = clone;
Text.prototype.updateBuffers = updateBuffers;

//Set text
function setText(text)
{
	//Clear old data
	this.vertex = [];
	this.texture_coords = [];
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
		var pos = new Vector2((font.char_pos[char].x+font.char_offset[char].x)/font.scale.x, (font.char_pos[char].y+font.char_offset[char].y)/font.scale.y);
		var size = new Vector2(font.char_size[char].x/font.scale.x, font.char_size[char].y/font.scale.y);

		//Add texture coords
		this.texture_coords.push(pos.x);
		this.texture_coords.push(pos.y);
		this.texture_coords.push(pos.x + size.x);
		this.texture_coords.push(pos.y);
		this.texture_coords.push(pos.x + size.x);
		this.texture_coords.push(pos.y + size.y);
		this.texture_coords.push(pos.x);
		this.texture_coords.push(pos.y + size.y);
		
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
function draw(camera, light)
{
	//Clone Camera Global transformation Matrix and multiply
	var camTransformationMatrix = Matrix.mulTranspose(this.transformationMatrix, camera.transformationMatrix);

	//Normal matrix
	var normalMatrix = MathUtils.matrix3Invert(camTransformationMatrix);

	// Passing the text View Matrix to apply the current transformation
	gl.uniformMatrix4fv(gl.getUniformLocation(camera.shader, "uMVMatrix"), false, camTransformationMatrix.flatten());
	gl.uniformMatrix3fv(gl.getUniformLocation(camera.shader, "uNMatrix"), false, normalMatrix.flatten());

	//Vertex buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(camera.shader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Texture Coords buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.vertexAttribPointer(camera.shader.textureCoordAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Normal Coords buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(camera.shader.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Faces buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);

	//Set texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(camera.shader.samplerUniform, 0);

	//Drawing the triangles
	gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_SHORT, 0);
}

//Recalculate Tranformation Matrix (Should be called after changing position)
function update()
{
	this.transformationMatrix = MatrixGenerator.scalingMatrix(this.scale.x, this.scale.y, this.scale.z);
	this.transformationMatrix.mul(MatrixGenerator.translation(-this.origin.x, -this.origin.y, -this.origin.z));
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    this.transformationMatrix.mul(MatrixGenerator.translation(this.position.x, this.position.y, this.position.z));
}

//Recreate data buffers
function updateBuffers()
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
 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coords), gl.STATIC_DRAW);
    this.textureCoordBuffer.itemSize = 2;
    this.textureCoordBuffer.numItems = this.texture_coords.length/2;

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
function clone()
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
