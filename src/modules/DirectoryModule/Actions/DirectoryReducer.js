import {API_FAILURE, API_START, GET_DIRECTORY} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const DirectoryReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case GET_DIRECTORY: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.directoryData =
          page == 1
            ? action.payload.data
            : [...state.directoryData, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.directoryData = [];
        }
        if( action.payload.pageCount === 0) {
          state.directoryData = [];

        }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        directoryData: [...state.directoryData],
        api: GET_DIRECTORY,
      };
    }

    case API_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
        api: null,
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
        api: state.api,
      };
  }
};

Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
};

export default DirectoryReducer;
