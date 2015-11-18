function Box()
{
	this.pos = new Vector3(0,0,0);
	this.size = new Vector3(0,0,0);
	this.ori = new Vector3(0,0,0);
	this.type = Geometry.BOX;
}

Box.prototype.isColliding = isColliding;

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
		//TODO
	}
	else
	{
		return false;
	}
}
