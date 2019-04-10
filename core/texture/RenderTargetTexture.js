"use strict";

/**
 * Render target texture is used to render the scene into.
 *
 * Can be reused as texture for other objects.
 */
function RenderTargetTexture(width, height, format)
{
	Texture.call(this);
	
	this.type = "RenderTargetTexture";

	this.framebuffer = null;
}

/**
 * Create the GL texture.
 */
RenderTargetTexture.prototype.createTexture = function(gl)
{
	var format = this.format === Texture.RGBA ? gl.RGBA : gl.RGB;

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, format, this.size.x, this.size.y, 0, format, gl.UNSIGNED_BYTE, null);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);

	// Create and bind the framebuffer
	var this.framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

	// attach the texture as the first color attachment
	var attachmentPoint = gl.COLOR_ATTACHMENT0;
	gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, tex, level);

	return texture;
};
