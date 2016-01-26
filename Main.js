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

	screen = new Test2D();
}

//Logic Update
Main.update = function()
{
	if(App.keyboard.isKeyPressed(Keyboard.I))
	{
		screen = new Arena();
	}
	else if(App.keyboard.isKeyPressed(Keyboard.O))
	{
		screen = new Test2D();
	}
	else if(App.keyboard.isKeyPressed(Keyboard.P))
	{
		screen = new ArenaPhysics();
	}

	
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
