import FileAPI from './FileAPI';
import {
  FILE_GET,
  FILE_ADD,
  FILE_EDIT,
  FILE_DELETE,
  FILE_REMOVE_IMAGES,
  FILE_UPLOAD_PROGRESS,
  API_START,
  API_FAILURE,
  DOWNLOAD_FILE,
  GET_DOCUMENT,
  DELETE_DOCUMENT,
} from './type';

//MARK: - Action Methods call from js files

export const getFiles = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FileAPI.getFile(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage != null) {
        if (data.code == 0) {
          dispatch(fileListSuccess(data, input.page));
          return;
        }
        errorObject.message = data.ErrorMessage;

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(fileListSuccess(data, input.page));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const addFile = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  dispatch(fileAddProgress());

  return FileAPI.addFile(input)
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

      if (data.progress !== undefined) {
        dispatch(fileAddProgress(data.progress));
      }

      if (data.ErrorMessage != null) {
        if (data.code == 0) {
          dispatch(fileAddSuccess(data, 1, input));
          return;
        }
        errorObject.message = data.ErrorMessage;

        dispatch(apiFailure(errorObject));
      } else {
        if (data.progress !== undefined) {
          dispatch(fileAddSuccess(data, 1, input));
        }
        dispatch(fileAddSuccess(data, 1, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const deleteFile = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());

  return FileAPI.deleteFile(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.code == -1) {
        errorObject.code = -1;
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage != null) {
        if (data.code == 0) {
          dispatch(fileDeleteSuccess(data));
          return;
        }
        errorObject.message = data.ErrorMessage;

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(fileDeleteSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const downloadFile = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());

  return FileAPI.downloadFile(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.code == -1) {
        errorObject.code = -1;
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage != null) {
        if (data.code == 0) {
          dispatch(fileDownloadSuccess(data));
          return;
        }
        errorObject.message = data.ErrorMessage;

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(fileDownloadSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getDocuments = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FileAPI.getDocuments(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage != null) {
        if (data.code == 0) {
          dispatch(getDocumentsSuccess(data));
          return;
        }
        errorObject.message = data.ErrorMessage;

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getDocumentsSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const deleteDocument = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return FileAPI.deleteDocument(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
      }

      if (data.ErrorMessage != null) {
        if (data.code == 0) {
          dispatch(deleteDocumentSuccess(data, input));
          return;
        }
        errorObject.message = data.ErrorMessage;

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(deleteDocumentSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods

export const fileListSuccess = (data, page) => ({
  type: FILE_GET,
  payload: {data, page},
});

export const fileDeleteSuccess = data => ({
  type: FILE_DELETE,
  payload: {data},
});

export const fileAddSuccess = (data, progress, input) => ({
  type: FILE_ADD,
  payload: {data, progress, input},
});

export const fileAddProgress = () => ({
  type: FILE_UPLOAD_PROGRESS,
  payload: {},
});

export const fileDownloadSuccess = data => ({
  type: DOWNLOAD_FILE,
  payload: {data},
});

export const getDocumentsSuccess = data => ({
  type: GET_DOCUMENT,
  payload: {data},
});

export const deleteDocumentSuccess = (data, input) => ({
  type: DELETE_DOCUMENT,
  payload: {data, input},
});

export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
