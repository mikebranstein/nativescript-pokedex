var viewModel = require("./pokedex-view-model");
var frameModule = require("ui/frame");

function onLoaded(args) {
    page = args.object;
    page.bindingContext = viewModel.pokedexViewModel;
}
exports.onLoaded = onLoaded;

function onItemTap(args) {
    console.log(args);

    var index = args.index;
    viewModel.pokedexViewModel.changePokemonTo(index);

    var navigationContext = {
        moduleName: "main-page",
        bindingContext: viewModel.pokedexViewModel,
        clearHistory: false
    };
    frameModule.topmost().navigate(navigationContext);
}
exports.onItemTap = onItemTap;