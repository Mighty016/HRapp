const observableModule = require("tns-core-modules/data/observable");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const SelectedPageService = require("../shared/selected-page-service");


function LeaveViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Leave List");

    const viewModel = observableModule.fromObject({
        approved: new ObservableArray(),
        pending:new ObservableArray()
    });

    return viewModel;
}

module.exports = LeaveViewModel;
