import {
  GET_MY_TIMESHEETS,
  GET_MY_DETAIL_TIMESHEET,
  GET_COMPANY_PERIOD,
  SUBMIT_TIMESHEET,
  GET_CHECKINS,
  UPDATE_CHECKOUT,
  UPDATE_TASK,
  CHECKIN,
  CHECKOUT,
  SUBMIT_REASON,
  GET_STAFF_TIMESHEETS,
  GET_COMPANY_EMPLOYEE,
  GET_STAFF_DETAIL_TIMESHEET,
  APPROVE_TIMESHEET,
  APPROVE_REJECT_DAY,
  GET_DAILY_DETAILS,
  GET_TIMESHEET_DETAIL_FROM_NOTIFICATION,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const TimesheetApiList = type => {
  switch (type) {
    case GET_MY_TIMESHEETS:
      return '/Timesheet/get';
    case GET_MY_DETAIL_TIMESHEET:
      return '/Timesheet/getMyDetailTimesheet';
    case GET_COMPANY_PERIOD:
      return '/Timesheet/getCompanyPeriod';
    case SUBMIT_TIMESHEET:
      return '/Timesheet/submitTimesheet';
    case GET_CHECKINS:
      return '/Timesheet/getcheckins';
    case UPDATE_CHECKOUT:
      return '/Timesheet/updateCheckout';
    case UPDATE_TASK:
      return '/Timesheet/updateTask';
    case CHECKIN:
      return '/Timesheet/checkin';
    case CHECKOUT:
      return '/Timesheet/checkout';
    case SUBMIT_REASON:
      return '/Timesheet/givereason';
    case GET_STAFF_TIMESHEETS:
      return '/Timesheet/getStafftimesheet';
    case GET_COMPANY_EMPLOYEE:
      return '/Timesheet/getCompanyEmployee';
    case GET_STAFF_DETAIL_TIMESHEET:
      return '/Timesheet/getStaffDetailTimesheet';
    case APPROVE_TIMESHEET:
      return '/Timesheet/givealldayApproval';
    case APPROVE_REJECT_DAY:
      return '/Timesheet/givedayApproval';
    case GET_DAILY_DETAILS:
      return '/Timesheet/getDetailTimeshseetTimes';
    case GET_TIMESHEET_DETAIL_FROM_NOTIFICATION:
      return '/Timesheet/getDetailFromNotification';
  }
};

class TimesheetAPI {
  static getMyTimesheets(input) {
    return apiCall(
      TimesheetApiList(GET_MY_TIMESHEETS),
      input,
      GET_MY_TIMESHEETS,
      RequestType.POST,
    );
  }
  static getMyDetailTimesheet(input) {
    return apiCall(
      TimesheetApiList(GET_MY_DETAIL_TIMESHEET),
      input,
      GET_MY_DETAIL_TIMESHEET,
      RequestType.POST,
    );
  }
  static getCompanyPeriod(input) {
    return apiCall(
      TimesheetApiList(GET_COMPANY_PERIOD),
      input,
      GET_COMPANY_PERIOD,
      RequestType.POST,
    );
  }
  static submitTimesheet(input) {
    return apiCall(
      TimesheetApiList(SUBMIT_TIMESHEET),
      input,
      SUBMIT_TIMESHEET,
      RequestType.POST,
    );
  }
  static getCheckins(input) {
    return apiCall(
      TimesheetApiList(GET_CHECKINS),
      input,
      GET_CHECKINS,
      RequestType.POST,
    );
  }
  static updateCheckout(input) {
    return apiCall(
      TimesheetApiList(UPDATE_CHECKOUT),
      input,
      UPDATE_CHECKOUT,
      RequestType.POST,
    );
  }
  static updateTask(input) {
    return apiCall(
      TimesheetApiList(UPDATE_TASK),
      input,
      UPDATE_TASK,
      RequestType.POST,
    );
  }
  static checkin(input) {
    return apiCall(TimesheetApiList(CHECKIN), input, CHECKIN, RequestType.POST);
  }
  static checkout(input) {
    return apiCall(
      TimesheetApiList(CHECKOUT),
      input,
      CHECKOUT,
      RequestType.POST,
    );
  }
  static submitReason(input) {
    return apiCall(
      TimesheetApiList(SUBMIT_REASON),
      input,
      SUBMIT_REASON,
      RequestType.POST,
    );
  }
  static getStaffTimesheets(input) {
    return apiCall(
      TimesheetApiList(GET_STAFF_TIMESHEETS),
      input,
      GET_STAFF_TIMESHEETS,
      RequestType.POST,
    );
  }
  static getCompanyEmployee(input) {
    return apiCall(
      TimesheetApiList(GET_COMPANY_EMPLOYEE),
      input,
      GET_COMPANY_EMPLOYEE,
      RequestType.POST,
    );
  }
  static getStaffDetailTimesheet(input) {
    return apiCall(
      TimesheetApiList(GET_STAFF_DETAIL_TIMESHEET),
      input,
      GET_STAFF_DETAIL_TIMESHEET,
      RequestType.POST,
    );
  }
  static approveTimesheet(input) {
    return apiCall(
      TimesheetApiList(APPROVE_TIMESHEET),
      input,
      APPROVE_TIMESHEET,
      RequestType.POST,
    );
  }

  static approveRejectDay(input) {
    return apiCall(
      TimesheetApiList(APPROVE_REJECT_DAY),
      input,
      APPROVE_REJECT_DAY,
      RequestType.POST,
    );
  }

  static getDailyDetails(input) {
    return apiCall(
      TimesheetApiList(GET_DAILY_DETAILS),
      input,
      GET_DAILY_DETAILS,
      RequestType.POST,
    );
  }

  static getTimesheetDetailFromNotification(input) {
    return apiCall(
      TimesheetApiList(GET_TIMESHEET_DETAIL_FROM_NOTIFICATION),
      input,
      GET_TIMESHEET_DETAIL_FROM_NOTIFICATION,
      RequestType.POST,
    );
  }
}

export default TimesheetAPI;
