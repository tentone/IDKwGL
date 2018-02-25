"use strict";

function MatrixGenerator(){}

//Generate Translation Matrix
MatrixGenerator.translation = function(translateX, translateY, translateZ)
{
	var mat = new Matrix(4,4);
	
	mat.matrix[0][3] = translateX;
	mat.matrix[1][3] = translateY;
	mat.matrix[2][3] = translateZ;	
	
	return mat;
};

//Creates rotation from direction vector (Vector3)
MatrixGenerator.directionMatrix = function(direction)
{
	var mat = new Matrix(4,4);
	var up = new Vector3(0,1,0);

	var xaxis = Vector3.cross(up, direction);
	xaxis.normalize();

	var yaxis = Vector3.cross(direction, xaxis);
	yaxis.normalize();

	mat.matrix[0][0] = xaxis.x;
	mat.matrix[1][0] = yaxis.x;
	mat.matrix[2][0] = direction.x;

	mat.matrix[0][1] = xaxis.y;
	mat.matrix[1][1] = yaxis.y;
	mat.matrix[2][1] = direction.y;

	mat.matrix[0][2] = xaxis.z;
	mat.matrix[1][2] = yaxis.z;
	mat.matrix[2][2] = direction.z;

	return mat;
};

//Generate Rotation Matrix
MatrixGenerator.rotationMatrix = function(degreesX, degreesY, degreesZ)
{
	var mat = new Matrix(4,4);

	//Individual components
	if(degreesZ !== 0)
	{
		var temp = new Matrix(4,4);
		var radians = Conversion.degreesToRadians(degreesZ);

		temp.matrix[0][0] = Math.cos(radians);
		temp.matrix[1][0] = Math.sin(radians);
		temp.matrix[0][1] = -temp.matrix[1][0];
		temp.matrix[1][1] = temp.matrix[0][0];

		mat.mul(temp);
	}
	if(degreesY !== 0)
	{
		var temp = new Matrix(4,4);
		var radians = Conversion.degreesToRadians(degreesY);

		temp.matrix[0][0] = Math.cos(radians);
		temp.matrix[0][2] = Math.sin(radians);
		temp.matrix[2][0] = -temp.matrix[0][2];
		temp.matrix[2][2] = temp.matrix[0][0];

		mat.mul(temp);
	}
	if(degreesX !== 0)
	{
		var temp = new Matrix(4,4);
		var radians = Conversion.degreesToRadians(degreesX);

		temp.matrix[1][1] = Math.cos(radians);
		temp.matrix[2][1] = Math.sin(radians);
		temp.matrix[1][2] = -temp.matrix[2][1];
		temp.matrix[2][2] = temp.matrix[1][1];

		mat.mul(temp);
	}

	return mat;
};

//Generate Scalling Matrix
MatrixGenerator.scalingMatrix = function(scaleX, scaleY, scaleZ)
{
	var mat = new Matrix(4,4);

	mat.matrix[0][0] = scaleX;
	mat.matrix[1][1] = scaleY;
	mat.matrix[2][2] = scaleZ;

	return mat;	
};
