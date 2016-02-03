//Light Constructor
function Light()
{
	this.enabled = true;

	this.position = new Vector3(0.0, 0.0, 0.0);
	this.ambient = new Color(0.0, 0.0, 0.0);
	this.color = new Color(0.2, 0.5, 0.3);
}

//Functions prototypes
Light.prototype.toString = toString;

//Info to String
function toString()
{
	return "Light(Enabled:"+this.enabled+" Position:"+this.position+")";
}
