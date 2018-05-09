"use strict";

/**
 * Geometry class represents triangulated geometries and auxiliar vertex data.
 *
 * Vertex are organized into faces.
 */
function Geometry()
{
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Geometry";

	this.vertex = []; //Vertex
	this.uvs = []; //Vertex Texture
	this.normals = []; //Vertex Normals
	this.faces = []; //Face <vertex / texture / normal>
}

Geometry.prototype.constructor = Geometry;

//Update GL buffers
Geometry.prototype.createBuffers = function(gl)
{
	//Vertex
	var vertexBuffer = gl.createBuffer();
	vertexBuffer.itemSize = 3;
	vertexBuffer.length = this.vertex.length/3;						
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex), gl.STATIC_DRAW);

	//Texture
	var uvBuffer = gl.createBuffer();
	uvBuffer.itemSize = 2;
	uvBuffer.length = this.uvs.length/2;
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);

	//Normals
	var normalBuffer = gl.createBuffer();
	normalBuffer.itemSize = 3;
	normalBuffer.length = this.normals.length/3;			
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

	//Faces
	var facesBuffer = gl.createBuffer();
	facesBuffer.itemSize = 1;
	facesBuffer.length = this.faces.length;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, facesBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);

	return {vertexBuffer: vertexBuffer, uvBuffer: uvBuffer, normalBuffer: normalBuffer, facesBuffer: facesBuffer};
};

//Computing the triangle unit normal vector to vertex 
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

//Fill geometry UV coordinates
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

//Scale UV by multiplying them by x and y constants
Geometry.prototype.scaleUV = function(x, y)
{
	for(var i = 0; i < this.uvs.length; i += 2)
	{
		this.uvs[i] *= x;
		this.uvs[i+1] *= y;
	}
};