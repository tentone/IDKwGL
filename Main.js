//Test Stuff
var model;
var scene;
var spectator;

//Shader an GL Pointers
var gl = null;
var shaderProgram = null;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	//Create WebGL context
	try
	{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	catch(e){}

	if(!gl)
	{
		alert("Failed to initialize WebGL (Check your browser)");
	}

	//Initialize Shaders
	shaderProgram = initShaders(gl);

	//Create Scene
	scene = new Scene();

	//Create Test Elements
	model = new Model();
	model.loadOBJ(cube);
	model.position.set(0,0,0);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(cube);
	model.position.set(0,1,0);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(cube);
	model.position.set(0,2,0);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(cube);
	model.position.set(2,0,2);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(cube);
	model.position.set(-3,0,5);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(cube);
	model.position.set(0,0,-5);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(cube);
	model.position.set(0,-1,0);
	model.scale.set(20,1,20);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(cessna);
	model.position.set(0,5,0);
	model.scale.set(0.3,0.3,0.3);
	model.update();
	scene.addModel(model);

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
		model.position.y -= 0.1;
		update = true;
	}
	if(App.keyboard.isKeyPressed(Keyboard.UP))
	{
		model.position.y += 0.1;
		update = true;
	}
	if(App.keyboard.isKeyPressed(Keyboard.LEFT))
	{
		model.position.x -= 0.1;
		update = true;
	}
	if(App.keyboard.isKeyPressed(Keyboard.RIGHT))
	{
		model.position.x += 0.1;
		update = true;
	}

	if(update)
	{
		model.update();
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
	scene.draw(spectator.camera);
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
