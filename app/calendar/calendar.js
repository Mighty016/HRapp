const app = require("tns-core-modules/application");
const HRApp = require("../HRAppFunction");
const CalViewModel = require("./calendar-view-model");
const appSettings = require("application-settings");
const calendarModule = require("nativescript-ui-calendar");
const dialogs = require("tns-core-modules/ui/dialogs");
const Color = require("color").Color;
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
class CustomEvent extends calendarModule.CalendarEvent {
    constructor({ leavetype, datefrom, dateend, approved, staff_name, reason }) {
        dateend = (isNaN(new Date(dateend).getTime()) ? datefrom : dateend);
        //console.log(leaveData);
        let owner = JSON.parse(appSettings.getString("userData")).staff_name;
        owner = (staff_name === owner)
        super((owner ? leavetype : `${staff_name} - ${leavetype}`), new Date(datefrom), new Date(dateend), true, new Color((approved == 0 ? "Blue" : approved == 1 ? "Orange" : approved == 2 ? "Green" : "Red")));
        //console.log("super created")
        this.staff_name = staff_name;
        this.reason = reason;
        this.approved = (approved == 0 ? "Pending approval (HOD)" : approved == 1 ? "Pending approval (Boss)" : approved == 2 ? "Approved" : `unknown value (${approved})`);

    }
}


function onNavigatingTo(args) {
    const page = args.object;
    //console.log("running");
    page.bindingContext = new CalViewModel();
    HRApp.HRAppLeaveStatus(JSON.parse(appSettings.getString("userData")).staff_id).then(
        (response) => {
            const result = JSON.parse(response.content)[0];
            //let leaves = page.bindingContext.get("leaves");
            let leaves = [];
            //console.log(leaves);
            result.forEach((element) => {
                //console.log(element.datefrom);
                let day = (new Date(element.dateend).getTime() - new Date(element.datefrom).getTime());
                if (new Date(element.datefrom).getTime() == 0 || day < 0) return;
                leaves.push(new CustomEvent(element));

            });
            page.bindingContext.set("leaves", new ObservableArray(leaves));
            //console.log("hell");
        }, (e) => {
            //console.log(e);
        }

    );
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onInlineEventSelectedEvent = (args) => {
    dialogs.alert({
        title: args.eventData.title,
        message: constructDialogAlert(args.eventData),
        okButtonText: "Back"
    });
};

function constructDialogAlert({ startDate, endDate, approved, reason, staff_name }) {
    startDate = HRApp.dateString(startDate);
    endDate = (startDate !== endDate ? "- " + HRApp.dateString(endDate) : "")
    return (`Date: ${startDate} ${endDate}\nName: ${staff_name}\nReason: ${reason}\nStatus: ${approved}`);
}
/*
exports.onload = (args) => {
    console.log("running");

};*/
//reason,approved,status,