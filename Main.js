//Test Stuff
var model;
var scene, scene2;
var spectator;
var particle;

var world;

//Global Variables
var shaderColor;
var shaderTexture;
var shaderLight;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	//Initialize Shaders
	shaderColor = Shader.colorRenderShader();
	shaderTexture = Shader.textureRenderShader();
	//shaderLight = Shader.lightRenderShader();

	//Test Model to load texture
	scene2 = new Scene();

	world = new World();
	
	model = Model.cube();
	model.setTexture(Texture.createTexture("data/texture/crate.bmp"));
	model.position.set(-3,20,8);
	model.update();
	scene2.addModel(model);

	world.addBody(new GameObject(new Body(null, new Box(new Vector3(-3,20,8), new Vector3(1,1,1), new Vector3(0.5, 0.5, 0.5))), model));

	model = Model.cube();
	model.setTexture(Texture.createTexture("data/texture/crate.bmp"));
	model.position.set(-3,0.5,8);
	model.update();
	scene2.addModel(model);

	world.addBody(new GameObject(new Body(null, new Box(new Vector3(-3,0.5,8), new Vector3(1,1,1), new Vector3(0.5, 0.5, 0.5))), model));

	console.log(world.toString());

	model = new Model();
	model.loadOBJ(orc);
	model.setTexture(Texture.createTexture("data/texture/orc.bmp"));
	model.position.set(2,1.5,-6);
	model.update();
	scene2.addModel(model);

	model = model.clone();
	model.position.set(-2,-0.5,6);
	model.rotation.set(0,90,0);
	model.update();
	scene2.addModel(model);

	model = Model.cube();
	model.setTexture(Texture.createTexture("data/texture/crate_metal.jpg"));
	model.position.set(2,0.5,-6);
	model.update();
	scene2.addModel(model);

	model = new Model();
	model.loadOBJ(cleffa);
	model.setTexture(Texture.createTexture("data/texture/cleffa.png"));
	model.scale.set(0.005,0.005,0.005);
	model.update();
	scene2.addModel(model);

	particle = new ParticleEmitter(model, new Vector3(0,0,0), new Vector3(0,0,0), new Vector3(0.5,0.5,0.5), 1.0, 0.5, 300, 100, 100);

	model = new Model();
	model.loadOBJ(baron_nashor);
	model.setTexture(Texture.createTexture("data/texture/baron_nashor.bmp"));
	model.position.set(-8,0,0);
	model.scale.set(0.03,0.03,0.03);
	model.update();
	scene2.addModel(model);

	model = model.clone();
	model.setTexture(Texture.createTexture("data/texture/baron_nashor_green.bmp"));
	model.position.set(-13,0,0);
	model.update();
	scene2.addModel(model);

	//Create Scene
	scene = new Scene();

	//Create Test Elements
	model = new ModelColor();
	model.loadOBJ(cube);
	model.position.set(0,0,0);
	model.update();
	scene.addModel(model);

	model = new ModelColor();
	model.loadOBJ(cube);
	model.position.set(0,1,0);
	model.update();
	scene.addModel(model);

	model = new ModelColor();
	model.loadOBJ(cube);
	model.position.set(0,2,0);
	model.update();
	scene.addModel(model);

	model = new ModelColor();
	model.loadOBJ(cube);
	model.position.set(2,0,2);
	model.update();
	scene.addModel(model);

	model = new ModelColor();
	model.loadOBJ(cube);
	model.position.set(-3,0,5);
	model.update();
	scene.addModel(model);

	model = new ModelColor();
	model.loadOBJ(cube);
	model.position.set(0,0,-5);
	model.update();
	scene.addModel(model);

	model = new ModelColor();
	model.loadOBJ(cube);
	model.position.set(0,-1,0);
	model.scale.set(40,1,40);
	model.update();
	scene.addModel(model);

	model = new ModelColor();
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
	particle.update();

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

	world.update();
}

//Draw Stuff
Main.draw = function()
{
    //Clearing the frame-buffer and the depth-buffer
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Draw Stuff to Spectator Camera
	spectator.camera.startFrame();

	spectator.camera.useShader(shaderColor);
	scene.draw(spectator.camera);

	spectator.camera.useShader(shaderTexture);
	scene2.draw(spectator.camera);
	particle.draw(spectator.camera);
}

//Resize Stuff
Main.resize = function(canvas)
{
	spectator.camera.resize(canvas.width, canvas.height);
}
