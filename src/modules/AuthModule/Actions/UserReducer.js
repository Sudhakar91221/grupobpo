//import initialState from '../../../helpers/initialState';
import {
  API_FAILURE,
  API_START,
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
import configureStore from '../../../store/Store';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  //api: null,
};

const UserReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case USER_REGISTER:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: {
          ...action.payload.data,
          mobile: action.payload.input.mobile,
          country: action.payload.input.country,
        },
        api: USER_REGISTER,
      };

    case OTP_VERIFY:
      const user =
        action.payload.user !== undefined ? action.payload.user : state.user;
      return {
        ...state,
        isLoading: false,
        error: null,
        api: OTP_VERIFY,
        user: {
          ...user,
          status: action.payload.data.status,
        },
      };

    case OTP_RESEND:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: OTP_RESEND,
        user: {
          ...state.user,
          otp: action.payload.data.otp,
        },
      };

    case PASSWORD_SET:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: PASSWORD_SET,
        user: {
          ...state.user,
          status: action.payload.data.status,
          isFromForgot: false,
        },
      };

    case PASSWORD_FORGOT:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: PASSWORD_FORGOT,
        user: {
          ...action.payload.data,
          status: -1,
          mobile: action.payload.input.mobile,
          country: action.payload.input.country,
          email: action.payload.input.email,
          isFromForgot: true,
        },
      };

    case TAG_ADD:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: TAG_ADD,
        user: {
          ...state.user,
          status: action.payload.data.status,
        },
      };
    case PHOTO_UPLOAD:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: PHOTO_UPLOAD,
        user: {
          ...state.user,
          status: action.payload.data.status,
        },
      };
    case COMPANY_DOMAIN:
      return {
        ...state,
        isLoading: false,
        error: null,
        company: action.payload.data.data,
        api: COMPANY_DOMAIN,
      };

    case USER_LOGIN:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: {
          ...action.payload.data,
          mobile: action.payload.input.phone,
          country: action.payload.input.country,
        },
        api: USER_LOGIN,
      };
    case COUNTRY_GET:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: state.user,
        countryData: action.payload.data,
        api: COUNTRY_GET,
      };

    case USER_DELETE: {
      const indexOfExpenseToDelete = state.data.findIndex(occurModel => {
        return occurModel.occId == action.payload.data;
      });
      state.data.splice(indexOfExpenseToDelete, 1);

      return {
        ...state,
        userList: [...state.data],
        isLoading: false,
        error: false,
        api: USER_DELETE,
      };
    }

    case COMMON_FILE_UPLOAD:
      return {
        ...state,
        user: {
          ...state.user,
          photo: action.payload.data.photo,
        },
        isLoading: false,
        api: COMMON_FILE_UPLOAD,
      };

    case PASSWORD_CHANGE:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: PASSWORD_CHANGE,
        user: {
          ...state.user,
        },
      };

    case USER_LOGOUT:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: null,
        blocks: null,
        blockModel: null,
        api: USER_LOGOUT,
      };

    case API_FAILURE:
      console.log('on failure --------------', state);
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
        api: state.api,
      };

    case API_START:
      return {
        ...state,
        isLoading: true,
        api: state.api,
        user: state.user,
        error: null,
      };

    default:
      return {
        ...state,
        error: null,
        isLoading: false,
        api: null,
      };
  }
};

export default UserReducer;
