"use strict";

/*
 * Geometry class represents triangulated geometries and auxiliar vertex data.
 *
 * Vertex are organized into faces.
 */
function Geometry()
{
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Geometry";

	/** 
	 * Geometry vertices, each vertex is composed of 3 values.
	 */
	this.vertex = [];

	/**
	 * Vertex UV for texture mapping, each UV is composed of 2 values.
	 */
	this.uvs = [];

	/**
	 * Normal vector of the vertex, each vector composed of 3 values.
	 */
	this.normals = [];

	/**
	 * List of faces that compose the geometry, each face is composed of 3 indices. Each one for a point of the face.
	 */
	this.faces = [];

	/**
	 * Tangent vectors, used for normal mapping in tangent space.
	 */
	this.tangent = [];
}

Geometry.prototype.constructor = Geometry;

/**
 * Calculate tangent vector for normal mapping.
 */
Geometry.prototype.calculateTangent = function()
{
	this.tangent = [];

	for(var i = 0 ; i < this.faces.length; i += 3)
	{
		var f0 = this.faces[i];
		var f1 = this.faces[i + 1];
		var f2 = this.faces[i + 2];

		var edge1X = this.vertex[f1] - this.vertex[f0];
		var edge1Y = this.vertex[f1 + 1] - this.vertex[f0 + 1];
		var edge1Z = this.vertex[f1 + 2] - this.vertex[f0 + 2];

		var edge2X = this.vertex[f2] - this.vertex[f0];
		var edge2Y = this.vertex[f2 + 1] - this.vertex[f0 + 1];
		var edge2Z = this.vertex[f2 + 2] - this.vertex[f0 + 2];

		//UV
		var deltaU1 = this.uvs[f1] - this.uvs[f0];
		var deltaV1 = this.uvs[f1 + 1] - this.uvs[f0 + 1];

		var deltaU2 = this.uvs[f2] - this.uvs[f0];
		var deltaV2 = this.uvs[f2 + 1] - this.uvs[f0 + 1];

		var f = 1.0 / (deltaU1 * deltaV2 - deltaU2 * deltaV1);

		var tangentX = f * (deltaV2 * edge1X - deltaV1 * edge2X);
		var tangentY = f * (deltaV2 * edge1Y - deltaV1 * edge2Y);
		var tangentZ = f * (deltaV2 * edge1Z - deltaV1 * edge2Z);

		//Normalize
		var tangentLength = Math.sqrt(Math.pow(tangentX, 2) + Math.pow(tangentY, 2) + Math.pow(tangentZ, 2));
		tangentX /= tangentLength;
		tangentY /= tangentLength;
		tangentZ /= tangentLength;

		for(var j = 0; j < 3; j++)
		{
			var f = this.faces[i + j];

			this.tangent[f] = tangentX;
			this.tangent[f + 1] = tangentY;
			this.tangent[f + 2] = tangentZ;
		}
	}
};

/**
 * Create GL buffers for the geometry data.
 */
Geometry.prototype.createBuffers = function(gl)
{
	//Vertex
	var vertexBuffer = gl.createBuffer();
	vertexBuffer.itemSize = 3;
	vertexBuffer.length = this.vertex.length / 3;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW);

	//Texture
	var uvBuffer = gl.createBuffer();
	uvBuffer.itemSize = 2;
	uvBuffer.length = this.uvs.length / 2;
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);

	//Normals
	var normalBuffer = gl.createBuffer();
	normalBuffer.itemSize = 3;
	normalBuffer.length = this.normals.length / 3;			
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

	//Faces
	var facesBuffer = gl.createBuffer();
	facesBuffer.itemSize = 1;
	facesBuffer.length = this.faces.length;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, facesBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);

	var buffers = 
	{
		vertexBuffer: vertexBuffer,
		uvBuffer: uvBuffer,
		normalBuffer: normalBuffer,
		facesBuffer: facesBuffer,
		tangentBuffer: null
	};

	//Tagent
	if(this.tangent.length > 0)
	{
		var tangentBuffer = gl.createBuffer();
		tangentBuffer.itemSize = 3;
		tangentBuffer.length = this.tangent.length / 3;
		gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent), gl.STATIC_DRAW);

		buffers.tangentBuffer = tangentBuffer;
	}

	return buffers;
};

/**
 * Computing the triangle normals vector from vertex.
 */
Geometry.prototype.computeNormals = function()
{
	this.normals = [];
	
	//Taking 3 vertices from the coordinates array 
	for(var i = 0; i < this.vertex.length; i += 9)
	{
		//Compute unit normal vector for each triangle
		var normalVector = MathUtils.computeNormalVector(new Vector3(this.vertex[i], this.vertex[i+1], this.vertex[i+2]), new Vector3(this.vertex[i+3], this.vertex[i+4], this.vertex[i+5]), new Vector3(this.vertex[i+6], this.vertex[i+7], this.vertex[i+8]));

		//Store normal 3 times
		this.normals.push(normalVector.x);
		this.normals.push(normalVector.y);
		this.normals.push(normalVector.z);
		this.normals.push(normalVector.x);
		this.normals.push(normalVector.y);
		this.normals.push(normalVector.z);
		this.normals.push(normalVector.x);
		this.normals.push(normalVector.y);
		this.normals.push(normalVector.z);
	}
};

/**
 * Fill geometry missing UV coordinates.
 */
Geometry.prototype.fillUV = function()
{
	this.uvs = [0.0, 0.0, 1.0, 1.0];

	//Add UV to all faces
	for(var i = 1; i < this.faces.length; i+=3)
	{
		if(isNaN(this.faces[i]))
		{
			if(i%2 === 0)
			{
				this.faces[i] = 1;
			}
			else
			{
				this.faces[i] = 2;
			}
		}
	}
};

/**
 * Scale UV by multiplying them by x and y constants.
 */
Geometry.prototype.scaleUV = function(x, y)
{
	for(var i = 0; i < this.uvs.length; i += 2)
	{
		this.uvs[i] *= x;
		this.uvs[i+1] *= y;
	}
};
