function World(gravity, gravity_direction)
{
	this.gravity = gravity;
	this.gravity_direction = gravity_direction;

	this.body = [];
}

//Function prototypes
Word.prototype.addBody = addBody;
World.prototype.update = update;

function update()
{
	//TODO <ADD CODE HERE>
}

function addBody(body)
{
	this.body.push(body);
}