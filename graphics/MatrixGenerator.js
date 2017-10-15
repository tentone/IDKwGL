function MatrixGenerator(){}

//Generate Translation Matrix
MatrixGenerator.translation = function(translate_x, translate_y, translate_z)
{
	var mat = new Matrix(4,4);
	
	mat.matrix[0][3] = translate_x;
	mat.matrix[1][3] = translate_y;
	mat.matrix[2][3] = translate_z;	
	
	return mat;
}

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
}

//Generate Rotation Matrix
MatrixGenerator.rotationMatrix = function(degrees_x, degrees_y, degrees_z)
{
	var mat = new Matrix(4,4);

	//Individual components
	if(degrees_z != 0)
	{
		var temp = new Matrix(4,4);
		var radians = Conversion.degreesToRadians(degrees_z);

		temp.matrix[0][0] = Math.cos(radians);
		temp.matrix[1][0] = Math.sin(radians);
		temp.matrix[0][1] = -temp.matrix[1][0];
		temp.matrix[1][1] = temp.matrix[0][0];

		mat.mul(temp);
	}
	if(degrees_y != 0)
	{
		var temp = new Matrix(4,4);
		var radians = Conversion.degreesToRadians(degrees_y);

		temp.matrix[0][0] = Math.cos(radians);
		temp.matrix[0][2] = Math.sin(radians);
		temp.matrix[2][0] = -temp.matrix[0][2];
		temp.matrix[2][2] = temp.matrix[0][0];

		mat.mul(temp);
	}
	if(degrees_x != 0)
	{
		var temp = new Matrix(4,4);
		var radians = Conversion.degreesToRadians(degrees_x);

		temp.matrix[1][1] = Math.cos(radians);
		temp.matrix[2][1] = Math.sin(radians);
		temp.matrix[1][2] = -temp.matrix[2][1];
		temp.matrix[2][2] = temp.matrix[1][1];

		mat.mul(temp);
	}

	return mat;
}

//Generate Scalling Matrix
MatrixGenerator.scalingMatrix = function(scale_x, scale_y, scale_z)
{
	var mat = new Matrix(4,4);

	mat.matrix[0][0] = scale_x;
	mat.matrix[1][1] = scale_y;
	mat.matrix[2][2] = scale_z;

	return mat;	
}