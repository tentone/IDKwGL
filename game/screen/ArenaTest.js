function ArenaTest()
{
	//Create this.world
	this.world = new World(new Vector3(0,0,0));

	//Test Model to load texture
	this.scene = new Scene();

	//Test elements (PHYSICS)
	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/wood_box.png"));
	this.model.position.set(0,-2,0);
	this.model.scale.set(30,1,30);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));
	this.world.body[this.world.body.length-1].setStatic(true);

	this.model = new Model();
	this.model.loadOBJ(baron_nashor);
	this.model.setTexture(Texture.createTexture("data/texture/baron_nashor.bmp"));
	this.model.position.set(-8,4,0);
	this.model.scale.set(0.03,0.03,0.03);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));
	this.world.body[this.world.body.length-1].setStatic(true);

	this.model = new Model.cube();
	this.model.setTexture(Texture.generateSolidColorTexture(Color.GREEN));
	this.model.position.set(8,5,0);
	this.model.scale.set(3,3,3);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));
	this.world.body[this.world.body.length-1].setStatic(true);

	this.model = new Model.cube();
	this.model.setTexture(Texture.generateSolidColorTexture(Color.BLUE));
	this.model.position.set(7,4,5);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(this.game_object = new GameObject(this.model));

	//Test elements
	this.model = new Model();
	this.model.loadOBJ(cardboard_boxes);
	this.model.setTexture(Texture.createTexture("data/texture/cardboard_boxes.png"));
	this.model.position.set(-5,1,0);
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

	this.model = this.model.clone();
	this.model.position.set(-2,-1,6);
	this.model.rotation.set(0,90,0);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = new Model();
	this.model.loadOBJ(cleffa);
	this.model.setTexture(Texture.createTexture("data/texture/cleffa.png"));
	this.model.scale.set(0.005,0.005,0.005);
	this.model.update();
	this.scene.addModel(this.model);

	this.particle = new ParticleEmitter(this.model, new Vector3(0,0,0), new Vector3(0,0,0), new Vector3(0.5,0.5,0.5), 1.0, 0.5, 300, 100, 100);

	this.model = new Model();
	this.model.loadOBJ(baron_nashor);
	this.model.setTexture(Texture.createTexture("data/texture/baron_nashor_green.bmp"));
	this.model.scale.set(0.03,0.03,0.03);
	this.model.position.set(-15,-0.7,0);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = new Model.cube();
	this.model.setTexture(Texture.generateSolidColorTexture(Color.BLUE));
	this.model.position.set(7,4,5);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(this.weapon = new GameObject(this.model));

	this.spectator = new Spectator(canvas);
}

ArenaTest.prototype.draw = draw;
ArenaTest.prototype.update = update;
ArenaTest.prototype.resize = resize;

function update()
{
	//Update Player Camera Position
	this.world.update();
	this.spectator.update();
	this.particle.update();
	
	//Model Move Test
	if(App.keyboard.isKeyPressed(Keyboard.DOWN))
	{
		this.game_object.body.acceleration.y -= 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.UP))
	{
		this.game_object.body.acceleration.y += 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.LEFT))
	{
		this.game_object.body.acceleration.x -= 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.RIGHT))
	{
		this.game_object.body.acceleration.x += 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.O))
	{
		this.game_object.body.acceleration.z -= 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.P))
	{
		this.game_object.body.acceleration.z += 0.1;
	}
}

function draw()
{
    //Clearing the frame-buffer and the depth-buffer
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Draw Stuff to Spectator Camera
	this.spectator.camera.startFrame();
	this.spectator.camera.useShader(shaderLightPixel);

	this.scene.draw(this.spectator.camera);
	this.particle.draw(this.spectator.camera);
}

function resize()
{
	this.spectator.camera.resize(canvas.width, canvas.height);
}