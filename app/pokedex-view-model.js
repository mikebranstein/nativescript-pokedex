var observable = require("data/observable");
var fs = require("file-system");
var tts = require("nativescript-texttospeech");

var PokedexModel = (function (_super) {
    __extends(PokedexModel, _super);
    function PokedexModel() {
        _super.call(this);
        this.imageNumber = 0;
        this.lowerBound = 0;

        var appFolder = fs.knownFolders.currentApp();
        var file = appFolder.getFile("pokedex.json");

        file.readText("Unicode").then(function(content) {
            this.pokedex = JSON.parse(content);
        }.bind(this)).then(function () {
            this.set("imageSource", "~/images/" + this.pokedex[this.imageNumber].fileName);
            this.set("name", this.pokedex[this.imageNumber].name);
            this.set("description", this.pokedex[this.imageNumber].description);
        }.bind(this));
    };

    PokedexModel.prototype.pad = function (number, width) {
        width -= number.toString().length;
        if ( width > 0 )
        {
            return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + ""; // always return a string
    };

    PokedexModel.prototype.changePokemon = function (direction) {
        console.log(this.imageNumber);
        tts.speak("");
        
        if (direction === -1 && this.imageNumber === this.lowerBound)
            this.imageNumber = this.pokedex.length - 1;
        else if (direction === 1 && this.imageNumber === this.pokedex.length - 1) 
            this.imageNumber = this.lowerBound;
        else 
            this.imageNumber += direction;
        
        this.set("imageSource", "~/images/" + this.pokedex[this.imageNumber].fileName);
        this.set("name", this.pokedex[this.imageNumber].name);
        this.set("description", this.pokedex[this.imageNumber].description);
    };

    PokedexModel.prototype.onTap = function (args) {
        if (args.object.id === "prev") {
            this.changePokemon(-1);
        } else {
            this.changePokemon(1);
        }
    };

    PokedexModel.prototype.readDescription = function (args) {
        tts.speak(this.pokedex[this.imageNumber].description, false, 1.75, 0.5, null);
    };

    return PokedexModel;
})(observable.Observable);
exports.PokedexModel = PokedexModel;
exports.pokedexViewModel = new PokedexModel();
