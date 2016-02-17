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
	this.page_id = [];
	this.page_file = [];
	this.page_texture = [];

	//Char info
	this.char_count = 0;
	this.char_id = [];

	//Char details (Indexed by id)
	this.char_pos = [];
	this.char_size = [];
	this.char_offset = [];
	this.char_xadvance = [];
	this.char_page = [];
	this.char_chnl = [];

	//Fill char info
	for(i = 0; i < 256; i++)
	{
		this.char_pos.push(null);
		this.char_size.push(null);
		this.char_offset.push(null);
		this.char_xadvance.push(null);
		this.char_page.push(null);
		this.char_chnl.push(null);
	}

	//Kerning info
	this.kerning_count = 0;
	this.kerning_first = [];
	this.kerning_second = [];
	this.kerning_amount = [];

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

//Functions prototypes
Font.prototype.loadFont = loadFont;
Font.prototype.toString = toString;

//Load font from file
function loadFont(fname, folder)
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
					this.page_id.push(id);
				}
				else if(field[0] == "file")
				{
					this.page_file[id] = field[1].replace(new RegExp("\"", 'g'), "");
					this.page_texture[id] = Texture.createTexture(folder + this.page_file[id]);
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
					this.char_count = parseInt(field[1]);
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
					this.char_id.push(id);
				}
				else if(field[0] == "x")
				{
					this.char_pos[id] = new Vector2(parseInt(field[1]), 0);
				}
				else if(field[0] == "y")
				{
					this.char_pos[id].y = parseInt(field[1]);
				}
				else if(field[0] == "width")
				{
					this.char_size[id] = new Vector2(parseInt(field[1]), 0);
				}
				else if(field[0] == "height")
				{
					this.char_size[id].y = parseInt(field[1]);
				}
				else if(field[0] == "xoffset")
				{
					this.char_offset[id] = new Vector2(parseInt(field[1]), 0);
				}
				else if(field[0] == "yoffset")
				{
					this.char_offset[id].y = parseInt(field[1]);
				}
				else if(field[0] == "xadvance")
				{
					this.char_xadvance[id] = parseInt(field[1]);
				}
				else if(field[0] == "page")
				{
					this.char_page[id] = parseInt(field[1]);
				}
				else if(field[0] == "chnl")
				{
					this.char_chnl[id] = parseInt(field[1]);
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
					this.kerning_count = parseInt(field[1]);
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
					this.kerning_first.push(parseInt(field[1]));
				}
				else if(field[0] == "second")
				{
					this.kerning_second.push(parseInt(field[1]));
				}
				else if(field[0] == "amount")
				{
					this.kerning_amount.push(parseInt(field[1]));
				}
			}
		}
	}
}

//Create info string
function toString()
{
	var s = "Font " + this.face;
	s += "\n   Size:" + this.size;
	s += "\n   Bold:" + this.bold;
	s += "\n   Italic:" + this.italic;
	s += "\n   Smooth:" + this.smooth;
	s += "\n   CharList:";
	for(var i = 0; i < this.char_id.length; i++)
	{
		var id = this.char_id[i];
		s += "\n      " + id + " Pos" + this.char_pos[id].toString() + " Size" + this.char_size[id].toString();
	}

	return s;
}
