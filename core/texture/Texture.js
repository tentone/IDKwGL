"use strict";

function Texture(file)
{
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Texture";

	this.format = Texture.RGBA;
	this.flipY = true;
	this.premultiplyAlpha = false;

	this.file = file;
}

Texture.RGB = 100;
Texture.RGBA = 101;

Texture.REPEAT = 200;
Texture.CLAMP_TO_EDGE = 201;
Texture.MIRRORED_REPEAT = 202;

Texture.LINEAR = 300;
Texture.NEAREST = 301;
Texture.NEAREST_MIPMAP_NEAREST = 302;
Texture.NEAREST_MIPMAP_LINEAR = 303;
Texture.LINEAR_MIPMAP_NEAREST = 304;
Texture.LINEAR_MIPMAP_LINEAR = 305;

//Texture Constructor from file name
Texture.prototype.createTexture = function(gl)
{
	var texture = gl.createTexture();
	var image = document.createElement("img");

	var self = this;
	var format = this.format === Texture.RGBA ? gl.RGBA : gl.RGB;

	image.onload = function()
	{	
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, image);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, self.flipY);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, self.premultiplyAlpha);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

		//Check anisotropic support
		/*var anisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
		if(anisotropic !== undefined)
		{
			//TODO
		}*/

		//Only generate MIPMAPS is texture is a power of two
		if(MathUtils.isPowerOf2() && MathUtils.isPowerOf2())
		{
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		}
		else
		{	
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	};
	image.src = this.file;

	return texture;
};
