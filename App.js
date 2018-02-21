"use strict";

//Core
include("core/math/MatrixGenerator.js");
include("core/math/Vector2.js");
include("core/math/Vector3.js");
include("core/math/Vector4.js");
include("core/math/Matrix.js");
include("core/math/Matrix4.js");
include("core/math/Conversion.js");
include("core/math/MathsUtils.js");
include("core/math/Color.js");

include("core/math/geometry/Geometry.js");
include("core/math/geometry/Box.js");
include("core/math/geometry/Sphere.js");

include("core/input/Key.js");
include("core/input/Keyboard.js");
include("core/input/Mouse.js");

include("core/utils/GeometryUtils.js");

include("core/Font.js");
include("core/Texture.js");
include("core/Shader.js");

include("core/materials/Material.js");

include("core/object/Object3D.js");
include("core/object/Sprite.js");
include("core/object/Mesh.js");
include("core/object/Text.js");

include("core/object/particle/Particle.js");
include("core/object/particle/ParticleEmitter.js");

include("core/object/light/AmbientLight.js");
include("core/object/light/DirectionalLight.js");
include("core/object/light/PointLight.js");

include("core/object/camera/Camera.js");
include("core/object/camera/OrthographicCamera.js");
include("core/object/camera/PerspectiveCamera.js");

include("core/renderer/Scene.js");
include("core/renderer/Renderer.js");

include("core/physics/Body.js");
include("core/physics/World.js");

//Data
include("data/models/house.js");
include("data/models/tank.js");

//Game
include("game/Spectator.js");
include("game/Player.js");
include("game/GameObject.js");
include("game/Referencial.js");
include("game/screen/Arena.js");
include("game/screen/ArenaPhysics.js");

include("Main.js");

//Global App Variables
var gl = null;

//App class
function App(){}

//Time control
App.deltaTime = 0;
App.time = 0;

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
	
	App.loop()
}

//Initialize WebGL
App.initGL = function()
{
	try
	{
		gl = canvas.getContext("webgl", {alpha: false});
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
	
	//Update and render stuff
	Main.update();
	Main.draw();

	//Update time values
	App.deltaTime = new Date - App.time;
	App.time += App.deltaTime;

	//Call loop again
	requestAnimationFrame(App.loop, 0);
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
	if(event.keyCode === 112)
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

//Read text file
App.readFile = function(fname)
{
	var file = new XMLHttpRequest();
	file.overrideMimeType("text/plain");
	
	var data = null;

	//Request file to server
	file.open("GET", fname, false);

	//Get file
	file.onreadystatechange = function ()
	{
		if(file.status === 200 || file.status === 0)
		{
			data = file.responseText;
		}
	}

	//Send null to ensure that file was received
	file.send(null);

	return data;
}

//Auxuiliary function to include JS files in app
function include(file)
{
	if(file.endsWith(".js"))
	{
		var js = document.createElement("script");
		js.src = file;
		js.type = "text/javascript";
		js.async = false;
		document.body.appendChild(js);
	}
	else if(file.endsWith(".css"))
	{
		var css = document.createElement("link");
		css.href = file;
		css.rel = "stylesheet";
		document.body.appendChild(css);
	}	
}

