function Arena()
{
	//Create scene and world
	this.world = new World();
	this.scene = new Scene();
	this.scene_grass = new Scene();

	//Skybox
	this.skybox = new Model();
	this.skybox.loadOBJ(App.readFile("data/models/skybox/skybox.obj"));
	this.skybox.setTexture(Texture.createTexture("data/texture/skybox.png"));
	this.skybox.scale.set(800,800,800);
	this.skybox.rotation.set(90,0,0);
	this.skybox.update();

	//Tank
	this.model = new Model();
	this.model.loadOBJ(tank);
	this.model.setTexture(Texture.createTexture("data/texture/tank.png"));
	this.model.scale.set(15, 15, 15);
	this.model.position.set(-250,0,100);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	//Eyebot
	this.model = new Model();
	this.model.loadOBJ(App.readFile("data/models/eyebot/eyebot.obj"));
	this.model.setTexture(Texture.createTexture("data/texture/eyebot.png"));
	this.model.position.set(0,20,-100);
	this.model.scale.set(0.5,0.5,0.5);
	this.model.update();
	this.scene.addModel(this.model);

	//Bus
	this.bus = new Model();
	this.bus.loadOBJ(bus);
	this.bus.setTexture(Texture.createTexture("data/texture/bus.bmp"));
	this.bus.scale.set(0.08, 0.08, 0.08);
	this.bus.position.set(100,19.8,300);
	this.bus.update();

	this.scene.addModel(this.bus);
	this.world.addBody(new GameObject(this.bus));

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
	this.model = Model.plane();
	this.model.setTexture(Texture.createTexture("data/texture/smoke.jpg"));
	this.model.scale.set(4, 4, 1);
	this.model.position.set(MathUtils.randomMod()*400, 2, MathUtils.randomMod()*400);
	this.model.update();
	this.particle = new ParticleEmitter(this.model, new Vector3(-250,8,100), new Vector3(0,0.7,0), new Vector3(0.3,0.5,0.3), 4, 2, 200, 100, 20);

	//Bullet
	this.bullet = new Model();
	this.bullet.loadOBJ(App.readFile("data/models/skybox/skybox.obj"));
	this.bullet.setTexture(Texture.generateSolidColorTexture(Color.WHITE));
	this.bullet.scale.set(0.3,0.3,0.3);
	this.bullet.position.set(0,8,0);
	this.bullet.update();
	
	this.bullet_particle = new Particle(this.bullet.clone(), new Vector3(0,8,0), new Vector3(0,0,0), 1, 10000);
	this.bullet_particle_list = [];

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

	//Static camera for Weapon
	this.camera_static = new PrespectiveCamera(canvas, 70, 1);

	//Crossair and HUD camera
	this.hud_camera = new OrthographicCamera(canvas, 20);
	this.cross = Model.plane();
	this.cross.setTexture(Texture.createTexture("data/texture/cross.png"));

	//Referencial
	this.referencial = new Referencial();
}

Arena.prototype.draw = draw;
Arena.prototype.update = update;
Arena.prototype.resize = resize;

function update()
{
	//Update Player Camera Position
	this.world.update();
	this.particle.update();
	
	//Fire Gun
	if(App.mouse.buttonJustPressed(Mouse.LEFT))
	{
		var angle_horizontal = Conversion.degreesToRadians(-this.player.rotation.x);
		var angle_vertical = Conversion.degreesToRadians(-this.player.rotation.y);
		var cos_angle_vertical = Math.cos(angle_vertical);
		var direction = new Vector3(Math.sin(angle_horizontal)*cos_angle_vertical, Math.sin(angle_vertical), Math.cos(angle_horizontal)*cos_angle_vertical);

		var position = this.player.camera.position.clone();
		
		var bullet_particle = new Particle(this.bullet.clone(), position, direction, 1, 100);		
		bullet_particle.speed.mulConst(3);
		this.bullet_particle_list.push(bullet_particle);
	}

	//Update bullet list
	for(var i=0; i< this.bullet_particle_list.length;i++)
	{
		if(this.bullet_particle_list[i].time < 0)
		{
			this.bullet_particle_list.splice(i, 1);
		}
		else
		{
			this.bullet_particle_list[i].update();
		}
	}
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

	//Draw referencial
	this.referencial.draw(this.player.camera);

   	//Draw main scene
	this.scene.draw(this.player.camera);
	this.skybox.draw(this.player.camera);
	for(var i = 0; i < this.bullet_particle_list.length; i++)
	{
		this.bullet_particle_list[i].draw(this.player.camera,this.scene.light);	
	}

	//Draw static camera
	this.camera_static.startFrame();
	this.camera_static.useShader(shaderLightPixel);
	this.weapon.draw(this.camera_static);
	
    //Enable bleding
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

	//Render Grass and particles
	this.scene_grass.draw(this.player.camera);
	this.particle.draw(this.player.camera);
	
	//Render HUD
	this.hud_camera.startFrame();
	this.hud_camera.useShader(shaderLightPixel);
	this.cross.draw(this.hud_camera);

	//Disable Blending
	gl.disable(gl.BLEND);
}

//Resize cameras
function resize(canvas)
{
	this.player.camera.resize(canvas.width, canvas.height);
	this.camera_static.resize(canvas.width, canvas.height);
	this.hud_camera.resize(canvas.width, canvas.height);
}
