// Global Variables
var gl = null;
var shaderProgram = null;

//Test Stuff
var model = [];
var lights = [];
var spectator;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	//Create WebGL context
	try
	{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
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
	model[0].loadOBJ(cube);
	model[0].position.set(0,0,0);
	model[0].update();

	model[1] = new Model();
	model[1].loadOBJ(cube);
	model[1].position.set(0,1,0);
	model[1].update();

	model[2] = new Model();
	model[2].loadOBJ(cube);
	model[2].position.set(0,2,0);
	model[2].update();

	model[3] = new Model();
	model[3].loadOBJ(cube);
	model[3].position.set(2,0,2);
	model[3].update();

	model[4] = new Model();
	model[4].loadOBJ(cube);
	model[4].position.set(-3,0,5);
	model[4].update();

	model[5] = new Model();
	model[5].loadOBJ(cube);
	model[5].position.set(0,0,-5);
	model[5].update();

	model[6] = new Model();
	model[6].loadOBJ(cube);
	model[6].position.set(0,-1,0);
	model[6].scale.set(20,1,20);
	model[6].update();

	model[7] = new Model();
	model[7].loadOBJ(cessna);
	model[7].position.set(0,5,0);
	model[7].scale.set(0.3,0.3,0.3);
	model[7].update();
	
	spectator = new Spectator(canvas);
}

//Logic Update
Main.update = function()
{
	var angle = Conversion.degreesToRadians(spectator.rotation.x);

	//Camera Rotate Test
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		spectator.camera.position.z += 0.1 * Math.cos(angle);
		spectator.camera.position.x += 0.1 * Math.sin(angle);
	}
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		spectator.camera.position.z -= 0.1 * Math.cos(angle);
		spectator.camera.position.x -= 0.1 * Math.sin(angle);
	}

	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		spectator.camera.position.z -= 0.1 * Math.cos(angle+MathUtils.PID2);
		spectator.camera.position.x -= 0.1 * Math.sin(angle+MathUtils.PID2);
	}
	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		spectator.camera.position.z += 0.1 * Math.cos(angle+MathUtils.PID2);
		spectator.camera.position.x += 0.1 * Math.sin(angle+MathUtils.PID2);
	}

	//Camera Keyboard Movement
	if(App.keyboard.isKeyPressed(Keyboard.Q))
	{
		spectator.rotation.x -= 3;
	}
	if(App.keyboard.isKeyPressed(Keyboard.E))
	{
		spectator.rotation.x += 3;
	}

	//Camera Mouse Movement
	if(App.isMouseLocked())
	{
		spectator.rotation.x += 0.2 * App.mouse.pos_diff.x;
		spectator.rotation.y += 0.2 * App.mouse.pos_diff.y;
	}
	else if(App.mouse.buttonPressed(Mouse.LEFT))
	{
		spectator.rotation.x += 0.2 * App.mouse.pos_diff.x;
		spectator.rotation.y += 0.2 * App.mouse.pos_diff.y;
	}

	//Camera Move UP/DOWN
	if(App.keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		spectator.camera.position.y += 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.CTRL))
	{
		spectator.camera.position.y -= 0.1;
	}

	//Update Player Camera Position
	spectator.updatePosition();

	//Model Move Test
	var update = false;
	if(App.keyboard.isKeyPressed(Keyboard.DOWN))
	{
		model[0].position.y -= 0.1;
		update = true;
	}
	if(App.keyboard.isKeyPressed(Keyboard.UP))
	{
		model[0].position.y += 0.1;
		update = true;
	}
	if(App.keyboard.isKeyPressed(Keyboard.LEFT))
	{
		model[0].position.x -= 0.1;
		update = true;
	}
	if(App.keyboard.isKeyPressed(Keyboard.RIGHT))
	{
		model[0].position.x += 0.1;
		update = true;
	}

	if(update)
	{
		model[0].update();
	}
}

//Draw Stuff
Main.draw = function()
{
    //Clearing the frame-buffer and the depth-buffer
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    //Draw Stuff to Player Camera
	spectator.camera.startFrame();
	for(i = 0; i < model.length; i++)
	{
		model[i].draw(spectator.camera);
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
	spectator.camera.resize(canvas.width, canvas.height);
}
