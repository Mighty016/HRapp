const app = require("tns-core-modules/application");
const HRApp = require("../HRAppFunction");
const appSettings = require("application-settings");
const observableModule = require("tns-core-modules/data/observable");
const SelectedPageService = require("../shared/selected-page-service");
const dialogs = require("tns-core-modules/ui/dialogs");
const ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;

exports.onDrawerButtonTap = (args) => {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
};

exports.onNavigatingTo = (args) => {
    SelectedPageService.getInstance().updateSelectedPage("Apply Leave");

    const viewModel = observableModule.fromObject({
        selected: { leavetype: "Select type of leave", typeid: 0 },
        reason: "",
        datefrom: 'PICK DATE',
        dateend: 'PICK DATE',
        halfday1: {
            id: 1,
            name: "Full day"
        },
        halfday2: {
            id: 1,
            name: "Full day"
        },
        typeList: [{ leavetype: "Failed to connect. Make sure you are connected to the internet, then reopen this page",typeid: 0}],
        busy: false
    });

    HRApp.HRAppGetLeaveType().then(
        (response) => {
            viewModel.typeList = JSON.parse(response.content);
        }
    );

    args.object.bindingContext = viewModel;
};


exports.onApplyLeave = (args) => {
    var bc = args.object.bindingContext;
    const { selected, reason, datefrom, dateend, halfday1, halfday2} = bc;
    const userdata = JSON.parse(appSettings.getString("userData"));
    if (reason === "" || datefrom === "PICK DATE" || dateend === "PICK DATE" || selected.typeid === 0) {
        dialogs.alert({
            title: "Incomplete form",
            message: "Please fill in all the details",
            okButtonText: "OK"
        });
    } else {
        if (new Date(dateend) - new Date(datefrom) >= 0) {
            dialogs.confirm({
                title: "Confirm apply?",
                message: `Name: ${userdata.staff_name}\nType: ${selected.leavetype}\nReason: ${reason}\nFrom: ${datefrom} (${halfday1.name})\nTo: ${dateend} (${halfday2.name})`,
                cancelButtonText: "NO",
                okButtonText: "YES"
            }).then((result) => {
                if (result) {
                    bc.busy = true;
                    HRApp.HRAppApplyLeave(
                        userdata.staff_id,
                        selected.typeid,
                        reason,
                        datefrom,
                        dateend,
                        "",
                        halfday1.id,
                        halfday2.id
                    ).then(
                        (response) => {
                            bc.busy = false;
                            userData = JSON.parse(response.content)[0][0];
                            appSettings.setString("userData", JSON.stringify(userdata));
                            dialogs.alert({
                                title: "Success",
                                message: "Leave have been applied, waiting for approval",
                                okButtonText: "OK"
                            });
                        }, (e) => {
                            bc.busy = false;
                            dialogs.alert({
                                message: e.toString(),
                                okButtonText: "OK"
                            });
                        }
                    );
                }
            });
        } else {
            dialogs.alert({
                title: "There was a mistake",
                message: "Invalid end date",
                okButtonText: "OK"
            });
        }
    }

};

exports.chooseLeaveType = (args) => {
    let bc = args.object.bindingContext;
    const display = bc.typeList.map((v) => v.leavetype);
    dialogs.action({
        message: "Leave type",
        cancelButtonText: "BACK",
        actions: display
    }).then(
        (result) => {
            bc.selected = bc.typeList.find((v) => v.leavetype === result);
        }
    );
};

exports.onChooseLeaveDuration = (args) => {
    const btn = args.object.id;

    let bc = args.object.bindingContext;
    const option = [
        { id: 1, name: "Full day" },
        { id: 2, name: "Morning" },
        { id: 3, name: "Evening" }
    ];
    const display = option.map((v) => v.name);

    dialogs.action({
        message: "Duration",
        cancelButtonText: "BACK",
        actions: display
    }).then(
        (result) => {
            bc.set(btn, option.find((v) => v.name === result));
        }
    );
};

exports.onChooseDate = (args) => {
    let id = args.object.id;
    let bc = args.object.bindingContext;
    var minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 12);
    //console.log(!isNaN(new Date(bc.get('datefrom')).getTime()),id == 'dateend')
    if(!isNaN(new Date(bc.get('datefrom')).getTime()) && id == 'dateend'){
        console.log("min added");
        minDate = new Date(bc.get('datefrom'));
    }
    const picker = new ModalPicker();
    picker.pickDate({
        title: "Select date",
        theme: "light",
        minDate: minDate
    }).then(
        (result) => {
            const { year, month, day } = result;
            bc.set(id, HRApp.dateString(new Date(year, month - 1, day)));
            if(id == 'datefrom') bc.set('dateend', HRApp.dateString(new Date(year, month - 1, day)));
        }
    );
}