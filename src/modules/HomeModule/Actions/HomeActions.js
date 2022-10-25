import HomeAPI from './HomeAPI';
import {
  JOBLIST_GET,
  HOME_GET,
  HOME_DETAIL,
  HOME_UPDATE,
  HOME_DELETE,
  HOME_ADD,
  API_START,
  API_FAILURE,
} from './type';

//MARK: - Action Methods call from js files

export const getHome = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return HomeAPI.getHome(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code ) {
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

export const getJoblist = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return HomeAPI.getJoblist(input)
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
          dispatch(jobListSuccess(data.data, input.page, data.recordCount));
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
        dispatch(jobListSuccess(data.data, input.page, data.recordCount));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const detailHome = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return HomeAPI.detailHome(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.code == -1) {
        //-1 for network error
        errorObject.code = -1;
        dispatch(apiFailure(errorObject));
        return;
      }
      if (data.code == 0) {
        dispatch(notificationDetailSuccess(data));
        return;
      }

      if (data.ErrorMessage) {
        errorObject.message = data.ErrorMessage;
        dispatch(apiFailure(errorObject));
      } else {
        dispatch(notificationDetailSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const addHome = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return HomeAPI.addHome(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code ) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(notificationAddSuccess(input));
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
        dispatch(notificationAddSuccess(input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const deleteHome = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return HomeAPI.deleteHome(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code ) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(notificationDeleteSuccess(input.notificationId));
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
        dispatch(notificationDeleteSuccess(input.notificationId));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateHome = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return HomeAPI.updateHome(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code ) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(notificationUpdateSuccess(data, input));
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
        dispatch(notificationUpdateSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods

export const notificationListSuccess = (data, page, count) => ({
  type: HOME_GET,
  payload: {data, page, count},
});

export const jobListSuccess = (data, page, count) => ({
  type: JOBLIST_GET,
  payload: {data, page, count},
});

export const notificationDetailSuccess = data => ({
  type: HOME_DETAIL,
  payload: {data},
});

export const notificationAddSuccess = data => ({
  type: HOME_ADD,
  payload: {data},
});

export const notificationUpdateSuccess = (data, input) => ({
  type: HOME_UPDATE,
  payload: {data, input},
});
export const notificationDeleteSuccess = notificationId => ({
  type: HOME_DELETE,
  payload: {notificationId},
});
export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
