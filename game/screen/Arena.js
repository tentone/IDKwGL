function Arena()
{
	//Create scene and world
	this.world = new World();
	this.scene = new Scene();
	this.scene_grass = new Scene();

	//Cameras
	this.camera_static = new PrespectiveCamera(canvas, 70, 1);
	this.hud_camera = new OrthographicCamera(canvas, 10);

	//IDK Logo
	this.idk = new Sprite();
	this.idk.setTexture(Texture.createTexture("data/texture/idk.png"));
	this.idk.scale.set(this.hud_camera.size.y/2,this.hud_camera.size.y/4,1);
	this.idk.origin.set(this.hud_camera.size.x/3,0,0);
	this.idk.position.set(this.hud_camera.size.x-1,-this.hud_camera.size.y+1,0);
	this.idk.update();
	
	//Crosshair
	this.cross = new Sprite();
	this.cross.setTexture(Texture.createTexture("data/texture/cross.png"));
	this.cross.position.set(-0.5, -0.5, 0);
	this.cross.update();

	//Skybox
	this.skybox = new Model();
	this.skybox.loadMTL(App.readFile("data/models/skybox/skybox.mtl"), "data/models/skybox");
	this.skybox.loadOBJ(App.readFile("data/models/skybox/skybox.obj"));
	this.skybox.scale.set(800,800,800);
	this.skybox.rotation.set(-90,0,0);
	this.skybox.update();
	this.scene.addModel(this.skybox);
	
	//Tank
	this.model = new Model();
	this.model.loadOBJ(tank);
	this.model.setTexture(Texture.createTexture("data/texture/tank.jpg"));
	this.model.scale.set(15, 15, 15);
	this.model.position.set(-250,0,100);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	//Eyebot
	this.model = new Model();
	this.model.loadMTL(App.readFile("data/models/eyebot/eyebot.mtl"), "data/models/eyebot");
	this.model.loadOBJ(App.readFile("data/models/eyebot/eyebot.obj"));
	this.model.position.set(0,20,-100);
	this.model.scale.set(0.5,0.5,0.5);
	this.model.update();
	this.scene.addModel(this.model);

	//Asian Girl
	this.model = new Model();
	this.model.loadMTL(App.readFile("data/models/asiangirl/asiangirl.mtl"), "data/models/asiangirl");
	this.model.loadOBJ(App.readFile("data/models/asiangirl/asiangirl.obj"));
	this.model.position.set(-100,0,-100);
	this.model.scale.set(0.15,0.15,0.15);
	this.model.update();
	this.scene.addModel(this.model);

	//Bus
	this.bus = new Model();
	this.bus.loadMTL(App.readFile("data/models/bus/bus.mtl"), "data/models/bus");
	this.bus.loadOBJ(App.readFile("data/models/bus/bus.obj"));
	this.bus.scale.set(0.08, 0.08, 0.08);
	this.bus.position.set(100,19.8,300);
	this.bus.rotation.set(0,180,0);
	this.bus.update();
	this.scene.addModel(this.bus);
	this.world.addBody(new GameObject(this.bus));
	
	//House
	this.model = new Model();
	this.model.loadOBJ(house);
	this.model.setTexture(Texture.createTexture("data/texture/house.jpg"));
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
	this.model.setTexture(Texture.createTexture("data/texture/wood_box.jpg"));
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
		this.model = new Sprite();
		this.model.setTexture(Texture.createTexture("data/texture/grass_sprite_2.png"));
		this.model.follow_camera_rotation = true;
		this.model.scale.set(16, 4, 1);
		this.model.origin.set(8, 2, 0);
		this.model.position.set(MathUtils.randomMod()*400, 2, MathUtils.randomMod()*400);
		this.model.update();
		this.scene_grass.addModel(this.model);
	}

	//Tank smoke
	this.model = new Sprite();
	this.model.setTexture(Texture.createTexture("data/texture/smoke_2.png"));
	this.model.scale.set(4, 4, 1);
	this.model.origin.set(2, 2, 0);
	this.model.follow_camera_rotation = true;
	this.model.position.set(MathUtils.randomMod()*400, 2, MathUtils.randomMod()*400);
	this.model.update();
	this.particle = new ParticleEmitter(this.model, new Vector3(-250,8,100), new Vector3(0,0.7,0), new Vector3(0.3,0.5,0.3), 6, 4, 150, 150, 50);

	//Bullet
	this.bullet = new Model();
	this.bullet.loadOBJ(App.readFile("data/models/skybox/skybox.obj"));
	this.bullet.setTexture(Texture.generateSolidColorTexture(Color.WHITE));
	this.bullet.scale.set(0.2,0.2,0.2);
	this.bullet.position.set(0,8,0);
	this.bullet.update();
	
	this.bullet_particle = new Particle(this.bullet.clone(), new Vector3(0,8,0), new Vector3(0,0,0), 1, 10000);
	this.bullet_particle_list = [];

	//Weapon
	this.weapon = new Model();
	this.weapon.loadOBJ(App.readFile("data/models/pulserifle/pulserifle.obj"));
	this.weapon.setTexture(Texture.createTexture("data/models/pulserifle/tex1.jpg"));
	this.weapon.scale.set(2, 2, 2);
	this.weapon.position.set(-0.3,-0.3,0.5);
	this.weapon.update();

	//Player
	this.player = new Player(canvas);
	this.world.addBody(this.player);
	this.world.body[this.world.body.length-1].setStatic(false);

	//Referencial
	this.referencial = new Referencial();

	//Test Cube
	this.cube = Model.cube();
	this.cube.setTexture(font.page_texture[0]);
	this.cube.position.set(0,0,0);
	this.cube.scale.set(5,5,5);
	this.cube.update();
	this.scene.addModel(this.cube);
}

