precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform sampler2D uSampler;

void main(void)
{
	vec4 fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	gl_FragColor = vec4(fragmentColor.rgb, fragmentColor.a);

	if(gl_FragColor.a < 0.3)
	{
		discard;
	}
}