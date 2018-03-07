"use strict";

function PhongMaterial(name)
{
	MeshMaterial.call(this);

	this.name = name;
	this.type = "PhongMaterial";

	this.texture = null;
	this.normalMap = null;
	this.bumpMap = null;
	this.specularMap = null;

	this.ambient = new Color(1,1,1); //Ambient Value
	this.diffuse = new Color(1,1,1); //Diffuse Value
	this.specular = new Color(1,1,1); //Specular Value
	this.specularIntensity = 1; //Specular Intensity (Phong constant) range [1, 1000]
	
	this.alpha = 1; //Alpha Value
}

PhongMaterial.prototype = Object.create(MeshMaterial.prototype);
PhongMaterial.prototype.constructor = PhongMaterial;
PhongMaterial.id = MathUtils.generateID();

PhongMaterial.createShader = function(gl)
{
	var fragmentShader = MeshMaterial.fragmentHeader + "void main(void)\
	{\
		vec3 normal = normalize(vec3((model * vec4(fragmentNormal, 0.0)).xyz));\
		vec4 vertex = model * vec4(fragmentVertex, 1.0);\
		\
		/* Directional light */\
		vec3 directionalColor = vec3(0.3, 0.3, 0.3);\
		vec3 directional = directionalColor * dot(normal, vec3(0, 1, 0.5));\
		\
		/* Ambient light */\
		vec3 ambient = vec3(0.3, 0.3, 0.3);\
		\
		/* Point light A*/\
		vec3 pointLightColor = vec3(0.0, 0.0, 2.0);\
		vec4 pointLightPosition = vec4(50.0, 30.0, 50.0, 1.0);\
		vec3 lightDirection = normalize(pointLightPosition.xyz - vertex.xyz);\
		vec3 pointA = pointLightColor * max(dot(normalize(normal), lightDirection), 0.0);\
		\
		/* Point light B*/\
		pointLightColor = vec3(2.0, 0.0, 0.0);\
		pointLightPosition = vec4(-50.0, 30.0, -50.0, 1.0);\
		lightDirection = normalize(pointLightPosition.xyz - vertex.xyz);\
		vec3 pointB = pointLightColor * max(dot(normalize(normal), lightDirection), 0.0);\
		\
		/* Point light C*/\
		pointLightColor = vec3(0.0, 1.0, 0.0);\
		pointLightPosition = vec4(-50.0, 30.0, 50.0, 1.0);\
		lightDirection = normalize(pointLightPosition.xyz - vertex.xyz);\
		vec3 pointC = pointLightColor * max(dot(normalize(normal), lightDirection), 0.0);\
		\
		gl_FragColor = texture2D(texture, vec2(fragmentUV.s, fragmentUV.t));\
		gl_FragColor.rgb *= ambient + directional + pointA + pointB + pointC;" + MeshMaterial.alphaTest + "\
	}";

	var shader = new Shader(gl, fragmentShader, MeshMaterial.vertexShader);

	//Vertex attributes
	shader.registerVertexAttributeArray("vertexPosition");
	shader.registerVertexAttributeArray("vertexUV");
	shader.registerVertexAttributeArray("vertexNormal");

	//Texture
	shader.registerUniform("texture");

	//Matrices
	shader.registerUniform("view");
	shader.registerUniform("projection");
	shader.registerUniform("model");

	//Uniforms
	shader.registerUniform("alphaTest");
	shader.registerUniform("far");
	shader.registerUniform("near");

	return shader;
};
