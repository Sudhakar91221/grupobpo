import {
  GET_MY_LEAVES,
  GET_MY_BALANCE,
  APPLY_LEAVE,
  LEAVE_DETAIL,
  CANCEL_LEAVE,
  UPDATE_LEAVE,
  GET_STAFF_LEAVES,
  STAFF_LEAVE_DETAIL,
  APPROVE_LEAVE,
  REJECT_LEAVE,
  APPLY_STAFF_LEAVE,
  COMPUTE_TOTAL_DAYS,
  UPDATE_STAFF_LEAVE,
  GET_DASHBOARD_LEAVES,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const LeaveApiList = type => {
  switch (type) {
    case GET_MY_LEAVES:
      return '/Leave/getMyLeaves';
    case GET_DASHBOARD_LEAVES:
      return '/Leave/getMyLeaves';
    case GET_MY_BALANCE:
      return '/Leave/getMyBalance';
    case APPLY_LEAVE:
      return '/Leave/apply';
    case LEAVE_DETAIL:
      return '/Leave/getDetail';
    case CANCEL_LEAVE:
      return '/Leave/cancel';
    case UPDATE_LEAVE:
      return '/Leave/update';
    case GET_STAFF_LEAVES:
      return '/Leave/getStaffLeaves';
    case STAFF_LEAVE_DETAIL:
      return '/Leave/getStaffLeaves';
    case APPROVE_LEAVE:
      return '/Leave/approve';
    case REJECT_LEAVE:
      return '/Leave/reject';
    case APPLY_STAFF_LEAVE:
      return '/Leave/applyStaffLeave';
    case COMPUTE_TOTAL_DAYS:
      return '/Leave/computeTotalDays';
    case UPDATE_STAFF_LEAVE:
      return '/Leave/updateStaffLeave';
  }
};

class LeaveAPI {
  static getMyLeaves(input) {
    return apiCall(
      LeaveApiList(GET_MY_LEAVES),
      input,
      GET_MY_LEAVES,
      RequestType.POST,
    );
  }
  static getDashboardLeaves(input) {
    return apiCall(
      LeaveApiList(GET_MY_LEAVES),
      input,
      GET_DASHBOARD_LEAVES,
      RequestType.POST,
    );
  }
  static getMyBalance(input) {
    return apiCall(
      LeaveApiList(GET_MY_BALANCE),
      input,
      GET_MY_BALANCE,
      RequestType.GET,
    );
  }
  static applyLeave(input) {
    return apiCall(
      LeaveApiList(APPLY_LEAVE),
      input,
      APPLY_LEAVE,
      RequestType.POST,
    );
  }
  static getLeaveDetail(input) {
    return apiCall(
      LeaveApiList(LEAVE_DETAIL),
      input,
      LEAVE_DETAIL,
      RequestType.GET,
    );
  }
  static cancelLeave(input) {
    return apiCall(
      LeaveApiList(CANCEL_LEAVE),
      input,
      CANCEL_LEAVE,
      RequestType.POST,
    );
  }
  static updateLeave(input) {
    return apiCall(
      LeaveApiList(UPDATE_LEAVE),
      input,
      UPDATE_LEAVE,
      RequestType.POST,
    );
  }
  static getStaffLeaves(input) {
    return apiCall(
      LeaveApiList(GET_STAFF_LEAVES),
      input,
      GET_STAFF_LEAVES,
      RequestType.POST,
    );
  }
  static staffLeaveDetail(input) {
    return apiCall(
      LeaveApiList(STAFF_LEAVE_DETAIL),
      input,
      STAFF_LEAVE_DETAIL,
      RequestType.POST,
    );
  }
  static approveLeave(input) {
    return apiCall(
      LeaveApiList(APPROVE_LEAVE),
      input,
      APPROVE_LEAVE,
      RequestType.POST,
    );
  }
  static rejectLeave(input) {
    return apiCall(
      LeaveApiList(REJECT_LEAVE),
      input,
      REJECT_LEAVE,
      RequestType.POST,
    );
  }
  static applyStaffLeave(input) {
    return apiCall(
      LeaveApiList(APPLY_STAFF_LEAVE),
      input,
      APPLY_STAFF_LEAVE,
      RequestType.POST,
    );
  }
  static computeTotalDays(input) {
    return apiCall(
      LeaveApiList(COMPUTE_TOTAL_DAYS),
      input,
      COMPUTE_TOTAL_DAYS,
      RequestType.POST,
    );
  }
  static updateStaffLeave(input) {
    return apiCall(
      LeaveApiList(UPDATE_LEAVE),
      input,
      UPDATE_LEAVE,
      RequestType.POST,
    );
  }
}

export default LeaveAPI;
