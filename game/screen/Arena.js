function Arena()
{
	//Create scene and world
	this.world = new World();
	this.scene = new Scene();

	//Candle
	this.candle = new Model();
	this.candle.loadOBJ(candle);
	this.candle.setTexture(Texture.createTexture("data/texture/candle.png"));
	this.candle.scale.set(2, 2, 2);
	this.candle.position.set(5,5,5);
	this.candle.update();
	this.scene.addModel(this.candle);

	//House
	this.model = new Model();
	this.model.loadOBJ(house);
	this.model.setTexture(Texture.createTexture("data/texture/house.png"));
	this.model.scale.set(5, 5, 5);
	this.model.position.set(150,0,10);
	this.model.update();
	this.scene.addModel(this.model);

	this.model = this.model.clone();
	this.model.position.set(150,0,100);
	this.model.update();
	this.scene.addModel(this.model);

	//Floor
	this.model = Model.cube();
	this.model.setTexture(Texture.createTexture("data/texture/grass.jpg"));
	this.model.position.set(0, 0, 0);
	this.model.scale.set(200, 1, 200);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));
	
	//Walls
	this.model = Model.cube();
	this.model.setTexture(Texture.generateSolidColorTexture(Color.WHITE));
	this.model.position.set(0, 0, -150);
	this.model.scale.set(150, 30, 1);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.generateSolidColorTexture(Color.WHITE));
	this.model.position.set(0, 0, 150);
	this.model.scale.set(150, 30, 1);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.generateSolidColorTexture(Color.WHITE));
	this.model.position.set(-150, 0, 0);
	this.model.scale.set(1, 30, 150);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));

	this.model = Model.cube();
	this.model.setTexture(Texture.generateSolidColorTexture(Color.WHITE));
	this.model.position.set(150, 0, 0);
	this.model.scale.set(1, 30, 150);
	this.model.update();
	this.scene.addModel(this.model);
	this.world.addBody(new GameObject(this.model));
	
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

	//Draw static camera
	this.camera_static.camera.startFrame();
	this.camera_static.camera.useShader(shaderLightPixel);
	this.weapon.draw(this.camera_static.camera);
}

//Resize cameras
function resize(canvas)
{
	this.player.camera.resize(canvas.width, canvas.height);
	this.camera_static.camera.resize(canvas.width, canvas.height);
}
