"use strict";

var screen;

function Main(){}

//Initialize
Main.init = function(canvas)
{
	screen = new Arena();
}

//Logic Update
Main.update = function()
{
	if(App.keyboard.isKeyPressed(Keyboard.O))
	{
		screen = new Arena();
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
