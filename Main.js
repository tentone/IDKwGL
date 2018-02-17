"use strict";

var screen;
var font;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	font = new Font();
	screen = new Arena();
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
