function Shader(gl, fragment, vertex)
{
	//Initialize Shader
	this.fragmentShader = Shader.getShader(gl, fragment);
	this.vertexShader = Shader.getShader(gl, vertex);
	this.shaderProgram = gl.createProgram();
	
	gl.attachShader(this.shaderProgram, this.vertexShader);
	gl.attachShader(this.shaderProgram, this.fragmentShader);
	gl.linkProgram(this.shaderProgram);

	if(!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS))
	{
		throw "Could not initialise shaders";
	}

	//Set Shader to GL
	gl.useProgram(this.shaderProgram);

	// Coordinates 
	this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

	// Colors 
	this.shaderProgram.vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
}

//Function Prototypes
Shader.prototype.get = get;

function get()
{
	return this.shaderProgram;
}

//Read shader and compile
Shader.getShader = function(gl, id)
{
	//Read shader text
	var shaderScript = document.getElementById(id);
	if (!shaderScript)
	{
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while(k)
	{
		if (k.nodeType == 3)
		{
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	//Create Shader object
	var shader;
	if(shaderScript.type == "x-shader/x-fragment")
	{
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}
	else if(shaderScript.type == "x-shader/x-vertex")
	{
		shader = gl.createShader(gl.VERTEX_SHADER);
	}
	else
	{
		throw "Invalid shader";
	}

	//Compile Shader
	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		throw "Error in shader compilation";
	}

	return shader;
}
