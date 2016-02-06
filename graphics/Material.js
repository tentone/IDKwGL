//Material Constructor
function Material(name)
{
	this.name = name;

	this.texture = null; //Texture
	this.bump_map = null; //Bump Map
	this.specular_map = null; //Specular map
	this.distance_map = null; //Distance map

	this.ka = new Color(1,1,1); //Ambient Value
	this.kd = new Color(1,1,1); //Diffuse Value
	this.ks = new Color(1,1,1); //Specular Value
	this.ns = 1; //Specular Intensity (Phong constant) range [1, 1000]
	
	this.alpha = 1; //Alpha Value
}

//Functions Prototypes
Material.prototype.toString = toString;

//Material info to String
function toString()
{
	return "Material\n   Name:"+this.name+"\n   Texture:"+this.texture;
}