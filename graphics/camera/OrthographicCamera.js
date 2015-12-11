//Constructor from y size and canvas
function OrthographicCamera(canvas, size_y)
{
    //Camera Screen Interface
    this.aspect_ratio = canvas.width/canvas.height; //x/y
    this.screen_size = new Vector2(canvas.width, canvas.height);

    //Camera Specs
    this.size = new Vector2(size_y*this.aspect_ratio, size_y);

    //Camera Movement
	this.position = new Vector3(0,0,0); //Position
    this.rotation = new Vector3(0,0,0); //View Angle
    this.zoom = 1.0; //Camera Zoom

    //Camera Projetion Matrix
    this.projectionMatrix = OrthographicCamera.orthogonalProjectionMatrix(-this.size.x, this.size.x, -this.size.y, this.size.y, -this.size.y, this.size.y);

    //Camera Transformation Matrix
    this.transformationMatrix = new Matrix(4,4);
    this.shader = null;
}

//Function Prototypes
OrthographicCamera.prototype.useShader = useShader;
OrthographicCamera.prototype.startFrame = startFrame;
OrthographicCamera.prototype.resize = resize;
OrthographicCamera.prototype.toString = toString;

//Call before start a frame on this camera
function startFrame()
{
    //Calculate Camera Transformation Matrix
    this.transformationMatrix = MatrixGenerator.translation(this.position.x, this.position.y, this.position.z);
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
}

//Set shader to be used by camera
function useShader(shader)
{
    this.shader = shader.get();
    gl.useProgram(shader.get());
    gl.uniformMatrix4fv(gl.getUniformLocation(shader.get(), "uPMatrix"), false, this.projectionMatrix.flatten());
}

//Call every time the canvas is resized
function resize(x, y)
{
    //Set new Values
    this.aspect_ratio = x/y;
    this.screen_size = new Vector2(x, y);
    this.size = new Vector2(this.size.y*this.aspect_ratio, this.size.y);

    //Calculate Projection Matrix
    this.projectionMatrix = OrthographicCamera.orthogonalProjectionMatrix(-this.size.x, this.size.x, -this.size.y, this.size.y, -this.size.y, this.size.y);
}

//Create string with camera info
function toString()
{
    return "OrthographicCamera (ScreenSize:"+this.screen_size.toString()+" VirtualSize:"+this.size.toString()+" AspectRatio:"+this.aspect_ratio+")";
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