function Font(fname, folder)
{
	//Info variables
	this.face = "";
	this.size = 0;
	this.bold = false;
	this.italic = false;
	this.charset = "";
	this.unicode = false;
	this.stretchH = 100;
	this.smooth = true;
	this.aa = true;
	this.padding = [1,1,1,1];
	this.spacing = [1,1];

	//Common variables
	this.lineHeight = 0;
	this.base = 0;
	this.scale = new Vector2(1, 1);
	this.pages = 0;
	this.packed = false;
	this.alphaChnl = 0;
	this.redChnl = 0;
	this.blueChnl = 0;
	this.greenChnl = 0;

	//Pages info (Indexed by id)
	this.pageId = [];
	this.pageFile = [];
	this.pageTexture = [];

	//Char info
	this.charCount = 0;
	this.charId = [];

	//Char details (Indexed by id)
	this.charPos = [];
	this.charSize = [];
	this.charOffset = [];
	this.charXadvance = [];
	this.charPage = [];
	this.charChnl = [];

	//Fill char info
	for(i = 0; i < 256; i++)
	{
		this.charPos.push(null);
		this.charSize.push(null);
		this.charOffset.push(null);
		this.charXadvance.push(null);
		this.charPage.push(null);
		this.charChnl.push(null);
	}

	//Kerning info
	this.kerningCount = 0;
	this.kerningFirst = [];
	this.kerningSecond = [];
	this.kerningAmount = [];

	//Load Font
	if(fname === undefined || folder === undefined)
	{
		this.loadFont("data/font/arial.fnt", "data/font/");
	}
	else
	{
		this.loadFont(fname, folder);
	}
}

