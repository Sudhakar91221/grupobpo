import {
  // JOBLIST_GET,
  HOME_GET,
  HOME_DETAIL,
  HOME_UPDATE,
  HOME_DELETE,
  HOME_ADD,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const HomeApiList = type => {
  switch (type) {
    // case JOBLIST_GET:
    //   return '/Jobs/get';
    case HOME_GET:
      return '/Home/get';
    case HOME_DETAIL:
      return '/Home/get';
    case HOME_UPDATE:
      return '/Home/update';
    case HOME_DELETE:
      return '/Home/delete';
    case HOME_ADD:
      return '/Home/add';
  }
};

class HomeAPI {
  static getHome(input) {
    return apiCall(
      HomeApiList(HOME_GET),
      input,
      HOME_GET,
      RequestType.POST,
    );
  }

  static detailHome(input) {
    return apiCall(
      HomeApiList(HOME_DETAIL),
      input,
      HOME_DETAIL,
      RequestType.POST,
    );
  }

  static updateHome(input) {
    return apiCall(
      HomeApiList(HOME_UPDATE),
      input,
      HOME_UPDATE,
      RequestType.POST,
    );
  }

  static deleteHome(input) {
    return apiCall(
      HomeApiList(HOME_DELETE),
      input,
      HOME_DELETE,
      RequestType.POST,
    );
  }

  static addHome(input) {
    return apiCall(
      HomeApiList(HOME_ADD),
      input,
      HOME_ADD,
      RequestType.POST,
    );
  }
}

export default HomeAPI;
