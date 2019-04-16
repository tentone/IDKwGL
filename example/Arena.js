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

	var sphere = new SphereGeometry(1.0, 16, 16);

	var material = new BasicMaterial();
	material.color.set(1, 0, 0);
	this.markerA = new Mesh(sphere, material);
	this.scene.add(this.markerA);

	this.lightB = new PointLight();
	this.lightB.color.set(0.0, 0.0, 2.0);
	this.scene.add(this.lightB);

	var material = new BasicMaterial();
	material.color.set(0, 0, 1);
	this.markerB = new Mesh(sphere, material);
	this.scene.add(this.markerB);

	this.lightC = new PointLight();
	this.lightC.color.set(0.0, 1.0, 0.0);
	this.scene.add(this.lightC);

	var material = new BasicMaterial();
	material.color.set(0, 1, 0);
	this.markerC = new Mesh(sphere, material);
	this.scene.add(this.markerC);

	this.lightD = new PointLight();
	this.lightD.color.set(0.5, 0.5, 0.5);
	this.lightD.position.set(53.5, 24.5, -137);
	this.scene.add(this.lightD);

	this.markerD = new Mesh(sphere, new BasicMaterial());
	this.markerD.position.set(0, 3, 0);
	this.scene.add(this.markerD);

	this.ambient = new AmbientLight();
	this.ambient.color.set(0.2, 0.2, 0.2);
	this.scene.add(this.ambient);

	this.directional = new DirectionalLight();
	this.directional.color.set(0.2, 0.2, 0.2);
	this.directional.position.set(0.0, 2.0, 1.0);
	this.scene.add(this.directional);

	this.sphereBump = new Mesh(new SphereGeometry(10.0, 128, 128), new PhongMaterial());
	this.sphereBump.position.set(200, 20, -120);
	this.sphereBump.material.bumpMap = new Texture("data/texture/noise.jpg");
	this.scene.add(this.sphereBump);

	//Axis
	var axis = new Axis(this.scene);

	//Skybox
	var geometry = new SphereGeometry(1.0, 32, 32);
	
	var material = new BasicMaterial();
	material.texture = new Texture("data/texture/box.jpg");
	material.faceCullingMode = MeshMaterial.FRONT;

	this.skybox = new Mesh(geometry, material);
	this.skybox.scale.set(1e3, 1e3, 1e3);
	this.scene.add(this.skybox);

	//Tank
	var model = OBJLoader.load(tank);
	model.material = new PhongMaterial();
	model.material.texture = new Texture("data/texture/tank.jpg");
	model.scale.set(15, 15, 15);
	model.position.set(-250,0,100);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	//Eyebot
	FileLoader.loadMultiple(["data/models/eyebot/eyebot.obj", "data/models/eyebot/eyebot.mtl"], function(data)
	{
		self.eyebotBump = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		self.eyebotBump.material = new PhongMaterial();
		self.eyebotBump.material.texture = new Texture("data/models/eyebot/Eyebot_d.jpg");
		self.eyebotBump.material.bumpMap = new Texture("data/texture/noise.jpg");
		self.eyebotBump.material.bumpScale = 5.0;
		self.eyebotBump.position.set(90, 20, -100);
		self.eyebotBump.scale.set(0.5, 0.5, 0.5);
		self.scene.add(self.eyebotBump);

		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new PhongMaterial();
		model.material.texture = new Texture("data/models/eyebot/Eyebot_d.jpg");
		model.material.normalMap = new Texture("data/models/eyebot/Eyebot_n.jpg");
		model.position.set(60, 20, -100);
		model.scale.set(0.5, 0.5, 0.5);
		self.scene.add(model);

		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new PhongMaterial();
		model.material.texture = new Texture("data/models/eyebot/Eyebot_d.jpg");
		model.position.set(30, 20, -100);
		model.scale.set(0.5, 0.5, 0.5);
		self.scene.add(model);

		//Eyebot color
		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new PhongMaterial();
		model.position.set(0, 20, -100);
		model.scale.set(0.5,0.5,0.5);
		self.scene.add(model);

		//Eyebot depth
		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new DepthMaterial();
		model.position.set(-30,20,-100);
		model.scale.set(0.5,0.5,0.5);
		self.scene.add(model);

		//Eyebot dissolve
		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new DissolveMaterial();
		model.material.texture = new Texture("data/models/eyebot/Eyebot_d.jpg");
		model.material.dissolveMap = new Texture("data/texture/noise.jpg");
		model.position.set(-60,20,-100);
		model.scale.set(0.5,0.5,0.5);
		self.scene.add(model);

		//Eyebot normal
		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new NormalMaterial();
		model.position.set(-90,20,-100);
		model.scale.set(0.5,0.5,0.5);
		self.scene.add(model);

		//Eyebot normal map
		var model = OBJLoader.load(data[0], data[1], "data/models/eyebot");
		model.material = new NormalMaterial();
		model.material.normalMap = new Texture("data/models/eyebot/Eyebot_n.jpg");
		model.position.set(-120, 20, -100);
		model.scale.set(0.5,0.5,0.5);
		self.scene.add(model);

	});

	//Asian Girl
	FileLoader.loadMultiple(["data/models/asiangirl/asiangirl.obj", "data/models/asiangirl/asiangirl.mtl"], function(data)
	{
		var model = OBJLoader.load(data[0], data[1], "data/models/asiangirl");
		model.position.set(-160, 0, -100);
		model.scale.set(0.15, 0.15, 0.15);
		self.scene.add(model);
	});

	//Bus
	FileLoader.loadMultiple(["data/models/bus/bus.obj", "data/models/bus/bus.mtl"], function(data)
	{
		var bus = OBJLoader.load(data[0], data[1], "data/models/bus");
		bus.scale.set(0.08, 0.08, 0.08);
		bus.position.set(100, 19.8, 230);
		bus.rotation.set(0, Math.PI, 0);
		self.scene.add(bus);
		self.world.addBody(new BodyObject(bus));

		var bus = OBJLoader.load(data[0], data[1], "data/models/bus");
		bus.material = new BasicMaterial();
		bus.material.color.set(1.0, 0.5, 0.6);
		bus.mode = Mesh.LINES;
		bus.scale.set(0.08, 0.08, 0.08);
		bus.position.set(60, 19.8, 230);
		bus.rotation.set(0, Math.PI, 0);
		self.scene.add(bus);
		self.world.addBody(new BodyObject(bus));

		var bus = OBJLoader.load(data[0], data[1], "data/models/bus");
		bus.material = new BasicMaterial();
		bus.mode = Mesh.POINTS;
		bus.scale.set(0.08, 0.08, 0.08);
		bus.position.set(20, 19.8, 230);
		bus.rotation.set(0, Math.PI, 0);
		self.scene.add(bus);
		self.world.addBody(new BodyObject(bus));
	});
	

	//House
	model = OBJLoader.load(house);
	model.material = new PhongMaterial();
	model.material.texture = new Texture("data/texture/house.jpg");
	model.scale.set(7, 7, 7);
	model.position.set(300,0,0);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(300,0,80);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(300,0,160);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(200,0,0);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(200,0,80);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(200,0,160);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	//Crate Pile
	model = new Mesh(new BoxGeometry());
	model.material = new PhongMaterial();
	model.material.texture = new Texture("data/texture/wood_box.jpg");
	model.material.normalMap = new Texture("data/texture/wood_box_normal.png");
	model.position.set(-200,5,0);
	model.scale.set(5,5,5);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(-200,15,0);
	model.scale.set(5,5,5);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(-190,5,0);
	model.scale.set(5,5,5);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = model.clone();
	model.position.set(-200,5,10);
	model.scale.set(5,5,5);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	var floorMaterial = new PhongMaterial();
	floorMaterial.texture = new Texture("data/texture/grass.jpg");
	floorMaterial.normalMap = new Texture("data/texture/grass_normal.png");

	var floorGeometry = new BoxGeometry();
	floorGeometry.scaleUV(30, 30);

	//Floor
	model = new Mesh(floorGeometry, floorMaterial);
	model.position.set(0, -100, 0);
	model.scale.set(900, 100, 900);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));
	
	var material = new PhongMaterial();
	material.texture = new Texture("data/texture/wall.png");
	material.normalMap = new Texture("data/texture/wall_normal.png");

	var geometry = new BoxGeometry();
	geometry.scaleUV(50, 3);

	//Walls
	model = new Mesh(geometry, material);
	model.position.set(0, 0, -300);
	model.scale.set(300, 50, 1);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = new Mesh(geometry, material);
	model.position.set(0, 0, 300);
	model.scale.set(300, 50, 1);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = new Mesh(geometry, material);
	model.position.set(-300, 0, 0);
	model.scale.set(1, 50, 300);
	this.scene.add(model);
	this.world.addBody(new BodyObject(model));

	model = new Mesh(geometry, material);
	model.position.set(300, 0, 0);
	model.scale.set(1, 50, 300);
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
	this.scene.add(grass);

	//Player
	this.player = new Player();
	this.player.setStatic(false);
	this.world.addBody(this.player);

	//Test Cube
	this.cube = new Mesh(new BoxGeometry());
	this.cube.material = new PhongMaterial();
	this.cube.material.texture = new RenderTargetTexture(512, 512);
	this.cube.material.normalMap = new Texture("data/texture/wood_box_normal.png");
	this.cube.position.set(-40, 10, 80);
	this.cube.scale.set(10, 10, 10);
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
	this.weapon.scale.set(5, 5, 5);
	this.weapon.position.set(1.5, -1, -1.5);
	this.weapon.rotation.set(0, Math.PI, 0);
	this.player.camera.add(this.weapon);
	this.scene.add(this.player.camera);

	//
	this.bufferCamera = new PerspectiveCamera(1, 60, 1);
	this.bufferCamera.position.set(50, 30, 50);
	this.scene.add(this.bufferCamera);

	this.cameraCube = new Mesh(new BoxGeometry());
	this.cameraCube.material = new PhongMaterial();
	this.cameraCube.position.set(0, 0, 10);
	this.cameraCube.scale.set(5, 5, 5);
	this.bufferCamera.add(this.cameraCube);

	//HUD Scene
	this.hudCamera = new OrthographicCamera(1, 1);
	this.hudScene = new Scene();

	//IDK Logo
	this.idk = new Sprite();
	this.idk.texture = new Texture("data/texture/idk.png");
	this.idk.scale.set(20, 10, 1);
	this.idk.position.set(60, -45, -1);
	this.hudScene.add(this.idk);
	
	//Crosshair
	this.cross = new Sprite();
	this.cross.texture = new Texture("data/texture/cross.png");
	this.cross.scale.set(4, 4, 1);
	this.cross.position.set(-2, -2, -1);
	this.hudScene.add(this.cross);

	this.bullet = new Mesh(new SphereGeometry(1.0, 16, 16), new BasicMaterial());
	this.bullet.position.set(0, 3, 0);
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

	this.sphereBump.rotation.y += 0.01;

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

	this.sphereBump.material.bumpScale = Math.cos(time / 500.0) + 2.0;

	this.weapon.rotation.x = Math.cos(time / 1000.0) * 0.02;
	this.weapon.rotation.z = Math.cos(time / 2000.0) * 0.01;
	this.bufferCamera.rotation.y += 0.001;

	this.lightA.position.set(Math.cos(time / 1000.0) * 70.0 + 50.0, 30, Math.sin(time / 1300.0) * 70.0 + 50.0);
	this.lightB.position.set(Math.cos(time / 800.0) * 80.0, Math.sin(time / 1200.0) * 25 + 30, Math.sin(time / 900.0) * 80.0);
	this.lightC.position.set(Math.cos(time / 1200.0) * 90.0 - 50.0, Math.sin(time / 1400.0) * 25 + 30, Math.sin(time / 1100.0) * 90.0 - 50.0);

	this.particle.update();
	this.world.update();


	if(App.keyboard.isKeyPressed(Keyboard.RIGHT))
	{
		this.lightD.position.x += 0.5;
	}
	if(App.keyboard.isKeyPressed(Keyboard.LEFT))
	{
		this.lightD.position.x -= 0.5;
	}

	if(App.keyboard.isKeyPressed(Keyboard.CTRL))
	{
		if(App.keyboard.isKeyPressed(Keyboard.UP))
		{
			this.lightD.position.y += 0.5;
		}
		if(App.keyboard.isKeyPressed(Keyboard.DOWN))
		{
			this.lightD.position.y -= 0.5;
		}
	}
	else
	{
		if(App.keyboard.isKeyPressed(Keyboard.UP))
		{
			this.lightD.position.z -= 0.5;

		}
		if(App.keyboard.isKeyPressed(Keyboard.DOWN))
		{
			this.lightD.position.z += 0.5;
		}
	}

	this.markerA.position.copy(this.lightA.position);
	this.markerB.position.copy(this.lightB.position);
	this.markerC.position.copy(this.lightC.position);
	this.markerD.position.copy(this.lightD.position);
};

Arena.prototype.draw = function(renderer)
{
	renderer.autoClear = true;
	renderer.render(this.scene, this.bufferCamera, this.cube.material.texture);
	renderer.render(this.scene, this.player.camera);
	renderer.autoClear = false;
	renderer.render(this.hudScene, this.hudCamera);
};

Arena.prototype.resize = function(width, height)
{
	var aspect = width / height;
	var hud = 100;

	this.idk.position.x = hud * aspect * 0.4;

	this.hudCamera.resize(hud * aspect, hud);
	this.player.camera.resize(width, height);
};
