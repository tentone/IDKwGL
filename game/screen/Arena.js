"use strict";

function Arena()
{
	//Create scene and world
	this.world = new World();
	this.scene = new Scene();

	//Cameras
	this.cameraStatic = new PrespectiveCamera(canvas, 70, 1);
	this.hudCamera = new OrthographicCamera(canvas, 10);

	//IDK Logo
	this.idk = new Sprite();
	this.idk.setTexture(Texture.createTexture(gl, "data/texture/idk.png"));
	this.idk.scale.set(this.hudCamera.size.y/2,this.hudCamera.size.y/4,1);
	this.idk.origin.set(this.hudCamera.size.x/3,0,0);
	this.idk.position.set(this.hudCamera.size.x-1,-this.hudCamera.size.y+1,0);
	this.idk.update();
	
	//Crosshair
	this.cross = new Sprite();
	this.cross.setTexture(Texture.createTexture(gl, "data/texture/cross.png"));
	this.cross.position.set(-0.5, -0.5, 0);
	this.cross.update();

	//Skybox
	this.skybox = new Model();
	this.skybox.loadMTL(App.readFile("data/models/skybox/skybox.mtl"), "data/models/skybox");
	this.skybox.loadOBJ(App.readFile("data/models/skybox/skybox.obj"));
	this.skybox.scale.set(800,800,800);
	this.skybox.rotation.set(-90,0,0);
	this.skybox.update();
	this.scene.add(this.skybox);
	
	//Tank
	this.model = new Model();
	this.model.loadOBJ(tank);
	this.model.setTexture(Texture.createTexture(gl, "data/texture/tank.jpg"));
	this.model.scale.set(15, 15, 15);
	this.model.position.set(-250,0,100);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	//Eyebot
	this.model = new Model();
	this.model.loadMTL(App.readFile("data/models/eyebot/eyebot.mtl"), "data/models/eyebot");
	this.model.loadOBJ(App.readFile("data/models/eyebot/eyebot.obj"));
	this.model.position.set(0,20,-100);
	this.model.scale.set(0.5,0.5,0.5);
	this.model.update();
	this.scene.add(this.model);

	//Asian Girl
	this.model = new Model();
	this.model.loadMTL(App.readFile("data/models/asiangirl/asiangirl.mtl"), "data/models/asiangirl");
	this.model.loadOBJ(App.readFile("data/models/asiangirl/asiangirl.obj"));
	this.model.position.set(-100,0,-100);
	this.model.scale.set(0.15,0.15,0.15);
	this.model.update();
	this.scene.add(this.model);

	//Bus
	this.bus = new Model();
	this.bus.loadMTL(App.readFile("data/models/bus/bus.mtl"), "data/models/bus");
	this.bus.loadOBJ(App.readFile("data/models/bus/bus.obj"));
	this.bus.scale.set(0.08, 0.08, 0.08);
	this.bus.position.set(100,19.8,300);
	this.bus.rotation.set(0,180,0);
	this.bus.update();
	this.scene.add(this.bus);
	this.world.addBody(new GameObject(this.bus));
	
	//House
	this.model = new Model();
	this.model.loadOBJ(house);
	this.model.setTexture(Texture.createTexture(gl, "data/texture/house.jpg"));
	this.model.scale.set(7, 7, 7);
	this.model.position.set(300,0,500);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(300,0,80);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(300,0,160);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(200,0,0);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(200,0,80);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(200,0,160);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	//Crate Pile
	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture(gl, "data/texture/wood_box.jpg"));
	this.model.position.set(-200,5,0);
	this.model.scale.set(5,5,5);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(-200,15,0);
	this.model.scale.set(5,5,5);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(-190,5,0);
	this.model.scale.set(5,5,5);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(-200,5,10);
	this.model.scale.set(5,5,5);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	//Floor
	this.model = Model.cube();
	this.model.setTexture(Texture.createTextureRepeat(gl, "data/texture/grass.jpg"));
	this.model.mulTextureCoords(10, 10);
	this.model.position.set(0, -100, 0);
	this.model.scale.set(900, 100, 900);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));
	
	//Walls
	this.model = Model.cube();
	this.model.setTexture(Texture.createTextureRepeat(gl, "data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(0, 0, -400);
	this.model.scale.set(400, 50, 1);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture(gl, "data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(0, 0, 400);
	this.model.scale.set(400, 50, 1);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture(gl, "data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(-400, 0, 0);
	this.model.scale.set(1, 50, 400);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture(gl, "data/texture/wall.png"));
	this.model.mulTextureCoords(20, 1);
	this.model.position.set(400, 0, 0);
	this.model.scale.set(1, 50, 400);
	this.model.update();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));
	
	//Grass
	for(var i = 0; i < 200; i++)
	{
		this.model = new Sprite();
		this.model.setTexture(Texture.createTexture(gl, "data/texture/grass_sprite_2.png"));
		this.model.followCameraRotation = true;
		this.model.scale.set(16, 4, 1);
		this.model.origin.set(8, 2, 0);
		this.model.position.set(MathUtils.randomMod()*400, 2, MathUtils.randomMod()*400);
		this.model.update();
		this.scene.add(this.model);
	}

	//Tank smoke
	this.model = new Sprite();
	this.model.setTexture(Texture.createTexture(gl, "data/texture/smoke_2.png"));
	this.model.scale.set(4, 4, 1);
	this.model.origin.set(2, 2, 0);
	this.model.followCameraRotation = true;
	this.model.position.set(MathUtils.randomMod()*400, 2, MathUtils.randomMod()*400);
	this.model.update();
	this.particle = new ParticleEmitter(this.model, new Vector3(-250,8,100), new Vector3(0,0.7,0), new Vector3(0.3,0.5,0.3), 6, 4, 150, 150, 50);
	
	
	//Bullet
	this.bullet = new Model();
	this.bullet.loadOBJ(App.readFile("data/models/skybox/skybox.obj"));
	this.bullet.setTexture(Texture.generateSolidColorTexture(gl, Color.WHITE));
	this.bullet.scale.set(0.2,0.2,0.2);
	this.bullet.position.set(0,8,0);
	this.bullet.update();
	
	this.bulletParticle = new Particle(this.bullet.clone(), new Vector3(0,8,0), new Vector3(0,0,0), 1, 10000);
	this.bulletParticleList = [];

	//Weapon
	this.weapon = new Model();
	this.weapon.loadOBJ(App.readFile("data/models/pulserifle/pulserifle.obj"));
	this.weapon.setTexture(Texture.createTexture(gl, "data/models/pulserifle/tex1.jpg"));
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
	this.cube.setTexture(font.pageTexture[0]);
	this.cube.position.set(0,0,0);
	this.cube.scale.set(5,5,5);
	this.cube.update();
	this.scene.add(this.cube);
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
		var bulletParticle = new Particle(this.bullet.clone(), position, direction, 1, 200);		
		bulletParticle.speed.mulConst(5);
		this.bulletParticleList.push(bulletParticle);
	}

	//Weapon change
	if(App.keyboard.isKeyPressed(Keyboard.NUM1))
	{
		this.weapon = new Model();
		this.weapon.loadOBJ(App.readFile("data/models/pulserifle/pulserifle.obj"));
		this.weapon.setTexture(Texture.createTexture(gl, "data/models/pulserifle/tex1.jpg"));
		this.weapon.scale.set(2, 2, 2);
		this.weapon.position.set(-0.3,-0.3,0.5);
		this.weapon.update();
	}
	if(App.keyboard.isKeyPressed(Keyboard.NUM2))
	{
		this.weapon = new Model();
		this.weapon.loadOBJ(App.readFile("data/models/scopedrifle/scopedrifle.obj"));
		this.weapon.setTexture(Texture.createTexture(gl, "data/models/scopedrifle/tex1.jpg"));
		this.weapon.scale.set(2, 2, 2);
		this.weapon.position.set(-0.3,-0.3,0.5);
		this.weapon.update();
	}

	//Update bullet list
	for(var i = 0; i < this.bulletParticleList.length; i++)
	{
		if(this.bulletParticleList[i].time < 0)
		{
			this.bulletParticleList.splice(i, 1);
		}
		else
		{
			this.bulletParticleList[i].update();
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
	//Prepare player camera
	this.player.camera.startFrame();

	//Draw referencial
	this.referencial.draw(this.player.camera);

	//Draw main scene
	this.scene.draw(this.player.camera);

	//Draw bullets
	for(var i = 0; i < this.bulletParticleList.length; i++)
	{
		this.bulletParticleList[i].draw(this.player.camera, this.scene.light);	
	}
	
	//Render Grass and particles
	this.particle.draw(this.player.camera, this.scene.light);
	
	//Render HUD
	this.hudCamera.startFrame();
	this.cross.draw(this.hudCamera);

	//Draw IDK Logo
	this.idk.draw(this.hudCamera);

	//Draw static camera
	this.cameraStatic.startFrame();
	this.weapon.draw(this.cameraStatic, this.scene.light);
}

//Resize cameras
Arena.prototype.resize = function(canvas)
{
	this.player.camera.resize(canvas.width, canvas.height);
	this.cameraStatic.resize(canvas.width, canvas.height);
	this.hudCamera.resize(canvas.width, canvas.height);
}
