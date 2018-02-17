//Texture class placeholder
function Texture(){}

//Texture Constructor from file name
Texture.createTextureRepeat = function(file)
{
	if(file === undefined)
	{
		return Texture.generateSolidColorTexture(Color.RED);
	}

   	var texture = gl.createTexture();
	texture.image = new Image();
	texture.image.onload = function ()
	{
		Texture.handleTextureRepeatLoaded(texture);
	}

	texture.image.src = file;
    return texture;
}

//Texture Constructor from file name
Texture.createTexture = function(file)
{
	if(file === undefined)
	{
		return Texture.generateSolidColorTexture(Color.RED);
	}

   	var texture = gl.createTexture();
	texture.image = new Image();
	texture.image.onload = function ()
	{
		Texture.handleTextureLoaded(texture);
	}

	texture.image.src = file;
    return texture;
}

//Creates a solid color texture
Texture.generateSolidColorTexture = function(color)
{
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([(color.r*255), (color.g*255), (color.b*255), 255]));
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.generateMipmap(gl.TEXTURE_2D);
	
	return texture;
}

//Create a texture from array (elements by line)
Texture.createFromDataArray = function(size, colorList)
{
	colorArray = [] 
	for(var i = 0; i < colorList.length; i++)
	{
		colorArray.push(colorList[i].r * 255);
		colorArray.push(colorList[i].g * 255);
		colorArray.push(colorList[i].b * 255);
		colorArray.push(255);
	}

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(colorArray));
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.generateMipmap(gl.TEXTURE_2D);

	return texture;
}

//Handle Texture initialization after image loaded for repeating textures
Texture.handleTextureRepeatLoaded = function(texture)
{
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
}

//Handle Texture initialization after image loaded
Texture.handleTextureLoaded = function(texture)
{
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
}