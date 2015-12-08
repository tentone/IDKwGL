function Arena()
{
	//Create this.world
	this.world = new World();

	//Create new Scene
	this.scene = new Scene();

	//Sprite Test
	this.plane = Model.plane();
	this.plane.setTexture(Texture.createTexture("data/texture/flare.png"));
	this.plane.position.set(0,0,9);
	this.plane.update();

	//Models
	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wood_box.png"));
	this.model.position.set(0,-2,0);
	this.model.scale.set(30,1,30);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = new Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wood_box.png"));
	this.model.position.set(8,2,0);
	this.model.scale.set(1,2,1);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = new Model();
	this.model.loadOBJ(cardboard_boxes);
	this.model.setTexture(Texture.createTexture("data/texture/cardboard_boxes.png"));
	this.model.position.set(-5,-1,0);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = new Model();
	this.model.loadOBJ(cardboard_boxes);
	this.model.setTexture(Texture.createTexture("data/texture/cardboard_boxes.png"));
	this.model.position.set(5,-1,-3);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wood_box.png"));
	this.model.position.set(7,0,8);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wood_box.png"));
	this.model.position.set(7,2,8);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = new Model();
	this.model.loadOBJ(orc);
	this.model.setTexture(Texture.createTexture("data/texture/orc.bmp"));
	this.model.position.set(2,-1,-6);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = new Model();
	this.model.loadOBJ(baron_nashor);
	this.model.setTexture(Texture.createTexture("data/texture/baron_nashor.bmp"));
	this.model.position.set(-12,-0.7,0);
	this.model.scale.set(0.03,0.03,0.03);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = this.model.clone();
	this.model.setTexture(Texture.createTexture("data/texture/baron_nashor_green.bmp"));
	this.model.scale.set(0.03,0.03,0.03);
	this.model.position.set(-18,-0.7,0);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = new Model();
	this.model.loadOBJ(cleffa);
	this.model.setTexture(Texture.createTexture("data/texture/cleffa.png"));
	this.model.scale.set(0.005,0.005,0.005);
	this.model.update();
	this.particle = new ParticleEmitter(this.model, new Vector3(0,0,0), new Vector3(0,0,0), new Vector3(0.5,0.5,0.5), 1.0, 0.5, 300, 100, 100);
	this.scene.addModel(this.particle);

	this.player = new Player(canvas);
	this.camera_weapon = new Spectator(canvas);
}

Arena.prototype.draw = draw;
Arena.prototype.update = update;
Arena.prototype.resize = resize;

function update()
{
	//Update Player Camera Position
	this.world.update();
	this.player.update();
	this.particle.update();

	this.plane.rotation.y = -this.player.camera.rotation.y;
	this.plane.update();

	if(App.keyboard.isKeyPressed(Keyboard.Y))
	{
		var sc = new ArenaTest();
		screen = sc;
	}

	if(App.keyboard.isKeyPressed(Keyboard.LEFT))
	{
		this.scene.light.position.z -= 0.5;
	}
	if(App.keyboard.isKeyPressed(Keyboard.RIGHT))
	{
		this.scene.light.position.z += 0.5;
	}
	if(App.keyboard.isKeyPressed(Keyboard.UP))
	{
		this.scene.light.position.y += 0.5;
	}
	if(App.keyboard.isKeyPressed(Keyboard.DOWN))
	{
		this.scene.light.position.y -= 0.5;
	}
}

function draw()
{
    //Clearing the frame-buffer and the depth-buffer
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Draw Stuff to Spectator Camera
	this.player.camera.startFrame();
	this.player.camera.useShader(shaderLightPixel);

	this.scene.draw(this.player.camera);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	this.camera_weapon.camera.startFrame();
	this.camera_weapon.camera.useShader(shaderLightPixel);
	this.plane.draw(this.camera_weapon.camera);
	gl.disable(gl.BLEND);
}

function resize(canvas)
{
	this.player.camera.resize(canvas.width, canvas.height);
}