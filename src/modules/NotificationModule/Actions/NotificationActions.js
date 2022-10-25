import NotificationAPI from './NotificationAPI';
import {
  NOTIFICATION_GET,
  MARK_NOTIFICATION_READ,
  API_START,
  API_FAILURE,
  GET_HOME_NOTIFICATIONS,
} from './type';

//MARK: - Action Methods call from js files

export const getNotification = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return NotificationAPI.getNotification(input)
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
            notificationListSuccess(
              data.data,
              input.page,
              data.notificationCount,
            ),
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
        dispatch(
          notificationListSuccess(
            data.data,
            input.page,
            data.notificationCount,
          ),
        );
      }
    })
    .catch(error => {
      throw error;
    });
};

export const markNotificationRead = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return NotificationAPI.markNotificationRead(input)
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
          dispatch(markNotificationReadSuccess(data, input));
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
        dispatch(markNotificationReadSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getHomeNotifications = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return NotificationAPI.getHomeNotifications(input)
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
            homeNotificationListSuccess(
              data.data,
              input.page,
              data.notificationCount,
            ),
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
        dispatch(
          homeNotificationListSuccess(
            data.data,
            input.page,
            data.notificationCount,
          ),
        );
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods

export const notificationListSuccess = (data, page, count) => ({
  type: NOTIFICATION_GET,
  payload: {data, page, count},
});

export const markNotificationReadSuccess = (data, input) => ({
  type: MARK_NOTIFICATION_READ,
  payload: {data, input},
});

export const homeNotificationListSuccess = (data, page, count) => ({
  type: GET_HOME_NOTIFICATIONS,
  payload: {data, page, count},
});

export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
