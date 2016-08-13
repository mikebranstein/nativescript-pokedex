var viewModel = require("./pokedex-view-model");

function onLoaded(args) {
    var page = args.object;
    page.bindingContext = viewModel.pokedexViewModel;

    // set the line spacing
    var descriptionLabel = page.getViewById("description");
    labelLineHeight(descriptionLabel, 10);
}
exports.onLoaded = onLoaded;

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