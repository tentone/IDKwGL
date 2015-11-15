include("math/Matrix.js");
include("math/Conversion.js");

//Constructor
function PrespectiveCamera(canvas, size_y, fov, zoom)
{
    //Camera Screen Interface
    this.aspect_ratio = canvas.width/canvas.height; //x/y
    this.screen_size = new Vector2(canvas.width, canvas.height);
    this.virtual_size = new Vector2(size_y*this.aspect_ratio, size_y);
    this.size_ratio = 1/this.virtual_size.y;

    //Camera Movement
	this.position = new Vector3(0,0,-1); //Position
    this.rotation = new Vector3(0,0,0); //View Angle
    this.zoom = zoom; //Camera Zoom

    //Camera Projetion Matrix
    this.fov = fov;
    this.projectionMatrix = PrespectiveCamera.perspectiveProjectionMatrix(this.fov, this.aspect_ratio, 1, 1000);

    //Camera Transformation Matrix
    this.transformationMatrix = new Matrix(4,4);
}

//Function Prototypes
PrespectiveCamera.prototype.startFrame = startFrame;
PrespectiveCamera.prototype.resize = resize;
PrespectiveCamera.prototype.toString = toString;
PrespectiveCamera.prototype.setFov = setFov;

//Call before start a frame on this camera
function startFrame()
{
    // Passing the Projection Matrix to apply the current projection
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uPMatrix"), false, this.projectionMatrix.flatten());

    // Create Camera Transformation Matrix
    this.transformationMatrix = MatrixGenerator.translation(-this.position.x, -this.position.y, this.position.z);
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    var zoom = this.zoom * this.size_ratio;
    this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(zoom, zoom, zoom));
}

//Change Camera Field of View
function setFov(fov)
{
    this.fov = fov;
    this.projectionMatrix = PrespectiveCamera.perspectiveProjectionMatrix(this.fov, this.aspect_ratio, 1, 1000);
}

//Call every time the canvas is resized
function resize(x, y)
{
    //Set new Values
    this.aspect_ratio = x/y;
    this.screen_size = new Vector2(x, y);
    this.virtual_size = new Vector2(this.virtual_size.y*this.aspect_ratio, this.virtual_size.y);
    this.size_ratio = 1/this.virtual_size.y;

    //Calculate Projection Matrix
    this.projectionMatrix = PrespectiveCamera.perspectiveProjectionMatrix(this.fov, this.aspect_ratio, 1, 1000);
}

//Create Info String
function toString()
{
    return "PrespectiveCamera (FOV:"+this.fov+" ScreenSize:"+this.screen_size.toString()+" VirtualSize:"+this.virtual_size.toString()+" AspectRatio:"+this.aspect_ratio+")";
}

//Perpective Projection Matrix Generator (Angel / Shreiner)
PrespectiveCamera.perspectiveProjectionMatrix = function(fovy, aspect, near, far)
{
    var f = 1.0 / Math.tan(Conversion.degreesToRadians(fovy)/2);
    var d = far - near;
    var result = new Matrix(4,4);

    result.matrix[0][0] = f / aspect;
    result.matrix[1][1] = f;
    result.matrix[2][2] = -(near + far) / d;
    result.matrix[2][3] = -2 * near * far / d;
    result.matrix[3][2] = -1;
    result.matrix[3][3] = 0.0;

    return result;
}
