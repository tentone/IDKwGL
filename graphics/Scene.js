//Constructor creates empty scene
function Scene()
{
	this.models = [];
	this.lights = [];

	this.light = new PointLight();
}

//Functions Prototypes
Scene.prototype.addLight = addLight;
Scene.prototype.addModel = addModel;
Scene.prototype.draw = draw;

//Add light to scene
function addLight(light)
{
	this.lights.push(light);
}

//Add model to scene
function addModel(model)
{
	this.models.push(model);
}

//Draw Scene to Camera
function draw(camera)
{
	//Draw Models to Camera
	for(var i = 0; i < this.models.length; i++)
	{
		this.models[i].draw(camera, this.light);
	}
}
