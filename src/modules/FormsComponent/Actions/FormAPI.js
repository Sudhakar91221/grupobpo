import {
  FORMS_GET,
  BLOCKS_GET,
  FIELDS_GET,
  APPLICATION_GET,
  APPLICATION_SUBMIT,
  APPLICATION_DRAFT,
  APPLICATION_DETAIL,
  USER_LOGIN,
  USER_LOGOUT,
  OTP_VERIFY,
  OTP_RESEND,
  MOBILE_UPDATE,
  PASSWORD_SET,
  PASSWORD_FORGOT,
  PASSWORD_CHANGE,
  EMPTY_APPLICATION,
  APPLICATION_COMMENT_ADD,
  REMOVE_PHOTO,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const FormsApiList = (type, customUrl) => {
  switch (type) {
    case FORMS_GET:
      return '/GetFormBlocks';
    case BLOCKS_GET:
      return '/GetFormBlocks';
    case FIELDS_GET:
      return '/GetBlocksFields';
    case APPLICATION_GET:
      return '/ApplicationList';
    case APPLICATION_SUBMIT:
      return '/' + customUrl;
    case APPLICATION_DRAFT:
      return '';
    case APPLICATION_DETAIL:
      return '/ApplicationDetails';
    case USER_LOGIN:
      return '/User/login';
    case USER_LOGOUT:
      return '/User/logout';
    case OTP_VERIFY:
      return '/VerifyOtp';
    case OTP_RESEND:
      return '/ResendCode';
    case MOBILE_UPDATE:
      return '/Register/updateMobile';
    case PASSWORD_SET:
      return '/SetPassword';
    case PASSWORD_FORGOT:
      return '/User/forgotPassword';
    case PASSWORD_CHANGE:
      return '/User/changePassword';
    case EMPTY_APPLICATION:
      return '';
    case APPLICATION_COMMENT_ADD:
      return '/AddEApplicationComment';
    case REMOVE_PHOTO:
      return '/User/removePhoto';
  }
};

class FormAPI {
  static loginUser(input) {
    return apiCall(FormsApiList(USER_LOGIN), input, USER_LOGIN);
  }

  static getForms(input) {
    return apiCall(FormsApiList(FORMS_GET), input, FORMS_GET, RequestType.POST);
  }

  static getBlocks(input) {
    return apiCall(
      FormsApiList(BLOCKS_GET),
      input,
      BLOCKS_GET,
      RequestType.POST,
    );
  }

  static getFields(input) {
    return apiCall(
      FormsApiList(FIELDS_GET),
      input,
      FIELDS_GET,
      RequestType.POST,
    );
  }

  static getApplications(input) {
    return apiCall(
      FormsApiList(APPLICATION_GET),
      input,
      APPLICATION_GET,
      RequestType.POST,
    );
  }

  static submitApplication(input, customUrl) {
    return apiCall(
      FormsApiList(APPLICATION_SUBMIT, customUrl),
      input,
      APPLICATION_SUBMIT,
      RequestType.POST,
      customUrl,
    );
  }

  static draftApplication(input, customUrl) {
    return apiCall(
      FormsApiList(APPLICATION_DRAFT, customUrl),
      input,
      APPLICATION_DRAFT,
      RequestType.POST,
      customUrl,
    );
  }

  static getApplicationDetails(input) {
    return apiCall(
      FormsApiList(APPLICATION_DETAIL),
      input,
      APPLICATION_DETAIL,
      RequestType.POST,
    );
  }

  static logoutUser(input) {
    return apiCall(
      FormsApiList(USER_LOGOUT),
      input,
      USER_LOGOUT,
      RequestType.GET,
    );
  }

  static verifyOtp(input) {
    return apiCall(FormsApiList(OTP_VERIFY), input, OTP_VERIFY);
  }
  static resendOtp(input) {
    return apiCall(FormsApiList(OTP_RESEND), input, OTP_RESEND);
  }
  static updateMobile(input) {
    return apiCall(FormsApiList(MOBILE_UPDATE), input, MOBILE_UPDATE);
  }
  static setPassword(input) {
    return apiCall(FormsApiList(PASSWORD_SET), input, PASSWORD_SET);
  }
  static forgetPassword(input) {
    return apiCall(FormsApiList(PASSWORD_FORGOT), input, PASSWORD_FORGOT);
  }

  static changePassword(input) {
    return apiCall(FormsApiList(PASSWORD_CHANGE), input, PASSWORD_CHANGE);
  }

  static emptyApplication(input, customUrl) {
    return apiCall(
      FormsApiList(EMPTY_APPLICATION, customUrl),
      input,
      EMPTY_APPLICATION,
      RequestType.POST,
      customUrl,
    );
  }

  static applicationAddComment(input) {
    return apiCall(
      FormsApiList(APPLICATION_COMMENT_ADD),
      input,
      APPLICATION_COMMENT_ADD,
      RequestType.POST,
    );
  }

  static removePhoto(input) {
    return apiCall(
      FormsApiList(REMOVE_PHOTO),
      input,
      REMOVE_PHOTO,
      RequestType.GET,
    );
  }
}

export default FormAPI;
