"use strict";

function FileLoader(){}

FileLoader.loadMultiple = function(files, onLoad)
{	
	var count = 0;
	var responses = new Array(files.length);

	function loadText(j)
	{
		FileLoader.loadText(files[j], false, function(data)
		{
			responses[j] = data;
			count++;

			if(count === files.length)
			{
				onLoad(responses);
			}
		});
	}

	for(var i = 0; i < files.length; i++)
	{
		loadText(i);
	}
};

FileLoader.loadText = function(fname, sync, onLoad)
{
	if(sync === undefined)
	{
		sync = true;
	}

	var file = new XMLHttpRequest();
	file.overrideMimeType("text/plain");
	file.open("GET", fname, !sync);
	file.onload = function()
	{
		if((file.status === 200 || file.status === 0) && onLoad !== undefined)
		{
			onLoad(file.response);
		}
	}
	file.send(null);
	return file.response;
};