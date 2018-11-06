"use strict";

/**
 * Base class for materials.
 */
function Material()
{
	this.id = MathUtils.generateID();
	this.name = "";
	this.type = "Material";

	/**
	 * Shader object used to render this material.
	 */
	this.shader = null;

	/**
	 * Indicates if the material uses the lights provided by the scene.
	 */
	this.useLights = false;
}

Material.prototype.constructor = Material;

/**
 * Maximum number of lights allowed.
 */
Material.MAX_LIGHTS = 8;

/**
 * Create the shader program and register the uniforms, for that shader program.
 *
 * Uniforms should be declared using the registerUniforms() method.
 */
Material.createShader = function(gl){};

/**
 * Register the uniforms, for that shader program.
 */
Material.registerUniforms = function(gl, shader){};

/**
 * Render a object from a scene to a camera using the renderer provided.
 *
 * The renderer provides shader cache and gl context for rendering.
 *
 * Uniforms should be used using the updateUniforms() method.
 */
Material.prototype.render = function(renderer, camera, object, scene){};

/**
 * Update the shdaer uniforms before rendering to the screen.
 */
Material.prototype.updateUniforms = function(renderer, gl, shader, camera, object, scene){};
