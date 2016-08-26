var application = require("application");
var TNSFontIcon = require("nativescript-fonticon").TNSFontIcon;
var fonticon = require("nativescript-fonticon").fonticon;
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

application.resources["fonticon"] = fonticon;
application.start({ moduleName: "views/main/main" });
