import {
  GET_USERS,
  GET_USER_DROPDOWN,
  GET_PERSONAL_DROPDOWN,
  GET_SHIFT_DROPDOWN,
  ADD_MEMBER,
  EDIT_MEMBER,
  GET_ADDRESS,
  UPDATE_ADDRESS,
  GET_JOB,
  UPDATE_JOB,
  GET_DESIGNATION,
  GET_DEPARTMENT,
  GET_SALARY,
  UPDATE_SALARY,
  GET_BANK,
  UPDATE_BANK,
  GET_FAMILY,
  DELETE_FAMILY,
  ADD_FAMILY,
  UPDATE_FAMILY,
  GET_LEAVE_DROPDOWN,
  GET_LEAVE_INFO,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';
import {retry} from 'redux-saga/effects';

export const MemberAPIList = type => {
  switch (type) {
    case GET_USERS:
      return '/Employee/getUsers';
    case GET_USER_DROPDOWN:
      return '/Employee/getUserDropdown';
    case GET_PERSONAL_DROPDOWN:
      return '/Employee/getPersonalDropdown';
    case GET_SHIFT_DROPDOWN:
      return '/Employee/getShiftDropdown';
    case ADD_MEMBER:
      return '/Employee/add';
    case EDIT_MEMBER:
      return '/Employee/edit';
    case GET_ADDRESS:
      return '/EmpAddress/get';
    case UPDATE_ADDRESS:
      return '/EmpAddress/update';
    case GET_JOB:
      return '/EmpJob/get';
    case UPDATE_JOB:
      return '/EmpJob/update';
    case GET_DESIGNATION:
      return '/EmpJob/getDesignationDropdown';
    case GET_DEPARTMENT:
      return '/EmpJob/getDepartmentDropdown';
    case GET_SALARY:
      return '/EmpSalary/get';
    case UPDATE_SALARY:
      return '/EmpSalary/update';
    case GET_BANK:
      return '/EmpBank/get';
    case UPDATE_BANK:
      return '/EmpBank/update';
    case GET_FAMILY:
      return '/EmpFamily/get';
    case DELETE_FAMILY:
      return '/EmpFamily/removeFamilyMember';
    case ADD_FAMILY:
      return '/EmpFamily/update';
    case UPDATE_FAMILY:
      return '/EmpFamily/update';
    case GET_LEAVE_DROPDOWN:
      return '/Employee/leaveYearDropdown';
    case GET_LEAVE_INFO:
      return '/Employee/leaveDetail';
  }
};

class MemberAPI {
  static getUsers(input) {
    return apiCall(
      MemberAPIList(GET_USERS),
      input,
      GET_USERS,
      RequestType.POST,
    );
  }

  static getUserDropdown(input) {
    return apiCall(
      MemberAPIList(GET_USER_DROPDOWN),
      input,
      GET_USER_DROPDOWN,
      RequestType.POST,
    );
  }

  static getPersonalDropdown(input) {
    return apiCall(
      MemberAPIList(GET_PERSONAL_DROPDOWN),
      input,
      GET_PERSONAL_DROPDOWN,
      RequestType.POST,
    );
  }

  static getShiftDropdown(input) {
    return apiCall(
      MemberAPIList(GET_SHIFT_DROPDOWN),
      input,
      GET_SHIFT_DROPDOWN,
      RequestType.POST,
    );
  }

  static addMember(input) {
    return apiCall(
      MemberAPIList(ADD_MEMBER),
      input,
      ADD_MEMBER,
      RequestType.POST,
    );
  }

  static editMember(input) {
    return apiCall(
      MemberAPIList(EDIT_MEMBER),
      input,
      EDIT_MEMBER,
      RequestType.POST,
    );
  }

  static getAddress(input) {
    return apiCall(
      MemberAPIList(GET_ADDRESS),
      input,
      GET_ADDRESS,
      RequestType.POST,
    );
  }

  static updateAddress(input) {
    return apiCall(
      MemberAPIList(UPDATE_ADDRESS),
      input,
      UPDATE_ADDRESS,
      RequestType.POST,
    );
  }

  static getJob(input) {
    return apiCall(MemberAPIList(GET_JOB), input, GET_JOB, RequestType.POST);
  }

  static updateJob(input) {
    return apiCall(
      MemberAPIList(UPDATE_JOB),
      input,
      UPDATE_JOB,
      RequestType.POST,
    );
  }

  static getDesignationList(input) {
    return apiCall(
      MemberAPIList(GET_DESIGNATION),
      input,
      GET_DESIGNATION,
      RequestType.POST,
    );
  }

  static getDepartmentList(input) {
    return apiCall(
      MemberAPIList(GET_DEPARTMENT),
      input,
      GET_DEPARTMENT,
      RequestType.POST,
    );
  }

  static getSalary(input) {
    return apiCall(
      MemberAPIList(GET_SALARY),
      input,
      GET_SALARY,
      RequestType.POST,
    );
  }

  static updateSalary(input) {
    return apiCall(
      MemberAPIList(UPDATE_SALARY),
      input,
      UPDATE_SALARY,
      RequestType.POST,
    );
  }

  static getBank(input) {
    return apiCall(MemberAPIList(GET_BANK), input, GET_BANK, RequestType.POST);
  }

  static updateBAnk(input) {
    return apiCall(
      MemberAPIList(UPDATE_BANK),
      input,
      UPDATE_BANK,
      RequestType.POST,
    );
  }

  static getFamily(input) {
    return apiCall(
      MemberAPIList(GET_FAMILY),
      input,
      GET_FAMILY,
      RequestType.POST,
    );
  }

  static deleteFamily(input) {
    return apiCall(
      MemberAPIList(DELETE_FAMILY),
      input,
      DELETE_FAMILY,
      RequestType.POST,
    );
  }

  static addFamily(input) {
    return apiCall(
      MemberAPIList(ADD_FAMILY),
      input,
      ADD_FAMILY,
      RequestType.POST,
    );
  }

  static updateFamily(input) {
    return apiCall(
      MemberAPIList(UPDATE_FAMILY),
      input,
      UPDATE_FAMILY,
      RequestType.POST,
    );
  }

  static getLeaveDropdown(input) {
    return apiCall(
      MemberAPIList(GET_LEAVE_DROPDOWN),
      input,
      GET_LEAVE_DROPDOWN,
      RequestType.POST,
    );
  }

  static getLeaveInfo(input) {
    return apiCall(
      MemberAPIList(GET_LEAVE_INFO),
      input,
      GET_LEAVE_INFO,
      RequestType.POST,
    );
  }
}

export default MemberAPI;