//Load font from file
Font.prototype.loadFont = function(fname, folder)
{
	var file = App.readFile(fname);
	var data = file.split("\n");
	var id = -1;

	for(var i = 0; i < data.length; i++)
	{
		var content = data[i].split(/\s\s*/);

		if(content[0] == "info")
		{
			for(var j = 1; j < content.length; j++)
			{
				var field = content[j].split("=");
				if(field[0] == "face")
				{
					this.face = field[1].replace(new RegExp("\"", 'g'), "");
				}
				else if(field[0] == "size")
				{
					this.size = parseInt(field[1]);
				}
				else if(field[0] == "bold")
				{
					this.bold = (field[1] == "1");
				}
				else if(field[0] == "italic")
				{
					this.italic = (field[1] == "1");
				}
				else if(field[0] == "charset")
				{
					this.charset = field[1].replace(new RegExp("\"", 'g'), "");
				}
				else if(field[0] == "unicode")
				{
					this.unicode = (field[1] == "1");
				}
				else if(field[0] == "stretchH")
				{
					this.stretchH = parseInt(field[1]);
				}
				else if(field[0] == "smooth")
				{
					this.smooth = (field[1] == "1");
				}
				else if(field[0] == "aa")
				{
					this.aa = (field[1] == "1");
				}
				else if(field[0] == "padding")
				{
					var values = field[1].split(",");
					this.padding[0] = parseInt(values[0]);
					this.padding[1] = parseInt(values[1]);
					this.padding[2] = parseInt(values[2]);
					this.padding[3] = parseInt(values[3]);
				}
				else if(field[0] == "spacing")
				{
					var values = field[1].split(",");
					this.spacing[0] = parseInt(values[0]);
					this.spacing[1] = parseInt(values[1]);
				}
			}	
		}
		else if(content[0] == "common")
		{
			for(var j = 1; j < content.length; j++)
			{
				var field = content[j].split("=");
				if(field[0] == "lineHeight")
				{
					this.lineHeight = parseInt(field[1]);
				}
				else if(field[0] == "base")
				{
					this.base = parseInt(field[1]);
				}
				else if(field[0] == "scaleW")
				{
					this.scale.x = parseInt(field[1]);
				}
				else if(field[0] == "scaleH")
				{
					this.scale.y = parseInt(field[1]);
				}
				else if(field[0] == "pages")
				{
					this.pages = parseInt(field[1]);
				}
				else if(field[0] == "packed")
				{
					this.aa = (field[1] == "1");
				}
				else if(field[0] == "alphaChnl")
				{
					this.alphaChnl = parseInt(field[1]);
				}
				else if(field[0] == "redChnl")
				{
					this.redChnl = parseInt(field[1]);
				}
				else if(field[0] == "blueChnl")
				{
					this.blueChnl = parseInt(field[1]);
				}
				else if(field[0] == "greenChnl")
				{
					this.greenChnl = parseInt(field[1]);
				}

			}
		}
		else if(content[0] == "page")
		{
			for(var j = 1; j < content.length; j++)
			{
				var field = content[j].split("=");
				if(field[0] == "id")
				{
					id = parseInt(field[1]);
					this.pageId.push(id);
				}
				else if(field[0] == "file")
				{
					this.pageFile[id] = field[1].replace(new RegExp("\"", 'g'), "");
					this.pageTexture[id] = Texture.createTexture(folder + this.pageFile[id]);
				}
			}
		}
		else if(content[0] == "chars")
		{
			for(var j = 1; j < content.length; j++)
			{
				var field = content[j].split("=");
				if(field[0] == "count")
				{
					this.charCount = parseInt(field[1]);
				} 
			}
		}
		else if(content[0] == "char")
		{
			for(var j = 1; j < content.length; j++)
			{
				var field = content[j].split("=");

				if(field[0] == "id")
				{
					id = parseInt(field[1]);
					this.charId.push(id);
				}
				else if(field[0] == "x")
				{
					this.charPos[id] = new Vector2(parseInt(field[1]), 0);
				}
				else if(field[0] == "y")
				{
					this.charPos[id].y = parseInt(field[1]);
				}
				else if(field[0] == "width")
				{
					this.charSize[id] = new Vector2(parseInt(field[1]), 0);
				}
				else if(field[0] == "height")
				{
					this.charSize[id].y = parseInt(field[1]);
				}
				else if(field[0] == "xoffset")
				{
					this.charOffset[id] = new Vector2(parseInt(field[1]), 0);
				}
				else if(field[0] == "yoffset")
				{
					this.charOffset[id].y = parseInt(field[1]);
				}
				else if(field[0] == "xadvance")
				{
					this.charXadvance[id] = parseInt(field[1]);
				}
				else if(field[0] == "page")
				{
					this.charPage[id] = parseInt(field[1]);
				}
				else if(field[0] == "chnl")
				{
					this.charChnl[id] = parseInt(field[1]);
				}
			}
		}
		else if(content[0] == "kernings")
		{
			for(var j = 1; j < content.length; j++)
			{
				var field = content[j].split("=");
				if(field[0] == "count")
				{
					this.kerningCount = parseInt(field[1]);
				}
			}
		}
		else if(content[0] == "kerning")
		{
			for(var j = 1; j < content.length; j++)
			{
				var field = content[j].split("=");
				if(field[0] == "first")
				{
					this.kerningFirst.push(parseInt(field[1]));
				}
				else if(field[0] == "second")
				{
					this.kerningSecond.push(parseInt(field[1]));
				}
				else if(field[0] == "amount")
				{
					this.kerningAmount.push(parseInt(field[1]));
				}
			}
		}
	}
}

//Create info string
Font.prototype.toString = function()
{
	var s = "Font " + this.face;
	s += "\n   Size:" + this.size;
	s += "\n   Bold:" + this.bold;
	s += "\n   Italic:" + this.italic;
	s += "\n   Smooth:" + this.smooth;
	s += "\n   CharList:";
	for(var i = 0; i < this.charId.length; i++)
	{
		var id = this.charId[i];
		s += "\n      " + id + " Pos" + this.charPos[id].toString() + " Size" + this.charSize[id].toString();
	}

	return s;
}
