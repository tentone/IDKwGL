function Test2D()
{
	this.camera = new OrthographicCamera(canvas, 20);

	this.sprite = new Sprite();
	this.sprite.setTexture(Texture.createTexture("data/texture/cross.png"));
	this.sprite.scale.set(5,5,0);
	this.sprite.update();
}

Test2D.prototype.draw = draw;
Test2D.prototype.update = update;
Test2D.prototype.resize = resize;

function update(){}

function draw()
{
    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.camera.startFrame();
	this.camera.useShader(shaderLightPixel);
	this.sprite.draw(this.camera);
}

function resize()
{
	this.camera.resize(canvas.width, canvas.height);
}
