"use strict";

/**
 * Textures contains image data that can be mapped into 3D objects.
 */
function Texture(file)
{
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Texture";

	/**
	 * Texture color channel format.
	 */
	this.format = Texture.RGBA;

	/**
	 * If true the texture coords are flipped in Y.
	 */
	this.flipY = true;

	/**
	 * If set to true the alpha channel is pre multiplied with all colors.
	 */
	this.premultiplyAlpha = false;

	/**
	 * Horizontal texture GL wrap mode.
	 */
	this.wrapS = Texture.REPEAT;

	/**
	 * Vertical texture GL wrap mode.
	 */
	this.wrapT = Texture.REPEAT;

	/**
	 * Image file path URL.
	 */
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

/**
 * Create the GL texture.
 */
Texture.prototype.createTexture = function(gl)
{
	var texture = gl.createTexture();
	var self = this;

	var image = document.createElement("img");
	image.onload = function()
	{	
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, self.format, self.format, gl.UNSIGNED_BYTE, this);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, self.flipY);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, self.premultiplyAlpha);

		//Wrap mode
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, self.wrapS);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, self.wrapT);

		//Only generate mipmaps is texture is power of two
		if(MathUtils.isPowerOf2(this.naturalWidth) && MathUtils.isPowerOf2(this.naturalHeight))
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
