var observable = require("data/observable");

var PokedexModel = (function (_super) {
    __extends(PokedexModel, _super);
    function PokedexModel() {
        _super.call(this);
        this.imageNumber = 1;
        this.lowerBound = 1;
        this.upperBound = 720;
        this.set("imageSource", "~/images/" + this.pad(this.imageNumber, 3) + ".png");
    }
    PokedexModel.prototype.pad = function (number, width) {
        width -= number.toString().length;
        if ( width > 0 )
        {
            return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + ""; // always return a string
    }
    PokedexModel.prototype.changePokemon = function (direction) {
        if (direction === -1 && this.imageNumber === this.lowerBound)
            this.imageNumber = this.upperBound;
        else if (direction === 1 && this.imageNumber === this.upperBound) 
            this.imageNumber = this.lowerBound;
        else 
            this.imageNumber += direction;

        this.set("imageSource", "~/images/" + this.pad(this.imageNumber, 3) + ".png");
    }
    PokedexModel.prototype.onTap = function (args) {
        if (args.object.id === "prev") {
            this.changePokemon(-1);
        } else {
            this.changePokemon(1);
        }
    };
    return PokedexModel;
})(observable.Observable);
exports.PokedexModel = PokedexModel;
exports.pokedexViewModel = new PokedexModel();
