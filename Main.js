// Global Variables
var gl = null;
var shaderProgram = null;

//Test Stuff
var model = [];
var camera;
var lightSources = [];

function Main(){}

//Initialize
Main.init = function(canvas)
{
	// Create the WebGL context
	try
	{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	catch(e){}

	if(!gl)
	{
		alert("Failed to initialize WebGL (Check your browser)");
	}

	//Initialize Shaders
	shaderProgram = initShaders(gl);

	//Create Test Elements
	model[0] = new Model();
	model[0].loadOBJ(cube_model);
	model[0].position.set(0,0,0);

	model[1] = new Model();
	model[1].loadOBJ(cube_model);
	model[1].position.set(0,1,0);

	model[2] = new Model();
	model[2].loadOBJ(cube_model);
	model[2].position.set(0,2,0);

	model[3] = new Model();
	model[3].loadOBJ(cube_model);
	model[3].position.set(2,0,2);

	model[4] = new Model();
	model[4].loadOBJ(cube_model);
	model[4].position.set(-3,0,5);

	model[5] = new Model();
	model[5].loadOBJ(cube_model);
	model[5].position.set(0,0,-5);

	camera = new Camera(canvas, 2, Camera.PRESPECTIVE);

	/*lightSources.push(new LightSource());
	lightSources[0].setPosition(0.0, 0.0, 1.0, 0.0);
	lightSources[0].setIntensity(1.0, 1.0, 1.0 );
	lightSources[0].setAmbIntensity(0.2, 0.2, 0.2);*/
}

//Logic Update
Main.update = function()
{
	//Camera Rotate Test
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		camera.position.z -= 0.1*Math.cos(Conversion.degreesToRadians(-camera.rotation.y));
		camera.position.x -= 0.1*Math.sin(Conversion.degreesToRadians(-camera.rotation.y));
	}
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		camera.position.z += 0.1*Math.cos(Conversion.degreesToRadians(-camera.rotation.y));
		camera.position.x += 0.1*Math.sin(Conversion.degreesToRadians(-camera.rotation.y));
	}

	//Camera Movement
	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		camera.rotation.y += 3;
	}
	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		camera.rotation.y -= 3;
	}

	if(App.keyboard.isKeyPressed(Keyboard.Q))
	{
		camera.position.z -= 0.1*Math.cos(Conversion.degreesToRadians(-camera.rotation.y+90));
		camera.position.x -= 0.1*Math.sin(Conversion.degreesToRadians(-camera.rotation.y+90));
	}
	if(App.keyboard.isKeyPressed(Keyboard.E))
	{
		camera.position.z += 0.1*Math.cos(Conversion.degreesToRadians(-camera.rotation.y+90));
		camera.position.x += 0.1*Math.sin(Conversion.degreesToRadians(-camera.rotation.y+90));
	}

	//Camera UP/DOWN
	if(App.keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		camera.position.y += 0.1
	}
	if(App.keyboard.isKeyPressed(Keyboard.CTRL))
	{
		camera.position.y -= 0.1
	}

	//Model Move Test
	if(App.keyboard.isKeyPressed(Keyboard.DOWN))
	{
		model.position.y -= 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.UP))
	{
		model.position.y += 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.LEFT))
	{
		model.position.x -= 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.RIGHT))
	{
		model.position.x += 0.1;
	}

	//Camera Zoom Test
	if(App.keyboard.isKeyPressed(Keyboard.NUM1))
	{
		camera.zoom += 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.NUM2))
	{
		camera.zoom -= 0.1;
	}
}

//Draw Stuff
Main.draw = function()
{
	camera.startFrame();
	for(i = 0; i < model.length; i++)
	{
		model[i].draw(camera);
	}
}

