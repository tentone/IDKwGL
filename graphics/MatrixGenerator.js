include("math/Conversion.js");

function MatrixGenerator(){}

MatrixGenerator.translation = function(translate_x, translate_y, translate_z)
{
	mat = new Matrix(4,4);
	
	mat.matrix[0][3] = translate_x;
	mat.matrix[1][3] = translate_y;
	mat.matrix[2][3] = translate_z;	
	
	return mat;	
}

MatrixGenerator.rotationMatrix = function(degrees_x, degrees_y, degrees_z)
{
	var mat = new Matrix(4,4);

	if(degrees_z != 0)
	{
		temp = new Matrix(4,4);
		radians = Conversion.degreesToRadians(degrees_z);

		temp.matrix[0][0] = Math.cos(radians);
		temp.matrix[0][1] = -Math.sin(radians);
		temp.matrix[1][0] = -temp.matrix[0][1];
		temp.matrix[1][1] = temp.matrix[0][0];

		mat.mul(temp);
	}
	if(degrees_y != 0)
	{
		temp = new Matrix(4,4);
		radians = Conversion.degreesToRadians(degrees_y);

		temp.matrix[0][0] = Math.cos(radians);
		temp.matrix[0][2] = Math.sin(radians);
		temp.matrix[2][0] = -temp.matrix[0][2];
		temp.matrix[2][2] = temp.matrix[0][0];

		mat.mul(temp);
	}
	if(degrees_x != 0)
	{
		temp = new Matrix(4,4);
		radians = Conversion.degreesToRadians(degrees_x);

		temp.matrix[1][1] = Math.cos(radians);
		temp.matrix[1][2] = -Math.sin(radians);
		temp.matrix[2][1] = -temp.matrix[1][2];
		temp.matrix[2][2] = temp.matrix[1][1];

		mat.mul(temp);
	}

	return mat;
}

MatrixGenerator.scalingMatrix = function(scale_x, scale_y, scale_z)
{
	mat = new Matrix(4,4);
	
	mat.matrix[0][0] = scale_x;
	mat.matrix[1][1] = scale_y;
	mat.matrix[2][2] = scale_z;	
	
	return mat;	
}