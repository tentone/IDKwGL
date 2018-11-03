"use strict";

function Arena()
{
	//Create scene and world
	this.world = new World();
	this.scene = new Scene();

	//Timer
	this.timer = new Timer();
	this.timer.start();

	//Lights
	this.lightA = new PointLight();
	this.lightA.color.set(1.0, 0.0, 0.0);
	this.scene.add(this.lightA);

	this.lightB = new PointLight();
	this.lightB.color.set(0.0, 0.0, 1.5);
	this.scene.add(this.lightB);

	this.lightC = new PointLight();
	this.lightC.color.set(0.0, 0.7, 0.0);
	this.scene.add(this.lightC);

	this.ambient = new AmbientLight();
	this.ambient.color.set(0.1, 0.1, 0.1);
	this.scene.add(this.ambient);

	this.directional = new DirectionalLight();
	this.directional.color.set(0.2, 0.2, 0.2);
	this.directional.position.set(0.0, 2.0, 1.0);
	this.scene.add(this.directional);

	//Referencial
	this.referential = new Referencial(this.scene);

	//Skybox
	this.skybox = OBJLoader.load(FileLoader.loadText("data/models/sphere.obj"));
	this.skybox.material = new BasicMaterial();
	this.skybox.material.texture = new Texture("data/texture/sky.jpg");
	this.skybox.material.faceCullingMode = MeshMaterial.FRONT;
	this.skybox.scale.set(800,800,800);
	this.skybox.updateMatrix();
	this.scene.add(this.skybox);

	//Tank
	this.model = OBJLoader.load(tank);
	this.model.material = new PhongMaterial();
	this.model.material.texture = new Texture("data/texture/tank.jpg");
	this.model.scale.set(15, 15, 15);
	this.model.position.set(-250,0,100);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	//Eyebot
	this.model = OBJLoader.load(FileLoader.loadText("data/models/eyebot/eyebot.obj"), FileLoader.loadText("data/models/eyebot/eyebot.mtl"), "data/models/eyebot");
	this.model.position.set(0,20,-100);
	this.model.scale.set(0.5,0.5,0.5);
	this.model.updateMatrix();
	this.scene.add(this.model);

	//Asian Girl
	this.model = OBJLoader.load(FileLoader.loadText("data/models/asiangirl/asiangirl.obj"), FileLoader.loadText("data/models/asiangirl/asiangirl.mtl"), "data/models/asiangirl");
	this.model.position.set(-100,0,-100);
	this.model.scale.set(0.15,0.15,0.15);
	this.model.updateMatrix();
	this.scene.add(this.model);

	//Bus
	this.bus = OBJLoader.load(FileLoader.loadText("data/models/bus/bus.obj"), FileLoader.loadText("data/models/bus/bus.mtl"), "data/models/bus");
	this.bus.scale.set(0.08, 0.08, 0.08);
	this.bus.position.set(100, 19.8, 230);
	this.bus.rotation.set(0, Math.PI, 0);
	this.bus.updateMatrix();
	this.scene.add(this.bus);
	this.world.addBody(new GameObject(this.bus));
	
	//House
	this.model = OBJLoader.load(house);
	this.model.material = new PhongMaterial();
	this.model.material.texture = new Texture("data/texture/house.jpg");
	this.model.scale.set(7, 7, 7);
	this.model.position.set(300,0,0);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(300,0,80);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(300,0,160);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(200,0,0);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(200,0,80);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(200,0,160);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	//Crate Pile
	this.model = new Mesh(new BoxGeometry());
	this.model.material = new PhongMaterial();
	this.model.material.texture = new Texture("data/texture/wood_box.jpg");
	this.model.position.set(-200,5,0);
	this.model.scale.set(5,5,5);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(-200,15,0);
	this.model.scale.set(5,5,5);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(-190,5,0);
	this.model.scale.set(5,5,5);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = this.model.clone();
	this.model.position.set(-200,5,10);
	this.model.scale.set(5,5,5);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	var floorMaterial = new PhongMaterial();
	floorMaterial.texture = new Texture("data/texture/grass.jpg");
	//floorMaterial.normalMap = new Texture("data/texture/normal.png");

	var floorGeometry = new BoxGeometry();
	floorGeometry.scaleUV(30, 30);

	//Floor
	this.model = new Mesh(floorGeometry, floorMaterial);
	this.model.position.set(0, -100, 0);
	this.model.scale.set(900, 100, 900);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));
	
	var wallMaterial = new PhongMaterial();
	wallMaterial.texture = new Texture("data/texture/wall.png");

	var wallGeometry = new BoxGeometry();
	wallGeometry.scaleUV(20, 1);

	//Walls
	this.model = new Mesh(wallGeometry, wallMaterial);
	this.model.position.set(0, 0, -300);
	this.model.scale.set(300, 50, 1);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = new Mesh(wallGeometry, wallMaterial);
	this.model.position.set(0, 0, 300);
	this.model.scale.set(300, 50, 1);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = new Mesh(wallGeometry, wallMaterial);
	this.model.position.set(-300, 0, 0);
	this.model.scale.set(1, 50, 300);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = new Mesh(wallGeometry, wallMaterial);
	this.model.position.set(300, 0, 0);
	this.model.scale.set(1, 50, 300);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	var grassMaterial = new GrassMaterial();
	grassMaterial.texture = new Texture("data/texture/grass.png");
	grassMaterial.texture.wrapS = Texture.CLAMP_TO_EDGE;
	grassMaterial.texture.wrapT = Texture.CLAMP_TO_EDGE;
	grassMaterial.blending = true;
	grassMaterial.faceCulling = false;
	grassMaterial.alphaTest = 0.6;

	var grass = new GrassGeometry();
	var merged = new Geometry();

	//Merge grass geometry
	for(var i = 0; i < 5000; i++)
	{
		var x = MathUtils.randomMod() * 50;
		var z = MathUtils.randomMod() * 50;

		for(var k = 0; k < grass.vertex.length; k+=3)
		{
			merged.vertex.push(grass.vertex[k] + x);
			merged.vertex.push(grass.vertex[k + 1] + 1);
			merged.vertex.push(grass.vertex[k + 2] + z);
		}

		merged.uvs = merged.uvs.concat(grass.uvs);
		merged.normals = merged.normals.concat(grass.normals);

		for(var k = 0; k < grass.faces.length; k++)
		{
			merged.faces.push(grass.faces[k] + 8 * i);
		}
	}

	var grass = new Mesh(merged, grassMaterial);
	grass.scale.set(6, 6, 6);
	grass.updateMatrix();
	this.scene.add(grass);

	//Tank smoke
	this.model = new Sprite();
	this.model.texture = new Texture("data/texture/smoke_2.png");
	this.particle = new ParticleEmitter(this.model, new Vector3(-250, 8, 100), new Vector3(0,0.7,0), new Vector3(0.3,0.5,0.3), 30, 10, 150, 150, 50);
	this.scene.add(this.particle);

	//Bullet
	/*this.bullet = new Mesh();
	this.bullet = OBJLoader.load(FileLoader.loadText("data/models/skybox/skybox.obj"));
	this.bullet.scale.set(0.2,0.2,0.2);
	this.bullet.position.set(0,8,0);
	this.bullet.updateMatrix();
	
	this.bulletParticle = new Particle(this.bullet, new Vector3(0,8,0), new Vector3(0,0,0), 1, 10000);
	this.bulletParticleList = [];*/

	//Player
	this.player = new Player();
	this.world.addBody(this.player);
	this.world.body[this.world.body.length-1].setStatic(false);

	//Test Cube
	this.cube = new Mesh(new BoxGeometry());
	this.cube.material = new PhongMaterial();
	this.cube.material.texture = new Texture("data/texture/wood_box.jpg");//font.pageTexture[0]);
	this.cube.position.set(0,0,0);
	this.cube.scale.set(5,5,5);
	this.cube.updateMatrix();
	this.scene.add(this.cube);

	//Weapon scene
	/*this.cameraWeapon = new PerspectiveCamera(1, 70, 1);

	this.sceneWeapon = new Scene();

	this.weapon = OBJLoader.load(FileLoader.loadText("data/models/pulserifle/pulserifle.obj"), FileLoader.loadText("data/models/pulserifle/pulserifle.mtl"), "data/models/pulserifle");
	this.weapon.scale.set(10, 10, 10);
	this.weapon.position.set(-0.3,5,0.5);
	this.weapon.updateMatrix();
	this.scene.add(this.weapon);*/

	/*
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
	*/
}

