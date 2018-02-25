"use strict";

//Constructor creates indentity matrix if width equals height
function Matrix(width, height)
{
	this.matrix = [];
	this.size = new Vector2(width, height);

	for(var i = 0; i < this.size.x; i++)
	{
		this.matrix[i] = [];
		for(var j = 0; j < this.size.y; j++)
		{
			this.matrix[i][j] = 0; 
		}
	}

	if(this.size.x === this.size.y)
	{
		for(var i = 0; i < this.size.x; i++)
		{
			this.matrix[i][i] = 1;
		}
	}
}

//Clears matrix data to 0's if matrix if square clears to indentity
Matrix.prototype.clear = function()
{
	for(var i = 0; i < this.size.x; i++)
	{
		this.matrix[i] = [];
		for(var j = 0; j < this.size.y; j++)
		{
			this.matrix[i][j] = 0; 
		}
	}

	if(this.size.x === this.size.y)
	{
		for(i = 0; i < this.size.x; i++)
		{
			this.matrix[i][i] = 1;
		}
	}
};

//Checks if matri is equals to another
Matrix.prototype.equals = function(val)
{
	for(var i = 0; i < this.size.x; i++)
	{
		for(var j = 0; j < this.size.y; j++)
		{
			if(this.matrix[i][j] !== val.matrix[i][j])
			{
				return false;
			}
		}
	}

	return true;
};

//Convert to array collum oriented
Matrix.prototype.flatten = function()
{
	var array = new Float32Array(this.size.x * this.size.y);
	var k = 0;

	for(var i = 0; i < this.size.y; i++)
	{
		for(var j = 0; j < this.size.x; j++)
		{
			array[k] = this.matrix[i][j];
			k++;
		}
	}

	return array;
};

//Clone matrix into new object
Matrix.prototype.clone = function()
{
	var mat = new Matrix(this.size.x, this.size.y);

	for(var i = 0; i < this.size.x; i++)
	{
		for(var j = 0; j < this.size.y; j++)
		{
			mat.matrix[i][j] = this.matrix[i][j];
		}
	}

	return mat;
};

//Tranpose this matrix
Matrix.prototype.transpose = function()
{
	var mat = [];
	
	for(var i = 0; i < this.size.y; i++)
	{
		mat[i] = [];
		for(var j = 0; j < this.size.x; j++)
		{
			mat[i][j] = this.matrix[j][i];
		}
	}

	//Update Matrix Values
	this.size.y = this.size.x;
	this.size.x = i;
	this.matrix = mat;
};

//Multiply Matrix
Matrix.prototype.mul = function(val)
{
	if(this.size.x !== val.size.y)
	{
		throw "Matrix cant be multiplied (check matrix size)";
	}

	var mat = new Matrix(this.size.y, val.size.x);
	for(var j = 0; j < val.size.x; j++)
	{
		for(var i = 0; i < this.size.y; i++)
		{
			var sum = 0;
			for(var k = 0; k < this.size.x; k++)
			{
				sum += this.matrix[k][i] * val.matrix[j][k];
			}
			mat.matrix[j][i] = sum;
		}
	}

	this.matrix = mat.matrix;
	this.size.x = mat.size.x;
	this.size.y = mat.size.y;
};

//Add to matrix (have to be same size)
Matrix.prototype.add = function(val)
{
	if(val.size.x !== this.size.x || val.size.y !== this.size.y)
	{
		throw "Matrix has different size";
	}

	for(var i = 0; i < this.size.x; i++)
	{
		for(var j = 0; j < this.size.y; j++)
		{
			this.matrix[i][j] += val.matrix[i][j];
		}
	}
};

//Sub from matrix (have to be same size)
Matrix.prototype.sub = function(val)
{
	if(val.size.x !== this.size.x || val.size.y !== this.size.y)
	{
		throw "Matrix has different size";
	}

	for(var i = 0; i < this.size.x; i++)
	{
		for(var j = 0; j < this.size.y; j++)
		{
			this.matrix[i][j] -= val.matrix[i][j];
		}
	}
};

