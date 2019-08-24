const app = require("tns-core-modules/application");
const HomeViewModel = require("./home-view-model");
const frameModule = require("tns-core-modules/ui/frame");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function link(args) {
    var bc = args.object.bindingContext;
    if (!bc.navigating) {
        bc.navigating = true;
        var position = bc.category;
        var destination = "leave/leave-page"
        if (position != 2) {
            destination = "apply-leave/apply-leave";
        }
        setTimeout(() => {
            frameModule.topmost().navigate({
                moduleName: destination,
                transition: {
                    name: "fade"
                }
            });
        }, 250);
    }
}

exports.link = link;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
