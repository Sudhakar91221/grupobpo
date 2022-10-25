import {
  API_FAILURE,
  API_START,
  GET_MY_DASHBOARD,
  GET_CONTENTS,
  UPDATE_PROFILE,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const DashboardReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case GET_MY_DASHBOARD: {
      return {
        ...state,
        isLoading: false,
        error: null,
        dashboardModel: action.payload.data,
        api: GET_MY_DASHBOARD,
      };
    }

    case GET_CONTENTS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        pageContents: action.payload.data.data,
        api: GET_CONTENTS,
      };
    }

    case UPDATE_PROFILE: {
      global.user.photo = action.payload.data.photo;
      return {
        ...state,
        isLoading: false,
        error: null,
        photo: action.payload.data.photo,
        api: UPDATE_PROFILE,
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

export default DashboardReducer;
