function Box()
{
	this.pos = new Vector3(0,0,0);
	this.size = new Vector3(0,0,0);
	this.ori = new Vector3(0,0,0);
	this.type = Geometry.BOX;
}

//Function Prototypes
Box.prototype.isColliding = isColliding;
Box.prototype.toString = toString;

function isColliding(obj)
{
	if(obj.type == Geometry.BOX)
	{
		var t = new Vector3(this.pos.x-this.ori.x, this.pos.y-this.ori.y, this.pos.z-this.ori.z);
		var o = new Vector3(obj.pos.x-obj.ori.x, obj.pos.y-obj.ori.y, obj.pos.z-obj.ori.z);
		return (t.y<(o.y+obj.size.y)) && ((t.y+this.size.y)>o.y)
			&& (t.x<(o.x+obj.size.x)) && ((t.x+this.size.x)>o.x)
			&& (t.z<(o.z+obj.size.z)) && ((t.z+this.size.z)>o.z);
	}
	else if(obj.type == Geometry.SPHERE)
	{
		//TODO <ADD CODE HERE>
	}
	else
	{
		return false;
	}
}

function toString()
{
	return "Pos"+this.pos.toString()+" Size"+this.size.toString();
}

Box.test = function()
{
	a = new Box();
	a.pos.set(0,0,0);
	a.size.set(1,1,1);

	b = new Box();
	b.pos.set(0.5, 0.5, 0.5);
	b.size.set(1,1,1);

	console.log("Box A and B");
	console.log(a.toString());
	console.log(b.toString());

	console.log("Col A->B" + a.isColliding(b));
	console.log("Col B->A" + b.isColliding(a));
}