var colorModule = require("color");
var animationModule = require("ui/animation");
var observableModule = require("data/observable");
var labelModule = require("ui/label");
var frameModule = require("ui/frame");
var page;

function onNavigatedTo(args) {
    page.bindingContext = args.object.navigationContext;
}

function onLoaded(args) {
    page = args.object;
    page.bindingContext
        .addEventListener(observableModule.Observable.propertyChangeEvent, 
            function (args) {
                if (args.propertyName === "stats") {
                    animateStats(args.value);
                } 
            });

    var descriptionLabel = page.getViewById("description");
    descriptionLabel.addEventListener(labelModule.Label.propertyChangeEvent, 
        function(args) {
            if (args.propertyName === "text") {
                setDescriptionLineSpacing();
            }
    });

    // set the line spacing
    setDescriptionLineSpacing();

    // tell the initial pokemon loaded to animate it's stats
    animateStats(page.bindingContext.stats);
}
exports.onLoaded = onLoaded;

function setDescriptionLineSpacing() {
    var descriptionLabel = page.getViewById("description");
    labelLineHeight(descriptionLabel, 10);
}

function animateStats(meterValues) {

    var meterIds = 
        ["hpMeter", "attackMeter", "defenseMeter", 
            "specialAttackMeter", "specialDefenseMeter", "speedMeter"];

    var controlMeter = function (meter, initialLevel, level, delay) {
        setTimeout(function() {
            drainMeter(meter, 10, 0, 500)
                .then(function() { return fillMeter(meter, 0, initialLevel, 0); })
                .then(function() { return drainMeter(meter, initialLevel, 0, 500); })
                .then(function() { return fillMeter(meter, 0, level, 0); });
        }, delay);
    };

    var shuffle = function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    var delay = 0;
    var delayOffset = 250;
    var order = shuffle([0,1,2,3,4,5]);
    for (var i = 0; i < order.length; i++) {
        var initialLevel = Math.floor((Math.random() * 10) + 1);
        controlMeter(meterIds[order[i]], initialLevel, meterValues[order[i]], delay);
        delay += delayOffset;
    }
}



function fillMeter(id, fromLevel, toLevel, beginDelay, endDelay) {
    var meter = getMeterById(id);
    return fillRecurse(meter, toLevel, fromLevel, 1, "#30A7D7", endDelay);
}

function drainMeter(id, fromLevel, toLevel, endDelay) {
    var meter = getMeterById(id);
    return fillRecurse(meter, toLevel-1, fromLevel-1, -1, "white", endDelay);    
}

function fillRecurse(meter, level, current, step, color, endDelay) {
    if (current === level) return new Promise(function(resolve,error) {
        setTimeout(function() {
            resolve();
        }, endDelay);
    });

    return meter[current].animate({
        backgroundColor: new colorModule.Color(color),
        duration: 40
    }).then(function() {
        return fillRecurse(meter, level, current+step, step, color, endDelay);
    });
}

function getMeterById(id) {
    var meter = new Array();

    var meterContainer = page.getViewById(id);
    var childrenCount = meterContainer.getChildrenCount();
    for (var i = childrenCount-2; i >= 0; i--) {
        meter[meter.length] = meterContainer.getChildAt(i);
    }

    return meter;
}

function labelLineHeight(nsLabel, amount) {

    if(nsPlatform.ios){
        var label= nsLabel.ios;
        var attributedString;

        if(label.atributedText){
            attributedString = label.atributedText;
        }
        else{
            attributedString=NSMutableAttributedString.alloc().initWithString(label.text);
        }
        var paragraphStyle = NSMutableParagraphStyle.alloc().init();
        paragraphStyle.lineSpacing = amount;
        var range= NSMakeRange(0, label.text.length);
        attributedString.addAttributeValueRange(NSParagraphStyleAttributeName, paragraphStyle, range);
        label.attributedText = attributedString;
    }
    if(nsPlatform.android){
        var label = nsLabel.android;
        //Default spacing is 20% of text size
        //setLineSpacing(add,multiplyby);
        label.setLineSpacing(amount, 1);
    }   
}