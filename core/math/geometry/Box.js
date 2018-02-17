"use strict";

function Box()
{
	this.position = new Vector3(0,0,0);
	this.size = new Vector3(0,0,0);
	this.ori = new Vector3(0,0,0);
	
	this.type = Geometry.BOX;
}

//Checks if body is colliding
Box.prototype.isColliding = function(obj)
{
	if(obj.type == Geometry.BOX)
	{
		var t = new Vector3(this.position.x-this.ori.x, this.position.y-this.ori.y, this.position.z-this.ori.z);
		var o = new Vector3(obj.position.x-obj.ori.x, obj.position.y-obj.ori.y, obj.position.z-obj.ori.z);
		return (t.y<(o.y+obj.size.y)) && ((t.y+this.size.y)>o.y) && (t.x<(o.x+obj.size.x)) && ((t.x+this.size.x)>o.x) && (t.z<(o.z+obj.size.z)) && ((t.z+this.size.z)>o.z);
	}

	return false;
}

//Check if box will collide after apllying a descolation
Box.prototype.willCollide = function(speed, obj)
{
	if(obj.type == Geometry.BOX)
	{
		var t = new Vector3(this.position.x + speed.x -this.ori.x, this.position.y + speed.y -this.ori.y, this.position.z + speed.z -this.ori.z);
		var o = new Vector3(obj.position.x-obj.ori.x, obj.position.y-obj.ori.y, obj.position.z-obj.ori.z);
		return (t.y<(o.y+obj.size.y)) && ((t.y+this.size.y)>o.y) && (t.x<(o.x+obj.size.x)) && ((t.x+this.size.x)>o.x) && (t.z<(o.z+obj.size.z)) && ((t.z+this.size.z)>o.z);
	}

	return false;
}

//Retuns string with box info
Box.prototype.toString = function()
{
	return "Box (Pos:"+this.position.toString()+" Size:"+this.size.toString()+" Ori:"+this.ori.toString()+")";
}

//Self test function
Box.test = function()
{
	var a = new Box();
	a.position.set(0,0,0);
	a.size.set(1,1,1);

	var b = new Box();
	b.position.set(0.5, 0.5, 0.5);
	b.size.set(1,1,1);

	console.log("Box A and B");
	console.log(a.toString());
	console.log(b.toString());

	console.log("Col A->B" + a.isColliding(b));
	console.log("Col B->A" + b.isColliding(a));
}