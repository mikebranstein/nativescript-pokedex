var viewModel = require("./pokedex-view-model");

function onLoaded(args) {
    var page = args.object;
    page.bindingContext = viewModel.pokedexViewModel;
}
exports.onLoaded = onLoaded;