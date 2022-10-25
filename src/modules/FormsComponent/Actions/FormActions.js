import FormAPI from './FormAPI';
import {
  API_START,
  API_FAILURE,
  FORMS_GET,
  BLOCKS_GET,
  FIELDS_GET,
  APPLICATION_GET,
  APPLICATION_SUBMIT,
  APPLICATION_DETAIL,
  USER_LOGIN,
  USER_LOGOUT,
  OTP_RESEND,
  PASSWORD_CHANGE,
  PASSWORD_SET,
  PASSWORD_FORGOT,
  OTP_VERIFY,
  MOBILE_UPDATE,
  APPLICATION_DRAFT,
  EMPTY_APPLICATION,
  APPLICATION_COMMENT_ADD,
  REMOVE_PHOTO,
} from './type';

//MARK: - Action Methods call from js files

export const getForms = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FormAPI.getForms(input)
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
          dispatch(formListSuccess(data.data, input.page, data.reportCount));
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
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(formListSuccess(data.data, input.page, data.reportCount));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getBlocks = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FormAPI.getBlocks(input)
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
          dispatch(blockListSuccess(data.data, input, data.reportCount));
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
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(blockListSuccess(data.data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getFields = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FormAPI.getFields(input)
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
          dispatch(fieldsListSuccess(data.data, input, data.reportCount));
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
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(fieldsListSuccess(data.data, input, data.reportCount));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getApplications = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FormAPI.getApplications(input)
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
          dispatch(
            applicaitonsListSuccess(data.data, input.page, data.reportCount),
          );
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
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(applicaitonsListSuccess(data.data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const draftApplication = (input, customUrl) => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input !== undefined ? input.request : APPLICATION_DRAFT,
  };
  dispatch(apiBegins());

  return FormAPI.draftApplication(input, customUrl)
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
          dispatch(applicationDraftSuccess(input));
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
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(applicationDraftSuccess(input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const submitApplication = (input, customUrl) => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());

  return FormAPI.submitApplication(input, customUrl)
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
          dispatch(applicaitonSubmitSuccess(data, input));
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
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(applicaitonSubmitSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getApplicationDetails = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FormAPI.getApplicationDetails(input)
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
          dispatch(applicationDetailSuccess(data.data));
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
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(applicationDetailSuccess(data.data));
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
  return FormAPI.loginUser(input)
    .then(data => {
      console.log(data);
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }
      if (data.code == -1) {
        //-1 for network error
        errorObject.code = -1;
        errorObject.message = 'Network error';
        dispatch(apiFailure(errorObject));
        return;
      }
      if (data.ErrorMessage) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          errorObject.message = 'Network error';
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(userLoginSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject));
          return;
        }
        // errorObject.code = data.code;
        // switch (data.code) {
        //   case 1:
        //     errorObject.message = 'All fields are mandatory';
        //     break;
        //   case 2:
        //     errorObject.message = 'Invalid Token';
        //     break;
        //   case 3:
        //     errorObject.message = 'Invalid OTP';
        //     break;
        //   case 4:
        //     errorObject.message = 'OTP expired';
        //     break;
        //   case 5:
        //     errorObject.message = 'OTP already verified';
        //     break;
        //   case 6:
        //     errorObject.message = 'Something wrong';
        //     break;
        // }

        // dispatch(apiFailure(errorObject));
      } else {
        dispatch(userLoginSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const logoutUser = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());

  return FormAPI.logoutUser(input)
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

export const changePassword = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FormAPI.changePassword(input)
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

export const setPassword = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FormAPI.setPassword(input)
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

export const forgetPassword = (input, requestType) => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };

  dispatch(apiBegins());
  return FormAPI.forgetPassword(input)
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
        dispatch(forgetPasswordSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const verifyOtp = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());

  return FormAPI.verifyOtp(input)
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
          dispatch(verifyOtpSuccess(data));
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
        dispatch(verifyOtpSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const resendOtp = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());

  return FormAPI.resendOtp(input)
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
          dispatch(resendOtpSuccess(data));
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
        dispatch(resendOtpSuccess(data));
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
  return FormAPI.updateMobile(input)
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

export const emptyApplication = (input, customUrl) => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());

  return FormAPI.emptyApplication(input, customUrl)
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
          dispatch(emptyApplicationSuccess(input));
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
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(emptyApplicationSuccess(input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const applicationAddComment = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());

  return FormAPI.applicationAddComment(input)
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
          dispatch(addCommentSuccess(data, input));
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
            errorObject.message = 'Something wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(addCommentSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const removePhoto = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FormAPI.removePhoto(input)
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
          dispatch(removePhotoSuccess(data));
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
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(removePhotoSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods
export const userLoginSuccess = (data, input) => ({
  type: USER_LOGIN,
  payload: {data, input},
});

export const logoutSuccess = (data, input) => ({
  type: USER_LOGOUT,
  payload: {data, input},
});

export const formListSuccess = (data, page, count) => ({
  type: FORMS_GET,
  payload: {data, page, count},
});

export const blockListSuccess = (data, input, count) => ({
  type: BLOCKS_GET,
  payload: {data, input, count},
});

export const fieldsListSuccess = (data, input, count) => ({
  type: FIELDS_GET,
  payload: {data, input},
});

export const applicaitonsListSuccess = (data, input, count) => ({
  type: APPLICATION_GET,
  payload: {data, input, count},
});

export const applicaitonSubmitSuccess = (data, input) => ({
  type: APPLICATION_SUBMIT,
  payload: {data, input},
});
export const applicationDraftSuccess = input => ({
  type: APPLICATION_DRAFT,
  payload: {input},
});

export const applicationDetailSuccess = data => ({
  type: APPLICATION_DETAIL,
  payload: {data},
});

export const changePasswordSuccess = (data, input) => ({
  type: PASSWORD_CHANGE,
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

export const verifyOtpSuccess = data => ({
  type: OTP_VERIFY,
  payload: {data},
});

export const resendOtpSuccess = data => ({
  type: OTP_RESEND,
  payload: {data},
});

export const updateMobileSuccess = data => ({
  type: MOBILE_UPDATE,
  payload: {data},
});

export const emptyApplicationSuccess = input => ({
  type: EMPTY_APPLICATION,
  payload: {input},
});

export const addCommentSuccess = (data, input) => ({
  type: APPLICATION_COMMENT_ADD,
  payload: {data, input},
});

export const removePhotoSuccess = data => ({
  type: REMOVE_PHOTO,
  payload: {data},
});

export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
