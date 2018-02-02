precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform sampler2D uSampler;

void main(void)
{
	vec3 direction = vec3(0, 1, 0);
	vec3 directionalColor = vec3(0.0, 0.0, 0.0);
	vec3 ambientColor = vec3(1.0, 1.0, 1.0);

	vec3 lightWeighting = ambientColor + directionalColor * max(dot(normalize(vTransformedNormal), direction), 0.0);

	vec4 fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

	gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);

	if(gl_FragColor.a < 0.3)
	{
		discard;
	}
}