import CalenderAPI from './CalenderAPI';
import {
  API_START,
  API_FAILURE,
  GET_TODAY_EVENT,
  EVENT_DETAIL,
  GET_EVENT_ATTENDEE,
  GIVE_EVENT_ATTENDANCE,
  DELETE_EVENT,
  GET_EVENTS,
  ADD_EVENT,
  UPDATE_EVENT,
} from './type';

//MARK: - Action Methods call from js files

export const getTodayEvent = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return CalenderAPI.getTodayEvent(input)
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
          dispatch(getTodayEventSuccess(data));
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
        dispatch(getTodayEventSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const eventDetail = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return CalenderAPI.eventDetail(input)
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
          dispatch(eventDetailSuccess(data));
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
        dispatch(eventDetailSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getEventAttendee = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return CalenderAPI.getEventAttendee(input)
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
          dispatch(eventAttendeeSuccess(data));
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
        dispatch(eventAttendeeSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const giveEventAttendance = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return CalenderAPI.giveEventAttendance(input)
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
          dispatch(eventAttendanceSuccess(data));
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
        dispatch(eventAttendanceSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const deleteEvent = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return CalenderAPI.deleteEvent(input)
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
          dispatch(deleteEventSuccess(data,input));
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
        dispatch(deleteEventSuccess(data,input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getEvents = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return CalenderAPI.getEvents(input)
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
          dispatch(getEventsSuccess(data));
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
        dispatch(getEventsSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const addEvent = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return CalenderAPI.addEvent(input)
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
          dispatch(addEventSuccess(data, input));
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
        dispatch(addEventSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateEvent = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return CalenderAPI.updateEvent(input)
    .then(data => {
      if (data === undefined) {
        dispatch(updateEventSuccess(errorObject));
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
          dispatch(updateEventSuccess(data, input));
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
        dispatch(addEventSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods

export const getTodayEventSuccess = data => ({
  type: GET_TODAY_EVENT,
  payload: {data},
});

export const getEventsSuccess = data => ({
  type: GET_EVENTS,
  payload: {data},
});

export const eventDetailSuccess = data => ({
  type: EVENT_DETAIL,
  payload: {data},
});

export const eventAttendeeSuccess = data => ({
  type: GET_EVENT_ATTENDEE,
  payload: {data},
});

export const eventAttendanceSuccess = data => ({
  type: GIVE_EVENT_ATTENDANCE,
  payload: {data},
});

export const deleteEventSuccess = (data,input) => ({
  type: DELETE_EVENT,
  payload: {data,input},
});

export const addEventSuccess = (data, input) => ({
  type: ADD_EVENT,
  payload: {data, input},
});

export const updateEventSuccess = (data, input) => ({
  type: UPDATE_EVENT,
  payload: {data, input},
});

export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
