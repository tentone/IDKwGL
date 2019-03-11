"use strict";

function SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
{
	Geometry.call(this);

	this.vertex = [];
	this.uvs = [];
	this.normals = [];
	this.faces = [];

	radius = radius || 1;
	widthSegments = Math.max(3, Math.floor(widthSegments) || 8);
	heightSegments = Math.max(2, Math.floor(heightSegments) || 6);
	phiStart = phiStart !== undefined ? phiStart : 0;
	phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;
	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

	var thetaEnd = thetaStart + thetaLength;
	var index = 0;
	var grid = [];
	var vertex = new Vector3();
	var normal = new Vector3();

	//Generate vertices, normals and uvs
	for(var iy = 0; iy <= heightSegments; iy++)
	{
		var verticesRow = [];
		var v = iy / heightSegments;

		for(var ix = 0; ix <= widthSegments; ix++)
		{
			var u = ix / widthSegments;

			// vertex
			vertex.x = - radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
			vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
			vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
			this.vertex.push(vertex.x, vertex.y, vertex.z);

			// normal
			normal.set(vertex.x, vertex.y, vertex.z).normalize();
			this.normals.push(normal.x, normal.y, normal.z);

			// uv
			this.uvs.push(u, 1 - v);
			verticesRow.push(index++);
		}

		grid.push(verticesRow);

	}

	//Indices
	for(var iy = 0; iy < heightSegments; iy++)
	{
		for(var ix = 0; ix < widthSegments; ix++)
		{
			var a = grid[iy][ix + 1];
			var b = grid[iy][ix];
			var c = grid[iy + 1][ix];
			var d = grid[iy + 1][ix + 1];

			if(iy !== 0 || thetaStart > 0)
			{
				this.faces.push(a, b, d)
			}

			if(iy !== heightSegments - 1 || thetaEnd < Math.PI)
			{
				this.faces.push(b, c, d);
			}
		}
	}
}

SphereGeometry.prototype = Object.create(Geometry.prototype);