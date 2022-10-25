import {GET_DIRECTORY} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const DashboardApiList = type => {
  switch (type) {
    case GET_DIRECTORY:
      return '/Employee/get';
  }
};

class DirectoryAPI {
  static getDirectory(input) {
    return apiCall(
      DashboardApiList(GET_DIRECTORY),
      input,
      GET_DIRECTORY,
      RequestType.POST,
    );
  }
}

export default DirectoryAPI;
