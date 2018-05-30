"use strict";

function FileLoader(){}

FileLoader.loadText = function(fname)
{
	var file = new XMLHttpRequest();
	file.overrideMimeType("text/plain");
	
	var data = null;

	//Request file to server
	file.open("GET", fname, false);

	//Get file
	file.onreadystatechange = function()
	{
		if(file.status === 200 || file.status === 0)
		{
			data = file.responseText;
		}
	}

	//Send null to ensure that file was received
	file.send(null);

	return file.response;
};