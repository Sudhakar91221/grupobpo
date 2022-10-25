import {GET_MY_PAYSLIPS, GET_SALARY_DETAIL, GET_STAFF_PAYSLIPS} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const PayslipAPIList = type => {
  switch (type) {
    case GET_MY_PAYSLIPS:
      return '/Salary/getMySalaries';
    case GET_SALARY_DETAIL:
      return '/Salary/print';
    case GET_STAFF_PAYSLIPS:
      return '/Salary/getStaffSalaries';
  }
};

class PayslipAPI {
  static getMyPayslips(input) {
    return apiCall(
      PayslipAPIList(GET_MY_PAYSLIPS),
      input,
      GET_MY_PAYSLIPS,
      RequestType.POST,
    );
  }
  static getSalaryDetail(input) {
    return apiCall(
      PayslipAPIList(GET_SALARY_DETAIL),
      input,
      GET_SALARY_DETAIL,
      RequestType.POST,
    );
  }
  static getStaffPayslips(input) {
    return apiCall(
      PayslipAPIList(GET_STAFF_PAYSLIPS),
      input,
      GET_STAFF_PAYSLIPS,
      RequestType.POST,
    );
  }
}

export default PayslipAPI;
