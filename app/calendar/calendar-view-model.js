const observableModule = require("tns-core-modules/data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function CalendarViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Calendar");

    const viewModel = observableModule.fromObject({
        leaves: []
    });
    
    return viewModel;
}

module.exports = CalendarViewModel;
