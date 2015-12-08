//Material Constructor
function Material(name)
{
	this.name = name;
	this.texture = null;
	this.ambientColor = new Color(1,1,1);
	this.diffuseColor = new Color(1,1,1);
	this.specularColor = new Color(0.5,0.5,0.5);
}

//Functions Prototypes
Material.prototype.toString = toString;

//Material info to String
function toString()
{
	return "Material (Name:"+this.name+", Texture:"+this.texture+")";
}