//Game object constructor
function GameObject(body, model)
{ 
	this.body = body;
	this.model = model;
}

//Function prototypes
GameObject.prototype.update = update;
GameObject.prototype.setWorld = setWorld;
GameObject.prototype.setCollidable = setCollidable;
GameObject.prototype.getGeometry = getGeometry;
GameObject.prototype.toString = toString;

//Update game object
function update()
{
	this.body.update();
	this.model.position.set(this.body.geometry.position.x, this.body.geometry.position.y, this.body.geometry.position.z);
	this.model.update();
}

//Get Body Geometry
function getGeometry()
{
	return this.body.geometry;
}


function setWorld(world)
{
	this.body.world = world;
	this.body.has_world = true;
}

function setCollidable(collidable)
{
	this.body.collidable = collidable;
}

//String
function toString()
{
	return this.body.toString();
}