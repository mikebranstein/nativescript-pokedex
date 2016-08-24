var application = require("application");
var TNSFontIcon = require("nativescript-fonticon").TNSFontIcon;
var fonticon = require("nativescript-fonticon").fonticon;
require("nativescript-platform");

TNSFontIcon.paths = {
  "fa": "font-awesome.css"
};
TNSFontIcon.loadCss();

application.resources["fonticon"] = fonticon;
application.start({ moduleName: "main-page" });
