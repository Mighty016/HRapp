const dialogs = require("tns-core-modules/ui/dialogs");
const app = require("tns-core-modules/application");
const HRApp = require("./../HRAppFunction");
const SettingsViewModel = require("./settings-view-model");
const appSettings = require("application-settings");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new SettingsViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function changePassword(args) {
    const bc = args.object.bindingContext;
    const currentPswd = bc.get("currentPswd");
    const newPswd = bc.newPswd;
    const confirmPswd = bc.confirmPswd;
    const userData = JSON.parse(appSettings.getString("userData"));

    if (currentPswd == "" || newPswd == "" || confirmPswd == "") {
        dialogs.alert({
            title: "Incomplete form",
            message: "Please fill in all the details",
            okButtonText: "OK"
        });
    } else {
        if (newPswd === confirmPswd) {
            bc.busy = true;
            HRApp.HRAppChangePassword(userData.username, currentPswd, newPswd).then(
                (response) => {
                    bc.busy = false;
                    const result = JSON.parse(response.content);
                    if (result == 1) {
                        dialogs.alert({
                            title: "Success",
                            message: "Password has been successfully changed",
                            okButtonText: "OK"
                        });
                    } else {
                        dialogs.alert({
                            title: "There was a mistake",
                            message: "Incorrect current password",
                            okButtonText: "OK"
                        });
                    }
                },
                (e) => {
                    bc.busy = false;
                    dialogs.alert({
                        message: e.toString(),
                        okButtonText: "OK"
                    });
                }
            );
        } else if (newPswd !== confirmPswd) {
            dialogs.alert({
                title: "There was a mistake",
                message: "New password and confirmation password doesn't match ",
                okButtonText: "OK"
            });
        }
    }
}

function logout(args) {
    setTimeout(() => {
        dialogs.confirm({
            title: "Confirm log out",
            message: "Are you sure to log out of HRapp?",
            okButtonText: "LOG OUT",
            cancelButtonText: "CANCEL"
        }).then(function (result) {
            if (result) {
                appSettings.clear();
                const page = args.object.page;
                const navigationEntry = {
                    moduleName: "login/login-page",
                    animated: true,
                    transition:
                    {
                        name: "slideTop",

                    },
                    clearHistory: true
                };
                page.frame.navigate(navigationEntry);
            }
        });
    }, 200);

}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.changePassword = changePassword;
exports.logout = logout;
