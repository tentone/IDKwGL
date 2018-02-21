"use strict";

function Texture()
{

}

//Texture Constructor from file name
Texture.createTexture = function(gl, file)
{
	var texture = gl.createTexture();
	var image = document.createElement("img");
	image.onload = function ()
	{
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

		//Check anisotropic support
		var anisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
		if(anisotropic !== undefined)
		{
			//TODO
		}

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
	image.src = file;

	return texture;
};

//Creates a solid color texture
Texture.generateSolidColorTexture = function(gl, color)
{
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([(color.r*255), (color.g*255), (color.b*255), 255]));
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.generateMipmap(gl.TEXTURE_2D);
	
	return texture;
};

//Create a texture from array (elements by line)
Texture.createDataTexture = function(gl, size, colorList)
{
	var data = [] 

	for(var i = 0; i < colorList.length; i++)
	{
		data.push(colorList[i].r * 255);
		data.push(colorList[i].g * 255);
		data.push(colorList[i].b * 255);
		data.push(255);
	}

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(data));
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);

	return texture;
};
