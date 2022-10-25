import {
  GET_TODAY_EVENT,
  EVENT_DETAIL,
  GET_EVENT_ATTENDEE,
  GIVE_EVENT_ATTENDANCE,
  DELETE_EVENT,
  GET_EVENTS,
  ADD_EVENT,
  UPDATE_EVENT,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const CalenderAPIList = type => {
  switch (type) {
    case GET_TODAY_EVENT:
      return '/Event/get';
    case EVENT_DETAIL:
      return '/Event/get';
    case GET_EVENT_ATTENDEE:
      return '/Event/getInvitedAttendees';
    case GIVE_EVENT_ATTENDANCE:
      return '/Event/giveEventResponce';
    case DELETE_EVENT:
      return '/Event/delete';
    case GET_EVENTS:
      return '/Event/get';
    case ADD_EVENT:
      return '/Event/add';
    case UPDATE_EVENT:
      return '/Event/update';
  }
};

class CalenderAPI {
  static getTodayEvent(input) {
    return apiCall(
      CalenderAPIList(GET_TODAY_EVENT),
      input,
      GET_TODAY_EVENT,
      RequestType.POST,
    );
  }

  static eventDetail(input) {
    return apiCall(
      CalenderAPIList(EVENT_DETAIL),
      input,
      EVENT_DETAIL,
      RequestType.POST,
    );
  }

  static getEventAttendee(input) {
    return apiCall(
      CalenderAPIList(GET_EVENT_ATTENDEE),
      input,
      GET_EVENT_ATTENDEE,
      RequestType.POST,
    );
  }

  static giveEventAttendance(input) {
    return apiCall(
      CalenderAPIList(GIVE_EVENT_ATTENDANCE),
      input,
      GIVE_EVENT_ATTENDANCE,
      RequestType.POST,
    );
  }

  static deleteEvent(input) {
    return apiCall(
      CalenderAPIList(DELETE_EVENT),
      input,
      DELETE_EVENT,
      RequestType.POST,
    );
  }

  static getEvents(input) {
    return apiCall(
      CalenderAPIList(GET_EVENTS),
      input,
      GET_EVENTS,
      RequestType.POST,
    );
  }

  static addEvent(input) {
    return apiCall(
      CalenderAPIList(ADD_EVENT),
      input,
      ADD_EVENT,
      RequestType.POST,
    );
  }

  static updateEvent(input) {
    return apiCall(
      CalenderAPIList(UPDATE_EVENT),
      input,
      UPDATE_EVENT,
      RequestType.POST,
    );
  }
}

export default CalenderAPI;
