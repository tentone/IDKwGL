"use strict";

function DataTexture()
{
	Texture.call(this);
	
	this.type = "DataTexture";

	//TODO <ADD CODE HERE>
}

//Texture Constructor from file name
DataTexture.createTexture = function(gl, size, colorList)
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
};
