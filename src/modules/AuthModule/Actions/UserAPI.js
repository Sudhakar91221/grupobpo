import {
  USER_REGISTER,
  OTP_VERIFY,
  OTP_RESEND,
  MOBILE_UPDATE,
  PHOTO_UPLOAD,
  TAG_ADD,
  USER_LOGIN,
  USER_LOGOUT,
  USER_EDIT,
  USER_DELETE,
  USER_DETAIL,
  COMPANY_DOMAIN,
  COUNTRY_GET,
  COMMON_FILE_UPLOAD,
  PASSWORD_SET,
  PASSWORD_FORGOT,
  CATEGORY_GET,
  BLOCK_NUMBER,
  FLOOR_NUMBER,
  PASSWORD_CHANGE,
} from './type';

import {apiCall} from '../../../network/APICall';
var housecall = require('../../../network/queue.js');

const UserApiList = type => {
  switch (type) {
    case USER_REGISTER:
      return '/Register/step1';
    case OTP_VERIFY:
      return '/VerifyOtp';
    case OTP_RESEND:
      return '/ResendCode';
    case MOBILE_UPDATE:
      return '/Register/updateMobile';
    case TAG_ADD:
      return '/Tags/add';
    case PHOTO_UPLOAD:
      return '/Register/updateLogo';

    case USER_LOGIN:
      return '/Login';
    case USER_LOGOUT:
      return '/Logout';
    case USER_EDIT:
      return '/User/update';
    case USER_DELETE:
      return '/User/delete';
    case USER_DETAIL:
      return '/User/get';
    case COMPANY_DOMAIN:
      return '';
    case COUNTRY_GET:
      return '';
    case COMMON_FILE_UPLOAD:
      return '/User/userUpdate';
    case PASSWORD_SET:
      return '/SetPassword';
    case PASSWORD_FORGOT:
      return '/ForgotPassword';
    case CATEGORY_GET:
      return '/getCategory';
    case BLOCK_NUMBER:
      return '/Register/blockNumber';
    case FLOOR_NUMBER:
      return '/Register/floorNumber';

    case PASSWORD_CHANGE:
      return '/ChangePassword';
  }
};

class UserAPI {
  static registerUser(input) {
    return apiCall(UserApiList(USER_REGISTER), input, USER_REGISTER);
  }
  static verifyOtp(input) {
    return apiCall(UserApiList(OTP_VERIFY), input, OTP_VERIFY);
  }
  static resendOtp(input) {
    return apiCall(UserApiList(OTP_RESEND), input, OTP_RESEND);
  }
  static updateMobile(input) {
    return apiCall(UserApiList(MOBILE_UPDATE), input, MOBILE_UPDATE);
  }
  static uploadPhoto(input) {
    return apiCall(UserApiList(PHOTO_UPLOAD), input, PHOTO_UPLOAD);
  }
  static addTags(input) {
    return apiCall(UserApiList(TAG_ADD), input, TAG_ADD);
  }
  static loginUser(input) {
    return apiCall(UserApiList(USER_LOGIN), input, USER_LOGIN);
  }

  static logoutUser(input) {
    return apiCall(UserApiList(USER_LOGOUT), input, USER_LOGOUT);
  }

  static detailUser(input) {
    return apiCall(UserApiList(USER_DETAIL), input, USER_DETAIL);
  }
  static deleteUser(input) {
    return apiCall(UserApiList(USER_DELETE), input, USER_DELETE);
  }
  static getCompanyDomain(input) {
    return apiCall(UserApiList(COMPANY_DOMAIN), input, COMPANY_DOMAIN);
  }
  static getCountry(input) {
    return apiCall(UserApiList(COUNTRY_GET), input, COUNTRY_GET);
  }
  static commonUploadFile(input) {
    return apiCall(UserApiList(COMMON_FILE_UPLOAD), input, COMMON_FILE_UPLOAD);
  }

  static getCategory(input) {
    return apiCall(UserApiList(CATEGORY_GET), input, CATEGORY_GET);
  }
  static blockNumber(input) {
    return apiCall(UserApiList(BLOCK_NUMBER), input, BLOCK_NUMBER);
  }
  static floorNumber(input) {
    return apiCall(UserApiList(FLOOR_NUMBER), input, FLOOR_NUMBER);
  }
  static setPassword(input) {
    return apiCall(UserApiList(PASSWORD_SET), input, PASSWORD_SET);
  }
  static forgetPassword(input) {
    return apiCall(UserApiList(PASSWORD_FORGOT), input, PASSWORD_FORGOT);
  }

  static changePassword(input) {
    return apiCall(UserApiList(PASSWORD_CHANGE), input, PASSWORD_CHANGE);
  }
}

export default UserAPI;
