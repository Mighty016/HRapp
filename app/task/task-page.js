const app = require("tns-core-modules/application");

const TaskViewModel = require("./task-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new TaskViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
