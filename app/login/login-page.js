const HRApp = require("../HRAppFunction");
const Observable = require("tns-core-modules/data/observable").Observable;
const appSettings = require("application-settings");
var dialogs = require("tns-core-modules/ui/dialogs");
const application = require("tns-core-modules/application");
const TnsOneSignal = require('nativescript-onesignal').TnsOneSignal;


const drawerComponent = application.getRootView();

function navigateToProfile(args) {
    const page = args.object.page;
    const navigationEntry = {
        moduleName: "home/home-page",
        animated: true,
        transition:
        {
            name: "slideLeft"
        },
        clearHistory: true
    };
    drawerComponent.gesturesEnabled = true;
    page.frame.navigate(navigationEntry);
}

function refreshDrawer(data) {
    const drawerBind = drawerComponent.bindingContext;
    drawerBind.set("name", data.staff_name);
    let pos = data.level;
    drawerBind.set("pos", pos == 0 ? "Staff" : pos == 1 ? "Head of department" : "Boss");
}

exports.pageLoaded = (args) => {
    drawerComponent.gesturesEnabled = false;
    const page = args.object;
    const viewModel = new Observable();
    viewModel.username = "";
    viewModel.password = "";
    viewModel.loading = false;
    viewModel.login = (args) => {
        viewModel.set("loading", true);
        let gsm = getGSM()
        console.log(gsm);
        HRApp.HRAppLogin(viewModel.get("username"), viewModel.get("password"), gsm).then(
            (response) => {
                viewModel.set("loading", false);
                if (response.content == 1) {
                    dialogs.alert({
                        title: "There was a mistake",
                        message: "You entered incorrect username or password",
                        okButtonText: "OK"
                    });
                } else {
                    const userData = JSON.parse(response.content)[0][0];
                    console.log(userData);
                    appSettings.setString("userData", JSON.stringify(userData));
                    refreshDrawer(userData);
                    navigateToProfile(args);
                }
            },
            (e) => {
                viewModel.set("loading", false);
                dialogs.alert({
                    message: e.toString(),
                    okButtonText: "OK"
                });
            }

        );

    };

    page.bindingContext = viewModel;
};

function getGSM(){
    let status = TnsOneSignal.getPermissionSubscriptionState();
    // console.log(status.getPermissionStatus().getEnabled());
        
    // console.log(status.getSubscriptionStatus().getSubscribed());
    // console.log(status.getSubscriptionStatus().getUserSubscriptionSetting());
    return status.getSubscriptionStatus().getUserId();
    // console.log(status.getSubscriptionStatus().getPushToken());
}
