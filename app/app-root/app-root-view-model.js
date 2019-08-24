const observableModule = require("tns-core-modules/data/observable");
const appSettings = require("application-settings");
const SelectedPageService = require("../shared/selected-page-service");

function AppRootViewModel() {
    var history = appSettings.getString("userData");
    if (history != null) {
        var data = JSON.parse(history);
        var sname = data.staff_name;
        var category = data.level;
    } 
    const viewModel = observableModule.fromObject({
        selectedPage: "",
        name: sname ? sname : "NULL",
        pos: category == null ? "NULL" : category == 0 ? "Staff" : category == 1 ? "Head of department" : "Boss",
        hasData: history
    });

    SelectedPageService.getInstance().selectedPage$
        .subscribe((selectedPage) => { viewModel.selectedPage = selectedPage; });

    return viewModel;
}

module.exports = AppRootViewModel;
