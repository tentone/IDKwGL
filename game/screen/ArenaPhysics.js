"use strict";

function ArenaPhysics()
{
	//IDK Logo
	this.camera = new OrthographicCamera(canvas, 20);
	this.idk = new Sprite();
	this.idk.setTexture(Texture.createTexture(gl, "data/texture/idk.png"));
	this.idk.scale.set(this.camera.size.y/2,this.camera.size.y/4,1);
	this.idk.position.set(this.camera.size.x-1,-this.camera.size.y+1,0);
	this.idk.updateMatrix();

	//Create scene and world
	this.world = new World(new Vector3(0, -20.8, 0));
	this.scene = new Scene();
	this.sceneGrass = new Scene();

	//Skybox
	this.skybox = OBJLoader.load(FileLoader.loadText("data/models/skybox/skybox.obj"), FileLoader.loadText("data/models/skybox/skybox.mtl"), "data/models/skybox");
	this.skybox.scale.set(800,800,800);
	this.skybox.updateMatrix();
	this.scene.add(this.skybox);

	//Floor
	this.model = new Mesh(new BoxGeometry());
	this.model.setTexture(Texture.createTexture(gl, "data/texture/grass.jpg"));
	this.model.geometry.scaleUV(10, 10);
	this.model.position.set(0, -100, 0);
	this.model.scale.set(900, 100, 900);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));
	
	//Walls
	this.model = new Mesh(new BoxGeometry());
	this.model.setTexture(Texture.createTexture(gl, "data/texture/wall.png"));
	this.model.geometry.scaleUV(20, 1);
	this.model.position.set(0, 0, -400);
	this.model.scale.set(400, 50, 1);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = new Mesh(new BoxGeometry());
	this.model.setTexture(Texture.createTexture(gl, "data/texture/wall.png"));
	this.model.geometry.scaleUV(20, 1);
	this.model.position.set(0, 0, 400);
	this.model.scale.set(400, 50, 1);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = new Mesh(new BoxGeometry());
	this.model.setTexture(Texture.createTexture(gl, "data/texture/wall.png"));
	this.model.geometry.scaleUV(20, 1);
	this.model.position.set(-400, 0, 0);
	this.model.scale.set(1, 50, 400);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = new Mesh(new BoxGeometry());
	this.model.setTexture(Texture.createTexture(gl, "data/texture/wall.png"));
	this.model.geometry.scaleUV(20, 1);
	this.model.position.set(400, 0, 0);
	this.model.scale.set(1, 50, 400);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	//Player
	this.player = new Spectator(canvas);
	this.player.camera.position.y += 50;

	this.time = 0;
}

ArenaPhysics.prototype.update = function()
{
	this.time++;

	//Spawn boxes in random position
	if(this.time % 10 === 0)
	{
		this.model = new Mesh(new BoxGeometry());
		this.model.setTexture(Texture.createTexture(gl, "data/texture/woodBox.jpg"));
		this.model.position.set(MathUtils.randomMod()*400,  MathUtils.randomMod()*300, MathUtils.randomMod()*400);
		this.model.scale.set(5, 5, 5);
		this.model.updateMatrix();
		this.scene.add(this.model);
		this.world.addBody(new GameObject(this.model));
		this.world.body[this.world.body.length-1].setStatic(false);
	}

	//Update spectator position
	this.player.update();

	//Update Player Camera Position
	this.world.update();
};

ArenaPhysics.prototype.draw = function()
{
	//Draw scene to player camera
	this.player.camera.updateMatrix();
	this.scene.draw(this.player.camera);

	//Draw idk logo
	this.camera.updateMatrix();
	this.idk.draw(this.camera);
};

//Resize cameras
ArenaPhysics.prototype.resize = function(canvas)
{
	this.player.camera.resize(canvas.width, canvas.height);
	this.camera.resize(canvas.width, canvas.height);
};
