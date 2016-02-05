function Sprite()
{
	//Square single sided sprite data
	this.vertex = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,  0.0];
	this.texture_coords = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
	this.normals = [0.0,  0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0];
	this.faces = [0, 1, 2, 0, 2, 3]; //Face <vertex / texture / normal>

	//Auto Rotate Flags
	this.follow_camera_horizontal = false;
	this.follow_camera_vertical = false;

	//Buffers
	this.normalBuffer = null;
	this.vertexBuffer = null;
	this.textureCoordBuffer = null;
	this.facesBuffer = null;

	//Texture
	this.texture = Texture.generateSolidColorTexture(Color.RED);

	//Tranformations Control
	this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);
	this.scale = new Vector3(1,1,1);

	//Update sprite buffers
	this.updateBuffers();

	//Tranformation Matrix
	this.transformationMatrix = new Matrix(4,4);
}

//Function Prototypes
Sprite.prototype.draw = draw;
Sprite.prototype.update = update;
Sprite.prototype.setTexture = setTexture;
Sprite.prototype.setSize = setSize;
Sprite.prototype.clone = clone;
Sprite.prototype.updateBuffers = updateBuffers;

//Draw sprite to camera
function draw(camera, light)
{
	if(this.follow_camera_vertical)
	{
		this.rotation.y = -camera.rotation.y;
		this.update();
	}
	
    //Clone Camera Global transformation Matrix and multiply
    var camTransformationMatrix = Matrix.mul(this.transformationMatrix, camera.transformationMatrix);
	camTransformationMatrix.transpose();
	
	//Normal matrix
	var normalMatrix = MathUtils.matrix3Invert(camTransformationMatrix);

	// Passing the sprite View Matrix to apply the current transformation
	gl.uniformMatrix4fv(gl.getUniformLocation(camera.shader, "uMVMatrix"), false, camTransformationMatrix.flatten());
	gl.uniformMatrix3fv(gl.getUniformLocation(camera.shader, "uNMatrix"), false, normalMatrix.flatten());
	
	//Light render
	if(light == null || light === undefined)
	{
		gl.uniform1i(camera.shader.useLightingUniform, false);
	}
	else
	{
		//Light position
		gl.uniform3f(camera.shader.pointLightingLocationUniform, light.position.x, light.position.y, light.position.z);

		//Light options
		gl.uniform1i(camera.shader.useLightingUniform, light.enabled);
		gl.uniform3f(camera.shader.ambientColorUniform, light.ambient.r, light.ambient.g, light.ambient.b);
		gl.uniform3f(camera.shader.pointLightingColorUniform, light.color.r, light.color.g, light.color.b);
	}

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
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

//Recalculate Tranformation Matrix (Should be called after changing position)
function update()
{
	this.transformationMatrix = MatrixGenerator.scalingMatrix(this.scale.x, this.scale.y, this.scale.z);
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    this.transformationMatrix.mul(MatrixGenerator.translation(this.position.x, this.position.y, this.position.z));
}

//Recreate data buffers (Should be called after structural changes)
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

//Creates a copy of this sprite (keeps same vertex, buffer and texture data pointers)
function clone()
{
	var sprite = new Sprite();

	sprite.vertex = this.vertex;
	sprite.texture_coords = this.texture_coords;
	sprite.normals = this.normals;
	sprite.faces = this.faces;

	sprite.textureCoordBuffer = this.textureCoordBuffer;
	sprite.normalBuffer = this.normalBuffer;
	sprite.vertexBuffer = this.vertexBuffer;
	sprite.facesBuffer = this.facesBuffer;

	sprite.texture = this.texture;

	sprite.follow_camera_vertical = this.follow_camera_vertical;
	sprite.follow_camera_horizontal = this.follow_camera_horizontal;

	sprite.position.set(this.position.x, this.position.y, this.position.z);
	sprite.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
	sprite.scale.set(this.scale.x, this.scale.y, this.scale.z);

	return sprite;
}

//Set sprite size with absolute values
function setSize(x, y)
{
	this.scale.set(x, y, 1);
}

//Attach texture image to this sprite
function setTexture(texture)
{
	this.texture = texture;
}
