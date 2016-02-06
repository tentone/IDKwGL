//Light Constructor
function PointLight()
{
	this.enabled = true;
	this.type = Light.POINT;

	//Light Caracteristics
	this.ambient = new Vector3(0.5, 0.5, 0.5);
	this.position = new Vector3(0.0, 0.0, 0.0);
	this.color = new Color(0.2, 0.5, 0.3);

	//Light Range
	this.range = 1000;
}

//Functions prototypes
PointLight.prototype.toString = toString;

//Returns string with info
function toString()
{
	return "Point Light\nEnabled:"+this.enabled+"\nPosition:"+this.position.toString()+"\nColor:"+this.color.toString();
}
