import {
  SUPPORT_GET,
  SUPPORT_DETAIL,
  SUPPORT_COMMENT_GET,
  SUPPORT_REPLY,
  SUPPORT_DELETE,
  SUPPORT_ADD,
  SUPPORT_UPLOAD,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const SupportApiList = type => {
  switch (type) {
    case SUPPORT_GET:
      return '/Ticket/getTicket';
    case SUPPORT_DETAIL:
      return '/Ticket/ticketDetails';
    case SUPPORT_COMMENT_GET:
      return '/Ticket/getComments';
    case SUPPORT_REPLY:
      return '/Ticket/ticketReplies';
    case SUPPORT_DELETE:
      return '/Ticket/submit';
    case SUPPORT_ADD:
      return '/Ticket/submit';
    case SUPPORT_UPLOAD:
      return '/Uploadfile/uploadTicketFile';
  }
};

class SupportAPI {
  static getSupports(input) {
    return apiCall(
      SupportApiList(SUPPORT_GET),
      input,
      SUPPORT_GET,
      RequestType.POST,
      true,
    );
  }

  static detailSupport(input) {
    return apiCall(
      SupportApiList(SUPPORT_DETAIL),
      input,
      SUPPORT_DETAIL,
      RequestType.POST,
      true,
    );
  }

  static getSupportComment(input) {
    return apiCall(
      SupportApiList(SUPPORT_COMMENT_GET),
      input,
      SUPPORT_COMMENT_GET,
      RequestType.POST,
      true,
    );
  }

  static replySupport(input) {
    return apiCall(
      SupportApiList(SUPPORT_REPLY),
      input,
      SUPPORT_REPLY,
      RequestType.POST,
      true,
    );
  }

  static deleteSupport(input) {
    return apiCall(
      SupportApiList(SUPPORT_DELETE),
      input,
      SUPPORT_DELETE,
      RequestType.POST,
      true,
    );
  }

  static addSupport(input) {
    return apiCall(
      SupportApiList(SUPPORT_ADD),
      input,
      SUPPORT_ADD,
      RequestType.POST,
      true,
    );
  }

  static uploadSupportFile(input, cancelToken) {
    return apiCall(
      SupportApiList(SUPPORT_UPLOAD),
      input,
      SUPPORT_UPLOAD,
      RequestType.POST,
      true,
      cancelToken,
    );
  }
}

export default SupportAPI;
