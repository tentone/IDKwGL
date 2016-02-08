varying vec4 position;  // position of the vertex (and fragment) in world space
varying vec3 varyingNormalDirection;  // surface normal vector in world space
uniform mat4 m, v, p;
uniform mat4 v_inv;

struct lightSource
{
	vec4 position;
	vec4 diffuse;
	vec4 specular;
	float constantAttenuation, linearAttenuation, quadraticAttenuation;
	float spotCutoff, spotExponent;
	vec3 spotDirection;
};

lightSource light0 = lightSource(
	vec4(0.0,  1.0,  2.0, 1.0),
	vec4(1.0,  1.0,  1.0, 1.0),
	vec4(1.0,  1.0,  1.0, 1.0),
	0.0, 1.0, 0.0,
	180.0, 0.0,
	vec3(0.0, 0.0, 0.0)
);

vec4 scene_ambient = vec4(0.2, 0.2, 0.2, 1.0);

struct material
{
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	float shininess;
};

material frontMaterial = material(
	vec4(0.2, 0.2, 0.2, 1.0),
	vec4(1.0, 0.8, 0.8, 1.0),
	vec4(1.0, 1.0, 1.0, 1.0),
	5.0
);

void main()
{
	vec3 normalDirection = normalize(varyingNormalDirection);
	vec3 viewDirection = normalize(vec3(v_inv * vec4(0.0, 0.0, 0.0, 1.0) - position));
	vec3 lightDirection;
	float attenuation;

	// directional light?
	if(0.0 == light0.position.w)
	{
		attenuation = 1.0; // no attenuation
		lightDirection = normalize(vec3(light0.position));
	} 
	// point light or spotlight (or other kind of light) 
	else
	{
		vec3 positionToLightSource = vec3(light0.position - position);
		float distance = length(positionToLightSource);
		lightDirection = normalize(positionToLightSource);
		attenuation = 1.0 / (light0.constantAttenuation + light0.linearAttenuation * distance + light0.quadraticAttenuation * distance * distance);

		if (light0.spotCutoff <= 90.0) // spotlight?
		{
			float clampedCosine = max(0.0, dot(-lightDirection, light0.spotDirection));
			if (clampedCosine < cos(radians(light0.spotCutoff))) // outside of spotlight cone?
			{
				attenuation = 0.0;
			}
			else
			{
				attenuation = attenuation * pow(clampedCosine, light0.spotExponent);   
			}
		}
	}

	vec3 ambientLighting = vec3(scene_ambient) * vec3(frontMaterial.ambient);
	vec3 diffuseReflection = attenuation * vec3(light0.diffuse) * vec3(frontMaterial.diffuse) * max(0.0, dot(normalDirection, lightDirection));
	vec3 specularReflection;

	// light source on the wrong side?
	if (dot(normalDirection, lightDirection) < 0.0)
	{
		specularReflection = vec3(0.0, 0.0, 0.0); // no specular reflection
	}
	// light source on the right side
	else
	{
		specularReflection = attenuation * vec3(light0.specular) * vec3(frontMaterial.specular) * pow(max(0.0, dot(reflect(-lightDirection, normalDirection), viewDirection)), frontMaterial.shininess);
	}

	gl_FragColor = vec4(ambientLighting + diffuseReflection + specularReflection, 1.0);
}