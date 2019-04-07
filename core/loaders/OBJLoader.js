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

	var geometry = mesh.geometry;

	// Check every line and store 
	for(var i = 0; i < lines.length; i++)
	{
		// The tokens/values in each line Separation between tokens is 1 or mode whitespaces
		var tokens = lines[i].split(/\s\s*/);

		//Vertices
		if(tokens[0] === "v")
		{
			geometry.vertex.push(parseFloat(tokens[1]));
			geometry.vertex.push(parseFloat(tokens[2]));
			geometry.vertex.push(parseFloat(tokens[3]));
		}
		//Normals
		else if(tokens[0] === "vn")
		{
			geometry.normals.push(parseFloat(tokens[1]));
			geometry.normals.push(parseFloat(tokens[2]));
			geometry.normals.push(parseFloat(tokens[3]));
		}
		//Texture coords
		else if(tokens[0] === "vt")
		{
			geometry.uvs.push(parseFloat(tokens[1]));
			geometry.uvs.push(parseFloat(tokens[2]));
		}
		//Faces <vertex>/<texture>/<normal>
		else if(tokens[0] === "f")
		{
			//3 vertex face
			//f 16/92/11 14/101/22 1/69/1
			if(tokens.length === 4)
			{
				var val = tokens[1].split("/");
				geometry.faces.push(parseInt(val[0])); //Vertex
				geometry.faces.push(parseInt(val[1])); //Texture
				geometry.faces.push(parseInt(val[2]));; //Normal

				val = tokens[2].split("/");
				geometry.faces.push(parseInt(val[0])); //Vertex
				geometry.faces.push(parseInt(val[1])); //Texture
				geometry.faces.push(parseInt(val[2]));; //Normal

				val = tokens[3].split("/");
				geometry.faces.push(parseInt(val[0])); //Vertex
				geometry.faces.push(parseInt(val[1])); //Texture
				geometry.faces.push(parseInt(val[2]));; //Normal
			}
			//4 vertex face (Quad)
			//f 16/92/11 40/109/40 38/114/38 14/101/22
			else if(tokens.length === 5)
			{
				var val = tokens[1].split("/");
				geometry.faces.push(val[0]); //Vertex
				geometry.faces.push(val[1]); //Texture
				geometry.faces.push(val[2]); //Normal

				val = tokens[2].split("/");
				geometry.faces.push(val[0]); //Vertex
				geometry.faces.push(val[1]); //Texture
				geometry.faces.push(val[2]); //Normal

				val = tokens[3].split("/");
				geometry.faces.push(val[0]); //Vertex
				geometry.faces.push(val[1]); //Texture
				geometry.faces.push(val[2]); //Normal

				val = tokens[1].split("/");
				geometry.faces.push(val[0]); //Vertex
				geometry.faces.push(val[1]); //Texture
				geometry.faces.push(val[2]); //Normal

				val = tokens[3].split("/");
				geometry.faces.push(val[0]); //Vertex
				geometry.faces.push(val[1]); //Texture
				geometry.faces.push(val[2]); //Normal

				val = tokens[4].split("/");
				geometry.faces.push(val[0]); //Vertex
				geometry.faces.push(val[1]); //Texture
				geometry.faces.push(val[2]); //Normal
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
					mesh.faceMaterial[mesh.faceMaterial.length-2] = geometry.faces.length/3;
				}

				//Add new material
				mesh.faceMaterial.push(geometry.faces.length/3); //Ini Position
				mesh.faceMaterial.push(geometry.faces.length/3); //End Position (temporary)
				mesh.faceMaterial.push(j); //Material Index
			}
		}
	}
	
	if(mesh.faceMaterial.length > 0)
	{
		mesh.faceMaterial[mesh.faceMaterial.length-2] = geometry.faces.length/3;
	}

	//If no coord found complete with data
	if(geometry.uvs.length === 0)
	{
		geometry.fillUV();
	}

	// Checking to see if the normals are defined on the file
	if(geometry.normals.length === 0)
	{
		geometry.computeNormals();
	}

	//Create temporary arrays to store all model data
	var vertex = [];
	var texture = [];
	var normals = [];
	var faces = [];
	
	//Transform Data
	for(var i = 0; i < geometry.faces.length; i += 3)
	{
		faces.push(Math.floor(i/3));

		vertex.push(geometry.vertex[(geometry.faces[i]-1)*3]);
		vertex.push(geometry.vertex[(geometry.faces[i]-1)*3+1]);
		vertex.push(geometry.vertex[(geometry.faces[i]-1)*3+2]);

		texture.push(geometry.uvs[(geometry.faces[i+1]-1)*2]);
		texture.push(geometry.uvs[(geometry.faces[i+1]-1)*2+1]);

		normals.push(geometry.normals[(geometry.faces[i+2]-1)*3]);
		normals.push(geometry.normals[(geometry.faces[i+2]-1)*3+1]);
		normals.push(geometry.normals[(geometry.faces[i+2]-1)*3+2]);
	}

	//Copy array pointer into main data and update bufffers
	geometry.faces = faces;
	geometry.vertex = vertex;
	geometry.uvs = texture;
	geometry.normals = normals;

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
				materials[index].texture = new Texture(path + "/" + tokens[1 + offset]);
			}
			//Bump map | Normal Map
			else if(tokens[offset] === "mapBump" || tokens[offset] === "bump")
			{
				materials[index].normalMap = new Texture(path + "/" + tokens[1 + offset]);
			}
			//Ambient color
			else if(tokens[offset] === "Ka")
			{
				materials[index].color.r = parseFloat(tokens[offset + 1]);
				materials[index].color.g = parseFloat(tokens[offset + 2]);
				materials[index].color.b = parseFloat(tokens[offset + 3]);
			}
			//Diffuse color
			else if(tokens[offset] === "Kd")
			{
				materials[index].color.r = parseFloat(tokens[offset + 1]);
				materials[index].color.g = parseFloat(tokens[offset + 2]);
				materials[index].color.b = parseFloat(tokens[offset + 3]);
			}
			//Specular color
			else if(tokens[offset] === "Ks")
			{
				materials[index].specular.r = parseFloat(tokens[offset + 1]);
				materials[index].specular.g = parseFloat(tokens[offset + 2]);
				materials[index].specular.b = parseFloat(tokens[offset + 3]);
			}
			//Specular intensity
			else if(tokens[offset] === "Ns")
			{
				materials[index].specularIntensity = parseFloat(tokens[offset + 1]);
			}
		}
	}

	return materials;
};
