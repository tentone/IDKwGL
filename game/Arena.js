"use strict";

function Arena()
{
	var self = this;

	//Create scene and world
	this.world = new World();
	this.scene = new Scene();

	//Timer
	this.timer = new Timer();
	this.timer.start();

	//Lights
	this.lightA = new PointLight();
	this.lightA.color.set(1.5, 0.0, 0.0);
	this.scene.add(this.lightA);

	this.lightB = new PointLight();
	this.lightB.color.set(0.0, 0.0, 2.0);
	this.scene.add(this.lightB);

	this.lightC = new PointLight();
	this.lightC.color.set(0.0, 1.0, 0.0);
	this.scene.add(this.lightC);

	this.ambient = new AmbientLight();
	this.ambient.color.set(0.2, 0.2, 0.2);
	this.scene.add(this.ambient);

	this.directional = new DirectionalLight();
	this.directional.color.set(0.2, 0.2, 0.2);
	this.directional.position.set(0.0, 2.0, 1.0);
	this.scene.add(this.directional);

	//Axis
	var axis = new Axis(this.scene);

	//Skybox
	var geometry = new SphereGeometry(1.0, 32, 32);
	
	var material = new BasicMaterial();
	material.texture = new Texture("data/texture/box.jpg");
	material.faceCullingMode = MeshMaterial.FRONT;

	this.skybox = new Mesh(geometry, material);
	this.skybox.scale.set(1e3, 1e3, 1e3);
	this.skybox.updateMatrix();
	this.scene.add(this.skybox);

	//Tank
	var model = OBJLoader.load(tank);
	model.material = new PhongMaterial();
	model.material.texture = new Texture("data/texture/tank.jpg");
	model.scale.set(15, 15, 15);
	model.position.set(-250,0,100);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	//Eyebot
	FileLoader.loadMultiple(["data/models/eyebot/eyebot.obj", "data/models/eyebot/eyebot.mtl"], function(data)
	{
		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.position.set(0,20,-100);
		model.scale.set(0.5,0.5,0.5);
		model.updateMatrix();
		self.scene.add(model);

		//Eyebot color
		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new PhongMaterial();
		model.position.set(30,20,-100);
		model.scale.set(0.5,0.5,0.5);
		model.updateMatrix();
		self.scene.add(model);

		//Eyebot depth
		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new DepthMaterial();
		model.position.set(-30,20,-100);
		model.scale.set(0.5,0.5,0.5);
		model.updateMatrix();
		self.scene.add(model);

		//Eyebot dissolve
		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new DissolveMaterial();
		model.material.texture = new Texture("data/models/eyebot/Eyebot_d.jpg");
		model.material.normalMap = new Texture("data/models/eyebot/Eyebot_n.jpg");
		model.material.dissolveMap = new Texture("data/texture/noise.jpg");
		model.position.set(-60,20,-100);
		model.scale.set(0.5,0.5,0.5);
		model.updateMatrix();
		self.scene.add(model);

		//Eyebot normal
		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new NormalMaterial();
		model.material.normalMap = new Texture("data/models/eyebot/Eyebot_n.jpg");
		model.position.set(-90,20,-100);
		model.scale.set(0.5,0.5,0.5);
		model.updateMatrix();
		self.scene.add(model);

	});

	//Asian Girl
	FileLoader.loadMultiple(["data/models/asiangirl/asiangirl.obj", "data/models/asiangirl/asiangirl.mtl"], function(data)
	{
		var model = OBJLoader.load(data[0], data[1], "data/models/asiangirl");
		model.position.set(-100,0,-100);
		model.scale.set(0.15,0.15,0.15);
		model.updateMatrix();
		self.scene.add(model);
	});

	//Bus
	FileLoader.loadMultiple(["data/models/bus/bus.obj", "data/models/bus/bus.mtl"], function(data)
	{
		var bus = OBJLoader.load(data[0], data[1], "data/models/bus");
		bus.scale.set(0.08, 0.08, 0.08);
		bus.position.set(100, 19.8, 230);
		bus.rotation.set(0, Math.PI, 0);
		bus.updateMatrix();
		self.scene.add(bus);
		self.world.addBody(new BodyObject(bus));
	});
	
	//House
	model = OBJLoader.load(house);
	model.material = new PhongMaterial();
	model.material.texture = new Texture("data/texture/house.jpg");
	model.scale.set(7, 7, 7);
	model.position.set(300,0,0);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(300,0,80);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(300,0,160);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(200,0,0);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(200,0,80);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(200,0,160);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	//Crate Pile
	model = new Mesh(new BoxGeometry());
	model.material = new PhongMaterial();
	model.material.texture = new Texture("data/texture/wood_box.jpg");
	model.position.set(-200,5,0);
	model.scale.set(5,5,5);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(-200,15,0);
	model.scale.set(5,5,5);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(-190,5,0);
	model.scale.set(5,5,5);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(-200,5,10);
	model.scale.set(5,5,5);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	var floorMaterial = new PhongMaterial();
	floorMaterial.texture = new Texture("data/texture/grass.jpg");

	var floorGeometry = new BoxGeometry();
	floorGeometry.scaleUV(30, 30);

	//Floor
	model = new Mesh(floorGeometry, floorMaterial);
	model.position.set(0, -100, 0);
	model.scale.set(900, 100, 900);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));
	
	var wallMaterial = new PhongMaterial();
	wallMaterial.texture = new Texture("data/texture/wall.png");

	var wallGeometry = new BoxGeometry();
	wallGeometry.scaleUV(20, 1);

	//Walls
	model = new Mesh(wallGeometry, wallMaterial);
	model.position.set(0, 0, -300);
	model.scale.set(300, 50, 1);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = new Mesh(wallGeometry, wallMaterial);
	model.position.set(0, 0, 300);
	model.scale.set(300, 50, 1);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = new Mesh(wallGeometry, wallMaterial);
	model.position.set(-300, 0, 0);
	model.scale.set(1, 50, 300);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = new Mesh(wallGeometry, wallMaterial);
	model.position.set(300, 0, 0);
	model.scale.set(1, 50, 300);
	model.updateMatrix();
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

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
	for(var i = 0; i < 2000; i++)
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

	//Player
	this.player = new Player();
	this.player.setStatic(false);
	this.world.addBody(this.player);

	//Test Cube
	this.cube = new Mesh(new BoxGeometry());
	this.cube.material = new PhongMaterial();
	this.cube.material.texture = new Texture("data/texture/wood_box.jpg");
	this.cube.position.set(0,0,0);
	this.cube.scale.set(5,5,5);
	this.cube.updateMatrix();
	this.scene.add(this.cube);

	//Smoke
	var smoke = new Sprite();
	smoke.texture = new Texture("data/texture/smoke_2.png");

	this.particle = new ParticleEmitter(smoke, new Vector3(0, 0.7, 0), new Vector3(0.3, 0.5, 0.3), 30, 10, 150, 150, 50);
	this.particle.position.set(-250, 8, 100);
	this.scene.add(this.particle);

	//Weapon
	this.weapon = OBJLoader.load(FileLoader.loadText("data/models/pulserifle/pulserifle.obj"));
	this.weapon.geometry.computeNormals();
	this.weapon.material = new PhongMaterial();
	this.weapon.material.texture = new Texture("data/models/pulserifle/tex1.jpg");
	this.weapon.scale.set(20, 20, 20);
	this.weapon.position.set(15, 5, -30);
	this.weapon.rotation.set(0, Math.PI, 0);
	this.weapon.updateMatrix();
	this.scene.add(this.weapon);

	//HUD Scene
	this.hudCamera = new OrthographicCamera(1, 1);
	this.hudScene = new Scene();

	//IDK Logo
	this.idk = new Sprite();
	this.idk.texture = new Texture("data/texture/idk.png");
	this.idk.scale.set(20, 10, 1);
	this.idk.position.set(60, -45, -1);
	this.idk.updateMatrix();
	this.hudScene.add(this.idk);
	
	//Crosshair
	this.cross = new Sprite();
	this.cross.texture = new Texture("data/texture/cross.png");
	this.cross.scale.set(4, 4, 1);
	this.cross.position.set(-2, -2, -1);
	this.cross.updateMatrix();
	this.hudScene.add(this.cross);

	//Bullet
	this.bullet = new Mesh(new SphereGeometry(1.0, 16, 16), new BasicMaterial());
	this.bullet.position.set(0, 8, 0);
	this.bullet.updateMatrix();
	this.scene.add(this.bullet);

	//Bullet list
	this.bullets = [];
}

