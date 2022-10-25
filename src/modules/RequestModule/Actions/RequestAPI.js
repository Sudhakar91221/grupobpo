import {
  GET_MY_REQUESTS,
  DELETE_REQUEST,
  ADD_REQUEST,
  UPDATE_REQUEST,
  INCOMING_REQUESTS,
  OUTGOING_REQUESTS,
  ACCEPT_REQUEST,
  DECLINE_REQUEST,
  REPLY_REQUEST,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const RequestAPIList = type => {
  switch (type) {
    case GET_MY_REQUESTS:
      return '/Requests/getEmployeeReq';
    case DELETE_REQUEST:
      return '/Requests/delete';
    case ADD_REQUEST:
      return '/Requests/add';
    case UPDATE_REQUEST:
      return '/Requests/update';
    case INCOMING_REQUESTS:
      return '/Requests/getHRReq';
    case OUTGOING_REQUESTS:
      return '/Requests/getHRReq';
    case ACCEPT_REQUEST:
      return '/Requests/acceptDeclineRequest';
    case DECLINE_REQUEST:
      return '/Requests/acceptDeclineRequest';
    case REPLY_REQUEST:
      return '/Requests/reply';
  }
};

class RequestAPI {
  static getMyRequests(input) {
    return apiCall(
      RequestAPIList(GET_MY_REQUESTS),
      input,
      GET_MY_REQUESTS,
      RequestType.POST,
    );
  }

  static deleteRequest(input) {
    return apiCall(
      RequestAPIList(DELETE_REQUEST),
      input,
      DELETE_REQUEST,
      RequestType.POST,
    );
  }

  static addRequest(input) {
    return apiCall(
      RequestAPIList(ADD_REQUEST),
      input,
      ADD_REQUEST,
      RequestType.POST,
    );
  }

  static updateRequest(input) {
    return apiCall(
      RequestAPIList(UPDATE_REQUEST),
      input,
      UPDATE_REQUEST,
      RequestType.POST,
    );
  }

  static getIncomingRequests(input) {
    return apiCall(
      RequestAPIList(INCOMING_REQUESTS),
      input,
      INCOMING_REQUESTS,
      RequestType.POST,
    );
  }

  static getOutgoingRequests(input) {
    return apiCall(
      RequestAPIList(OUTGOING_REQUESTS),
      input,
      OUTGOING_REQUESTS,
      RequestType.POST,
    );
  }

  static acceptRequest(input) {
    return apiCall(
      RequestAPIList(ACCEPT_REQUEST),
      input,
      ACCEPT_REQUEST,
      RequestType.POST,
    );
  }

  static declineRequest(input) {
    return apiCall(
      RequestAPIList(DECLINE_REQUEST),
      input,
      DECLINE_REQUEST,
      RequestType.POST,
    );
  }

  static replyRequest(input) {
    return apiCall(
      RequestAPIList(REPLY_REQUEST),
      input,
      REPLY_REQUEST,
      RequestType.POST,
    );
  }
}

export default RequestAPI;
