var application = require("application");
var TNSFontIcon = require("nativescript-fonticon").TNSFontIcon;
var fonticon = require("nativescript-fonticon").fonticon;
var fresco = require("nativescript-fresco");
require("nativescript-platform");

TNSFontIcon.paths = {
  "fa": "font-awesome.css"
};
TNSFontIcon.loadCss();

// global binding formatter
function pad(value, width) {
    width -= value.toString().length;
    if ( width > 0 )
    {
        return "#" + new Array( width + (/\./.test( value ) ? 2 : 1) ).join( '0' ) + value;
    }
    return "#" + value; // always return a string
}
application.resources["pad"] = pad;

//global binding formatter
function padWithImageResource(value, width) {
    width -= value.toString().length;
    if ( width > 0 )
    {
        value = "" + new Array( width + (/\./.test( value ) ? 2 : 1) ).join( '0' ) + value;
    }
    return "http://assets.pokemon.com/assets/cms2/img/pokedex/full/" + value + ".png";
}
application.resources["padWithImageResource"] = padWithImageResource;

// global binding formatter
function getTypeClass(value, location) {
    return location + " type-" + value.toLowerCase();
}
application.resources["getTypeClass"] = getTypeClass;

// global binding formatter
function getEvolutionClass(value, index, baseClass) {
    if (index < value.length) return baseClass;
    return baseClass + " evo-hidden";
}
application.resources["getEvolutionClass"] = getEvolutionClass;

// load fresco for android
if (application.android) {
    application.onLaunch = function (intent) {
        fresco.initialize();
    };
}

application.resources["fonticon"] = fonticon;
application.start({ moduleName: "views/main/main" });
