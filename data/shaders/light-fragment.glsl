precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform bool uUseLighting;

uniform vec3 uAmbientColor;
uniform vec3 uPointLightingLocation;
uniform vec3 uPointLightingColor;

uniform sampler2D uSampler;

void main(void)
{
	vec3 lightWeighting;
	
	if(!uUseLighting)
	{
		lightWeighting = vec3(1.0, 1.0, 1.0);
	}
	else
	{
		vec3 lightDirection = normalize(uPointLightingLocation - vPosition.xyz);
		float directionalLightWeighting = max(dot(normalize(vTransformedNormal), lightDirection), 0.0);
		lightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;
	}

	vec4 fragmentColor;
	fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);

	//Check transparent fragments and discard them
	if(gl_FragColor.a < 0.5)
	{
		discard;
	}
}