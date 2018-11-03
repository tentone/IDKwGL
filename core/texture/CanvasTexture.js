"use strict";

/**
 * Canvas texture is created from a 2D javascript canvas.
 */
function CanvasTexture(canvas)
{
	Texture.call(this);
	
	this.type = "CanvasTexture";

	this.canvas = canvas;
	this.size = new Vector2(canvas.width, canvas.weight);
}

