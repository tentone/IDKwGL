// Global Variables
var gl = null;
var shaderProgram = null;

//Test Stuff
var model = [];
var camera;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	//Create WebGL context
	try
	{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	catch(e){}

	if(!gl)
	{
		alert("Failed to initialize WebGL (Check your browser)");
	}

	//Initialize Shaders
	shaderProgram = initShaders(gl);

	//Create Test Elements
	model[0] = new Model();
	model[0].loadOBJ(cube_model);
	model[0].position.set(0,0,0);

	model[1] = new Model();
	model[1].loadOBJ(cube_model);
	model[1].position.set(0,1,0);

	model[2] = new Model();
	model[2].loadOBJ(cube_model);
	model[2].position.set(0,2,0);

	model[3] = new Model();
	model[3].loadOBJ(cube_model);
	model[3].position.set(2,0,2);

	model[4] = new Model();
	model[4].loadOBJ(cube_model);
	model[4].position.set(-3,0,5);

	model[5] = new Model();
	model[5].loadOBJ(cube_model);
	model[5].position.set(0,0,-5);

	model[6] = new Model();
	model[6].loadOBJ(cube_model);
	model[6].position.set(0,-1,0);
	model[6].scale.set(20,1,20);

	camera = new PrespectiveCamera(canvas, 90, 1);
}

//Logic Update
Main.update = function()
{
	var angle = -Conversion.degreesToRadians(camera.rotation.y);

	//Camera Rotate Test
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		camera.position.z += 0.1 * Math.cos(angle);
		camera.position.x += 0.1 * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		camera.position.z -= 0.1 * Math.cos(angle);
		camera.position.x -= 0.1 * Math.sin(angle);
	}

	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		camera.position.z -= 0.1 * Math.cos(angle+MathUtils.PID2);
		camera.position.x -= 0.1 * Math.sin(angle+MathUtils.PID2);
	}
	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		camera.position.z += 0.1 * Math.cos(angle+MathUtils.PID2);
		camera.position.x += 0.1 * Math.sin(angle+MathUtils.PID2);
	}

	//Camera Keyboard Movement
	if(App.keyboard.isKeyPressed(Keyboard.Q))
	{
		camera.rotation.y += 3;
	}
	if(App.keyboard.isKeyPressed(Keyboard.E))
	{
		camera.rotation.y -= 3;
	}

	//Camera Mouse Movement
	if(App.mouse.buttonPressed(Mouse.LEFT))
	{
		/*camera.rotation.z -= App.mouse.pos_diff.y * Math.sin(angle);
		camera.rotation.x -= App.mouse.pos_diff.y * Math.cos(angle);*/
		camera.rotation.y -= 0.1 * App.mouse.pos_diff.x;
	}

	//Camera Move UP/DOWN
	if(App.keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		camera.position.y += 0.1
	}
	if(App.keyboard.isKeyPressed(Keyboard.CTRL))
	{
		camera.position.y -= 0.1
	}

	//Model Move Test
	if(App.keyboard.isKeyPressed(Keyboard.DOWN))
	{
		model[0].position.y -= 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.UP))
	{
		model[0].position.y += 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.LEFT))
	{
		model[0].position.x -= 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.RIGHT))
	{
		model[0].position.x += 0.1;
	}
}

//Draw Stuff
Main.draw = function()
{
    //Clearing the frame-buffer and the depth-buffer
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //Draw Stuff on camera
	camera.startFrame();

	for(i = 0; i < model.length; i++)
	{
		model[i].draw(camera);
	}
}

Main.resize = function(canvas)
{
	// Create the WebGL context
	try
	{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	catch(e){}

	if(!gl)
	{
		alert("Failed to initialize WebGL (Check your browser)");
	}

	shaderProgram = initShaders(gl);
	camera.resize(canvas.width, canvas.height);
}
