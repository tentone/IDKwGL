include("math/Vector2.js");
include("math/Vector3.js");
include("math/Vector4.js");
include("math/Matrix.js");
include("math/Conversion.js");
include("math/MathsUtils.js");

include("math/geometry/Geometry.js");
include("math/geometry/Box.js");
include("math/geometry/Sphere.js");

include("data/models/cube.js");
include("data/models/cessna.js");

include("input/Key.js");
include("input/Keyboard.js");
include("input/Mouse.js");

include("graphics/elements/Scene.js");
include("graphics/elements/Model.js");
include("graphics/elements/LightSource.js");
include("graphics/elements/Texture.js");
include("graphics/elements/ModelTextured.js");
include("graphics/particle/Particle.js");
include("graphics/particle/ParticleEmitter.js");
include("graphics/camera/OrthographicCamera.js");
include("graphics/camera/PrespectiveCamera.js");
include("graphics/MatrixGenerator.js");
include("graphics/Color.js");
include("graphics/Shader.js");
include("graphics/ModelUtils.js");

include("object/Spectator.js");
include("object/Player.js");

include("Main.js");

//Global App Variables
var delta = 1000/60;
var gl = null;

//App class
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

	//Keyboard OnKeyDown Event
	document.onkeydown = function(event)
	{
		App.keyboard.update(event.keyCode, Key.KEY_DOWN);
		//console.log("Keyboard KeyDown: "+String.fromCharCode(event.keyCode)+" ("+event.keyCode+")");
	}

	//Keyboard OnKeyUp Event
	document.onkeyup = function(event)
	{
	    App.keyboard.update(event.keyCode, Key.KEY_UP);
	    //console.log("Keyboard KeyUp: "+String.fromCharCode(event.keyCode)+" ("+event.keyCode+")");
	}

	//Mouse Move Position
	document.onmousemove = function(event)
	{
		App.mouse.updatePosition(event.clientX, event.clientY, event.movementX, event.movementY);
		//console.log("Mouse Position:"+App.mouse.toString());
	}

	//Mouse Button Down
	document.onmousedown = function(event)
	{
		App.mouse.updateKey(event.which-1, Key.KEY_DOWN);
	}

	//Mouse Button Up
	document.onmouseup = function(event)
	{
		App.mouse.updateKey(event.which-1, Key.KEY_UP);
	}

	//Request to lock mouse if canvas is clicked (cross-browser)
	canvas.onclick = function()
	{
		try
		{
			canvas.requestPointerLock = canvas.mozRequestPointerLock || canvas.requestPointerLock || canvas.webkitRequestPointerLock;
			canvas.requestPointerLock();
		}
		catch(e){}
	}

	App.initGL(canvas);
	Main.init(canvas);
	App.loop();
}

//Initialize WebGL
App.initGL = function()
{
	try
	{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.enable(gl.DEPTH_TEST);
		//gl.enable(gl.CULL_FACE);
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	catch(e){}

	if(!gl)
	{
		throw "Failed to initialize WebGL";
	}
}

// Timer to update game logic and render stuff (switch to independent timers?)
App.loop = function()
{
	//Update Mouse Values (to keep in sync with game actions)
	App.mouse.update();

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

	App.initGL(canvas);
	Main.resize(canvas);
}

//Should be called by canvas onclicked
App.setFullscreen = function(event)
{
	//Key P Pressed
	if(event.keyCode == 112)
	{
		var canvas = document.getElementById("canvas");
		canvas.webkitRequestFullScreen();
	}
}

//Check if mouse is locked (cross-browser)
App.isMouseLocked = function()
{
	return document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas;
}

// Auxuiliary function to include JS files in app
function include(jsFile)
{
   document.write('<script type="text/javascript" src="'+ jsFile+ '"></script>');
}
