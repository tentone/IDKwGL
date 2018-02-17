//Material Constructor
function Material(name)
{
	this.name = name;

	this.texture = null; //Texture
	this.bumpMap = null; //Bump Map
	this.specularMap = null; //Specular map
	this.distanceMap = null; //Distance map

	this.ka = new Color(1,1,1); //Ambient Value
	this.kd = new Color(1,1,1); //Diffuse Value
	this.ks = new Color(1,1,1); //Specular Value
	this.ns = 1; //Specular Intensity (Phong constant) range [1, 1000]
	
	this.alpha = 1; //Alpha Value
}

//Material info to String
Material.prototype.toString = function()
{
	return "Material\n   Name:"+this.name+"\n   Texture:"+this.texture;
}