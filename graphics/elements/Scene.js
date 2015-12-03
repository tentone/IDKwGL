function Scene()
{
	this.models = [];
	this.lights = [];
}

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
	//TODO <ADD ILUMINATION>

	//Draw Models to Camera
	for(i = 0; i < models.length; i++)
	{
		models.draw(camera);
	}
}
