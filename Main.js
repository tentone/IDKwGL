//Test Stuff
var model;
var scene;
var spectator;

var model_test;

//Global Variables
var shaderProgram;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	//Initialize Shaders
	//shaderProgram = Shader.colorRenderShader();
	shaderProgram = Shader.textureRenderShader();

	//Test Model to load texture
	model_test = [];
	model_test[0] = ModelTextured.test();
	model_test[0].setTexture(Texture.crateFromDataArray(2, [Color.GREEN , Color.WHITE, Color.RED, Color.BLUE]));

	model_test[1] = ModelTextured.test();
	model_test[1].setTexture(Texture.createTexture("data/texture/crate.bmp"));
	model_test[1].position.set(2,0,2);
	model_test[1].update();

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
	//Update Player Camera Position
	spectator.update();

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

    //Draw Stuff to Spectator Camera
	spectator.camera.startFrame();
	
	//scene.draw(spectator.camera);

	for(var i = 0; i < model_test.length; i++)
	{
		model_test[i].draw(spectator.camera);
	}
}

//Resize Stuff
Main.resize = function(canvas)
{
	spectator.camera.resize(canvas.width, canvas.height);
}
