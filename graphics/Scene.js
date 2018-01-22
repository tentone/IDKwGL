//Constructor creates empty scene
function Scene()
{
	this.models = [];
	this.lights = [];

	this.light = new PointLight();
}

//Add light to scene
Scene.prototype.addLight = function(light)
{
	this.lights.push(light);
}

//Add model to scene
Scene.prototype.addModel = function(model)
{
	this.models.push(model);
}

//Draw Scene to Camera
Scene.prototype.draw = function(camera)
{
	//Draw Models to Camera
	for(var i = 0; i < this.models.length; i++)
	{
		this.models[i].draw(camera, this.light);
	}
}
