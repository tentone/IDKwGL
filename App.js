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

include("core/math/geometry/Box.js");
include("core/math/geometry/Sphere.js");

include("core/input/Key.js");
include("core/input/Keyboard.js");
include("core/input/Mouse.js");

include("core/loaders/FileLoader.js");
include("core/loaders/OBJLoader.js");

include("core/utils/GeometryUtils.js");

include("core/Font.js");
include("core/Scene.js");

include("core/shader/Shader.js");

include("core/texture/Texture.js");
include("core/texture/DataTexture.js");

include("core/geometry/Geometry.js");
include("core/geometry/BoxGeometry.js");
include("core/geometry/PlaneGeometry.js");

include("core/materials/Material.js");
include("core/materials/MeshMaterial.js");
include("core/materials/BasicMaterial.js");
include("core/materials/PhongMaterial.js");
include("core/materials/DepthMaterial.js");

include("core/object/Object3D.js");
include("core/object/Sprite.js");
include("core/object/Mesh.js");

include("core/object/particle/Particle.js");
include("core/object/particle/ParticleEmitter.js");

include("core/object/light/AmbientLight.js");
include("core/object/light/DirectionalLight.js");
include("core/object/light/PointLight.js");

include("core/object/camera/Camera.js");
include("core/object/camera/OrthographicCamera.js");
include("core/object/camera/PerspectiveCamera.js");

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

//Global App Variables
var gl;

//App class
function App(){}

//Input Input
App.keyboard = null;
App.mouse = null;
App.renderer = null;
App.screen = null;

// App Initialization
App.initialize = function()
{
	//var canvas = document.getElementById("canvas");
	//canvas.width  = window.innerWidth;
	//canvas.height = window.innerHeight;
	App.renderer = new Renderer();
	App.renderer.canvas.onclick = function()
	{
		try
		{
			canvas.requestPointerLock = canvas.mozRequestPointerLock || canvas.requestPointerLock || canvas.webkitRequestPointerLock;
			canvas.requestPointerLock();
		}
		catch(e){}
	};
	

	//TODO <REMOVE GLOBAL REFERENCE>
	gl = App.renderer.gl;
	
	App.keyboard = new Keyboard();
	App.mouse = new Mouse();
	App.screen = new Arena();
	
	App.resize(window.innerWidth, window.innerHeight);
	
	App.loop()
}

// Timer to update game logic and render stuff (switch to independent timers?)
App.loop = function()
{
	//Update Mouse Values (to keep in sync with game actions)
	App.mouse.update();
	
	//Update and render stuff
	if(App.keyboard.isKeyPressed(Keyboard.O))
	{
		App.screen = new Arena();
	}
	else if(App.keyboard.isKeyPressed(Keyboard.P))
	{
		App.screen = new ArenaPhysics();
	}

	App.screen.update();
	App.screen.draw(App.renderer);

	//Call loop again
	requestAnimationFrame(App.loop, 0);
}

// Called every time page is resized
App.resize = function()
{
	var width = window.innerWidth;
	var height = window.innerHeight;

	App.renderer.canvas.width  = width;
	App.renderer.canvas.height = height;
	App.renderer.resize(width, height);
	App.screen.resize(width, height);
}

//Check if mouse is locked (cross-browser)
App.isMouseLocked = function()
{
	return document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas;
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
