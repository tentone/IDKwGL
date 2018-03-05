"use strict";

function CanvasTexture(canvas)
{
	Texture.call(this);
	
	this.type = "CanvasTexture";

	this.canvas = canvas;
	this.size = new Vector2(canvas.width, canvas.weight);
}