Arena.prototype.update = function()
{
	if(App.mouse.buttonJustPressed(Mouse.LEFT))
	{
		var bullet = this.bullet.clone();
		bullet.position.copy(this.player.camera.position);


		var particle = new Particle(bullet);
		particle.time = 100;
		particle.speed.set();
		particle.speed.mulScalar(5);
		this.bullets.push(particle);
	}

	/*
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

	if(App.keyboard.isKeyPressed(Keyboard.NUM1))
	{
		var weapon = OBJLoader.load(FileLoader.loadText("data/models/pulserifle/pulserifle.obj"));
		weapon.geometry.computeNormals();
		weapon.material = new PhongMaterial();
		weapon.material.texture = new Texture("data/models/pulserifle/tex1.jpg");

		this.weapon.geometry = weapon.geometry;
		this.weapon.material = weapon.material;
	}

	if(App.keyboard.isKeyPressed(Keyboard.NUM2))
	{
		var weapon = OBJLoader.load(FileLoader.loadText("data/models/scopedrifle/scopedrifle.obj"));
		weapon.geometry.computeNormals();
		weapon.material = new PhongMaterial();
		weapon.material.texture = new Texture("data/models/scopedrifle/tex1.jpg");

		this.weapon.geometry = weapon.geometry;
		this.weapon.material = weapon.material;
	}

	var time = this.timer.get();

	this.lightA.position.set(Math.cos(time / 1000.0) * 70.0 + 50.0, 30, Math.sin(time / 1300.0) * 70.0 + 50.0);
	this.lightB.position.set(Math.cos(time / 800.0) * 80.0, 30, Math.sin(time / 900.0) * 80.0);
	this.lightC.position.set(Math.cos(time / 1200.0) * 90.0 - 50.0, 30, Math.sin(time / 1100.0) * 90.0 - 50.0);

	this.particle.update();
	this.world.update();

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
	
	this.cube.updateMatrix();
};

Arena.prototype.draw = function(renderer)
{
	renderer.autoClear = true;
	renderer.render(this.scene, this.player.camera);
	renderer.autoClear = false;
	renderer.render(this.hudScene, this.hudCamera);
};

Arena.prototype.resize = function(width, height)
{
	var aspect = width / height;
	var hud = 100;

	this.idk.position.x = hud * aspect * 0.4;
	this.idk.updateMatrix();

	this.hudCamera.resize(hud * aspect, hud);
	this.player.camera.resize(width, height);
};
