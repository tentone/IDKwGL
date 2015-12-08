//Global variables
var screen;

//Global Shaders
var shaderLightVertex;
var shaderLightPixel;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	//Initialize Shaders
	shaderLightVertex = Shader.lightVertexRenderShader();
	shaderLightPixel = Shader.lightPixelRenderShader();

	screen = new Arena();
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
	screen.resize(canvas);
}
