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

//Generate Rotation Matrix
MatrixGenerator.rotationMatrix = function(degrees_x, degrees_y, degrees_z)
{
	var mat = new Matrix(4,4);

	//Calculate Z>Y>X TODO <CHECK THIS>
	/*var rad = new Vector3(-degrees_x, degrees_y, -degrees_z);
	rad.mulConst(Conversion.degToRadRat);

	xc = Math.cos(rad.x);
	xs = Math.sin(rad.x);
	
	yc = Math.cos(rad.y);
	ys = Math.sin(rad.y);

	zc = Math.cos(rad.z);
	zs = Math.sin(rad.z);

	mat.matrix[0][0] = yc*zc;
	mat.matrix[0][1] = -yc*zs;
	mat.matrix[0][2] = ys;

	mat.matrix[1][0] = xc*zs + xs*ys*zc;
	mat.matrix[1][1] = xc*zc - xs*ys*zs;
	mat.matrix[1][2] = -xs*yc;

	mat.matrix[2][0] = xs*zs - xc*ys*zc;
	mat.matrix[2][1] = xs*zc + xc*ys*zs;
	mat.matrix[2][2] = xc*yc;*/

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
	if(true) //degrees_x != 0)
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