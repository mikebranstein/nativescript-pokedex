var observable = require("data/observable");
var fs = require("file-system");
var tts = require("nativescript-texttospeech");

var PokedexModel = (function (_super) {
    __extends(PokedexModel, _super);
    function PokedexModel() {
        _super.call(this);
        this.imageNumber = 0;
        this.prevImageNumber = 719;
        this.nextImageNumber = 1;
        this.lowerBound = 0;

        var appFolder = fs.knownFolders.currentApp();
        var file = appFolder.getFile("pokedex.json");

        file.readText("ASCII").then(function(content) {
            this.pokedex = JSON.parse(content);
        }.bind(this)).then(function () {
            this.update();
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

    PokedexModel.prototype.getImageNumber = function (num, direction) {
        var result = num;

        if (direction === -1 && num === this.lowerBound)
            result = this.pokedex.length - 1;
        else if (direction === 1 && num === this.pokedex.length - 1) 
            result = this.lowerBound;
        else 
            result += direction;

        return result;
    };

    PokedexModel.prototype.changePokemon = function (direction) {
        tts.speak(""); // stop speaking
        
        this.imageNumber = this.getImageNumber(this.imageNumber, direction);
        this.prevImageNumber = this.getImageNumber(this.imageNumber, -1);
        this.nextImageNumber = this.getImageNumber(this.imageNumber, 1);

        this.update();
    };

    PokedexModel.prototype.update = function () {
        // current
        var pokemon = this.pokedex[this.imageNumber];
        this.set("imageSource", "~/images/" + pokemon.fileName);
        this.set("name", pokemon.name);
        this.set("description", pokemon.description);
        this.set("id", "#" + this.pad(this.imageNumber + 1, 3));
        this.set("height", pokemon.height);
        this.set("category", pokemon.category);
        this.set("weight", pokemon.weight);
        this.set("stats", 
            [pokemon.hp_stat, pokemon.attack_stat, 
            pokemon.defense_stat, pokemon.special_attack_stat, 
            pokemon.special_defense_stat, pokemon.speed_stat]);

        // prev
        this.set("prevId", "#" + this.pad(this.prevImageNumber + 1, 3));
        this.set("prevName", this.pokedex[this.prevImageNumber].name);

        // next
        this.set("nextId", "#" + this.pad(this.nextImageNumber + 1, 3));    
        this.set("nextName", this.pokedex[this.nextImageNumber].name);
    };

    PokedexModel.prototype.onTap = function (args) {
        if (args.object.id.includes("prev")) {
            this.changePokemon(-1);
        } else {
            this.changePokemon(1);
        }
    };

    PokedexModel.prototype.onSayName = function (args) {
        tts.speak(this.pokedex[this.imageNumber].name, false, 1.75, 0.5, null);
    };

    PokedexModel.prototype.onReadDescription = function (args) {
        tts.speak(this.pokedex[this.imageNumber].description, false, 1.75, 0.5, null);
    };

    return PokedexModel;
})(observable.Observable);
exports.PokedexModel = PokedexModel;
exports.pokedexViewModel = new PokedexModel();
