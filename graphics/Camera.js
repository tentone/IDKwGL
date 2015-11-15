include("math/Matrix.js");
include("math/Conversion.js");

//Camera Projection Mode
Camera.ORTHOGONAL = 0;
Camera.PRESPECTIVE = 1;

//Constructor
function Camera(canvas, size_y, projection_type)
{
    //Camera Screen Interface
    this.aspect_ratio = canvas.width/canvas.height; //x/y
    this.screen_size = new Vector2(canvas.width, canvas.height);
    this.virtual_size = new Vector2(size_y*this.aspect_ratio, size_y);
    this.size_ratio = 1/this.virtual_size.y;

    //Camera Movement
	this.position = new Vector3(0,0,-1); //Position
    this.rotation = new Vector3(0,0,0); //View Angle
    this.zoom = 1.0; //Camera Zoom

    //Camera Projetion Matrix
    this.projectionType = projection_type;
    this.projectionMatrix = new Matrix(4,4);
    this.setProjection(projection_type);

    //Camera Transformation Matrix
    this.transformationMatrix = new Matrix(4,4);
}

//Function Prototypes
Camera.prototype.setProjection = setProjection;
Camera.prototype.startFrame = startFrame;
Camera.prototype.resize = resize;
Camera.prototype.toString = toString;

//Call before start a frame on this camera
function startFrame()
{
    // Clearing the frame-buffer and the depth-buffer
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Passing the Projection Matrix to apply the current projection
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uPMatrix"), false, this.projectionMatrix.flatten());

    // Create Camera Transformation Matrix
    this.transformationMatrix = MatrixGenerator.translation(-this.position.x, -this.position.y, this.position.z);
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    var zoom = this.zoom * this.size_ratio;
    this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(zoom, zoom, zoom));
}

function resize(x, y)
{
    //Set new Values
    this.aspect_ratio = x/y;
    this.screen_size = new Vector2(x, y);
    this.virtual_size = new Vector2(this.virtual_size.y*this.aspect_ratio, this.virtual_size.y);
    this.size_ratio = 1/this.virtual_size.y;

    //Calculate Projection Matrix
    this.setProjection(this.projectionType);
}

//Set Projection Mode for camera
function setProjection(value)
{
    if(value == 0) //Orthogonal
    {
        this.projectionType = 0;
    }
    else if(value == 1) //Prespective
    {
        this.projectionType = 1;
    }
    
    //Calculate Projection Matrix
    if(this.projectionType == 0)
    {
        this.projectionMatrix = Camera.orthogonalProjectionMatrix(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0, this.aspect_ratio);
    }
    else if(this.projectionType == 1)
    {
        this.projectionMatrix = Camera.perspectiveProjectionMatrix(60, this.aspect_ratio, 1, 1000);
    }
}  

function toString()
{
    return "Camera (ScreenSize:"+this.screen_size.toString()+" VirtualSize:"+this.virtual_size.toString()+" AspectRatio:"+this.aspect_ratio+")";
}

//Orthogonal Projection Matrix Generator (Angel / Shreiner) (arguments are the view box boundries)
Camera.orthogonalProjectionMatrix = function(left, right, bottom, top, near, far, aspect_ratio)
{
    if (left == right) { throw "ortho(): left and right are equal"; }
    if (bottom == top) { throw "ortho(): bottom and top are equal"; }
    if (near == far) { throw "ortho(): near and far are equal"; }

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

//Perpective Projection Matrix Generator (Angel / Shreiner)
//A standard view volume Viewer is at (0,0,0), ensure that the model is "inside" the view volume
Camera.perspectiveProjectionMatrix = function(fovy, aspect, near, far)
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
