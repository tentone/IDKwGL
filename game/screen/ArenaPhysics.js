function ArenaPhysics()
{
	//Create scene and world
	this.world = new World(new Vector3(0, -20.8, 0));
	this.scene = new Scene();
	this.scene_grass = new Scene();

	//Skybox
	this.skybox = new Model();
	this.skybox.loadOBJ(skybox);
	this.skybox.setTexture(Texture.createTexture("data/texture/skybox.png"));
	this.skybox.scale.set(800,800,800);
	this.skybox.rotation.set(90,0,0);
	this.skybox.update();

	//Floor
	this.model = Model.cube();
	this.model.setTexture(Texture.createTextureRepeat("data/texture/grass.jpg"));
	this.model.mulTextureCoords(10, 10);
	this.model.position.set(0, -100, 0);
	this.model.scale.set(900, 100, 900);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));
	
	//Walls
	this.model = Model.cube();
	this.model.setTexture(Texture.createTextureRepeat("data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(0, 0, -400);
	this.model.scale.set(400, 50, 1);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(0, 0, 400);
	this.model.scale.set(400, 50, 1);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(-400, 0, 0);
	this.model.scale.set(1, 50, 400);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(400, 0, 0);
	this.model.scale.set(1, 50, 400);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	//Player
	this.player = new Spectator(canvas);
	this.player.camera.position.y += 50;
}

ArenaPhysics.prototype.draw = draw;
ArenaPhysics.prototype.update = update;
ArenaPhysics.prototype.resize = resize;

time = 0;

function update()
{
	//Spawn boxes in random position
    time++;
    if(time % 5 == 0)
    {
        this.model = Model.cube();
        this.model.setTexture(Texture.createTexture("data/texture/wood_box.png"));
        this.model.position.set(MathUtils.randomMod()*400,  MathUtils.randomMod()*300, MathUtils.randomMod()*400);
        this.model.scale.set(5,5,5);
        this.model.update();
        this.scene.addModel(this.model);
        this.world.addBody(new GameObject(this.model));
        this.world.body[this.world.body.length-1].setStatic(false);
    }
	this.player.update();

	//Update Player Camera Position
	this.world.update();

	//Restore light intesity
	this.scene.light.intensity.set(0.6, 0.6, 0.6);
}

function draw()
{
    //Clearing the frame-buffer and the depth-buffer
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    //Prepare player camera
	this.player.camera.startFrame();
	this.player.camera.useShader(shaderLightPixel);

   	//Draw scene, skybox
	this.scene.draw(this.player.camera);
	this.skybox.draw(this.player.camera);
}

//Resize cameras
function resize(canvas)
{
	this.player.camera.resize(canvas.width, canvas.height);
	this.camera_static.resize(canvas.width, canvas.height);
	this.hud_camera.resize(canvas.width, canvas.height);
}
