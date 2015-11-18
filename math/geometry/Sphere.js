function Sphere()
{
	this.pos = new Vector3(0,0,0);
	this.radius = 0;
	this.ori = new Vector3(0,0,0);
	this.type = Geometry.SPHERE;
}

Sphere.prototype.isColliding = isColliding;

function isColliding(obj)
{
	if(obj.type == Geometry.BOX)
	{
		//TODO
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
