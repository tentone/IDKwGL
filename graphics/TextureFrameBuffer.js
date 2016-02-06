function TextureFrameBuffer(size_x, size_y)
{
	this.framebuffer;
	this.texture;
	this.render_bufffer;

	var this.framebuffer;
	var this.texture;
	var this.render_buffer;

	//Our first step is to create the framebuffer itself, and, following the normal pattern
	//(as with textures, vertex attribute buffers, and so on) we make it our current one
	this.framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
	this.framebuffer.width = size_x;
	this.framebuffer.height = size_y;

	//Next, we create a texture object, and set up the same parameters as usual
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	//the call to gl.texImage2D has rather different parameters cause we dont have any texture yet
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.framebuffer.width, this.framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	//so we now have an empty texture which can store the colour values for our rendered scene.
	//Next, we create a depth buffer to store the depth information
	this.render_buffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.render_buffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.framebuffer.width, this.framebuffer.height);

	//call gl.this.render_bufferStorage to tell WebGL that the currently-bound renderbuffer needs enough storage for
	//16-bit depth values across a buffer with the given width and height.
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.render_buffer);

	//Now we have all of the memory set up for our framebuffer
	//WebGL knows what to render to when we’re using it.
	//So now, we tidy up, setting the current texture, renderbuffer, and framebuffer back to their defaults
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
