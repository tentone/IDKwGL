"use strict";

function Texture(file)
{
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Texture";

	this.format = Texture.RGBA;

	this.flipY = true;
	this.premultiplyAlpha = false;

	this.wrapS = Texture.REPEAT;
	this.wrapT = Texture.REPEAT;

	this.file = file;
}

Texture.RGB = 6407;
Texture.RGBA = 6408;

Texture.REPEAT = 10497;
Texture.CLAMP_TO_EDGE = 33071;
Texture.MIRRORED_REPEAT = 33648;

Texture.LINEAR = 9729;
Texture.NEAREST = 9728;
Texture.NEAREST_MIPMAP_NEAREST = 9984;
Texture.NEAREST_MIPMAP_LINEAR = 9986;
Texture.LINEAR_MIPMAP_NEAREST = 9985;
Texture.LINEAR_MIPMAP_LINEAR = 9987;

//Texture Constructor from file name
Texture.prototype.createTexture = function(gl)
{
	var texture = gl.createTexture();
	var image = document.createElement("img");

	var self = this;

	image.onload = function()
	{	
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, self.format, self.format, gl.UNSIGNED_BYTE, image);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, self.flipY);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, self.premultiplyAlpha);

		//Wrap mode
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, self.wrapS);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, self.wrapT);

		//Only generate mipmaps is texture is power of two
		if(MathUtils.isPowerOf2(image.naturalWidth) && MathUtils.isPowerOf2(image.naturalHeight))
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