Arena.prototype.update = function()
{
	this.particle.update();

	/*
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
	*/

	//Weapon change
	/*if(App.keyboard.isKeyPressed(Keyboard.NUM1))
	{
		this.weapon = new Mesh();
		this.weapon = OBJLoader.load(FileLoader.loadText("data/models/pulserifle/pulserifle.obj"));
		//this.weapon.setTexture(new Texture("data/models/pulserifle/tex1.jpg"));
		this.weapon.scale.set(2, 2, 2);
		this.weapon.position.set(-0.3,-0.3,0.5);
		this.weapon.updateMatrix();
	}
	if(App.keyboard.isKeyPressed(Keyboard.NUM2))
	{
		this.weapon = new Mesh();
		this.weapon = OBJLoader.load(FileLoader.loadText("data/models/scopedrifle/scopedrifle.obj"));
		//this.weapon.setTexture(new Texture("data/models/scopedrifle/tex1.jpg"));
		this.weapon.scale.set(2, 2, 2);
		this.weapon.position.set(-0.3,-0.3,0.5);
		this.weapon.updateMatrix();
	}*/

	var time = this.timer.get();

	this.lightA.position.set(Math.cos(time / 1000.0) * 70.0 + 50.0, 30, Math.sin(time / 1300.0) * 70.0 + 50.0);
	this.lightB.position.set(Math.cos(time / 800.0) * 80.0, 30, Math.sin(time / 900.0) * 80.0);
	this.lightC.position.set(Math.cos(time / 1200.0) * 90.0 - 50.0, 30, Math.sin(time / 1100.0) * 90.0 - 50.0);

	//Update Player Camera Position
	this.world.update();

	//Rotate cube
	if(App.keyboard.isKeyPressed(Keyboard.UP))
	{
		this.cube.rotation.y += 0.02;
	}
	if(App.keyboard.isKeyPressed(Keyboard.DOWN))
	{
		this.cube.rotation.y -= 0.02;
	}
	if(App.keyboard.isKeyPressed(Keyboard.RIGHT))
	{
		this.cube.rotation.x += 0.02;
	}
	if(App.keyboard.isKeyPressed(Keyboard.LEFT))
	{
		this.cube.rotation.x -= 0.02;
	}
	if(App.keyboard.isKeyPressed(Keyboard.L))
	{
		this.cube.rotation.z += 0.02;
	}
	if(App.keyboard.isKeyPressed(Keyboard.K))
	{
		this.cube.rotation.z -= 0.02;
	}
	
	this.cube.updateMatrix();
};

Arena.prototype.draw = function(renderer)
{
	//renderer.autoClear = true;
	renderer.render(this.scene, this.player.camera);
	//renderer.render(this.sceneWeapon, this.player.camera);
	//renderer.autoClear = false;
};

Arena.prototype.resize = function(width, height)
{
	this.player.camera.resize(width, height);
};
