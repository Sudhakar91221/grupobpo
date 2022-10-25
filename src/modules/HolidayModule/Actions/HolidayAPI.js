import {
  GET_HOLIDAYS,
  ADD_HOLIDAY,
  DELETE_HOLIDAY,
  UPDATE_HOLIDAY,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const HolidayApiList = type => {
  switch (type) {
    case GET_HOLIDAYS:
      return '/Holiday/get';
    case ADD_HOLIDAY:
      return '/Holiday/add';
    case DELETE_HOLIDAY:
      return '/Holiday/delete';
    case UPDATE_HOLIDAY:
      return '/Holiday/update';
  }
};

class HolidayAPI {
  static getHolidays(input) {
    return apiCall(
      HolidayApiList(GET_HOLIDAYS),
      input,
      GET_HOLIDAYS,
      RequestType.POST,
    );
  }
  static addHoliday(input) {
    return apiCall(
      HolidayApiList(ADD_HOLIDAY),
      input,
      ADD_HOLIDAY,
      RequestType.POST,
    );
  }
  static deleteHoliday(input) {
    return apiCall(
      HolidayApiList(DELETE_HOLIDAY),
      input,
      DELETE_HOLIDAY,
      RequestType.POST,
    );
  }
  static updateHoliday(input) {
    return apiCall(
      HolidayApiList(UPDATE_HOLIDAY),
      input,
      UPDATE_HOLIDAY,
      RequestType.POST,
    );
  }
}

export default HolidayAPI;
