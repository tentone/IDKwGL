"use strict";

function Referencial(scene)
{
	this.referencialO = new Mesh(new BoxGeometry());
	this.referencialO.scale.set(1.0, 1.0, 1.0);
	this.referencialO.updateMatrix();
	this.referencialO.setTexture(Texture.generateSolidColorTexture(gl, Color.WHITE));
	
	this.referencialX = new Mesh(new BoxGeometry());
	this.referencialX.position.set(30.0, 0.0, 0.0);
	this.referencialX.scale.set(30.0, 0.5, 0.5);
	this.referencialX.updateMatrix();
	this.referencialX.setTexture(Texture.generateSolidColorTexture(gl, Color.RED));
	
	this.referencialY = new Mesh(new BoxGeometry());
	this.referencialY.scale.set(0.5, 30.0, 0.5);
	this.referencialY.position.set(0.0, 30.0, 0.0);
	this.referencialY.updateMatrix();
	this.referencialY.setTexture(Texture.generateSolidColorTexture(gl, Color.GREEN));

	this.referencialZ = new Mesh(new BoxGeometry());
	this.referencialZ.scale.set(0.5, 0.5, 30.0);
	this.referencialZ.position.set(0.0, 0.0, 30.0);
	this.referencialZ.updateMatrix();
	this.referencialZ.setTexture(Texture.generateSolidColorTexture(gl, Color.BLUE));
	
	scene.add(this.referencialO);
	scene.add(this.referencialX);
	scene.add(this.referencialY);
	scene.add(this.referencialZ);
}
