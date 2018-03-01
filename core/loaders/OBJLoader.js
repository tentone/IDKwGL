"use strict";

function OBJLoader(){}

OBJLoader.load = function(data, mtl, path)
{
	var mesh = new Mesh();

	if(mtl !== undefined)
	{
		mesh.material = OBJLoader.loadMTL(mtl, path);
	}

	var lines = data.split("\n");

	// Check every line and store 
	for(var i = 0; i < lines.length; i++)
	{
		// The tokens/values in each line Separation between tokens is 1 or mode whitespaces
		var tokens = lines[i].split(/\s\s*/);

		//Vertices
		if(tokens[0] === "v")
		{
			mesh.vertex.push(parseFloat(tokens[1]));
			mesh.vertex.push(parseFloat(tokens[2]));
			mesh.vertex.push(parseFloat(tokens[3]));
		}
		//Normals
		else if(tokens[0] === "vn")
		{
			mesh.normals.push(parseFloat(tokens[1]));
			mesh.normals.push(parseFloat(tokens[2]));
			mesh.normals.push(parseFloat(tokens[3]));
		}
		//Texture coords
		else if(tokens[0] === "vt")
		{
			mesh.uvs.push(parseFloat(tokens[1]));
			mesh.uvs.push(parseFloat(tokens[2]));
		}
		//Faces <vertex>/<texture>/<normal>
		else if(tokens[0] === "f")
		{
			//3 vertex face
			//f 16/92/11 14/101/22 1/69/1
			if(tokens.length === 4)
			{
				var val = tokens[1].split("/");
				mesh.faces.push(parseInt(val[0])); //Vertex
				mesh.faces.push(parseInt(val[1])); //Texture
				mesh.faces.push(parseInt(val[2]));; //Normal

				val = tokens[2].split("/");
				mesh.faces.push(parseInt(val[0])); //Vertex
				mesh.faces.push(parseInt(val[1])); //Texture
				mesh.faces.push(parseInt(val[2]));; //Normal

				val = tokens[3].split("/");
				mesh.faces.push(parseInt(val[0])); //Vertex
				mesh.faces.push(parseInt(val[1])); //Texture
				mesh.faces.push(parseInt(val[2]));; //Normal
			}
			//4 vertex face (Quad)
			//f 16/92/11 40/109/40 38/114/38 14/101/22
			else if(tokens.length === 5)
			{
				var val = tokens[1].split("/");
				mesh.faces.push(val[0]); //Vertex
				mesh.faces.push(val[1]); //Texture
				mesh.faces.push(val[2]); //Normal

				val = tokens[2].split("/");
				mesh.faces.push(val[0]); //Vertex
				mesh.faces.push(val[1]); //Texture
				mesh.faces.push(val[2]); //Normal

				val = tokens[3].split("/");
				mesh.faces.push(val[0]); //Vertex
				mesh.faces.push(val[1]); //Texture
				mesh.faces.push(val[2]); //Normal

				val = tokens[1].split("/");
				mesh.faces.push(val[0]); //Vertex
				mesh.faces.push(val[1]); //Texture
				mesh.faces.push(val[2]); //Normal

				val = tokens[3].split("/");
				mesh.faces.push(val[0]); //Vertex
				mesh.faces.push(val[1]); //Texture
				mesh.faces.push(val[2]); //Normal

				val = tokens[4].split("/");
				mesh.faces.push(val[0]); //Vertex
				mesh.faces.push(val[1]); //Texture
				mesh.faces.push(val[2]); //Normal
			}
		}
		//Material
		else if(tokens[0] === "usemtl")
		{
			var j = 0;

			//Search MTL index
			for(j = 0; j < mesh.material.length; j++)
			{
				if(mesh.material[j].name === tokens[1])
				{
					break;
				}
			}

			//Check if material was found and add to list
			if(j !== mesh.material.length)
			{
				//If faces material has elements add last index
				if(mesh.faceMaterial.length !== 0)
				{
					mesh.faceMaterial[mesh.faceMaterial.length-2] = mesh.faces.length/3;
				}

				//Add new material
				mesh.faceMaterial.push(mesh.faces.length/3); //Ini Position
				mesh.faceMaterial.push(mesh.faces.length/3); //End Position (temporary)
				mesh.faceMaterial.push(j); //Material Index
			}
		}
	}
	
	if(mesh.faceMaterial.length > 0)
	{
		mesh.faceMaterial[mesh.faceMaterial.length-2] = mesh.faces.length/3;
	}

	//If no coord found complete with data
	if(mesh.uvs.length === 0)
	{
		//Full texture to all triangles
		mesh.uvs.push(0.0);
		mesh.uvs.push(0.0);

		mesh.uvs.push(1.0);
		mesh.uvs.push(1.0);

		//Add Texture Component to all faces
		for(var i = 1; i < mesh.faces.length; i+=3)
		{
			if(isNaN(mesh.faces[i]))
			{
				if(i%2 === 0)
				{
					mesh.faces[i] = 1;
				}
				else
				{
					mesh.faces[i] = 2;
				}
			}
		}
	}

	// Checking to see if the normals are defined on the file
	if(mesh.normals.length === 0)
	{
		mesh.computeVertexNormals();
	}

	//Create temporary arrays to store all model data
	var vertex = [];
	var texture = [];
	var normals = [];
	var faces = [];
	
	//Transform Data
	for(var i = 0; i < mesh.faces.length; i += 3)
	{
		faces.push(Math.floor(i/3));

		vertex.push(mesh.vertex[(mesh.faces[i]-1)*3]);
		vertex.push(mesh.vertex[(mesh.faces[i]-1)*3+1]);
		vertex.push(mesh.vertex[(mesh.faces[i]-1)*3+2]);

		texture.push(mesh.uvs[(mesh.faces[i+1]-1)*2]);
		texture.push(mesh.uvs[(mesh.faces[i+1]-1)*2+1]);

		normals.push(mesh.normals[(mesh.faces[i+2]-1)*3]);
		normals.push(mesh.normals[(mesh.faces[i+2]-1)*3+1]);
		normals.push(mesh.normals[(mesh.faces[i+2]-1)*3+2]);
	}

	//Copy array pointer into main data and update bufffers
	mesh.faces = faces;
	mesh.vertex = vertex;
	mesh.uvs = texture;
	mesh.normals = normals;

	//Update Buffers
	mesh.updateBuffers();

	return mesh;
};