Arena.prototype.update = function()
{
	//Update Player Camera Position
	this.world.update();
	this.particle.update();
	
	//Fire Gun
	if(App.mouse.buttonJustPressed(Mouse.LEFT))
	{
		var direction = this.player.camera.direction.clone();
		var position = this.player.camera.position.clone();

		//Add bullet to array
		var bullet_particle = new Particle(this.bullet.clone(), position, direction, 1, 200);		
		bullet_particle.speed.mulConst(5);
		this.bullet_particle_list.push(bullet_particle);
	}

	//Weapon change
	if(App.keyboard.isKeyPressed(Keyboard.NUM1))
	{
		this.weapon = new Model();
		this.weapon.loadOBJ(App.readFile("data/models/pulserifle/pulserifle.obj"));
		this.weapon.setTexture(Texture.createTexture("data/models/pulserifle/tex1.jpg"));
		this.weapon.scale.set(2, 2, 2);
		this.weapon.position.set(-0.3,-0.3,0.5);
		this.weapon.update();
	}
	if(App.keyboard.isKeyPressed(Keyboard.NUM2))
	{
		this.weapon = new Model();
		this.weapon.loadOBJ(App.readFile("data/models/scopedrifle/scopedrifle.obj"));
		this.weapon.setTexture(Texture.createTexture("data/models/scopedrifle/tex1.jpg"));
		this.weapon.scale.set(2, 2, 2);
		this.weapon.position.set(-0.3,-0.3,0.5);
		this.weapon.update();
	}

	//Update bullet list
	for(var i = 0; i < this.bullet_particle_list.length; i++)
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

	//Rotate cube
	if(App.keyboard.isKeyPressed(Keyboard.UP))
	{
		this.cube.rotation.y += 2;
	}
	if(App.keyboard.isKeyPressed(Keyboard.DOWN))
	{
		this.cube.rotation.y -= 2;
	}
	if(App.keyboard.isKeyPressed(Keyboard.RIGHT))
	{
		this.cube.rotation.x += 2;
	}
	if(App.keyboard.isKeyPressed(Keyboard.LEFT))
	{
		this.cube.rotation.x -= 2;
	}
	if(App.keyboard.isKeyPressed(Keyboard.L))
	{
		this.cube.rotation.z += 2;
	}
	if(App.keyboard.isKeyPressed(Keyboard.K))
	{
		this.cube.rotation.z -= 2;
	}
	this.cube.update();
}

Arena.prototype.draw = function()
{
	//Clearing the frame-buffer and the depth-buffer
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Enable depth test
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);

	//Prepare player camera
	this.player.camera.startFrame();
	this.player.camera.useShader(shaderDefault);

	//Draw referencial
	this.referencial.draw(this.player.camera);

	//Draw main scene
	this.scene.draw(this.player.camera);

	//Draw bullets
	for(var i = 0; i < this.bullet_particle_list.length; i++)
	{
		this.bullet_particle_list[i].draw(this.player.camera, this.scene.light);	
	}
	
	//Enable bleding
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

	//Render Grass and particles
	this.scene_grass.draw(this.player.camera);
	this.particle.draw(this.player.camera, this.scene.light);
	
	//Render HUD
	this.hud_camera.startFrame();
	this.hud_camera.useShader(shaderDefault);
	this.cross.draw(this.hud_camera);

	//Disable Blending
	gl.disable(gl.BLEND);

	//Draw IDK Logo
	this.idk.draw(this.hud_camera);

	//Draw static camera
	this.camera_static.startFrame();
	this.camera_static.useShader(shaderDefault);
	this.weapon.draw(this.camera_static, this.scene.light);
}

//Resize cameras
Arena.prototype.resize = function(canvas)
{
	this.player.camera.resize(canvas.width, canvas.height);
	this.camera_static.resize(canvas.width, canvas.height);
	this.hud_camera.resize(canvas.width, canvas.height);
}
