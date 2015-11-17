//Constructor
function PrespectiveCamera(canvas, fov, zoom)
{
    //Camera Screen Interface
    this.aspect_ratio = canvas.width/canvas.height; //x/y
    this.screen_size = new Vector2(canvas.width, canvas.height);

    //Camera Movement
	this.position = new Vector3(0,0,0); //Position
    this.rotation = new Vector3(0,0,0); //View Angle
    this.zoom = zoom; //Camera Zoom

    //Camera Projetion Matrix
    this.fov = fov;
    this.updateProjectionMatrix();

    //Camera Transformation Matrix
    this.transformationMatrix = new Matrix(4,4);
}

//Function Prototypes
PrespectiveCamera.prototype.startFrame = startFrame;
PrespectiveCamera.prototype.resize = resize;
PrespectiveCamera.prototype.toString = toString;
PrespectiveCamera.prototype.setFov = setFov;
PrespectiveCamera.prototype.updateProjectionMatrix = updateProjectionMatrix;

//Call before start a frame on this camera
function startFrame()
{
    //Passing the Projection Matrix to apply the current projection
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uPMatrix"), false, this.projectionMatrix.flatten());

    //Calculate Camera Transformation Matrix
    this.transformationMatrix = MatrixGenerator.translation(this.position.x, -this.position.y, -this.position.z);
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(this.zoom, this.zoom, this.zoom));
}

//Change Camera Field of View
function setFov(fov)
{
    this.fov = fov;
    this.updateProjectionMatrix();
}

//Call every time the canvas is resized
function resize(x, y)
{
    //Set new Values
    this.aspect_ratio = x/y;
    this.screen_size = new Vector2(x, y);
    this.updateProjectionMatrix();
}

//Calculate Camera Projection Matrix
function updateProjectionMatrix()
{
    this.projectionMatrix = PrespectiveCamera.perspectiveProjectionMatrix(this.fov, this.aspect_ratio, 0.1, 500);
}

//Create Info String
function toString()
{
    return "PrespectiveCamera (Position:"+this.position.toString()+" Rotation:"+this.rotation.toString()+" FOV:"+this.fov+" ScreenSize:"+this.screen_size.toString()+" AspectRatio:"+this.aspect_ratio+")";
}

//Perpective Projection Matrix Generator (Angel / Shreiner)
PrespectiveCamera.perspectiveProjectionMatrixAS = function(fovy, aspect, near, far)
{
    var f = 1 / Math.tan(0.5 * Conversion.degreesToRadians(fovy));
    var d = far - near;
    var result = new Matrix(4,4);

    result.matrix[0][0] = f / aspect;
    result.matrix[1][1] = f;
    result.matrix[2][2] = -(near + far) / d;
    result.matrix[2][3] = -2 * near * far / d;
    result.matrix[3][2] = -1;
    result.matrix[3][3] = 0;

    return result;
}

//Prespective Projection Matrix (Mine)
PrespectiveCamera.perspectiveProjectionMatrix = function(fov, aspect, near, far)
{
    var depth = far - near;
    var depth_invert = 1 / depth;
    var result = new Matrix(4,4);

    result.matrix[1][1] = 1 / Math.tan(0.5 * Conversion.degreesToRadians(fov));
    result.matrix[0][0] = -1 * result.matrix[1][1] / aspect*1.2;
    result.matrix[2][2] = far * depth_invert;
    result.matrix[3][2] = (-far * near) * depth_invert;
    result.matrix[2][3] = 1;
    result.matrix[3][3] = 0;

    return result;
}