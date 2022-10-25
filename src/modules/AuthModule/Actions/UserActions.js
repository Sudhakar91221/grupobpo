import UserAPI from './UserAPI';
import {
  USER_REGISTER,
  OTP_VERIFY,
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
  API_START,
  API_FAILURE,
  COMMON_FILE_UPLOAD,
  PASSWORD_SET,
  PASSWORD_FORGOT,
  CATEGORY_GET,
  BLOCK_NUMBER,
  FLOOR_NUMBER,
  OTP_RESEND,
  PASSWORD_CHANGE,
} from './type';

export const registerUser = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.registerUser(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(userRegisterSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(userRegisterSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const verifyOtp = input => (dispatch, getState) => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());

  const user = getState().FormReducer.user;

  return UserAPI.verifyOtp(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(verifyOtpSuccess(data, user));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(verifyOtpSuccess(data, user));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const resendOtp = input => (dispatch, getState) => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  const user = getState().FormReducer.user;

  return UserAPI.resendOtp(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(resendOtpSuccess(data,user));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(resendOtpSuccess(data,user));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateMobile = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.updateMobile(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(updateMobileSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(updateMobileSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const uploadPhoto = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.uploadPhoto(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(uploadPhotoSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Mobile not verified';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(uploadPhotoSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const addTags = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.addTags(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(addTagsSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(addTagsSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Action Methods call from js files
export const getCountry = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.getCountry(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }
        if (data.code == 0) {
          dispatch(getCountrySuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getCountrySuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};
export const getCompanyDomain = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.getCompanyDomain(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getCompanyDomainSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }

        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getCompanyDomainSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const loginUser = (input, requestType) => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.loginUser(input)
    .then(data => {
      console.log(data);
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }
      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(userLoginSuccess(data.data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(userLoginSuccess(data.data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const setPassword = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.setPassword(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(setPasswordSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Record not found';
            break;
          case 4:
            errorObject.message = 'Mobile not verified';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(setPasswordSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const forgetPassword = (input, requestType) => (dispatch, getState) => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  const obj = getState();

  dispatch(apiBegins());
  return UserAPI.forgetPassword(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(forgetPasswordSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Record not exist';
            break;
          case 3:
            errorObject.message = 'Record not found';
            break;
          case 4:
            errorObject.message = 'Mobile not verified';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(forgetPasswordSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getCategory = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.getCategory(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getCategorySuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getCategorySuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const floorNumber = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.floorNumber(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(floorNumberSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(floorNumberSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const blockNumber = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.blockNumber(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(blockNumberSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(blockNumberSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const commonUploadFile = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.commonUploadFile(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }
        if (data.code == 0) {
          dispatch(commonUploadFileSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(commonUploadFileSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const changePassword = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return UserAPI.changePassword(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(changePasswordSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Record not found';
            break;
          case 4:
            errorObject.message = 'Mobile not verified';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(changePasswordSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const logoutUser = input => (dispatch, getState) => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());

  const user = getState().FormReducer.user;

  return UserAPI.logoutUser(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(logoutSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Invalid OTP';
            break;
          case 4:
            errorObject.message = 'OTP expired';
            break;
          case 5:
            errorObject.message = 'OTP already verified';
            break;
          case 6:
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(logoutSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods
export const userRegisterSuccess = (data, input) => ({
  type: USER_REGISTER,
  payload: {data, input},
});

export const verifyOtpSuccess = (data, user) => ({
  type: OTP_VERIFY,
  payload: {data, user},
});

export const resendOtpSuccess = (data, user) => ({
  type: OTP_RESEND,
  payload: {data, user},
});

export const updateMobileSuccess = data => ({
  type: MOBILE_UPDATE,
  payload: {data},
});

export const uploadPhotoSuccess = data => ({
  type: PHOTO_UPLOAD,
  payload: {data},
});

export const addTagsSuccess = data => ({
  type: TAG_ADD,
  payload: {data},
});

export const getCountrySuccess = data => ({
  type: COUNTRY_GET,
  payload: {data},
});

export const getCompanyDomainSuccess = data => ({
  type: COMPANY_DOMAIN,
  payload: {data},
});

export const userLoginSuccess = (data, input) => ({
  type: USER_LOGIN,
  payload: {data, input},
});

export const setPasswordSuccess = data => ({
  type: PASSWORD_SET,
  payload: {data},
});

export const forgetPasswordSuccess = (data, input) => ({
  type: PASSWORD_FORGOT,
  payload: {data, input},
});

export const getCategorySuccess = data => ({
  type: CATEGORY_GET,
  payload: {data},
});

export const floorNumberSuccess = data => ({
  type: FLOOR_NUMBER,
  payload: {data},
});

export const blockNumberSuccess = data => ({
  type: BLOCK_NUMBER,
  payload: {data},
});

export const commonUploadFileSuccess = data => ({
  type: COMMON_FILE_UPLOAD,
  payload: {data},
});

export const changePasswordSuccess = (data, input) => ({
  type: PASSWORD_CHANGE,
  payload: {data, input},
});

export const logoutSuccess = (data, input) => ({
  type: USER_LOGOUT,
  payload: {data, input},
});

export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
