function Player(canvas)
{
	this.camera = new PrespectiveCamera(canvas, 70, 1);
	this.rotation = new Vector2(0.0, 0.0); //Horizontal / Vertical
}

Player.prototype.updatePosition = updatePosition;
Player.prototype.toString = toString;

//Update camera with player movement
function updatePosition()
{
	//Limit Vertical Rotation
	if(this.rotation.y < -90)
	{
		this.rotation.y = -90;
	}
	else if(this.rotation.y > 90)
	{
		this.rotation.y = 90;
	}

	//Update Camera Rotation Values
	var angle = Conversion.degreesToRadians(this.rotation.x);
	this.camera.rotation.y = this.rotation.x;
	this.camera.rotation.z = this.rotation.y * Math.sin(angle);
	this.camera.rotation.x = this.rotation.y * Math.cos(angle);
}

//Return string with player info
function toString()
{
	return "Position:"+this.position.toString()+" Rotation:"+this.rotation.toString();
}
