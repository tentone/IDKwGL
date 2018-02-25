"use strict";

function Referencial()
{
	this.referencial = new Scene();
	
	this.referencialO = Mesh.cube();
	this.referencialO.scale.set(1.0, 1.0, 1.0);
	this.referencialO.update();
	this.referencialO.setTexture(Texture.generateSolidColorTexture(gl, Color.WHITE));
	
	this.referencialX = Mesh.cube();
	this.referencialX.position.set(30.0, 0.0, 0.0);
	this.referencialX.scale.set(30.0, 0.5, 0.5);
	this.referencialX.update();
	this.referencialX.setTexture(Texture.generateSolidColorTexture(gl, Color.RED));
	
	this.referencialY = Mesh.cube();
	this.referencialY.scale.set(0.5, 30.0, 0.5);
	this.referencialY.position.set(0.0, 30.0, 0.0);
	this.referencialY.update();
	this.referencialY.setTexture(Texture.generateSolidColorTexture(gl, Color.GREEN));

	this.referencialZ = Mesh.cube();
	this.referencialZ.scale.set(0.5, 0.5, 30.0);
	this.referencialZ.position.set(0.0, 0.0, 30.0);
	this.referencialZ.update();
	this.referencialZ.setTexture(Texture.generateSolidColorTexture(gl, Color.BLUE));
	
	this.referencial.add(this.referencialO);
	this.referencial.add(this.referencialX);
	this.referencial.add(this.referencialY);
	this.referencial.add(this.referencialZ);
}

Referencial.prototype.update = function(){}

Referencial.prototype.draw = function(camera)
{
	this.referencial.draw(camera);
};