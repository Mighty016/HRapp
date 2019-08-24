const application = require("tns-core-modules/application");
const frameModule = require("tns-core-modules/ui/frame");

const AppRootViewModel = require("./app-root-view-model");

function onLoaded(args) {
    const drawerComponent = args.object;
    drawerComponent.bindingContext = new AppRootViewModel();
}

function onNavigationItemTap(args) {
    const component = args.object;
    const componentRoute = component.route;
    const componentTitle = component.title;
    const bindingContext = component.bindingContext;

    setTimeout(function () {
        bindingContext.set("selectedPage", componentTitle);
        const drawerComponent = application.getRootView();
        drawerComponent.closeDrawer();
        setTimeout(() => {
            frameModule.topmost().navigate({
                moduleName: componentRoute,
                transition: {
                    name: "fade"
                }
            });
        }, 350);
    }, 200);
}

exports.onLoaded = onLoaded;
exports.onNavigationItemTap = onNavigationItemTap;
