function Arena()
{
	//Create scene and world
	this.world = new World();
	this.scene = new Scene();
	this.scene_grass = new Scene();

	//Bullet
	this.bullet = new Model();
	this.bullet.loadOBJ(skybox);
	this.bullet.setTexture(Texture.generateSolidColorTexture(Color.YELLOW));
	this.bullet.scale.set(0.5,0.5,0.5);
	this.bullet.position.set(0,100,0);
	this.bullet.update();
	this.bullet_particle = new Particle(this.bullet.clone(), new Vector3(0,8,0), new Vector3(0,0,0), 1, 0);

	//Skybox
	this.skybox = new Model();
	this.skybox.loadOBJ(skybox);
	this.skybox.setTexture(Texture.createTexture("data/texture/skybox.png"));
	this.skybox.scale.set(800,800,800);
	this.skybox.rotation.set(90,0,0);
	this.skybox.update();

	//Target
	this.model = new Model();
	this.model.loadOBJ(target);
	this.model.setTexture(Texture.createTexture("data/texture/target.png"));
	this.model.position.set(0,10,0);
	this.model.scale.set(2,2,2);
	this.model.update();
	this.scene.addModel(this.model);

	//Tank
	this.model = new Model();
	this.model.loadOBJ(tank);
	this.model.setTexture(Texture.createTexture("data/texture/tank.png"));
	this.model.scale.set(15, 15, 15);
	this.model.position.set(-250,0,100);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	//Bus
	this.model = new Model();
	this.model.loadOBJ(bus);
	this.model.setTexture(Texture.createTexture("data/texture/bus.bmp"));
	this.model.scale.set(0.08, 0.08, 0.08);
	this.model.position.set(100,19.8,300);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	//House
	this.model = new Model();
	this.model.loadOBJ(house);
	this.model.setTexture(Texture.createTexture("data/texture/house.png"));
	this.model.scale.set(7, 7, 7);
	this.model.position.set(300,0,500);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(300,0,80);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(300,0,160);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(200,0,0);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(200,0,80);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(200,0,160);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	//Crate Pile
	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wood_box.png"));
	this.model.position.set(-200,5,0);
	this.model.scale.set(5,5,5);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(-200,15,0);
	this.model.scale.set(5,5,5);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(-190,5,0);
	this.model.scale.set(5,5,5);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(-200,5,10);
	this.model.scale.set(5,5,5);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

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
	
	//Grass
	for(var i = 0; i < 200; i++)
	{
		this.model = Model.plane()
		this.model.setTexture(Texture.createTexture("data/texture/grass_sprite.png"));
		this.model.scale.set(16, 4, 1);
		this.model.position.set(MathUtils.randomMod()*400, 2, MathUtils.randomMod()*400);
		this.model.update();
		this.scene_grass.addModel(this.model);
	}

	//Tank smoke
	this.model = Model.plane()
	this.model.setTexture(Texture.createTexture("data/texture/smoke.jpg"));
	this.model.scale.set(4, 4, 1);
	this.model.position.set(MathUtils.randomMod()*400, 2, MathUtils.randomMod()*400);
	this.model.update();

	this.particle = new ParticleEmitter(this.model, new Vector3(-250,0,100), new Vector3(0,0.7,0), new Vector3(0.3,0.5,0.3), 1, 0.75, 300, 200, 100);

	//Weapon
	this.weapon = new Model();
	this.weapon.loadOBJ(pulse_rifle);
	this.weapon.setTexture(Texture.createTexture("data/texture/pulse_rifle.png"));
	this.weapon.scale.set(2, 2, 2);
	this.weapon.position.set(-0.3,-0.3,0.5);
	this.weapon.update();

	//Player
	this.player = new Player(canvas);
	this.world.addBody(this.player);
	this.world.body[this.world.body.length-1].setStatic(false);


	//Static camera for weapon and HUD
	this.camera_static = new Spectator(canvas);
}

Arena.prototype.draw = draw;
Arena.prototype.update = update;
Arena.prototype.resize = resize;

function update()
{
	//Update Player Camera Position
	this.world.update();
	this.particle.update();

	//Restore light intesity
	this.scene.light.intensity.set(0.6, 0.6, 0.6);

	//Fire Gun
	if(App.mouse.buttonJustPressed(Mouse.LEFT))
	{
		this.scene.light.intensity.set(1,1,0.6);
	}
}

function draw()
{
    //Clearing the frame-buffer and the depth-buffer
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Draw  play camera
	this.player.camera.startFrame();
	this.player.camera.useShader(shaderLightPixel);
	this.scene.draw(this.player.camera);
	if(this.bullet_particle.time > 0)
	{
		this.bullet_particle.model.draw(this.player.camera);
	}

	//Draw static camera
	this.camera_static.camera.startFrame();
	this.camera_static.camera.useShader(shaderLightPixel);
	this.weapon.draw(this.camera_static.camera);
	this.skybox.draw(this.player.camera);

	//Render Grass
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	this.scene_grass.draw(this.player.camera);
	this.particle.draw(this.player.camera);
	gl.disable(gl.BLEND);
}

//Resize cameras
function resize(canvas)
{
	this.player.camera.resize(canvas.width, canvas.height);
	this.camera_static.camera.resize(canvas.width, canvas.height);
}
