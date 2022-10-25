import {
  API_FAILURE,
  API_START,
  NOTIFICATION_GET,
  MARK_NOTIFICATION_READ,
  GET_HOME_NOTIFICATIONS,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
  notifications: [],
};

const NotificationReducer = (state = defaultState, action) => {
  console.log('------------REDUCER-------------');
  console.log(action.payload);

  switch (action.type) {
    case NOTIFICATION_GET: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0) {
        state.notifications =
          page == 1
            ? action.payload.data
            : [...state.notifications, ...action.payload.data];
      } else {
        // if(action.payload.page <= action.payload.data.pageCount ) {
        state.notifications = [];
        // }
      }

      //store notifications in asyncstorage
      if (page === 1) {
        AsyncStorage.setItem(
          'notifications',
          JSON.stringify(state.notifications),
        );
      }
      //home notifications
      if (action.payload.data.length > 0) {
        state.homeNotifications =
          page == 1 ? action.payload.data : [...state.homeNotifications];
      }
      AsyncStorage.setItem(
        'homeNotifications',
        JSON.stringify(state.homeNotifications),
      );
      if (state.notifications !== state.homeNotifications) {
        global.isBadgeShown = true;
      } else {
        global.isBadgeShown = false;
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        notifications: [...state.notifications],
        api: NOTIFICATION_GET,
        lastPage: action.payload.data.notificationCount,
      };
    }

    case MARK_NOTIFICATION_READ:
      if (action.payload.input.notiId === '') {
        //mark all as read
      } else {
        let index = state.notifications
          .map(function (item) {
            return item.notiId;
          })
          .indexOf(action.payload.input.notiId);
        let notificationModel = state.notifications[index];
        notificationModel.readStatus = '1';
        state.notifications[index] = notificationModel;
      }
      return {
        ...state,
        error: null,
        notifications: [...state.notifications],
        success: 'Notification read',
        isLoading: false,
        api: MARK_NOTIFICATION_READ,
      };

    case GET_HOME_NOTIFICATIONS: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0) {
        state.homeNotifications =
          page == 1 ? action.payload.data : [...state.homeNotifications];
      } else {
        // if(action.payload.page <= action.payload.data.pageCount ) {
        state.homeNotifications = [];
        // }
      }
      AsyncStorage.setItem(
        'homeNotifications',
        JSON.stringify(state.homeNotifications),
      );

      if (
        state.notifications === undefined ||
        state.notifications.length === 0 ||
        state.notifications !== state.homeNotifications
      ) {
        global.isBadgeShown = true;
      } else {
        global.isBadgeShown = false;
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        homeNotifications: [...state.homeNotifications],
        api: GET_HOME_NOTIFICATIONS,
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

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

export default NotificationReducer;
