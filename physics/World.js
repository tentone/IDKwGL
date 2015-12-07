function World(acceleration)
{
	if(acceleration === undefined)
	{
		acceleration = new Vector3(0, -9.8, 0);
	}

	this.acceleration = acceleration;
	this.friction = new Vector3(0.55,0.55,0.55);
	this.body = [];

	this.acceleration.mulConst(World.DELTA);
}

World.DELTA = 1/60;

//Function prototypes
World.prototype.addBody = addBody;
World.prototype.update = update;
World.prototype.toString = toString;	

function update()
{
	for(var i = 0; i < this.body.length ; i++)
	{
		this.body[i].update();
	}	
}

function addBody(body)
{
	this.body.push(body);
	body.setWorld(this);
}

function toString()
{
	var s = "World (BodyCount:"+this.body.length+")\n   Body List:";

	for(var i = 0; i < this.body.length; i++)
	{
		s += "\n    "+this.body[i].toString();
	}

	return s;
}