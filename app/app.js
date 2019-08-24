/*
In NativeScript, the app.js file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/
const application = require("tns-core-modules/application");
const TnsOneSignal = require('nativescript-onesignal').TnsOneSignal; //for Notification
//initialize OneSignal
if (application.android) {
    application.on(application.launchEvent, function(args) {
 
        try {
 
            console.log('TnsOneSignal', TnsOneSignal,application.android.context);
            TnsOneSignal.startInit(application.android.context)
            .inFocusDisplaying(TnsOneSignal.OSInFocusDisplayOption.Notification)
            .init();

            // let status = TnsOneSignal.getPermissionSubscriptionState();
            // console.log(status.getPermissionStatus().getEnabled());
                
            // console.log(status.getSubscriptionStatus().getSubscribed());
            // console.log(status.getSubscriptionStatus().getUserSubscriptionSetting());
            // console.log(status.getSubscriptionStatus().getUserId());
            // console.log(status.getSubscriptionStatus().getPushToken());
            
 
        } catch (error) {
            console.error('error', error)
        }
 
    })
}
application.run({ moduleName: "app-root/app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
