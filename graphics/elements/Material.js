function Material()
{
	this.name = "material";
	this.ambient = new Color(1,1,1);
	this.diffuse = new Color(1,1,1);
	this.specular = new Color(0.5,0.5,0.5);
	this.specular_ns = 1;
	this.alpha = 1;
}

Material.prototype.loadMTL = loadMTL;

function loadMTL()
{
	//MTL File Spec
	/*define a material named 'Colored'
    newmtl Colored
    The ambient color of the material is declared using Ka.
    Ka 1.000 1.000 1.000     # white
    Similarly, the diffuse color is declared using Kd.
    Kd 1.000 1.000 1.000     # white
    The specular color is declared using Ks, and weighted using the specular exponent Ns.
    Ks 0.000 0.000 0.000     # black (off)
   		Ns 10.000                # ranges between 0 and 1000
   	Materials can be transparent.
   	d 0.9                    # some implementations use 'd'
    Tr 0.1                   # others use 'Tr' (inverted)*/
}