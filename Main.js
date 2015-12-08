//Test Stuff
var model;
var scene;
var spectator;
var particle;

//Global Variables
var shaderTexture;
var shaderLightVertex;
var shaderLightPixel;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	//Initialize Shaders
	shaderTexture = Shader.textureRenderShader();
	shaderLightVertex = Shader.lightVertexRenderShader();
	shaderLightPixel = Shader.lightPixelRenderShader();

	//Test Model to load texture
	scene = new Scene();

	model = Model.cube();
	model.setTexture(Texture.createTexture("data/texture/wood_box.png"));
	model.position.set(0,-2,0);
	model.scale.set(30,1,30);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(cardboard_boxes);
	model.setTexture(Texture.createTexture("data/texture/cardboard_boxes.png"));
	model.position.set(-5,-1,0);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(cardboard_boxes);
	model.setTexture(Texture.createTexture("data/texture/cardboard_boxes.png"));
	model.position.set(5,-1,-3);
	model.update();
	scene.addModel(model);

	model = Model.cube();
	model.setTexture(Texture.createTexture("data/texture/wood_box.png"));
	model.position.set(7,0,8);
	model.update();
	scene.addModel(model);

	model = Model.cube();
	model.setTexture(Texture.createTexture("data/texture/wood_box.png"));
	model.position.set(7,2,8);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(orc);
	model.setTexture(Texture.createTexture("data/texture/orc.bmp"));
	model.position.set(2,-1,-6);
	model.update();
	scene.addModel(model);

	model = model.clone();
	model.position.set(-2,-1,6);
	model.rotation.set(0,90,0);
	model.update();
	scene.addModel(model);

	model = new Model();
	model.loadOBJ(cleffa);
	model.setTexture(Texture.createTexture("data/texture/cleffa.png"));
	model.scale.set(0.005,0.005,0.005);
	model.update();
	scene.addModel(model);

	particle = new ParticleEmitter(model, new Vector3(0,0,0), new Vector3(0,0,0), new Vector3(0.5,0.5,0.5), 1.0, 0.5, 300, 100, 100);

	model = new Model();
	model.loadOBJ(baron_nashor);
	model.setTexture(Texture.createTexture("data/texture/baron_nashor.bmp"));
	model.position.set(-8,-0.7,0);
	model.scale.set(0.03,0.03,0.03);
	model.update();
	scene.addModel(model);

	model = model.clone();
	model.setTexture(Texture.createTexture("data/texture/baron_nashor_green.bmp"));
	model.position.set(-15,-0.7,0);
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
}

//Draw Stuff
Main.draw = function()
{
    //Clearing the frame-buffer and the depth-buffer
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Draw Stuff to Spectator Camera
	spectator.camera.startFrame();

	spectator.camera.useShader(shaderLightPixel);
	scene.draw(spectator.camera);
	particle.draw(spectator.camera);
}

//Resize Stuff
Main.resize = function(canvas)
{
	spectator.camera.resize(canvas.width, canvas.height);
}
