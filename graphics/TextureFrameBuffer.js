function TextureFrameBuffer(size_x, size_y)
{
	var rttFramebuffer;
	var rttTexture;
	var renderbuffer;
	
	//Our first step is to create the framebuffer itself, and, following the normal pattern
	//(as with textures, vertex attribute buffers, and so on) we make it our current one
	rttFramebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
	rttFramebuffer.width = 512;
	rttFramebuffer.height = 512;

	//Next, we create a texture object, and set up the same parameters as usual
	rttTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, rttTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	//the call to gl.texImage2D has rather different parameters cause we dont have any texture yet
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	//so we now have an empty texture which can store the colour values for our rendered scene.
	//Next, we create a depth buffer to store the depth information
	renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

	//call gl.renderbufferStorage to tell WebGL that the currently-bound renderbuffer needs enough storage for
	//16-bit depth values across a buffer with the given width and height.
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

	//Now we have all of the memory set up for our framebuffer; WebGL knows what to render to when we’re using it.
	//So now, we tidy up, setting the current texture, renderbuffer, and framebuffer back to their defaults
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
