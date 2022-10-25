import PayslipAPI from './PayslipAPI';
import {
  API_START,
  API_FAILURE,
  GET_MY_PAYSLIPS,
  GET_SALARY_DETAIL,
  GET_STAFF_PAYSLIPS,
} from './type';

//MARK: - Action Methods call from js files

export const getMyPayslips = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return PayslipAPI.getMyPayslips(input)
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
          dispatch(getMyPayslipsSuccess(data.data,
            input.page,
            data.pageCount));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
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
        dispatch(getMyPayslipsSuccess(data.data,
          input.page,
          data.pageCount));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getSalaryDetail = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return PayslipAPI.getSalaryDetail(input)
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
          dispatch(getSalaryDetailSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
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
        dispatch(getSalaryDetailSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getStaffPayslips = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return PayslipAPI.getStaffPayslips(input)
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
          dispatch(getStaffPayslipsSuccess(data.data,
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
        dispatch(getStaffPayslipsSuccess(data.data,
          input.page,
          data.pageCount));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods

export const getMyPayslipsSuccess = (data, page, pageCount = 1) => ({
  type: GET_MY_PAYSLIPS,
  payload: {data, page, pageCount},
});

export const getSalaryDetailSuccess = data => ({
  type: GET_SALARY_DETAIL,
  payload: {data},
});

export const getStaffPayslipsSuccess = (data, page, pageCount = 1) => ({
  type: GET_STAFF_PAYSLIPS,
  payload: {data, page, pageCount},
});

export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
