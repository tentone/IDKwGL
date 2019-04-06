"use strict";

/** 
 * Helper to preview the world axis.
 */
function Axis(scene)
{
	var geometry = new BoxGeometry();

	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.WHITE);
	var material = new BasicMaterial();
	material.texture = texture;

	this.origin = new Mesh(geometry, material);
	this.origin.scale.set(1.0, 1.0, 1.0);
	this.origin.updateMatrix();
	
	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.RED);
	var material = new BasicMaterial();
	material.texture = texture;

	this.x = new Mesh(geometry, material, material);
	this.x.position.set(30.0, 0.0, 0.0);
	this.x.scale.set(30.0, 0.5, 0.5);
	this.x.updateMatrix();

	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.GREEN);
	var material = new BasicMaterial();
	material.texture = texture;

	this.y = new Mesh(geometry, material);
	this.y.scale.set(0.5, 30.0, 0.5);
	this.y.position.set(0.0, 30.0, 0.0);
	this.y.updateMatrix();

	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.BLUE);
	var material = new BasicMaterial();
	material.texture = texture;

	this.z = new Mesh(geometry, material);
	this.z.scale.set(0.5, 0.5, 30.0);
	this.z.position.set(0.0, 0.0, 30.0);
	this.z.updateMatrix();

	scene.add(this.origin);
	scene.add(this.x);
	scene.add(this.y);
	scene.add(this.z);
}
