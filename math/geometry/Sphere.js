function Sphere()
{
	this.position = new Vector3(0,0,0);
	this.radius = 0;
	this.ori = new Vector3(0,0,0);

	this.type = Geometry.SPHERE;
}

Sphere.prototype.isColliding = isColliding;
Sphere.prototype.willCollide = willCollide;

function isColliding(obj)
{
	if(obj.type == Geometry.SPHERE)
	{
		return MathUtils.pointDistance(this.position, obj.position) > this.radius + obj.radius;
	}

	return false;
}

function willCollide(speed, obj)
{
	return false;
}
