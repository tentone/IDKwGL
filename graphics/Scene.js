//Constructor creates empty scene
function Scene()
{
	this.models = [];
	this.light = new Light();
}

//Functions Prototypes
Scene.prototype.draw = draw;
Scene.prototype.addModel = addModel;

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
