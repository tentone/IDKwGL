"use strict";

function ArenaPhysics()
{
	//IDK Logo
	this.camera = new OrthographicCamera(canvas, 20);
	this.idk = new Sprite();
	this.idk.setTexture(Texture.createTexture("data/texture/idk.png"));
	this.idk.scale.set(this.camera.size.y/2,this.camera.size.y/4,1);
	this.idk.origin.set(this.camera.size.x/3,0,0);
	this.idk.position.set(this.camera.size.x-1,-this.camera.size.y+1,0);
	this.idk.update();

	//Create scene and world
	this.world = new World(new Vector3(0, -20.8, 0));
	this.scene = new Scene();
	this.sceneGrass = new Scene();

	//Skybox
	this.skybox = new Model();
	this.skybox.loadMTL(App.readFile("data/models/skybox/skybox.mtl"), "data/models/skybox");
	this.skybox.loadOBJ(App.readFile("data/models/skybox/skybox.obj"));
	this.skybox.scale.set(800,800,800);
	this.skybox.rotation.set(-90,0,0);
	this.skybox.update();
	this.scene.add(this.skybox);

	//Floor
	this.model = Model.cube();
	this.model.setTexture(Texture.createTextureRepeat("data/texture/grass.jpg"));
	this.model.mulTextureCoords(10, 10);
	this.model.position.set(0, -100, 0);
	this.model.scale.set(900, 100, 900);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));
	
	//Walls
	this.model = Model.cube();
	this.model.setTexture(Texture.createTextureRepeat("data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(0, 0, -400);
	this.model.scale.set(400, 50, 1);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(0, 0, 400);
	this.model.scale.set(400, 50, 1);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(-400, 0, 0);
	this.model.scale.set(1, 50, 400);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(400, 0, 0);
	this.model.scale.set(1, 50, 400);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	//Player
	this.player = new Spectator(canvas);
	this.player.camera.position.y += 50;
}

var time = 0;

ArenaPhysics.prototype.update = function()
{
	//Spawn boxes in random position
	time++;
	if(time % 5 == 0)
	{
		this.model = Model.cube();
		this.model.setTexture(Texture.createTexture("data/texture/woodBox.jpg"));
		this.model.position.set(MathUtils.randomMod()*400,  MathUtils.randomMod()*300, MathUtils.randomMod()*400);
		this.model.scale.set(5,5,5);
		this.model.update();
		this.scene.add(this.model);
		this.world.addBody(new GameObject(this.model));
		this.world.body[this.world.body.length-1].setStatic(false);
	}

	//Update spectator position
	this.player.update();

	//Update Player Camera Position
	this.world.update();
}

ArenaPhysics.prototype.draw = function()
{
	//Draw scene to player camera
	this.player.camera.startFrame();
	this.scene.draw(this.player.camera);

	//Draw idk logo
	this.camera.startFrame();
	this.idk.draw(this.camera);
}

//Resize cameras
ArenaPhysics.prototype.resize = function(canvas)
{
	this.player.camera.resize(canvas.width, canvas.height);
	this.camera.resize(canvas.width, canvas.height);
}
