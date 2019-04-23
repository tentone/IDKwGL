"use strict";

/**
 * Class used to craete and manage a post processing pipeline.
 *
 * A post processing pipeline is composed of passes executed in order.
 */
function Postprocessing()
{
	/**
	 * List of render passes.
	 */
	this.passes = [];

	/**
	 * X resolution of the postprocessing pipeline.
	 */
	this.width = 1;

	/**
	 * Y resolution of the postprocessing pipeline.
	 */
	this.height = 1;

	/**
	 * Input buffer passed to the render pass.
	 */
	this.inputRenderTarget = null;

	/**
	 * Output render target, where for the render pass to write its final result.
	 */
	this.outputRenderTarget = null;
}

/**
 * Render the scene using the post processing pipeline.
 */
Postprocessing.prototype.render = function(renderer, scene, camera, renderTarget)
{
	
	//TODO <RENDER ALL PASSES BY ORDER>
};

/**
 * Set size of the postprocesing pipeline.
 *
 * Recreates the input and output render targets.
 */
Postprocessing.prototype.setSize = function(width, height)
{
	this.width = width;
	this.height = height;
	this.inputRenderTarget = new RenderTargetTexture(width, height);
	this.outputRenderTarget = new RenderTargetTexture(width, height);
};