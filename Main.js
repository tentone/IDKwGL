//Global variables
var screen;

//Global Shaders
var shaderTexture;
var shaderLightVertex;
var shaderLightPixel;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	//Initialize Shaders
	shaderTexture = Shader.textureRenderShader();
	shaderLightVertex = Shader.lightVertexRenderShader();
	shaderLightPixel = Shader.lightPixelRenderShader();

	screen = new ArenaTest();
}

//Logic Update
Main.update = function()
{
	screen.update();
}

//Draw Stuff
Main.draw = function()
{
	screen.draw();
}

//Resize Stuff
Main.resize = function(canvas)
{
	screen.resize();
}
