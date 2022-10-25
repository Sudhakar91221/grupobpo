import {
  GET_MY_OCCURRENCES,
  OCCURRENCE_DETAIL,
  DELETE_OCCURRENCE,
  ADD_OCCURRENCE,
  GET_STAFF_OCCURRENCES,
  REJECT_OCCURRENCE,
  APPROVE_OCCURRENCE,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const OccuranceApiList = type => {
  switch (type) {
    case GET_MY_OCCURRENCES:
      return '/OccuranceReport/get';
    case OCCURRENCE_DETAIL:
      return '/OccuranceReport/get';
    case DELETE_OCCURRENCE:
      return '/OccuranceReport/delete';
    case ADD_OCCURRENCE:
      return '/OccuranceReport/add';
    case GET_STAFF_OCCURRENCES:
      return '/OccuranceReport/getStaffOccurance';
    case REJECT_OCCURRENCE:
      return '/OccuranceReport/reject';
    case APPROVE_OCCURRENCE:
      return '/OccuranceReport/approve';
  }
};

class OccuranceAPI {
  static getMyOccurrences(input) {
    return apiCall(
      OccuranceApiList(GET_MY_OCCURRENCES),
      input,
      GET_MY_OCCURRENCES,
      RequestType.POST,
    );
  }

  static occurrenceDetail(input) {
    return apiCall(
      OccuranceApiList(OCCURRENCE_DETAIL),
      input,
      OCCURRENCE_DETAIL,
      RequestType.POST,
    );
  }

  static deleteOccurrence(input) {
    return apiCall(
      OccuranceApiList(DELETE_OCCURRENCE),
      input,
      DELETE_OCCURRENCE,
      RequestType.POST,
    );
  }

  static addOccurrence(input) {
    return apiCall(
      OccuranceApiList(ADD_OCCURRENCE),
      input,
      ADD_OCCURRENCE,
      RequestType.POST,
    );
  }

  static getStaffOccurrences(input) {
    return apiCall(
      OccuranceApiList(GET_STAFF_OCCURRENCES),
      input,
      GET_STAFF_OCCURRENCES,
      RequestType.POST,
    );
  }

  static rejectOccurrence(input) {
    return apiCall(
      OccuranceApiList(REJECT_OCCURRENCE),
      input,
      REJECT_OCCURRENCE,
      RequestType.POST,
    );
  }

  static approveOccurrence(input) {
    return apiCall(
      OccuranceApiList(APPROVE_OCCURRENCE),
      input,
      APPROVE_OCCURRENCE,
      RequestType.POST,
    );
  }
}

export default OccuranceAPI;
