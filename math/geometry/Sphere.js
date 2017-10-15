function Sphere()
{
	this.position = new Vector3(0,0,0);
	this.radius = 0;
	this.ori = new Vector3(0,0,0);

	this.type = Geometry.SPHERE;
}

//Functions Prototypes
Sphere.prototype.isColliding = isColliding;
Sphere.prototype.willCollide = willCollide;
Sphere.prototype.toString = toString;

//Check if its colliding
function isColliding(obj)
{
	if(obj.type == Geometry.SPHERE)
	{
		return MathUtils.pointDistance(this.position, obj.position) > this.radius + obj.radius;
	}

	return false;
}

//Check if will collide after movement
function willCollide(speed, obj)
{
	return false;
}

//Retuns string with sphere info
function toString()
{
	return "Pos"+this.position.toString()+" Radius"+this.radius+" Ori"+this.ori.toString();
}