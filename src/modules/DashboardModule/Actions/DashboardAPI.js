import {
  GET_MY_DASHBOARD,
  EMERGENCY_CALL,
  GET_CONTENTS,
  UPDATE_PROFILE,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const DashboardApiList = type => {
  switch (type) {
    case GET_MY_DASHBOARD:
      return '/Dashboard/getmydashboard';
    case EMERGENCY_CALL:
      return '/Emergency/add';
    case GET_CONTENTS:
      return '/Page/getContents';
    case UPDATE_PROFILE:
      return '/User/userUpdate';
  }
};

class DashboardAPI {
  static getMyDashboard(input) {
    return apiCall(
      DashboardApiList(GET_MY_DASHBOARD),
      input,
      GET_MY_DASHBOARD,
      RequestType.POST,
    );
  }
  static emergencyCall(input) {
    return apiCall(
      DashboardApiList(EMERGENCY_CALL),
      input,
      EMERGENCY_CALL,
      RequestType.POST,
    );
  }
  static getTerms(input) {
    return apiCall(
      DashboardApiList(GET_CONTENTS),
      input,
      GET_CONTENTS,
      RequestType.GET,
    );
  }

  static updateProfile(input) {
    return apiCall(
      DashboardApiList(UPDATE_PROFILE),
      input,
      UPDATE_PROFILE,
      RequestType.POST,
    );
  }
}

export default DashboardAPI;
