var viewModel = require("~/pokedex-view-model");
var frameModule = require("ui/frame");

function onLoaded(args) {
    page = args.object;
    page.bindingContext = viewModel.pokedexViewModel;
}
exports.onLoaded = onLoaded;

function onItemSelecting(args) {
    viewModel.pokedexViewModel.changePokemonTo(args.itemIndex);

    var navigationEntry = {
        moduleName: "views/pokemon/pokemon",
        bindingContext: viewModel.pokedexViewModel,
        clearHistory: false
    };
    frameModule.topmost().navigate(navigationEntry);
}
exports.onItemSelecting = onItemSelecting;