Main.resize = function(canvas)
{
	// Create the WebGL context
	try
	{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	catch(e){}

	if(!gl)
	{
		alert("Failed to initialize WebGL (Check your browser)");
	}

	shaderProgram = initShaders(gl);

	camera.resize(canvas.width, canvas.height);
}

//------------------------- PHONG ILUMINATION STUFF <TODO> -----------------------------------

// Model Material Features (Move to Model Class)
/*var kAmbi = [0.2, 0.2, 0.2]; // Ambient coef.
var kDiff = [0.7, 0.7, 0.7]; // Difuse coef.
var kSpec = [0.7, 0.7, 0.7]; // Specular coef.
var nPhong = 100; // Phong coef.*/

//  Computing the illumination and rendering the model
/*function computeIllumination(mvMatrix, model, camera)
{
	// Phong Illumination Model
	// Clearing the colors array
	for( var i = 0; i < model.colors.length; i++ )
	{
		model.colors[i] = 0.0;
	}
	
    // SMOOTH-SHADING 
    // Compute the illumination for every vertex ,i terate through the vertices
    for(var vertIndex = 0; vertIndex < model.vertices.length; vertIndex += 3 )
    {	
		// For every vertex GET COORDINATES AND NORMAL VECTOR
		var auxP = model.vertices.slice(vertIndex, vertIndex + 3);
		var auxN = model.normals.slice(vertIndex, vertIndex + 3);

        // CONVERT TO HOMOGENEOUS COORDINATES
		auxP.push( 1.0 );
		auxN.push( 0.0 );
		
        // APPLY CURRENT TRANSFORMATION
        var pointP = MathUtils.multiplyPointByMatrix(mvMatrix, auxP);
        var vectorN = MathUtils.multiplyVectorByMatrix(mvMatrix, auxN);
        vectorN.normalize();

		// VIEWER POSITION
		var vectorV = new Vector3(0,0,0);
		if(camera.projectiontype == 0)
		{
			// Orthogonal 
			vectorV[2] = 1.0;
		}	
		else
		{
		    // Perspective
		    // Viewer at ( 0, 0 , 0 )
			vectorV = MathUtils.symmetric(pointP);
		}
		
        vectorV.normalize();

	    // Compute the 3 components: AMBIENT, DIFFUSE and SPECULAR FOR EACH LIGHT SOURCE
	    for(var l = 0; l < lightSources.length; l++ )
	    {
			if(lightSources[l].isOff())
			{
				continue;
			}
			
	        // INITIALIZE EACH COMPONENT, with the constant terms
		    var ambientTerm = new Color(0,0,0);
		    var diffuseTerm = new Color(0,0,0);
		    var specularTerm = new Color(0,0,0);
		
		    // For the current light source
		    ambient_Illumination = lightSources[l].getAmbIntensity();
		    int_Light_Source = lightSources[l].getIntensity();
		    pos_Light_Source = lightSources[l].getPosition();
		    
		    // Animating the light source, if defined
		    //var lightSourceMatrix = new Matrix(4,4);
		    
		    // TODO <GET LIGHT TRANSF MATRIX>
		   	//if(lightSources[l].isRotYYOn()) 
		    //{
			//	lightSourceMatrix.mul(rotationYYMatrix(lightSources[l].getRotangle.y()));
			//}
			
			
		    //Ambient Ilumination
		    ambientTerm.r = ambient_Illumination.r * kAmbi.r;
            diffuseTerm.r = int_Light_Source.r * kDiff.r;
            specularTerm.r = int_Light_Source.r * kSpec.r;

            ambientTerm.g = ambient_Illumination.g * kAmbi.g;
            diffuseTerm.g = int_Light_Source.g * kDiff.g;
            specularTerm.g = int_Light_Source.g * kSpec.g;

            ambientTerm.b = ambient_Illumination.b * kAmbi.b;
            diffuseTerm.b = int_Light_Source.b * kDiff.b;
            specularTerm.b = int_Light_Source.b * kSpec.b;

	        //Diffuse Illumination
	        var vectorL = new Vector4(0,0,0,0);
	        if(pos_Light_Source[3] == 0.0)
	        {
	            // Directional Light Source
	            vectorL = MathUtils.multiplyVectorByMatrix(lightSourceMatrix, pos_Light_Source);
	        }
	        else
	        {
	            // Point Light Source (apply the global transformation to the light source?)
	            vectorL = MathUtils.multiplyPointByMatrix(lightSourceMatrix, pos_Light_Source);
				vectorL.set(pointP.x, pointP.y, pointP.z);
	        }
	
			// Back to Euclidean coordinates
			vectorL = vectorL.toVector3();
	        vectorL.normalize();
	
	        var cosNL = MathUtils.dotProduct(vectorN, vectorL);
	        if(cosNL < 0.0)
	        {
				cosNL = 0.0;
	        }
	
	        // Specullar Ilumination
	        var vectorH = vectorL.clone();
	        vectorH.add(vectorV);
	        vectorH.normalize();

	        var cosNH = MathUtils.dotProduct(vectorN, vectorH);
	
			// No direct illumination or viewer not in the right direction
	        if(cosNH < 0.0 || cosNL <= 0.0)
	        {
	            cosNH = 0.0;
	        }
	
	        // Compute the color values and store in the colors array
	        var tp = Math.pow(cosNH, nPhong)
	        var temp = new Color(ambientTerm.r + diffuseTerm.r * cosNL + specularTerm.r * tp,
					        	 ambientTerm.g + diffuseTerm.g * cosNL + specularTerm.g * tp,
					        	 ambientTerm.b + diffuseTerm.b * cosNL + specularTerm.b * tp);
	        
			model.colors[vertIndex] += temp.r;
	        // Avoid exceeding 1.0
			if( model.colors[vertIndex] > 1.0 )
			{
				model.colors[vertIndex] = 1.0;
			}
	        
	        // Avoid exceeding 1.0
			model.colors[vertIndex + 1] += temp.g;
			if( model.colors[vertIndex + 1] > 1.0 )
			{
				model.colors[vertIndex + 1] = 1.0;
			}
			
			model.colors[vertIndex + 2] += temp.b;
	        // Avoid exceeding 1.0
			if( model.colors[vertIndex + 2] > 1.0 )
			{
				model.colors[vertIndex + 2] = 1.0;
			}
	    }	
	}
}*/
