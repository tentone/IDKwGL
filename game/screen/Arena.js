"use strict";

function Arena()
{
	//Create scene and world
	this.world = new World();
	this.scene = new Scene();

	//Referencial
	this.referential = new Referencial(this.scene);

	//Skybox
	this.skybox = OBJLoader.load(FileLoader.loadText("data/models/skybox/skybox.obj"));
	this.skybox.material = new BasicMaterial();
	this.skybox.material.texture = new Texture("data/models/skybox/skybox.jpg");
	this.skybox.scale.set(800,800,800);
	this.skybox.rotation.set(-1.57, 0, 0);
	this.skybox.updateMatrix();
	this.scene.add(this.skybox);
	
	//Tank
	this.model = OBJLoader.load(tank);
	this.model.setTexture(new Texture("data/texture/tank.jpg"));
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
	this.bus.position.set(100,19.8,300);
	this.bus.rotation.set(0, Math.PI ,0);
	this.bus.updateMatrix();
	this.scene.add(this.bus);
	this.world.addBody(new GameObject(this.bus));
	
	//House
	this.model = OBJLoader.load(house);
	this.model.setTexture(new Texture("data/texture/house.jpg"));
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
	this.model.setTexture(new Texture("data/texture/wood_box.jpg"));
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

	//Floor
	this.model = new Mesh(new BoxGeometry());
	this.model.setTexture(new Texture("data/texture/grass.jpg"));
	this.model.geometry.scaleUV(30, 30);
	this.model.position.set(0, -100, 0);
	this.model.scale.set(900, 100, 900);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));
	
	//Walls
	this.model = new Mesh(new BoxGeometry());
	this.model.setTexture(new Texture("data/texture/wall.png"));
	this.model.geometry.scaleUV(20, 1);
	this.model.position.set(0, 0, -400);
	this.model.scale.set(400, 50, 1);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = new Mesh(new BoxGeometry());
	this.model.setTexture(new Texture("data/texture/wall.png"));
	this.model.geometry.scaleUV(20, 1);
	this.model.position.set(0, 0, 400);
	this.model.scale.set(400, 50, 1);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = new Mesh(new BoxGeometry());
	this.model.setTexture(new Texture("data/texture/wall.png"));
	this.model.geometry.scaleUV(20, 1);
	this.model.position.set(-400, 0, 0);
	this.model.scale.set(1, 50, 400);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = new Mesh(new BoxGeometry());
	this.model.setTexture(new Texture("data/texture/wall.png"));
	this.model.geometry.scaleUV(20, 1);
	this.model.position.set(400, 0, 0);
	this.model.scale.set(1, 50, 400);
	this.model.updateMatrix();
	this.scene.add(this.model);
	this.world.addBody(new GameObject(this.model));

	var texture = new Texture("data/texture/grass.png");
	var position = new Vector3();

	//Grass
	for(var i = 0; i < 200; i++)
	{
		position.set(MathUtils.randomMod()*400, 4, MathUtils.randomMod()*400);

		var grass = new Sprite();
		grass.setTexture(texture);
		grass.scale.set(8, 8, 1);
		grass.position.copy(position);
		grass.updateMatrix();
		this.scene.add(grass);

		var grass = new Sprite();
		grass.setTexture(texture);
		grass.scale.set(8, 8, 1);
		grass.position.copy(position);
		grass.rotation.set(0, 1.57, 0);
		grass.updateMatrix();
		this.scene.add(grass);
	}

	//Tank smoke
	/*this.model = new Sprite();
	this.model.setTexture(new Texture("data/texture/smoke_2.png"));
	this.model.scale.set(4, 4, 1);
	this.model.position.set(MathUtils.randomMod()*400, 2, MathUtils.randomMod()*400);
	this.model.updateMatrix();
	this.particle = new ParticleEmitter(this.model, new Vector3(-250,8,100), new Vector3(0,0.7,0), new Vector3(0.3,0.5,0.3), 6, 4, 150, 150, 50);*/
	
	//Bullet
	/*this.bullet = new Mesh();
	this.bullet = OBJLoader.load(FileLoader.loadText("data/models/skybox/skybox.obj"));
	this.bullet.setTexture(Texture.generateSolidColorTexture(gl, Color.WHITE));
	this.bullet.scale.set(0.2,0.2,0.2);
	this.bullet.position.set(0,8,0);
	this.bullet.updateMatrix();
	
	this.bulletParticle = new Particle(this.bullet.clone(), new Vector3(0,8,0), new Vector3(0,0,0), 1, 10000);
	this.bulletParticleList = [];*/

	//Player
	this.player = new Player();
	this.world.addBody(this.player);
	this.world.body[this.world.body.length-1].setStatic(false);

	//Test Cube
	this.cube = new Mesh(new BoxGeometry());
	this.cube.setTexture(new Texture("data/texture/wood_box.jpg"));//font.pageTexture[0]);
	this.cube.position.set(0,0,0);
	this.cube.scale.set(5,5,5);
	this.cube.updateMatrix();
	this.scene.add(this.cube);
}

Arena.prototype.update = function()
{
	/*
	this.particle.update();
	*/

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
		this.weapon.setTexture(new Texture("data/models/pulserifle/tex1.jpg"));
		this.weapon.scale.set(2, 2, 2);
		this.weapon.position.set(-0.3,-0.3,0.5);
		this.weapon.update();
	}
	if(App.keyboard.isKeyPressed(Keyboard.NUM2))
	{
		this.weapon = new Mesh();
		this.weapon = OBJLoader.load(FileLoader.loadText("data/models/scopedrifle/scopedrifle.obj"));
		this.weapon.setTexture(new Texture("data/models/scopedrifle/tex1.jpg"));
		this.weapon.scale.set(2, 2, 2);
		this.weapon.position.set(-0.3,-0.3,0.5);
		this.weapon.update();
	}*/

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
	renderer.render(this.scene, this.player.camera);
};

Arena.prototype.resize = function(width, height)
{
	this.player.camera.resize(width, height);
};
