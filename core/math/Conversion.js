"use strict";

function Conversion(){}

Conversion.radToDegRat = 180.0 / Math.PI;
Conversion.degToRadRat = Math.PI / 180.0;

//Converts from radians to degrees
Conversion.radiansToDegree = function(radians)
{
    return radians * Conversion.radToDegRat;
};

//Converts from degrees to radians
Conversion.degreesToRadians = function(degrees)
{
    return degrees * Conversion.degToRadRat;
};

//Convert from cartesian to spherical (Vector3)
Conversion.cartesianToSpherical = function(vec)
{
 	result = new Vector3(0,0,0);

 	result.x = Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);//r = sqrt( x^2 + y^2 + z^2)
	result.y = Math.atan2(vec.y, vec.x); // a = arctan(y/x)
	result.z = Math.atan2(Math.sqrt(vec.x*vec.x + vec.y*vec.y), vec.z); // O = arcos(z / r) = arctan(sqrt(x^2 + y^2)/z)

 	return result;
};

//Convert from spherical to cartesian (Vector3)
Conversion.sphericalToCartesian = function(vec)
{
 	result = new Vector3(0,0,0);

 	aux = vec.x * Math.sin(vec.z);
 	result.x =  aux * Math.cos(vec.y);
	result.y = aux * Math.sin(vec.y);
	result.z = vec.x * Math.cos(vec.z);

 	return result;
};

//Convert from cartesian to cylindrical (Vector3)
Conversion.cartesianToCylindrical = function(vec)
{
 	result = new Vector3(0,0,0);

	result.x = Math.sqrt(vec.x*vec.x + vec.y*vec.y);
	result.y = Math.atan2(vec.y, vec.x);
 	result.z = vec.z;

 	return result;
};

Conversion.cylindricalToCartesian = function(vec)
{
	result = new Vector3(0,0,0);
 	result.x = vec.x * Math.cos(vec.y); // x = r * cos(O)
	result.y = vec.x * Math.sin(vec.y); // y = r * sin(O)
	result.z = vec.z; // z = z

	return result;
};

Conversion.test = function(vec)
{
	console.log("Cartesian to spherical test:");
	v = new Vector3(1,1,2);
	console.log(v.toString());
	a = Conversion.cartesianToSpherical(v);
	console.log(a.toString());
	v = Conversion.sphericalToCartesian(a);
	console.log(v.toString());

	console.log("\nCylindrical to cartesian test:");
	v = new Vector3(1,1,2);
	console.log(v.toString());
	a = Conversion.cartesianToCylindrical(v);
	console.log(a.toString());
	v = Conversion.cylindricalToCartesian(a);
	console.log(v.toString());
};