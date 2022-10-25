import SupportAPI from './SupportAPI';
import {
  SUPPORT_GET,
  SUPPORT_DETAIL,
  SUPPORT_COMMENT_GET,
  SUPPORT_REPLY,
  SUPPORT_DELETE,
  SUPPORT_REMOVE_IMAGES,
  SUPPORT_UPLOAD,
  SUPPORT_ADD,
  API_START,
  API_FAILURE,
} from './type';

//MARK: - Action Methods call from js files

export const getSupports = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return SupportAPI.getSupports(input)
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
        dispatch(supportListSuccess(data, input.page));
        return;
      }

      if (data.ErrorMessage != null) {
        errorObject.message = data.ErrorMessage;
        dispatch(apiFailure(errorObject));
      } else {
        dispatch(supportListSuccess(data, input.page));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getSupportComment = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return SupportAPI.getSupportComment(input)
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
        dispatch(commentListSuccess(data, input.page));
        return;
      }

      if (data.ErrorMessage != null) {
        errorObject.message = data.ErrorMessage;
        dispatch(apiFailure(errorObject));
      } else {
        dispatch(commentListSuccess(data, input.page));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const detailSupport = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return SupportAPI.detailSupport(input)
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
        dispatch(supportDetailSuccess(data));
        return;
      }

      if (data.ErrorMessage != null) {
        errorObject.message = data.ErrorMessage;
        dispatch(apiFailure(errorObject));
      } else {
        dispatch(supportDetailSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const replySupport = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return SupportAPI.replySupport(input)
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
        dispatch(supportReplySuccess(replyModel, input.ticketNo));
        return;
      }

      if (data.ErrorMessage != null) {
        errorObject.message = data.ErrorMessage;
        dispatch(apiFailure(errorObject));
      } else {
        const replyModel = {
          ticketId: data.ticketId, // this.props.user.userId,
          postedBY: 'You',
          userId: input.userId,
          comment: input.details,
          postedOn: 'Just',
          attachment: global.uploadedImageName
            ? global.uploadedImageName.split(',')
            : null,
          id: data.replyId,
        };

        dispatch(supportReplySuccess(replyModel, input.ticketNo));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const addSupport = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return SupportAPI.addSupport(input)
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
        dispatch(supportAddSuccess(input));
        return;
      }

      if (data.ErrorMessage != null) {
        errorObject.message = data.ErrorMessage;
        dispatch(apiFailure(errorObject));
      } else {
        const supportModel = {
          subject: input.subject,
          details: input.details,
          ticketNo: data.ticketNo, // this.props.user.userId,
          ticketId: data.ticketId,
          postedBY: 'You',
          postedOn: 'Just',
          userId: input.userId,
          status: '1',
          attachment: global.uploadedImageName
            ? global.uploadedImageName.split(',')
            : null,
        };

        dispatch(supportAddSuccess(supportModel));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const deleteSupport = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return SupportAPI.deleteSupport(input)
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
        dispatch(supportDeleteSuccess(input.supportId));
        return;
      }

      if (data.ErrorMessage != null) {
        errorObject.message = data.ErrorMessage;
        dispatch(apiFailure(errorObject));
      } else {
        dispatch(supportDeleteSuccess(input.supportId));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateSupport = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());
  return SupportAPI.updateSupport(input)
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
        dispatch(supportUpdateSuccess(input));
        return;
      }

      if (data.ErrorMessage != null) {
        errorObject.message = data.ErrorMessage;
        dispatch(apiFailure(errorObject));
      } else {
        dispatch(supportUpdateSuccess(input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const uploadSupportFile = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
  };
  dispatch(apiBegins());

  return SupportAPI.uploadSupportFile(input)
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

      if (data.code == 0) {
        dispatch(uploadSupportSuccess(data.fileName));
        return;
      }

      if (data.ErrorMessage != null) {
        errorObject.message = data.ErrorMessage;

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(uploadSupportSuccess(data.fileName));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods

export const supportListSuccess = (data, page) => ({
  type: SUPPORT_GET,
  payload: {data, page},
});

export const supportDetailSuccess = data => ({
  type: SUPPORT_DETAIL,
  payload: {data},
});
export const commentListSuccess = (data, page) => ({
  type: SUPPORT_COMMENT_GET,
  payload: {data, page},
});

export const uploadSupportSuccess = data => ({
  type: SUPPORT_UPLOAD,
  payload: {data},
});

export const supportAddSuccess = data => ({
  type: SUPPORT_ADD,
  payload: {data},
});

export const supportReplySuccess = (data, ticketNo) => ({
  type: SUPPORT_REPLY,
  payload: {data, ticketNo},
});

export const supportDeleteSuccess = supportId => ({
  type: SUPPORT_DELETE,
  payload: {supportId},
});
export const supportImagesDeleteSuccess = (supportId, imageId) => ({
  type: SUPPORT_REMOVE_IMAGES,
  payload: {supportId, imageId},
});

export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
