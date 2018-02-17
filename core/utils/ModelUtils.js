"use strict";

function ModelUtils(){}

//Moving vertices to the spherical surface of radius 1
ModelUtils.moveToSphericalSurface = function(coords)
{
	for(var i = 0; i < coords.length; i += 3)
	{
		var vec = new Vector3(coords[i], coords[i+1], coords[i+2]);
		vec.normalize();
		coords[i] = vec.x;
		coords[i+1] = vec.y;
		coords[i+2] = vec.z;
	}
}

//Subdivide triangles from model
ModelUtils.midPointRefinement = function(model, recursionDepth)
{
	//Copying
	var origCoords = model.vertex.slice();
	var origColors = model.colors.slice();
	
	//Clearing the arrays
	model.size = 0;
	model.vertex = [];
	model.colors = [];
	model.computeVertexNormals();

	//Each triangle is recursively subdivided into 4 triangles, Iterate through the original triangular faces
	for(var i = 0; i < origCoords.length; i += 9)
	{
		// Call the recursive subdivision function
		ModelUtils.recSubdivisionMidPoint(new Vector3(origCoords[i],origCoords[i+1],origCoords[i+2]),
										  new Vector3(origCoords[i+3],origCoords[i+4],origCoords[i+5]),
										  new Vector3(origCoords[i+6],origCoords[i+7],origCoords[i+8]),
										  new Vector3(origColors[i],origColors[i+1],origColors[i+2]),
										  new Vector3(origColors[i+3],origColors[i+4],origColors[i+5]),
										  new Vector3(origColors[i+6],origColors[i+7],origColors[i+8]),
										  model, recursionDepth);
	}
}

//Recursive triangle subdivision, using the midpoints of edges
ModelUtils.recSubdivisionMidPoint = function(v1, v2, v3, c1, c2, c3, model, recursionDepth)
{
	// Recursive midpoint subdivision of one triangle
	if(recursionDepth == 0)
	{
		// Storing coordinates and colors in the destination arrays
		model.vertex.push(v1.x, v1.y, v1.z);
		model.vertex.push(v2.x, v2.y, v2.z);
		model.vertex.push(v3.x, v3.y, v3.z);
		model.size += 9;
		model.colors.push(c1.x, c1.y, c1.z);
		model.colors.push(c2.x, c2.y, c2.z);
		model.colors.push(c3.x, c3.y, c3.z);	    
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
		ModelUtils.recSubdivisionMidPoint(v1, mid12, mid31, c1, c12, c31, model, recursionDepth - 1);
		ModelUtils.recSubdivisionMidPoint(v2, mid23, mid12, c2, c23, c12, model, recursionDepth - 1);
		ModelUtils.recSubdivisionMidPoint(v3, mid31, mid23, c3, c31, c23, model, recursionDepth - 1);
		ModelUtils.recSubdivisionMidPoint(mid12, mid23, mid31, c12, c23, c31, model, recursionDepth - 1);
	}
}
