import {
  API_FAILURE,
  API_START,
  HOME_GET,
  HOME_UPDATE,
  HOME_DELETE,
  HOME_ADD,
  HOME_DETAIL,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
  home: [],
};

const HomeReducer = (state = defaultState, action) => {
  console.log('------------REDUCER-------------');
  console.log(action.payload);

  switch (action.type) {
    case HOME_GET: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0) {
        state.home =
          page == 1
            ? action.payload.data
            : [...state.home, ...action.payload.data];
      } else {
        // if(action.payload.page <= action.payload.data.pageCount ) {
        state.home = [];
        // }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        home: [...state.home],
        api: HOME_GET,
        lastPage: action.payload.data.homeCount,
      };
    }

    case HOME_DETAIL:
      return {
        ...state,
        error: null,
        homeModel: action.payload.data.data[0],
        isLoading: false,
        api: HOME_DETAIL,
      };

    case HOME_DELETE: {
      const indexHomeToDelete = state.home.findIndex(
        homeModel => {
          return (
            homeModel.homeId == action.payload.homeId
          );
        },
      );
      state.home.splice(indexHomeToDelete, 1);

      return {
        ...state,
        home: [...state.home],
        isLoading: false,
        error: false,
        api: HOME_DELETE,
      };
    }

    case HOME_UPDATE: {
      var homeIndex = state.home
        .map(function(item) {
          return item.homeId;
        })
        .indexOf(action.payload.input.homeId);

      const originalHome = state.home[homeIndex];
      const newHome = action.payload.input;
      let updatedHomeModel = {
        ...state.home[homeIndex],
        homeId: newHome.homeId,
        name:
          newHome.name !== undefined
            ? newHome.name
            : originalHome.name,
        category:
          newHome.category !== undefined
            ? newHome.category
            : originalHome.category,
        des:
          newHome.des !== undefined
            ? newHome.des
            : originalHome.des,
      };
      state.home[homeIndex] = updatedHomeModel;

      //    setTimeout(() => {
      //      return {
      //           ...state,
      //           successMessage:undefined

      //      }
      //    }, 300);

      return {
        ...state,
        error: null,
        home: state.home,
        homeModel: updatedHomeModel,
        isLoading: false,
        api: HOME_UPDATE,
        successMessage: 'Home successfully updated',
      };
    }

    case HOME_ADD: {
      let home = state.home;
      if (state.home.length == 0) {
        home = [action.payload.data];
      } else {
        home.insert(0, action.payload.data);
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        home: home,
        homeModel: action.payload.data,
        api: HOME_ADD,
        homeCount: action.payload.count,
        successMessage: 'Home successfully added',
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

export default HomeReducer;
