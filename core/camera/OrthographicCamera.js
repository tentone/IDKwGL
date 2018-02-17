//Constructor from y size or x and y size and canvas
function OrthographicCamera(canvas, size_y, size_x)
{
	//Set camera type
	this.type = Camera.ORTHOGRAPHIC;

	//Collect size arguments
	if(size_x === undefined)
	{
		if(size_y === undefined)
		{
			this.aspectRatio = 1;
			this.screenSize = new Vector2(1, 1);
			this.size = new Vector2(1, 1);
		}
		else
		{
			this.aspectRatio = canvas.width/canvas.height; //x/y
			this.screenSize = new Vector2(canvas.width, canvas.height);
			this.size = new Vector2(size_y*this.aspectRatio, size_y);
		}
	}
	else
	{
		this.aspectRatio = size_x/size_y; //x/y
		this.screenSize = new Vector2(size_x, size_y);
		this.size = new Vector2(size_x, size_y);
	}

	//Camera Movement
	this.position = new Vector3(0,0,0); //Position
	this.rotation = 0; //Camera Rotation
	this.zoom = 1.0; //Camera Zoom

	//Camera Projetion Matrix
	this.projectionMatrix = OrthographicCamera.orthogonalProjectionMatrix(-this.size.x, this.size.x, -this.size.y, this.size.y, -this.size.y, this.size.y);

	//Camera Transformation Matrix
	this.transformationMatrix = new Matrix(4,4);
}

//Call before start a frame on this camera
OrthographicCamera.prototype.startFrame = function()
{
	//Calculate Camera Transformation Matrix
	this.transformationMatrix = MatrixGenerator.translation(this.position.x, this.position.y, this.position.z);
	this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(0, 0, this.rotation));
}

//Set shader to be used by camera
OrthographicCamera.prototype.useShader = function(shader)
{
	this.shader = shader.get();
	gl.useProgram(this.shader);
	gl.uniformMatrix4fv(gl.getUniformLocation(this.shader, "uPMatrix"), false, this.projectionMatrix.flatten());
}

//Call every time the canvas is resized
OrthographicCamera.prototype.resize = function(x, y)
{
	//Set new Values
	this.aspectRatio = x/y;
	this.screenSize = new Vector2(x, y);
	this.size = new Vector2(this.size.y*this.aspectRatio, this.size.y);

	//Calculate Projection Matrix
	this.projectionMatrix = OrthographicCamera.orthogonalProjectionMatrix(-this.size.x, this.size.x, -this.size.y, this.size.y, -this.size.y, this.size.y);
}

//Set custom projection matrix to camera
OrthographicCamera.prototype.setProjectionMatrix = function(matrix)
{
	this.projectionMatrix = matrix;
}

//Create string with camera info
OrthographicCamera.prototype.toString = function()
{
	return "OrthographicCamera (ScreenSize:"+this.screenSize.toString()+" VirtualSize:"+this.size.toString()+" AspectRatio:"+this.aspectRatio+")";
}

//Orthogonal Projection Matrix Generator (Angel / Shreiner)
OrthographicCamera.orthogonalProjectionMatrix = function(left, right, bottom, top, near, far)
{
	var w = right - left;
	var h = top - bottom;
	var d = far - near;

	var result = new Matrix(4,4);
	result.matrix[0][0] = 2.0 / w;
	result.matrix[1][1] = 2.0 / h;
	result.matrix[2][2] = -2.0 / d;
	result.matrix[0][3] = -(left + right) / w;
	result.matrix[1][3] = -(top + bottom) / h;
	result.matrix[2][3] = -(near + far) / d;

	return result;
}