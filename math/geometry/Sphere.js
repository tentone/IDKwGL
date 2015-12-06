function Sphere()
{
	this.position = new Vector3(0,0,0);
	this.radius = 0;
	this.ori = new Vector3(0,0,0);
	this.type = Geometry.SPHERE;
}

Sphere.prototype.isColliding = isColliding;

function isColliding(obj)
{
	if(obj.type == Geometry.BOX)
	{
		//TODO <ADD CODE HERE>
	}
	else if(obj.type == Geometry.SPHERE)
	{
		return MathUtils.pointDistance(this.position, obj.position) > this.radius + obj.radius;
	}

	return false;
}
