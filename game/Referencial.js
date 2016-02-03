function Referencial()
{
	this.referencial = new Scene();
	this.referencial_o = Model.cube();
	this.referencial_o.scale.set(1.0, 1.0, 1.0);
	this.referencial_o.update();
	this.referencial_o.setTexture(Texture.generateSolidColorTexture(Color.WHITE));
	
	this.referencial_x = Model.cube();
	this.referencial_x.position.set(30.0, 0.0, 0.0);
	this.referencial_x.scale.set(30.0, 0.5, 0.5);
	this.referencial_x.update();
	this.referencial_x.setTexture(Texture.generateSolidColorTexture(Color.RED));
	
	this.referencial_y = Model.cube();
	this.referencial_y.scale.set(0.5, 30.0, 0.5);
	this.referencial_y.position.set(0.0, 30.0, 0.0);
	this.referencial_y.update();
	this.referencial_y.setTexture(Texture.generateSolidColorTexture(Color.GREEN));

	this.referencial_z = Model.cube();
	this.referencial_z.scale.set(0.5, 0.5, 30.0);
	this.referencial_z.position.set(0.0, 0.0, 30.0);
	this.referencial_z.update();
	this.referencial_z.setTexture(Texture.generateSolidColorTexture(Color.BLUE));
	
	this.referencial.addModel(this.referencial_o);
	this.referencial.addModel(this.referencial_x);
	this.referencial.addModel(this.referencial_y);
	this.referencial.addModel(this.referencial_z);
}

Referencial.prototype.draw = draw;
Referencial.prototype.update = update;

function update(){}

function draw(camera)
{
	this.referencial.draw(camera);
}