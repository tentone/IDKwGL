//Constructor creates empty scene
function Scene()
{
	this.models = [];
	this.lights = [];
}

//Functions Prototypes
Scene.prototype.draw = draw;
Scene.prototype.addModel = addModel;
Scene.prototype.addLight = addLight;

//Add model to scene
function addModel(model)
{
	this.models.push(model);
}

//Add light to scene
function addLight(light)
{
	this.lights.push(light);
}

//Draw Scene to Camera
function draw(camera)
{
	//Draw Models to Camera
	for(i = 0; i < this.models.length; i++)
	{
		this.models[i].draw(camera);
	}
}
