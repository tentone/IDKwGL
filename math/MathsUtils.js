function MathUtils(){}

//Mid Point (Vector3)
MathUtils.computeMidPoint = function(p1, p2)
{
    return Vector3((p1.x+p2.x)/2.0, (p1.y+p2.y)/2.0, (p1.z+p2.z)/2.0);
}

//Calculate Centroid point (Vector3)
MathUtils.computeCentroid = function(p1, p2, p3)
{
    return Vector3((p1.x+p2.x+p3.x)/3.0, (p1.y+p2.y+p3.y)/3.0, (p1.z+p2.z+p3.z)/3.0);
}

//Symmetric vector (Vector3)
MathUtils.symmetric = function(v)
{
    return new Vector3(-v.x, -v.y, -v.z);
}

//Dot product (Vector3)
MathUtils.dotProduct = function(v1, v2)
{
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
}

// Vector product (Vector3)
MathUtils.vectorProduct = function(v1, v2)
{
	return new Vector3(v1.y*v2.z - v1.z*v2.y, -(v1.x*v2.z - v1.z*v2.x), v1.x*v2.y - v1.y*v2.x);
}

//Calculate Normal for surface (Vector3)
MathUtils.computeNormalVector = function(p0, p1, p2)
{
	var v1 = new Vector3(p1.x - p0.x, p1.y - p0.y, p1.z - p0.z);
	var v2 = new Vector3(p2.x - p0.x, p2.y - p0.y, p2.z - p0.z);

    result = vectorProduct(v1, v2);
    result.normalize();

    return result;
}

//Multiplying using homogeneous coordinates
MathUtils.multiplyPointByMatrix = function(m, p)
{
	return new Vector4(
        m.matrix[0][0] * p[0] + m.matrix[0][1] * p[1] + m.matrix[0][2] * p[2]+ m.matrix[0][3] * p[3],
        m.matrix[1][0] * p[0] + m.matrix[1][1] * p[1] + m.matrix[1][2] * p[2]+ m.matrix[1][3] * p[3],
        m.matrix[2][0] * p[0] + m.matrix[2][1] * p[1] + m.matrix[2][2] * p[2]+ m.matrix[2][3] * p[3],
        m.matrix[3][0] * p[0] + m.matrix[3][1] * p[1] + m.matrix[3][2] * p[2]+ m.matrix[3][3] * p[3]);
}

MathUtils.multiplyVectorByMatrix = function(m, p)
{
    return new Vector4(
        m.matrix[0][0] * p[0] + m.matrix[0][1] * p[1] + m.matrix[0][2] * p[2]+ m.matrix[0][3] * p[3],
        m.matrix[1][0] * p[0] + m.matrix[1][1] * p[1] + m.matrix[1][2] * p[2]+ m.matrix[1][3] * p[3],
        m.matrix[2][0] * p[0] + m.matrix[2][1] * p[1] + m.matrix[2][2] * p[2]+ m.matrix[2][3] * p[3], 0);
}

//Normalize Vector (Array[3])
MathUtils.normalize = function(v)
{
    var squaresSum = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    var norm = Math.sqrt(squaresSum);
    
    v[0] /= norm;
    v[1] /= norm;
    v[2] /= norm;
}