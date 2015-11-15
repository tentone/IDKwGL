//Light Constructor
function LightSource()
{
	this.enabled = true; // A new light source is always on

	this.position = new Vector4(0.0, 0.0, 1.0, 0.0); // And is directional
	this.intensity = new Color(1.0, 1.0, 1.0); // White light
	this.ambientIntensity = new Color(0.2, 0.2, 0.2); // Ambient component

	/*lightSources.push(new LightSource());
	lightSources[0].position.set0.0, 0.0, 1.0, 0.0);
	lightSources[0].intensity.set(1.0, 1.0, 1.0 );
	lightSources[0].ambientIntensity.set(0.2, 0.2, 0.2);*/
}

//Function Prototypes
LightSource.prototype.isDirectional = isDirectional;

//Return if light is directional
function isDirectional()
{
	return this.position.w == 0.0;
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
