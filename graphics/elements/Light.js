//Light Constructor
function Light()
{
	this.enabled = true; // A new light source is always on
	this.position = new Vector4(0.0, 0.0, 1.0, 0.0); // And is directional
	this.intensity = new Color(1.0, 1.0, 1.0); // White light
	this.ambientIntensity = new Color(0.2, 0.2, 0.2); // Ambient component
}
