"use strict";

function Referencial(scene)
{
	this.referencialO = new Mesh(new BoxGeometry());
	this.referencialO.scale.set(1.0, 1.0, 1.0);
	this.referencialO.updateMatrix();
	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.WHITE)
	this.referencialO.setTexture(texture);
	
	this.referencialX = new Mesh(new BoxGeometry());
	this.referencialX.position.set(30.0, 0.0, 0.0);
	this.referencialX.scale.set(30.0, 0.5, 0.5);
	this.referencialX.updateMatrix();
	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.RED)
	this.referencialX.setTexture(texture);


	this.referencialY = new Mesh(new BoxGeometry());
	this.referencialY.scale.set(0.5, 30.0, 0.5);
	this.referencialY.position.set(0.0, 30.0, 0.0);
	this.referencialY.updateMatrix();
	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.GREEN)
	this.referencialY.setTexture(texture);

	this.referencialZ = new Mesh(new BoxGeometry());
	this.referencialZ.scale.set(0.5, 0.5, 30.0);
	this.referencialZ.position.set(0.0, 0.0, 30.0);
	this.referencialZ.updateMatrix();
	var texture = new DataTexture();
	texture.generateSolidColorTexture(Color.BLUE)
	this.referencialZ.setTexture(texture);

	scene.add(this.referencialO);
	scene.add(this.referencialX);
	scene.add(this.referencialY);
	scene.add(this.referencialZ);
}
