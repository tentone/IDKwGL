"use strict";

/**
 * Data texture is manually created from a color array instead of a image file.
 */
function DataTexture(width, height, format)
{
	Texture.call(this);
	
	this.type = "DataTexture";

	if(format !== undefined)
	{
		this.format = format;
	}

	this.size = new Vector2(width || 0, height || 0);
	this.data = [];

	//Generate black texture
	var pixel = this.format === Texture.RGBA ? 4 : 3;
	var size = width * height * pixel;
	for(var i = 0; i < size; i++)
	{
		this.data.push(0);
	}
}

/**
 * Create the GL texture.
 */
DataTexture.prototype.createTexture = function(gl)
{
	var format = this.format === Texture.RGBA ? gl.RGBA : gl.RGB;

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, format, this.size.x, this.size.y, 0, format, gl.UNSIGNED_BYTE, new Uint8Array(this.data));
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);

	return texture;
};

/**
 * Creates a solid color texture.
 */
DataTexture.prototype.generateSolidColorTexture = function(color)
{
	this.data = [(color.r*255), (color.g*255), (color.b*255), 255];
	this.size.set(1, 1);
};

