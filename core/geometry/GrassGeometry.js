"use strict";

function GrassGeometry()
{
	Geometry.call(this);

	this.vertex =
	[
		-1.0, -1.0,  0.0,
		1.0, -1.0,  0.0,
		1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		0.0, -1.0, -1.0,
		0.0, -1.0,  1.0,
		0.0,  1.0,  1.0,
		0.0,  1.0,  -1.0
	];

	this.uvs =
	[
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	];

	this.normals =
	[
		0.0,  1.0, 0.0,
		0.0,  1.0, 0.0,
		0.0,  1.0, 0.0,
		0.0,  1.0, 0.0,
		0.0,  1.0, 0.0,
		0.0,  1.0, 0.0,
		0.0,  1.0, 0.0,
		0.0,  1.0, 0.0
	];

	this.faces =
	[
		0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7
	];
}

GrassGeometry.prototype = Object.create(Geometry.prototype);