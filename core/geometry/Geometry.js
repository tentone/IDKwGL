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
 * Project vertices to the spherical surface of radius 1-
 */
 // TODO <NOT WORKING>

Geometry.moveToSphericalSurface = function(coords)
{
	for(var i = 0; i < coords.length; i += 3)
	{
		var vec = new Vector3(coords[i], coords[i+1], coords[i+2]);
		vec.normalize();
		coords[i] = vec.x;
		coords[i+1] = vec.y;
		coords[i+2] = vec.z;
	}
};


/**
 * Subdivide triangles from a geometry by n levels.
 */

// TODO <NOT WORKING>
Geometry.prototype.subdivide = function(recursionDepth)
{
	// Recursive triangle subdivision, using the midpoints of edges.
	var recursiveDivision = function(v1, v2, v3, c1, c2, c3, geometry, recursionDepth)
	{
		// Recursive midpoint subdivision of one triangle
		if(recursionDepth === 0)
		{
			// Storing coordinates and colors in the destination arrays
			geometry.vertex.push(v1.x, v1.y, v1.z);
			geometry.vertex.push(v2.x, v2.y, v2.z);
			geometry.vertex.push(v3.x, v3.y, v3.z);
			geometry.size += 9;
			geometry.colors.push(c1.x, c1.y, c1.z);
			geometry.colors.push(c2.x, c2.y, c2.z);
			geometry.colors.push(c3.x, c3.y, c3.z);	    
		}
		else
		{
			// Compute the midpoints and proceed recursively
			var mid12 = MathUtils.computeMidPoint(v1, v2);
			var mid23 = MathUtils.computeMidPoint(v2, v3);
			var mid31 = MathUtils.computeMidPoint(v3, v1);
			
			// Colors are also averaged
			var c12 = MathUtils.computeMidPoint(c1, c2);
			var c23 = MathUtils.computeMidPoint(c2, c3);
			var c31 = MathUtils.computeMidPoint(c3, c1);
			
			// 4 recursive calls 
			recursiveDivision(v1, mid12, mid31, c1, c12, c31, geometry, recursionDepth - 1);
			recursiveDivision(v2, mid23, mid12, c2, c23, c12, geometry, recursionDepth - 1);
			recursiveDivision(v3, mid31, mid23, c3, c31, c23, geometry, recursionDepth - 1);
			recursiveDivision(mid12, mid23, mid31, c12, c23, c31, geometry, recursionDepth - 1);
		}
	};


	if(recursionDepth === undefined)
	{
		recursionDepth = 2;
	}

	// Copying
	var oriVertex = this.vertex.slice();
	var oriNormals = this.normals.slice();
	var oriUvs = this.uvs.slice();
	var oriFaces = this.faces.slice();

	// Clearing the arrays
	this.vertex = [];
	this.uvs = [];
	this.normals = [];
	this.faces = [];

	// Recompute normals
	// this.computeVertexNormals();

	// Each triangle is recursively subdivided into 4 triangles, Iterate through the original triangular faces
	for(var i = 0; i < oriVertex.length; i += 9)
	{
		// Call the recursive subdivision function
		recursiveDivision(new Vector3(oriVertex[i],oriVertex[i+1],oriVertex[i+2]),
						new Vector3(oriVertex[i+3],oriVertex[i+4],oriVertex[i+5]),
						new Vector3(oriVertex[i+6],oriVertex[i+7],oriVertex[i+8]),
						new Vector3(origColors[i],origColors[i+1],origColors[i+2]),
						new Vector3(origColors[i+3],origColors[i+4],origColors[i+5]),
						new Vector3(origColors[i+6],origColors[i+7],origColors[i+8]),
						this, recursionDepth);
	}
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
