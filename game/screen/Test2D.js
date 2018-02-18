"use strict";

function Test2D()
{
	this.camera = new OrthographicCamera(canvas, 20);

	this.wall = new Sprite();
	this.wall.setTexture(Texture.createTexture(gl, "data/texture/wallrunner/wall.png"));
	this.wall.scale.set(5,5,0);
	this.wall.update();

	this.wall3 = this.wall.clone();
	this.wall3.position.set(5,10,0);
	this.wall3.update();

	this.wall2 = this.wall.clone();
	this.wall2.position.set(5,0,0);
	this.wall2.update();

	this.fence = new Sprite();
	this.fence.setTexture(Texture.createTexture(gl, "data/texture/wallrunner/spikes.png"));
	this.fence.scale.set(12,3,0);
	this.fence.update();

	this.font = new Font("data/font/arial.fnt", "data/font/");
	
	this.text = new Text("Abc", this.font);
	this.text.position.set(-3,4,0);
	this.text.scale.set(5,5,0);
	this.text.update();

	this.idk = new Sprite();
	this.idk.setTexture(Texture.createTexture(gl, "data/texture/idk.png"));
	this.idk.scale.set(this.camera.size.y/2,this.camera.size.y/4,1);
	this.idk.origin.set(this.camera.size.x/3,0,0);
	this.idk.position.set(this.camera.size.x-1,-this.camera.size.y+1,0);
	this.idk.update();
}

Test2D.prototype.update = function(){}

Test2D.prototype.draw = function()
{
	this.camera.updateMatrix();
	this.camera.useShader(shaderDefault);

	this.text.draw(this.camera);
	this.idk.draw(this.camera);
}

Test2D.prototype.resize = function()
{
	this.camera.resize(canvas.width, canvas.height);
}
