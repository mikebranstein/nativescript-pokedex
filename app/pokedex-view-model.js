var observable = require("data/observable");
var observableArray = require("data/observable-array");
var listViewModule = require("nativescript-telerik-ui/listview")
var fs = require("file-system");
var tts = require("nativescript-texttospeech");

var PokedexModel = (function (_super) {
    __extends(PokedexModel, _super);

    function speakText(text) {
        if (nsPlatform.ios) {
            // ios
            tts.speak(text, false, 1.75, 0.5, null);
        } else {
            // android
            tts.speak(text, false, 0.75, 0.9, null);
        }
    };

    function PokedexModel() {
        _super.call(this);
        this.imageNumber = 0;
        this.prevImageNumber = 719;
        this.nextImageNumber = 1;
        this.lowerBound = 0;
        this._onDemandPokedex = new observableArray.ObservableArray();
        this._numberOfAddedItems = 0;

        var appFolder = fs.knownFolders.currentApp();
        var file = appFolder.getFile("pokedex.json");

        file.readText("ASCII").then(function(content) {
            this.pokedex = JSON.parse(content);
            for (var i = 0; i < 10; i++) {
                this._onDemandPokedex.push(this.pokedex[i]);
                this._numberOfAddedItems++;
            }
        }.bind(this)).then(function () {
            this.update();
        }.bind(this));
    };

    PokedexModel.prototype.onLoadMoreItemsRequested = function(args) {
        console.log("requesting more!");
        var that = new WeakRef(this);
        var listView = args.object;
        var initialNumberOfItems = that.get()._numberOfAddedItems;
        for (var i = that.get()._numberOfAddedItems; i < initialNumberOfItems + 25; i++) {
            if (i > this.pokedex.length - 1) {
                listView.loadOnDemandMode = listViewModule.ListViewLoadOnDemandMode[listViewModule.ListViewLoadOnDemandMode.None];
                break;
            }
            that.get()._onDemandPokedex.push(that.get().pokedex[i]);
            that.get()._numberOfAddedItems++;
        }

        listView.notifyLoadOnDemandFinished();

        args.returnValue = true;        
    };

    PokedexModel.prototype.pokedex = function() {
        return this.pokedex;
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

    PokedexModel.prototype.changePokemonTo = function (index) {
        tts.speak(""); // stop speaking
        
        this.imageNumber = index;
        this.prevImageNumber = this.getImageNumber(this.imageNumber, -1);
        this.nextImageNumber = this.getImageNumber(this.imageNumber, 1);

        this.update();
    };

    PokedexModel.prototype.update = function () {
        // current
        var pokemon = this.pokedex[this.imageNumber];
        this.set("imageSource", "~/images/" + pokemon.fileName);
        this.set("imageSourceAndroid", "http://assets.pokemon.com/assets/cms2/img/pokedex/full/" + this.pad(this.imageNumber + 1, 3) + ".png");
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

        var types = [];
        for (var i = 0; i < pokemon.types.length; i++) {
            types[types.length] = { value: pokemon.types[i] };
        }
        this.set("type", types);

        var evolution = [];
        for (var i = 0; i < pokemon.evolution.length; i++) {
            evolution[evolution.length] = {
                imageSource: "~/images/" + pokemon.evolution[i] + ".png",
                imageSourceAndroid: "http://assets.pokemon.com/assets/cms2/img/pokedex/full/" + pokemon.evolution[i] + ".png",
                name: this.pokedex[parseInt(pokemon.evolution[i]) - 1].name,
                id: "#" + pokemon.evolution[i]
            };

            if (i == 0) this.set("evolution-first", evolution[i]);
            if (i == 0) this.set("evolution-second", evolution[i]);
            if (i == 0) this.set("evolution-third", evolution[i]);
        }
        this.set("evolution", evolution);

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

    PokedexModel.prototype.onEvoTap = function (args) {
        var id = args.object.id;
        var index = 0;
        if (id.includes("first")) index = 0;
        else if (id.includes("second")) index = 1;
        else if (id.includes("third")) index = 2;

        var pokemonId = parseInt(this.pokedex[this.imageNumber].evolution[index]);
        this.changePokemonTo(pokemonId - 1);
    };

    PokedexModel.prototype.onSayName = function (args) {
        speakText(this.pokedex[this.imageNumber].name);
    };

    PokedexModel.prototype.onReadDescription = function (args) {
        speakText(this.pokedex[this.imageNumber].description);
    };

    PokedexModel.prototype.onSayType = function (args) {
        speakText(args.object.text);
    };

    return PokedexModel;
})(observable.Observable);
exports.PokedexModel = PokedexModel;
exports.pokedexViewModel = new PokedexModel();
