include("math/Vector2.js");

//Constructor creates indentity matrix if size_x equals size_y
function Matrix(size_x, size_y)
{
	this.matrix = [];
	this.size = new Vector2(size_x, size_y);

	var i, j;
	for(i = 0; i < this.size.x; i++)
	{
		this.matrix[i] = [];
		for(j = 0; j < this.size.y; j++)
		{
			this.matrix[i][j] = 0; 
		}
	}

	if(this.size.x == this.size.y)
	{
		for(i = 0; i < this.size.x; i++)
		{
			this.matrix[i][i] = 1;
		}
	}
}

//Function Prototypes
Matrix.prototype.toString = toString;
Matrix.prototype.transpose = transpose;
Matrix.prototype.add = add;
Matrix.prototype.sub = sub;
Matrix.prototype.mul = mul;
Matrix.prototype.mulTN = mulTN;
Matrix.prototype.flatten = flatten;
Matrix.prototype.clone = clone;

//Convert to array collum oriented
function flatten()
{
	var mat = this.clone();
	mat.transpose();

	var array = [];
	var i, j;

	for(i = 0; i < this.size.x; i++)
	{
		for(j = 0; j < this.size.y; j++)
		{
			array[i*this.size.y + j] = this.matrix[i][j];
		}
	}
	
	return new Float32Array(array);
}

//Clone matrix into new object
function clone()
{
	var mat = new Matrix(this.size.x, this.size.y);
	var i, j;

	for(i = 0; i < this.size.x; i++)
	{
		for(j = 0; j < this.size.y; j++)
		{
			mat.matrix[i][j] = this.matrix[i][j];
		}
	}

	return mat;
}

//Tranpose this matrix
function transpose()
{
	var i, j;
    var mat = [];

    for(i = 0; i < this.size.y; i++)
    {
    	mat[i] = [];

        for (j = 0; j < this.size.x; j++)
        {
            mat[i][j] = this.matrix[j][i];
        }
    }

    //Update Matrix Values
    this.size.y = this.size.x;
    this.size.x = i;
    this.matrix = mat;
}

//Multiply Matrix and store retult in a new one
function mulTN(val)
{
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		if(this.size.x != val.size.y || this.size.y != val.size.x)
		{
			throw "Matrix cant be multiplied";
		}

		mat = new Matrix(this.size.y, val.size.x);

		var i, j, k;
		var sum;

        for(i = 0; i < this.size.y; i++)
        {
            for (j = 0; j < val.size.x; j++)
            {
                sum = 0;
                for(k = 0; k < this.size.x; k++)
                {
                    sum += this.matrix[k][i] * val.matrix[j][k];
                }
                mat.matrix[i][j] = sum;
            }
        }

		return mat;
	}
}

//Multiply Matrix
function mul(val)
{
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		if(this.size.x != val.size.y || this.size.y != val.size.x)
		{
			throw "Matrix cant be multiplied";
		}

		mat = new Matrix(this.size.y, val.size.x);

		var i, j, k;
		var sum;

        for(i = 0; i < this.size.y; i++)
        {
            for (j = 0; j < val.size.x; j++)
            {
                sum = 0;
                for(k = 0; k < this.size.x; k++)
                {
                    sum += this.matrix[k][i] * val.matrix[j][k];
                }
                mat.matrix[i][j] = sum;
            }
        }

		this.matrix = mat.matrix;
		this.size.x = mat.size.x;
		this.size.y = mat.size.y;
	}
}

//Add to matrix (have to be same size)
function add(val)
{
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		if(val.size.x != this.size.x || val.size.y != this.size.y)
		{
			throw "Matrix has different size";
		}
		var i,j;
		for(i = 0; i < this.size.x; i++)
		{
			for(j = 0; j < this.size.y; j++)
			{
				this.matrix[i][j] += val.matrix[i][j];
			}
		}
	}
}

//Sub from matrix (have to be same size)
function sub(val)
{
	if(typeof val != typeof this)
	{
		throw "Incompatible types";
	}
	else
	{
		if(val.size.x != this.size.x || val.size.y != this.size.y)
		{
			throw "Matrix has different size";
		}
		var i,j;
		for(i = 0; i < this.size.x; i++)
		{
			for(j = 0; j < this.size.y; j++)
			{
				this.matrix[i][j] -= val.matrix[i][j];
			}
		}
	}
}

//toString Matrix info
function toString()
{
	string = "["
	var i=0, j;

	while(i < this.size.x)
	{
		j = 0;
		while(j < this.size.y)
		{
			string += this.matrix[i][j];
			j++;
			if(j < this.size.y)
			{
				string += ", "
			}
		}

		i++;

		if(i < this.size.x)
		{
			string += "\n ";
		}
	}
	return string + "]";
}

//Self testing function 
Matrix.test = function()
{
	//Basic Matrix Test
	mat = new Matrix(3,3);
	mat.toString();
	mat.transpose();
	mat.toString();
	mat.add(new Matrix(3,3));
	mat.toString();
	console.log(mat.flatten());

	//Matrix Mult Test
	a = new Matrix(3,2);
	a.matrix[0] = [1,4];
	a.matrix[1] = [2,5];
	a.matrix[2] = [3,6];
	a.toString();

	b = new Matrix(2,3);
	b.matrix[0] = [7,9,11];
	b.matrix[1] = [8,10,12];
	b.toString();

	m = a.mul(b);
	m.toString();

	b.transpose();
	b.toString();
}
