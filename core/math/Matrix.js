"use strict";

/**
 * Generic size matrix class.
 *
 * Constructor creates indentity matrix if width equals height
 */
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

Matrix.prototype.constructor = Matrix;

/**
 * Clears matrix data to 0's if matrix if square clears to indentity.
 */
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

/**
 * Checks if this matrix is equals to another.
 */
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

/**
 * Convert to array collum oriented as a Float32Array.
 */
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
		throw new Error("IDKwGL: Matrix cant be multiplied, check matrix size");
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
		throw new Error("IDKwGL: Matrix has different size");
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
		throw new Error("IDKwGL: Matrix has different size");
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
		throw new Error("IDKwGL: Matrix cant be multiplied, check matrix size");
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
