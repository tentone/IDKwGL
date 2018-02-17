"use strict";

//Constructor from y size or x and y size and canvas
function OrthographicCamera(canvas, height, width)
{
	//Set camera type
	this.type = Camera.ORTHOGRAPHIC;

	//Collect size arguments
	if(width === undefined)
	{
		if(height === undefined)
		{
			this.aspectRatio = 1;
			this.screenSize = new Vector2(1, 1);
			this.size = new Vector2(1, 1);
		}
		else
		{
			this.aspectRatio = canvas.width/canvas.height; //x/y
			this.screenSize = new Vector2(canvas.width, canvas.height);
			this.size = new Vector2(height*this.aspectRatio, height);
		}
	}
	else
	{
		this.aspectRatio = width/height; //x/y
		this.screenSize = new Vector2(width, height);
		this.size = new Vector2(width, height);
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
	var program = shader.get();
	gl.useProgram(program);
	gl.uniformMatrix4fv(gl.getUniformLocation(program, "uPMatrix"), false, this.projectionMatrix.flatten());
}

//Call every time the canvas is resized
OrthographicCamera.prototype.resize = function(x, y)
{
	this.aspectRatio = x / y;
	this.screenSize.set(x, y);
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