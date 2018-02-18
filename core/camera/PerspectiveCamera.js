"use strict";

//Prespective camera constructor from canvas fov and zoom values
function PerspectiveCamera(canvas, fov, zoom)
{
	//Camera type
	this.type = Camera.PERSPECTIVE;

	//Camera Screen Interface
	this.aspectRatio = canvas.width/canvas.height; //x/y
	this.screenSize = new Vector2(canvas.width, canvas.height);

	//Camera Movement
	this.position = new Vector3(0,0,0); //Position
	this.rotation = new Vector3(0,0,0); //Rotation in degrees
	this.direction = new Vector3(0,0,1); //Direction unitary vector
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
PerspectiveCamera.prototype.setRotation = function(horizontalRotation, verticalRotation)
{
	//Calculate Direction Vector
	var angleHorizontal = Conversion.degreesToRadians(-horizontalRotation);
	var angleVertical = Conversion.degreesToRadians(-verticalRotation);
	var cosAngleVertical = Math.cos(angleVertical);
	this.direction = new Vector3(Math.sin(angleHorizontal)*cosAngleVertical, Math.sin(angleVertical), Math.cos(angleHorizontal)*cosAngleVertical);

	//Set camera rotation
	this.rotation.y = horizontalRotation;
}

//Calculate Camera Transformation Matrix
PerspectiveCamera.prototype.updateMatrix = function()
{
	this.transformationMatrix = MatrixGenerator.translation(this.position.x, this.position.y, this.position.z);
	this.transformationMatrix.mul(MatrixGenerator.directionMatrix(this.direction));
	this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(this.zoom, this.zoom, this.zoom));
}

//Calculate Camera Projection Matrix
PerspectiveCamera.prototype.updateProjectionMatrix = function()
{
	this.projectionMatrix = PerspectiveCamera.perspectiveProjectionMatrix(this.fov, this.aspectRatio, 0.1, 200);
}

//Change Camera Field of View
PerspectiveCamera.prototype.setFov = function(fov)
{
	this.fov = fov;
	this.updateProjectionMatrix();
}

//Call every time the canvas is resized
PerspectiveCamera.prototype.resize = function(x, y)
{
	this.aspectRatio = x / y;
	this.screenSize.set(x, y);
	this.updateProjectionMatrix();
}

//Create Info String
PerspectiveCamera.prototype.toString = function()
{
	return "PerspectiveCamera\nPosition:"+this.position.toString()+"\nRotation:"+this.rotation.toString()+"\nFOV:"+this.fov+"\nScreenSize:"+this.screenSize.toString()+"\nAspectRatio:"+this.aspectRatio;
}

//Prespective Projection Matrix
PerspectiveCamera.perspectiveProjectionMatrix = function(fov, aspect, near, far)
{
	var result = new Matrix(4,4);

	var depth = far - near;
	var scale = 1 / Math.tan(Conversion.degreesToRadians(fov)/2);

	result.matrix[0][0] = scale;
	result.matrix[1][1] = scale;
	result.matrix[2][2] = -far/depth;
	result.matrix[2][3] = -1;
	result.matrix[3][2] = -(far * near) / depth;
	result.matrix[3][3] = 0;

	return result;
}