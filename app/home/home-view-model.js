const observableModule = require("tns-core-modules/data/observable");
const appSettings = require("application-settings");
const SelectedPageService = require("../shared/selected-page-service");

function HomeViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
    
    var data = JSON.parse(appSettings.getString("userData"));

    const viewModel = observableModule.fromObject({
        username: data.staff_name,
        category: data.level,
        leave: data.no,
        navigating: false,
        year: data.year
    });

    return viewModel;
}

module.exports = HomeViewModel;
