//Include Main Program
include("math/Vector2.js");
include("math/Vector3.js");
include("math/Vector4.js");
include("math/Matrix.js");
include("math/Conversion.js");
include("math/MathsUtils.js");

include("data/models/models.js");

include("input/Key.js");
include("input/Keyboard.js");
include("input/Mouse.js");

include("graphics/elements/Model.js");
include("graphics/elements/LightSource.js");
include("graphics/Camera.js");
include("graphics/MatrixGenerator.js");
include("graphics/Color.js");
include("graphics/Shaders.js");


include("Main.js");

var delta = 1000/60;

function App(){}

//Input Input
App.keyboard;
App.mouse;

// App Initialization
App.initialize = function()
{
	var canvas = document.getElementById("canvas");
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
	
	//Initialize Input
	App.keyboard = new Keyboard();
	App.mouse = new Mouse();

	//OnKeyDown Event
	document.onkeydown = function(event)
	{
		console.log("Keyboard KeyDown: "+String.fromCharCode(event.keyCode)+" ("+event.keyCode+")");
		App.keyboard.update(event.keyCode, Key.KEY_DOWN);
	}

	//OnKeyUp Event
	document.onkeyup = function(event)
	{
		//console.log("Keyboard KeyUp: "+String.fromCharCode(event.keyCode)+" ("+event.keyCode+")");
	    App.keyboard.update(event.keyCode, Key.KEY_UP);
	}

	Main.init(canvas);
	App.loop();
}

// Timer to update game logic and render stuff (switch to independent timers?)
App.loop = function()
{
	Main.update();
	Main.draw();
	setTimeout(App.loop, delta);
}

// Called every time page is resized
App.resize = function()
{
	var canvas = document.getElementById("canvas");
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	Main.resize(canvas);
}

// Auxuiliary function to include JS files in app
function include(jsFile)
{
   document.write('<script type="text/javascript" src="'+ jsFile+ '"></script>');
}

//Read external file (possible?)
function readFile(file)
{
	//TODO <ADD CODE HERE>
	return "";
}
