import {
  API_START,
  API_FAILURE,
  GET_MY_OCCURRENCES,
  OCCURRENCE_DETAIL,
  DELETE_OCCURRENCE,
  ADD_OCCURRENCE,
  GET_STAFF_OCCURRENCES,
  REJECT_OCCURRENCE,
  APPROVE_OCCURRENCE,
} from './type';
import OccuranceAPI from './OccuranceAPI';

//MARK: - Action Methods call from js files

export const getMyOccurrences = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return OccuranceAPI.getMyOccurrences(input)
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
          dispatch(getMyOccurrencesuccess(data.data,
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
        dispatch(getMyOccurrencesuccess(data.data,
          input.page,
          data.pageCount));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const occurrenceDetail = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return OccuranceAPI.occurrenceDetail(input)
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
          dispatch(occurrenceDetailSuccess(data));
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
        dispatch(occurrenceDetailSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const deleteOccurrence = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return OccuranceAPI.deleteOccurrence(input)
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
          dispatch(deleteOccurrenceSuccess(data, input));
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
        dispatch(deleteOccurrenceSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const addOccurrence = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return OccuranceAPI.addOccurrence(input)
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
          dispatch(addOccurrenceSuccess(data, input));
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
        dispatch(addOccurrenceSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getStaffOccurrences = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return OccuranceAPI.getStaffOccurrences(input)
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
          dispatch(getStaffOccurrencesSuccess(data.data,
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
        dispatch(getStaffOccurrencesSuccess(data.data,
          input.page,
          data.pageCount));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const rejectOccurrence = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return OccuranceAPI.rejectOccurrence(input)
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
          dispatch(rejectOccurrenceSuccess(data, input));
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
        dispatch(rejectOccurrenceSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const approveOccurrence = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return OccuranceAPI.rejectOccurrence(input)
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
          dispatch(approveOccurrenceSuccess(data, input));
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
        dispatch(approveOccurrenceSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods

export const getMyOccurrencesuccess = (data, page, pageCount = 1) => ({
  type: GET_MY_OCCURRENCES,
  payload: {data, page, pageCount},
});

export const occurrenceDetailSuccess = data => ({
  type: OCCURRENCE_DETAIL,
  payload: {data},
});

export const deleteOccurrenceSuccess = (data, input) => ({
  type: DELETE_OCCURRENCE,
  payload: {data, input},
});

export const addOccurrenceSuccess = (data, input) => ({
  type: ADD_OCCURRENCE,
  payload: {data, input},
});

export const getStaffOccurrencesSuccess = (data, page, pageCount = 1) => ({
  type: GET_STAFF_OCCURRENCES,
  payload: {data, page, pageCount},
});

export const rejectOccurrenceSuccess = (data, input) => ({
  type: REJECT_OCCURRENCE,
  payload: {data, input},
});

export const approveOccurrenceSuccess = (data, input) => ({
  type: APPROVE_OCCURRENCE,
  payload: {data, input},
});

export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
