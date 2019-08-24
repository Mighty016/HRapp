const observableModule = require("tns-core-modules/data/observable");

const SelectedPageService = require("../shared/selected-page-service");


function TaskViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Task");

    const viewModel = observableModule.fromObject({
        
    });

    return viewModel;
}

module.exports = TaskViewModel;
