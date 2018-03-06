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

include("core/objects/Object3D.js");
include("core/objects/Scene.js");
include("core/objects/Sprite.js");
include("core/objects/Mesh.js");

include("core/objects/particle/Particle.js");
include("core/objects/particle/ParticleEmitter.js");

include("core/objects/light/AmbientLight.js");
include("core/objects/light/DirectionalLight.js");
include("core/objects/light/PointLight.js");

include("core/objects/camera/Camera.js");
include("core/objects/camera/OrthographicCamera.js");
include("core/objects/camera/PerspectiveCamera.js");

include("core/renderer/shader/Shader.js");
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
			var canvas = App.renderer.canvas;
			canvas.requestPointerLock = canvas.mozRequestPointerLock || canvas.requestPointerLock || canvas.webkitRequestPointerLock;
			canvas.requestPointerLock();
		}
		catch(e){}
	};
	
	App.keyboard = new Keyboard();
	App.mouse = new Mouse();

	App.screen = new Arena();
	App.resize(window.innerWidth, window.innerHeight);
	
	App.loop();
}

// Timer to update game logic and render stuff (switch to independent timers?)
App.loop = function()
{
	//Update Mouse Values (to keep in sync with game actions)
	App.mouse.update();

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
