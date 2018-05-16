"use strict";

//Auxuiliary function to include JS files in app
window.include = function(file)
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
};
