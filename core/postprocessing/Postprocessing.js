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
	 * Input buffer passed to the render pass.
	 */
	this.inputRenderTarget = null;

	/**
	 * Output render target, where for the render pass to write its final result.
	 */
	this.outputRenderTarget = null;
}

Postprocessing.prototype.render = function(scene, camera, renderTarget)
{
	//TODO <RENDER ALL PASSES BY ORDER>
};