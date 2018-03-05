"use strict";

function DataTexture()
{
	Texture.call(this);
	
	this.type = "DataTexture";

	this.data = [];
	this.size = new Vector2(0, 0);
}

//Texture Constructor from file name
DataTexture.prototype.createTexture = function(gl)
{
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size.x, this.size.y, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this.data));
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	return texture;
};

//Creates a solid color texture
DataTexture.prototype.generateSolidColorTexture = function(color)
{
	this.data = [(color.r*255), (color.g*255), (color.b*255), 255];
	this.size.set(1, 1);
};

