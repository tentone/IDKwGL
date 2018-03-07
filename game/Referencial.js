"use strict";

function Referencial(scene)
{
	var geometry = new BoxGeometry();

	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.WHITE);
	var material = new BasicMaterial();
	material.texture = texture;

	this.referencialO = new Mesh(geometry, material);
	this.referencialO.scale.set(1.0, 1.0, 1.0);
	this.referencialO.updateMatrix();
	
	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.RED);
	var material = new BasicMaterial();
	material.texture = texture;

	this.referencialX = new Mesh(geometry, material, material);
	this.referencialX.position.set(30.0, 0.0, 0.0);
	this.referencialX.scale.set(30.0, 0.5, 0.5);
	this.referencialX.updateMatrix();

	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.GREEN);
	var material = new BasicMaterial();
	material.texture = texture;

	this.referencialY = new Mesh(geometry, material);
	this.referencialY.scale.set(0.5, 30.0, 0.5);
	this.referencialY.position.set(0.0, 30.0, 0.0);
	this.referencialY.updateMatrix();

	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.BLUE);
	var material = new BasicMaterial();
	material.texture = texture;

	this.referencialZ = new Mesh(geometry, material);
	this.referencialZ.scale.set(0.5, 0.5, 30.0);
	this.referencialZ.position.set(0.0, 0.0, 30.0);
	this.referencialZ.updateMatrix();

	scene.add(this.referencialO);
	scene.add(this.referencialX);
	scene.add(this.referencialY);
	scene.add(this.referencialZ);
}
