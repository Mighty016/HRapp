const app = require("tns-core-modules/application");
const appSettings = require("application-settings");
const LeaveViewModel = require("./leave-view-model");
const HRApp = require("../HRAppFunction");
const dialogs = require("tns-core-modules/ui/dialogs");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const TnsOneSignal = require('nativescript-onesignal').TnsOneSignal;

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new LeaveViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;

exports.onLoaded = (args) => {
    const page = args.object;
    let tabv = page.getViewById("tb");
    let layout = tabv.android.tabLayout;
    layout.setElevation(0);
    loadData(args);
};

exports.onItemTap = async (args) => {
    let type = args.object.id;
    let index = args.index;
    let bc = args.object.bindingContext;
    let user = JSON.parse(appSettings.getString("userData"));
    let selected = bc.get(type).getItem(index);
    const { leavetype, reason, datefrom, dateend, sessionFrom, gsmid, leavedetailid, approved, staff_name } = selected;
    let date = (datefrom == dateend ? `${datefrom}(${(sessionFrom != null ? sessionFrom : "Full")}) ` : `${datefrom} - ${dateend}`);
    let approval = (approved == 0 ? "Pending approval (HOD)" : approved == 1 ? "Pending approval (Boss)" : approved == 2 ? "Approved" : `unknown value (${approved})`);
    let owner = staff_name === user.staff_name;
    let past = new Date(datefrom).getTime() < new Date().getTime() || new Date(dateend).getTime() < new Date().getTime();

    dialogs.confirm({
        title: leavetype,
        message: `Reason: ${reason}\nDate: ${date}\nStatus: ${approval}\nName: ${staff_name}`,
        cancelButtonText: "BACK",
        okButtonText: (owner ? (past || approved == 2 ? "" : "CANCEL LEAVE") : "APPROVE LEAVE")
    }).then(
        (result) => {
            if (result) {
                const act = (owner ? 2 : 1);
                return dialogs.confirm({
                    title: act == 1 ? "Confirm Approve" : "Confirm Cancel",
                    message: 'Are you sure?',
                    cancelButtonText: "NO",
                    okButtonText: "YES"
                })
            }
        }
    ).then(
        (result) => {
            if (result) {
                const act = (owner ? 2 : 1);
                HRApp.HRAppApproveLeave(leavedetailid, act).then(
                    (response) => {
                        try {
                            user = JSON.parse(response.content)[0][0];
                            appSettings.setString("userData", JSON.stringify(user));
                        }
                        catch (e) {
                            console.log(e);
                        }
                        loadData(args);
                        try {
                            TnsOneSignal.postNotification(JSON.stringify(
                                {
                                    headings: { en: (owner ? "LEAVE CANCELED" : "LEAVE APPROVED") },
                                    contents: { en: notificationMessage(staff_name, owner, approved) },
                                    include_player_ids: [gsmid],
                                }), null);
                        } catch (e) {
                            console.log(e);
                        }
                        dialogs.alert({
                            title: "Done",
                            message: `Leave ${(act == 1 ? "approved" : "canceled")}`,
                            okButtonText: "BACK"
                        });

                    }
                );
            }

        }

    )


    // staff - cancel
    // HOD - approve(others' leave) , cancel(own leave)
    // BOSS - approve(staff leave)
};

function loadData(args) {
    const bc = args.object.bindingContext;
    const staff_id = JSON.parse(appSettings.getString("userData")).staff_id;
    HRApp.HRAppLeaveStatus(staff_id).then(
        (response) => {
            let result = JSON.parse(response.content)[0];
            result = result.sort((a, b) => {
                return (new Date(b.datefrom).getTime() - new Date(a.datefrom).getTime());
            });
            result.forEach((element) => {
                delete element.leaveday;
                delete element.staff_id;
                delete element.halfday;
                delete element.session;
                delete element.sessionEnd;
                delete element.datehalf;
                delete element.attachment;
                delete element.typeid;
                delete element.status;
                delete element.fullname;
                delete element.address;
                delete element.password;
                delete element.username;
                delete element.level;
                delete element.hod;
                delete element.company;
                delete element.admin;
                delete element.remember_token;
                delete element.updated_at;
            });
            
            bc.set('approved', new ObservableArray(result.filter((v) => v.approved == 2)));
            bc.set('pending', new ObservableArray(result.filter((v) => v.approved != 2)));
        }
    );
}

function notificationMessage(staff_name, owner, approved) {
    const act = (owner ? "canceled" : "approved");
    if (act === "canceled") {
        return `Hello ${staff_name} you have canceled your leave`;
    } else {
        let by = (approved == 0 ? "HOD" : approved == 1 ? "Boss" : `unknown value (${approved})`);
        return `Hello ${staff_name} your leave has been ${act} by ${by}`;
    }
}