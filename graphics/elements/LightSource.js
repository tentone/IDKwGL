// Constructor
function LightSource()
{
	this.isOn = true; // A new light source is always on

	this.position = new Vector4(0.0, 0.0, 1.0, 0.0); // And is directional
	this.intensity = new Color(1.0, 1.0, 1.0); // White light
	this.ambientIntensity = new Color(0.2, 0.2, 0.2); // Ambient component
}

//  Methods
LightSource.prototype.isOff = function()
{
	return this.isOn == false;
}

LightSource.prototype.switchOn = function()
{
	this.isOn = true;
}

LightSource.prototype.switchOff = function()
{
	this.isOn = false;
}

LightSource.prototype.isDirectional = function()
{
	return this.position.w == 0.0;
}

LightSource.prototype.getPosition = function()
{
	return this.position;
}

LightSource.prototype.setPosition = function(x, y, z, w)
{
	this.position.set(x, y, z, w);
}

LightSource.prototype.getIntensity = function()
{
	return this.intensity;
}

LightSource.prototype.setIntensity = function( r, g, b )
{
	this.intensity.r = r;
	this.intensity.g = g;
	this.intensity.b = b;
}

LightSource.prototype.getAmbIntensity = function()
{
	return this.ambientIntensity;
}

LightSource.prototype.setAmbIntensity = function(r, g, b)
{
	this.ambientIntensity.r = r;
	this.ambientIntensity.g = g;
	this.ambientIntensity.b = b;
}
