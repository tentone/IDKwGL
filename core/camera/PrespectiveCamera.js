"use strict";

//Prespective camera constructor from canvas fov and zoom values
function PrespectiveCamera(canvas, fov, zoom)
{
	//Camera type
	this.type = Camera.PRESPECTIVE;

	//Camera Screen Interface
	this.aspectRatio = canvas.width/canvas.height; //x/y
	this.screenSize = new Vector2(canvas.width, canvas.height);

	//Camera Movement
	this.position = new Vector3(0,0,0); //Position
	this.rotation = new Vector3(0,0,0); //Rotation in degrees
	this.direction = new Vector3(0,0,1); //Ddirection unitary vector
	this.ori = new Vector3(0,0,0); //Origin

	//Camera Properties
	this.zoom = zoom;
	this.fov = fov;
	this.updateProjectionMatrix();

	//Camera Transformation Matrix
	this.transformationMatrix = new Matrix(4,4);
	this.shader = null;
}

//Set camera rotation
PrespectiveCamera.prototype.setRotation = function(horizontalRotation, verticalRotation)
{
	//Calculate Direction Vector
	var angleHorizontal = Conversion.degreesToRadians(-horizontalRotation);
	var angleVertical = Conversion.degreesToRadians(-verticalRotation);
	var cosAngleVertical = Math.cos(angleVertical);
	this.direction = new Vector3(Math.sin(angleHorizontal)*cosAngleVertical, Math.sin(angleVertical), Math.cos(angleHorizontal)*cosAngleVertical);

	//Set camera rotation
	this.rotation.y = horizontalRotation;
}

//Call before start a frame on this camera
PrespectiveCamera.prototype.startFrame = function()
{
	//Calculate Camera Transformation Matrix
	this.transformationMatrix = MatrixGenerator.translation(-this.position.x, -this.position.y, -this.position.z);
	this.transformationMatrix.mul(MatrixGenerator.directionMatrix(this.direction));
	this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(this.zoom, this.zoom, this.zoom));
}

//Change Camera Field of View
PrespectiveCamera.prototype.setFov = function(fov)
{
	this.fov = fov;
	this.updateProjectionMatrix();
}

//Call every time the canvas is resized
PrespectiveCamera.prototype.resize = function(x, y)
{
	//Set new Values
	this.aspectRatio = x / y;
	this.screenSize.set(x, y);
	this.updateProjectionMatrix();
}

//Calculate Camera Projection Matrix
PrespectiveCamera.prototype.updateProjectionMatrix = function()
{
	this.projectionMatrix = PrespectiveCamera.perspectiveProjectionMatrix(this.fov, this.aspectRatio, 0.1, 3000);
}

//Create Info String
PrespectiveCamera.prototype.toString = function()
{
	return "PrespectiveCamera\nPosition:"+this.position.toString()+"\nRotation:"+this.rotation.toString()+"\nFOV:"+this.fov+"\nScreenSize:"+this.screenSize.toString()+"\nAspectRatio:"+this.aspectRatio;
}

//Prespective Projection Matrix
PrespectiveCamera.perspectiveProjectionMatrix = function(fov, aspect, near, far)
{
	var depth = far - near;
	var depthInvert = 1 / depth;
	var result = new Matrix(4,4);

	result.matrix[1][1] = 1 / Math.tan(0.5 * Conversion.degreesToRadians(fov));
	result.matrix[0][0] = -1 * result.matrix[1][1] / aspect*1.2;
	result.matrix[2][2] = far * depthInvert;
	result.matrix[3][2] = (-far * near) * depthInvert;
	result.matrix[2][3] = 1;
	result.matrix[3][3] = 0;

	return result;
}