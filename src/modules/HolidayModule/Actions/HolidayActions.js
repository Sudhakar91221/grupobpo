import HolidayAPI from './HolidayAPI';
import {
  API_START,
  API_FAILURE,
  GET_HOLIDAYS,
  ADD_HOLIDAY,
  DELETE_HOLIDAY,
  UPDATE_HOLIDAY,
} from './type';

//MARK: - Action Methods call from js files

export const getHolidays = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return HolidayAPI.getHolidays(input)
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
          dispatch(getHolidaysSucces(data));
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
        dispatch(getHolidaysSucces(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const addHoliday = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return HolidayAPI.addHoliday(input)
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
          dispatch(addHolidaySucces(data, input));
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
        dispatch(addHolidaySucces(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const deleteHoliday = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return HolidayAPI.deleteHoliday(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject,input.request));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject,input.request));
          return;
        }

        if (data.code == 0) {
          dispatch(deleteHolidaySuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          dispatch(apiFailure(errorObject,input.request));
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

        dispatch(apiFailure(errorObject,input.request));
      } else {
        dispatch(deleteHolidaySuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateHoliday = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return HolidayAPI.updateHoliday(input)
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
          dispatch(updateHolidaySucces(data, input));
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
        dispatch(updateHolidaySucces(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods

export const getHolidaysSucces = data => ({
  type: GET_HOLIDAYS,
  payload: {data},
});

export const addHolidaySucces = (data, input) => ({
  type: ADD_HOLIDAY,
  payload: {data, input},
});

export const deleteHolidaySuccess = (data, input) => ({
  type: DELETE_HOLIDAY,
  payload: {data, input},
});

export const updateHolidaySucces = (data, input) => ({
  type: UPDATE_HOLIDAY,
  payload: {data, input},
});

export const apiFailure = (error,request) => ({
  type: API_FAILURE,
  payload: {error,request},
});

export const apiBegins = () => ({
  type: API_START,
});
