/**
LOGIN (HTTP POST) :
URL: http://consurv.no-ip.biz/leave/logintest
Expected variable : username, password, gsm
On successful will return : JSON(userdata)

Change Password (HTTP POST) :
URL: http://consurv.no-ip.biz/leave/changepassword
Expected variable : username, olpass, newpass
On successful will return : JSON(userdata)

Leave Status (HTTP POST) :
URL: http://consurv.no-ip.biz/leave/leavedetail
Expected variable : staffid
On successful will return : JSON(userdata)


Leave approve (HTTP POST) :
URL: http://consurv.no-ip.biz/leave/updateapprove
Expected variable : leaveid, action
On successful will return : JSON(userdata)

Apply Leave (HTTP POST) :
URL: http://consurv.no-ip.biz/leave/submitleave
Expected variable :  staff_id, leavetype, reason, currentDate, endDate, image, halfday1,halfday2
On successful will return : JSON(userdata)


TYPE OF LEAVE (HTTP GET) :
URL: http://consurv.no-ip.biz/leave/leavetype
On successful will return : JSON(userdata)

 */



const httpModule = require("tns-core-modules/http");
/*
Expected variable : 
    username(user input), 
    password(user input), 
    gsm(OneSinal playerID)

return userData
*/

exports.HRAppLogin = (username,password,gsm) => {
    return httpModule.request({
        url: "http://consurv.no-ip.biz/leave/logintest",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({username,password,gsm})
    })
}

/*
Expected input : 
    username(from user data), 
    old password(user input), 
    new Password(user input)

Return status(1 = success, 0 = failed)
*/
exports.HRAppChangePassword = (username,olpass,newpass) => {
    return httpModule.request({
        url: "http://consurv.no-ip.biz/leave/changepassword",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({username, olpass, newpass})
    })
}
/*
Expected input : 
    staffid(from user data)

return :
    staff(every leave applied)
    HOD(every leave applied & leave pending for HOD approval)
    BOSS(leave pending for HOD approval)
*/

exports.HRAppLeaveStatus = (staffid) => {
    return httpModule.request({
        url: "http://consurv.no-ip.biz/leave/leavedetail",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({staffid})
    })
}

//return array {typeid,leavetype}
exports.HRAppGetLeaveType = () =>{
    return httpModule.request({
        url: "http://consurv.no-ip.biz/leave/leavetype",
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

/*
Expected input : 
    staff_id(from user data),
    leavetype(typeid from HRAppGetLeaveType),
    reason(user input string),
    currentDate(in string),
    endDate(in string),
    image(leave it null),
    halfday1( 1=full day, 2=morning, 3=evening )
    halfday2( 1=full day, 2=morning, 3=evening )

Return user Data

*/
exports.HRAppApplyLeave = (staff_id, leavetype, reason, currentDate, endDate, image, halfday1,halfday2) => {
    //console.log(JSON.stringify({staff_id, leavetype, reason, currentDate, endDate, image, halfday1,halfday2}));
    return httpModule.request ({
        url: "http://consurv.no-ip.biz/leave/submitleave",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({staff_id, leavetype, reason, currentDate, endDate, image, halfday1,halfday2})
    })
}

/*
Expected Input : 
    leaveid(from HRAppLeaveStatus),
    action( 1= Leave Approved,2 =Leave Canceled )

Return user data
*/
exports.HRAppApproveLeave = (leaveid, action) => {
    return httpModule.request({
        url: "http://consurv.no-ip.biz/leave/updateapprove",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({leaveid, action})
    })
}

/*
Expected input:
    date(js date object)

Return date string accepted by the server
 */
exports.dateString = (date) => {
    let day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    let year = date.getFullYear();
    console.log(year, " ", month, " ", day);
    return (year + "/" + month + "/" + day);

}