function World(acceleration)
{
	if(acceleration === undefined)
	{
		this.acceleration = new Vector3(0, -9.8, 0);
	}
	else
	{
		this.acceleration = acceleration;
	}

	this.friction = new Vector3(0.80, 0.80, 0.80);
	this.body = [];

	this.acceleration.mulConst(World.DELTA);
}

World.DELTA = 1/60;

//Function prototypes
World.prototype.addBody = addBody;
World.prototype.update = update;
World.prototype.toString = toString;	

//Update all bodys in world
function update()
{
	for(var i = 0; i < this.body.length; i++)
	{
		this.body[i].update(this);
	}	
}

//Add body to world
function addBody(body)
{
	body.setId(this.body.length);
	this.body.push(body);
}

//World info to String
function toString()
{
	var s = "World (BodyCount:"+this.body.length+")\n   Body List:";

	for(var i = 0; i < this.body.length; i++)
	{
		s += "\n    "+this.body[i].toString();
	}

	return s;
}