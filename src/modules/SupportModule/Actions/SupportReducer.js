import {
  API_FAILURE,
  API_START,
  SUPPORT_GET,
  SUPPORT_COMMENT_GET,
  SUPPORT_REPLY,
  SUPPORT_DELETE,
  SUPPORT_ADD,
  SUPPORT_UPLOAD,
  SUPPORT_DETAIL,
} from './type';
import _ from 'lodash';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const SupportReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case SUPPORT_GET: {
      if (action.payload.data.data.length > 0) {
        state.supportList =
          action.payload.page == 1
            ? action.payload.data.data
            : [...state.data, ...action.payload.data.data];
      } else {
        // if(action.payload.page <= action.payload.data.pageCount ) {
        state.supportList = [];
        // }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        supportList: [...state.supportList],
        api: SUPPORT_GET,
        lastPage: action.payload.data.pageCount,
      };
    }

    case SUPPORT_COMMENT_GET: {
      if (action.payload.data.data.length > 0) {
        if (
          state.commentList !== undefined &&
          state.commentList.length > 0 &&
          state.commentList[state.commentList.length - 1].postedOn ==
            action.payload.page
        ) {
          state.commentList =
            state.commentList === undefined || state.commentList.length == 0
              ? action.payload.data.data
              : [...state.commentList, ...action.payload.data.data];

          state.commentList = _.uniq(state.commentList); // [1, 2, 3]
        } else {
          state.commentList = action.payload.data.data;
        }
      } else {
        // if(action.payload.page <= action.payload.data.pageCount ) {
        // state.commentList = []
        // }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        commentList: [...state.commentList],
        api: SUPPORT_COMMENT_GET,
        lastPage: action.payload.page,
        fileName: null,
      };
    }

    case SUPPORT_DETAIL:
      return {
        ...state,
        error: null,
        supportModel: action.payload.data,
        isLoading: false,
        api: SUPPORT_DETAIL,
        fileName: null,
      };

    case SUPPORT_DELETE: {
      const indexSupportToDelete = state.supportList.findIndex(supportModel => {
        return supportModel.supportId == action.payload.supportId;
      });
      state.supportList.splice(indexSupportToDelete, 1);

      return {
        ...state,
        supportList: [...state.supportList],
        isLoading: false,
        error: false,
        api: SUPPORT_DELETE,
      };
    }

    case SUPPORT_REPLY: {
      var supportIndex = state.supportList
        .map(function(item) {
          return item.ticketId;
        })
        .indexOf(action.payload.data.ticketId);

      let supportModel = state.supportModel;
      if (
        supportModel.replies !== undefined &&
        supportModel.replies.length > 0
      ) {
        supportModel.replies.insert(0, action.payload.data);
      } else {
        supportModel.replies = [action.payload.data];
      }

      return {
        ...state,
        error: null,
        supportList: [...state.supportList],
        supportModel: supportModel,
        isLoading: false,
        api: SUPPORT_REPLY,
        fileName: null,
      };
    }

    case SUPPORT_ADD: {
      let supportList = state.supportList;
      if (state.supportList.length == 0) {
        supportList = [action.payload.data];
      } else {
        supportList.insert(0, action.payload.data);
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        supportList: supportList,
        supportModel: action.payload.data,
        api: SUPPORT_ADD,
        fileName: null,
      };
    }

    case SUPPORT_UPLOAD:
      return {
        ...state,
        error: null,
        fileName: action.payload.data,
        isLoading: false,
        api: SUPPORT_UPLOAD,
      };

    case API_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
        api: state.api,
      };

    case API_START:
      return {
        ...state,
        isLoading: true,
        api: state.api,
        error: null,
      };

    default:
      return {
        ...state,
        error: null,
        isLoading: false,
        api: null,
      };
  }
};

Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
};

export default SupportReducer;
