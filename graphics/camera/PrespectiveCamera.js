//Prespective camera constructor from canvas fov and zoom values
function PrespectiveCamera(canvas, fov, zoom)
{
    //Camera Screen Interface
    this.aspect_ratio = canvas.width/canvas.height; //x/y
    this.screen_size = new Vector2(canvas.width, canvas.height);

    //Camera Movement
	this.position = new Vector3(0,0,0); //Position
    this.rotation = new Vector3(0,0,0); //Camera Rotation in degrees
    this.direction = new Vector3(0,0,0); //Camera direction unitary vector
    this.ori = new Vector3(0,0,0); //Origin
    this.zoom = zoom; //Camera Zoom

    //Camera Properties
    this.fov = fov;
    this.updateProjectionMatrix();

    //Camera Transformation Matrix
    this.transformationMatrix = new Matrix(4,4);
    this.shader = null;
}

//Function Prototypes
PrespectiveCamera.prototype.setRotation = setRotation;
PrespectiveCamera.prototype.startFrame = startFrame;
PrespectiveCamera.prototype.useShader = useShader;
PrespectiveCamera.prototype.resize = resize;
PrespectiveCamera.prototype.toString = toString;
PrespectiveCamera.prototype.setFov = setFov;
PrespectiveCamera.prototype.updateProjectionMatrix = updateProjectionMatrix;

//Set camera rotation
function setRotation(horizontal_rotation, vertical_rotation)
{
    var angle_horizontal = Conversion.degreesToRadians(-horizontal_rotation);
    var angle_vertical = Conversion.degreesToRadians(-vertical_rotation);
    var cos_angle_vertical = Math.cos(angle_vertical);
    this.direction = new Vector3(Math.sin(angle_horizontal)*cos_angle_vertical, Math.sin(angle_vertical), Math.cos(angle_horizontal)*cos_angle_vertical);

    this.rotation.y = horizontal_rotation;
    this.rotation.x = -vertical_rotation * Math.cos(Conversion.degreesToRadians(horizontal_rotation%90));
    this.rotation.z = -vertical_rotation * Math.sin(Conversion.degreesToRadians(horizontal_rotation));
}

//Call before start a frame on this camera
function startFrame()
{
    //Calculate Camera Transformation Matrix
    this.transformationMatrix = MatrixGenerator.translation(-this.position.x, -this.position.y, -this.position.z);
    this.transformationMatrix.mul(MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z));
    this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(this.zoom, this.zoom, this.zoom));
}

//Set shader to be used by camera
function useShader(shader)
{
    this.shader = shader.get();
    gl.useProgram(shader.get());
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shader, "uPMatrix"), false, this.projectionMatrix.flatten());
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
    this.projectionMatrix = PrespectiveCamera.perspectiveProjectionMatrix(this.fov, this.aspect_ratio, 0.1, 3000);
}

//Create Info String
function toString()
{
    return "PrespectiveCamera\nPosition:"+this.position.toString()+"\nRotation:"+this.rotation.toString()+"\nFOV:"+this.fov+"\nScreenSize:"+this.screen_size.toString()+"\nAspectRatio:"+this.aspect_ratio;
}

//Prespective Projection Matrix (Mine V2)
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