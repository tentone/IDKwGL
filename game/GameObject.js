//Game object constructor
function GameObject(model, body)
{
	this.model = model;

	if(body === undefined)
	{
		this.body = new Body(this.model.getBox());
	} 
	else
	{
		this.body = body;
	}
}

//Function prototypes
GameObject.prototype.update = update;
GameObject.prototype.setCollidable = setCollidable;
GameObject.prototype.getGeometry = getGeometry;
GameObject.prototype.setStatic = setStatic;
GameObject.prototype.toString = toString;
GameObject.prototype.setId = setId;
GameObject.prototype.getId = getId;

//Set ID for body
function setId(value)
{
	this.body.setId(value);
}

//Get body ID
function getId()
{
	return this.body.getId();
}

//Update game object
function update(world)
{
	this.body.update(world);
	this.model.position.set(this.body.geometry.position.x, this.body.geometry.position.y, this.body.geometry.position.z);
	this.model.update();
}

//Get Body Geometry
function getGeometry()
{
	return this.body.geometry;
}

//Set static
function setStatic(value)
{
	this.body.is_static = value;
}

//Set if it can collide
function setCollidable(collidable)
{
	this.body.collidable = collidable;
}

//Create info string
function toString()
{
	return this.body.toString();
}
