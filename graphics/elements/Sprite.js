//Sprite constructor
function Sprite()
{
	this.model = Model.plane();
}

Sprite.prototype.draw = draw;
Sprite.prototype.update = update;

function update()
{
	this.transformationMatrix = MatrixGenerator.rotationMatrix(this.rotation.x, this.rotation.y, this.rotation.z);
    this.transformationMatrix.mul(MatrixGenerator.translation(this.position.x, this.position.y, this.position.z));
    this.transformationMatrix.mul(MatrixGenerator.scalingMatrix(this.scale.x, this.scale.y, this.scale.z));
}

function draw(camera, light)
{
	
	this.model.draw(camera, light);
}
