//Test Stuff
var model;
var scene, scene2;
var spectator;

//Global Variables
var shaderColor;
var shaderTexture;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	//Initialize Shaders
	shaderColor = Shader.colorRenderShader();
	shaderTexture = Shader.textureRenderShader();

	//Test Model to load texture
	scene2 = new Scene();

	model = ModelTextured.test();
	model.setTexture(Texture.crateFromDataArray(2, [Color.GREEN , Color.WHITE, Color.RED, Color.BLUE]));
	model.position.set(-3,0.5,8);
	model.update();
	scene2.addModel(model);

	model = ModelTextured.test();
	model.setTexture(Texture.createTexture("data/texture/crate.bmp"));
	model.position.set(2,0.5,-6);
	model.update();
	scene2.addModel(model);

	console.log(model.toString());

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

    //gl.enable(gl.BLEND);
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	//gl.disable(gl.BLEND);

    //Draw Stuff to Spectator Camera
	spectator.camera.startFrame();
	
	spectator.camera.useShader(shaderColor);
	scene.draw(spectator.camera);

	spectator.camera.useShader(shaderTexture);
	scene2.draw(spectator.camera);
}

//Resize Stuff
Main.resize = function(canvas)
{
	spectator.camera.resize(canvas.width, canvas.height);
}
