import TimesheetAPI from './TimesheetAPI';
import {
  GET_MY_TIMESHEETS,
  GET_MY_DETAIL_TIMESHEET,
  API_START,
  API_FAILURE,
  GET_COMPANY_PERIOD,
  SUBMIT_TIMESHEET,
  GET_CHECKINS,
  UPDATE_CHECKOUT,
  UPDATE_TASK,
  CHECKIN,
  CHECKOUT,
  SUBMIT_REASON,
  GET_STAFF_TIMESHEETS,
  GET_COMPANY_EMPLOYEE,
  GET_STAFF_DETAIL_TIMESHEET,
  APPROVE_TIMESHEET,
  APPROVE_REJECT_DAY,
  GET_DAILY_DETAILS,
  GET_TIMESHEET_DETAIL_FROM_NOTIFICATION,
} from './type';

//MARK: - Action Methods call from js files

export const getMyTimesheets = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.getMyTimesheets(input)
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
          dispatch(getMyTimesheetsSuccess(data.data,
            input.page,
            data.pageCount));
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
        dispatch(getMyTimesheetsSuccess(data.data,
          input.page,
          data.pageCount));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getMyDetailTimesheet = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.getMyDetailTimesheet(input)
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
          dispatch(getMyDetailTimesheetSuccess(data));
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
        dispatch(getMyDetailTimesheetSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getCompanyPeriod = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.getCompanyPeriod(input)
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
          dispatch(companyPeriodSuccess(data));
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
        dispatch(companyPeriodSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const submitTimesheet = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.submitTimesheet(input)
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
          dispatch(submitTimesheetSuccess(data));
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
        dispatch(submitTimesheetSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getCheckins = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.getCheckins(input)
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
          dispatch(getCheckinsSuccess(data));
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
        dispatch(getCheckinsSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateCheckout = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.updateCheckout(input)
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
          dispatch(updateCheckoutSuccess(data));
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
        dispatch(updateCheckoutSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateTask = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.updateTask(input)
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
          dispatch(updateTaskSuccess(data));
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
        dispatch(updateTaskSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const checkin = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.checkin(input)
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
          dispatch(checkinSuccess(data));
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
        dispatch(checkinSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const checkout = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.checkout(input)
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
          dispatch(checkoutSuccess(data));
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
        dispatch(checkoutSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const submitReason = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.submitReason(input)
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
          dispatch(submitReasonSuccess(data));
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
        dispatch(submitReasonSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getStaffTimesheets = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.getStaffTimesheets(input)
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
          dispatch(getStaffTimesheetsSuccess(data.data,
            input.page,
            data.pageCount));
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
        dispatch(getStaffTimesheetsSuccess(data.data,
          input.page,
          data.pageCount));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getCompanyEmployee = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.getCompanyEmployee(input)
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
          dispatch(companyEmployeeSuccess(data));
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
        dispatch(companyEmployeeSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getStaffDetailTimesheet = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.getStaffDetailTimesheet(input)
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
          dispatch(getStaffDetailTimesheetSuccess(data));
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
        dispatch(getStaffDetailTimesheetSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const approveTimesheet = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.approveTimesheet(input)
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
          dispatch(approveTimesheetSuccess(data));
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
        dispatch(approveTimesheetSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const approveRejectDay = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.approveRejectDay(input)
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
          dispatch(approveRejectDaySuccess(data));
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
        dispatch(approveRejectDaySuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getDailyDetails = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.getDailyDetails(input)
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
          dispatch(getDailyDetailsSuccess(data));
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
        dispatch(getDailyDetailsSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getTimesheetDetailFromNotification = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return TimesheetAPI.getTimesheetDetailFromNotification(input)
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
          dispatch(getTimesheetDetailFromNotificationSuccess(data, input));
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
        dispatch(getTimesheetDetailFromNotificationSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods

export const getMyTimesheetsSuccess = (data, page, pageCount = 1) => ({
  type: GET_MY_TIMESHEETS,
  payload: {data, page, pageCount},
});

export const getMyDetailTimesheetSuccess = data => ({
  type: GET_MY_DETAIL_TIMESHEET,
  payload: {data},
});

export const companyPeriodSuccess = data => ({
  type: GET_COMPANY_PERIOD,
  payload: {data},
});

export const submitTimesheetSuccess = data => ({
  type: SUBMIT_TIMESHEET,
  payload: {data},
});

export const getCheckinsSuccess = data => ({
  type: GET_CHECKINS,
  payload: {data},
});

export const updateCheckoutSuccess = data => ({
  type: UPDATE_CHECKOUT,
  payload: {data},
});

export const updateTaskSuccess = data => ({
  type: UPDATE_TASK,
  payload: {data},
});

export const checkinSuccess = data => ({
  type: CHECKIN,
  payload: {data},
});

export const checkoutSuccess = data => ({
  type: CHECKOUT,
  payload: {data},
});

export const submitReasonSuccess = data => ({
  type: SUBMIT_REASON,
  payload: {data},
});

export const getStaffTimesheetsSuccess = (data, page, pageCount = 1) => ({
  type: GET_STAFF_TIMESHEETS,
  payload: {data, page, pageCount},
});

export const companyEmployeeSuccess = data => ({
  type: GET_COMPANY_EMPLOYEE,
  payload: {data},
});

export const getStaffDetailTimesheetSuccess = data => ({
  type: GET_STAFF_DETAIL_TIMESHEET,
  payload: {data},
});

export const approveTimesheetSuccess = data => ({
  type: APPROVE_TIMESHEET,
  payload: {data},
});

export const approveRejectDaySuccess = data => ({
  type: APPROVE_REJECT_DAY,
  payload: {data},
});

export const getDailyDetailsSuccess = data => ({
  type: GET_DAILY_DETAILS,
  payload: {data},
});

export const getTimesheetDetailFromNotificationSuccess = (data, input) => ({
  type: GET_TIMESHEET_DETAIL_FROM_NOTIFICATION,
  payload: {data, input},
});

export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