//toString Matrix info
Matrix.prototype.toString = function()
{
	var string = "["
	var i = 0, j = 0;

	while(i < this.size.y)
	{
		j = 0;
		while(j < this.size.x)
		{
			string += this.matrix[j][i];
			j++;
			if(j < this.size.x)
			{
				string += ", "
			}
		}

		i++;

		if(i < this.size.y)
		{
			string += "\n ";
		}
	}
	
	return string + "]";
};

//Multiply Matrix and store retult in a new one
Matrix.mul = function(a, b)
{
	if(a.size.x !== b.size.y)
	{
		throw "Matrix cant be multiplied (check matrix size)";
		return null;
	}

	var mat = new Matrix(a.size.y, b.size.x);
	for(var j = 0; j < b.size.x; j++)
	{
		for(var i = 0; i < a.size.y; i++)
		{
			var sum = 0;
			for(var k = 0; k < a.size.x; k++)
			{
				sum += a.matrix[k][i] * b.matrix[j][k];
			}
			mat.matrix[j][i] = sum;
		}
	}

	return mat;
};
	
//Self testing function 
Matrix.test = function()
{
	//Matrix Initilization
	//a = [3,2,-1;4,-5,2]
	var a = new Matrix(3,2);
	a.matrix[0][0] = 3;
	a.matrix[1][0] = 2;
	a.matrix[2][0] = -1;
	a.matrix[0][1] = 4;
	a.matrix[1][1] = -5;
	a.matrix[2][1] = 2;

	//b = [3,-1;-5,5;-2,11]
	var b = new Matrix(2,3);
	b.matrix[0][0] = 3;
	b.matrix[1][0] = -1;
	b.matrix[0][1] = -5;
	b.matrix[1][1] = 5;
	b.matrix[0][2] = -2;
	b.matrix[1][2] = 11;

	var c = new Matrix(4,4);

	//d = [2,1,-2,1;-1,5,4,9;-11,-2,4,3;2,5,1,-3]
	var d = new Matrix(4,4);
	d.matrix[0][0] = 2;
	d.matrix[1][0] = 1;
	d.matrix[2][0] = -2;
	d.matrix[3][0] = 1;
	d.matrix[0][1] = -1;
	d.matrix[1][1] = 5;
	d.matrix[2][1] = 4;
	d.matrix[3][1] = 9;
	d.matrix[0][2] = -11;
	d.matrix[1][2] = -2;
	d.matrix[2][2] = 4;
	d.matrix[3][2] = 3;
	d.matrix[0][3] = 2;
	d.matrix[1][3] = 5;
	d.matrix[2][3] = 1;
	d.matrix[3][3] = -3;

	//f = [0,3,9,2;-2,5,3,1;-12,1,-4,-3;6,2,3,-1]
	var f = new Matrix(4,4);
	f.matrix[0][0] = 0;
	f.matrix[1][0] = 3;
	f.matrix[2][0] = 9;
	f.matrix[3][0] = 2;
	f.matrix[0][1] = -2;
	f.matrix[1][1] = 5;
	f.matrix[2][1] = 3;
	f.matrix[3][1] = 1;
	f.matrix[0][2] = -12;
	f.matrix[1][2] = 1;
	f.matrix[2][2] = -4;
	f.matrix[3][2] = -3;
	f.matrix[0][3] = 6;
	f.matrix[1][3] = 2;
	f.matrix[2][3] = 3;
	f.matrix[3][3] = -1;

	//A
	console.log("A");
	console.log(a.toString());

	//B
	console.log("\nB");
	console.log(b.toString());

	//D
	console.log("\nD");
	console.log(d.toString());

	//F
	console.log("\nF");
	console.log(f.toString());

	//G = D * F
	var g = Matrix.mul(d, f);
	console.log("\nG = D * F");
	console.log(g.toString());

	//H = F * D
	var h = Matrix.mul(f, d);
	console.log("\nH = F * D");
	console.log(h.toString());

	//I = A * B
	var i = Matrix.mul(a, b);
	console.log("\nI = A * B");
	console.log(i.toString());

	//J = B * A
	var j = Matrix.mul(b, a);
	console.log("\nI = B * A");
	console.log(j.toString());

	//K = G * ID(4x4)
	var k = Matrix.mul(g, c);
	console.log("\nK = G * ID(4x4)");
	console.log(k.toString());
};
