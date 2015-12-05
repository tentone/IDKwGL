//Texture class placeholder
function Texture(){}

//Texture Constructor from file name
Texture.createTexture = function(file)
{
	if(file === undefined)
	{
		return Texture.generateSolidColorTexture(Color.RED);
	}

   	texture = gl.createTexture();
	texture.image = new Image();
	texture.image.onload = function ()
	{
		Texture.handleTextureLoaded(texture);
	}

	texture.image.src = "file";
    return texture;
}

//Creates a solid color texture
Texture.generateSolidColorTexture = function(color)
{
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([(color.r*255), (color.g*255), (color.b*255), 255]));

	return texture;
}

//Create a texture from array (elements by line)
Texture.crateFromDataArray = function(size, color_list)
{
	color_array = [] 
	for(var i = 0; i < color_list.length; i++)
	{
		color_array.push(color_list[i].r * 255)
		color_array.push(color_list[i].g * 255)
		color_array.push(color_list[i].b * 255)
		color_array.push(255)
	}

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(color_array));
	gl.generateMipmap(gl.TEXTURE_2D);

	return texture;
}

//Handle Texture after being loaded
Texture.handleTextureLoaded = function(texture)
{
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
}