//Read MTL data from String
OBJLoader.loadMTL = function(data, path)
{
	var lines = data.split("\n");
	var index = -1;
	var materials = [];

	//Read Data lines
	for(var i = 0; i < lines.length; i++)
	{
		var tokens = lines[i].split(/\s\s*/);

		//New Material
		if(tokens[0] === "newmtl")
		{
			index++;
			materials[index] = new PhongMaterial(tokens[1]);
		}

		//If material found
		if(index >= 0)
		{
			var offset = 0
			while(offset < tokens.length && tokens[offset] === "")
			{
				offset++;
			}

			//Texture
			if(tokens[offset] === "map_Kd" || tokens[offset] === "map_Ka")
			{
				materials[index].texture = Texture.createTexture(gl, path + "/" + tokens[1+offset]);
			}
			//Bump map
			else if(tokens[offset] === "mapBump" || tokens[offset] === "bump")
			{
				materials[index].bumpMap = Texture.createTexture(gl, path + "/" + tokens[1+offset]);
			}
			//Ambient color
			else if(tokens[offset] === "Ka")
			{
				materials[index].ambient.r = parseFloat(tokens[offset+1]);
				materials[index].ambient.g = parseFloat(tokens[offset+2]);
				materials[index].ambient.b = parseFloat(tokens[offset+3]);
			}
			//Diffuse color
			else if(tokens[offset] === "Kd")
			{
				materials[index].diffuse.r = parseFloat(tokens[offset+1]);
				materials[index].diffuse.g = parseFloat(tokens[offset+2]);
				materials[index].diffuse.b = parseFloat(tokens[offset+3]);
			}
			//Specular color
			else if(tokens[offset] === "Ks")
			{
				materials[index].specular.r = parseFloat(tokens[offset+1]);
				materials[index].specular.g = parseFloat(tokens[offset+2]);
				materials[index].specular.b = parseFloat(tokens[offset+3]);
			}
			//Specular intensity
			else if(tokens[offset] === "Ns")
			{
				materials[index].specularIntensity = parseFloat(tokens[offset+1]);
			}
		}
	}

	return materials;
};
