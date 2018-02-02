precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform sampler2D uSampler;

void main(void)
{
	vec3 lightDirection = vec3(0, 1, 0);
	vec3 uPointLightingColor = vec3(0.8, 0.8, 0.8);
	vec3 uAmbientColor = vec3(0.4, 0.4, 0.4);

	float directionalLightWeighting = max(dot(normalize(vTransformedNormal), lightDirection), 0.0);
	vec3 lightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;

	vec4 fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);

	if(gl_FragColor.a < 0.3)
	{
		discard;
	}
}