import SyncStorage from 'sync-storage';

export async function isPermissionAllowed(id) {

    let permissions = JSONT.parse(await SyncStorage.get('permissions'))
    if (permissions.includes(id)) {

        return true
    }
    return false
}


export const PermissionHelper = {
    OccurenceReport: "OccuranceReport",
    ApproveRejectReport: "OccuranceReport/approve",
    StaffListing: "OccuranceReport/getStaffOccurance",
    OccurenceAdd: "OccuranceReport/add",
    OccurenceDelete: "OccuranceReport/delete",

    SubmitTimesheet: "Timesheet/submitTimesheet",
    TimehssetGiveReason: "Timesheet/givereason",
    StaffTimesheets: "StaffTimesheets",
    ApproveRejectTimesheet: "Timesheet/givedayApproval",
    ViewTimesheetStaff: "Timesheet/getStafftimesheet",

    EventMenu: "Event",
    EventList: "Event/get",
    EventAdd: "Event/add",
    EventUpdate: "Event/update",
    EventDelete: "Event/delete",
    EventResponseForEmployees: "Event/giveEventResponce",
}
