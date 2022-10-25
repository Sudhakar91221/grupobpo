import {
  NOTIFICATION_GET,
  MARK_NOTIFICATION_READ,
  GET_HOME_NOTIFICATIONS,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const NotificationApiList = type => {
  switch (type) {
    case NOTIFICATION_GET:
      return '/Notification/get';
    case MARK_NOTIFICATION_READ:
      return '/Notification/markRead';
    case GET_HOME_NOTIFICATIONS:
      return '/Notification/get';
  }
};

class NotificationAPI {
  static getNotification(input) {
    return apiCall(
      NotificationApiList(NOTIFICATION_GET),
      input,
      NOTIFICATION_GET,
      RequestType.POST,
    );
  }

  static markNotificationRead(input) {
    return apiCall(
      NotificationApiList(MARK_NOTIFICATION_READ),
      input,
      MARK_NOTIFICATION_READ,
      RequestType.POST,
    );
  }

  static getHomeNotifications(input) {
    return apiCall(
      NotificationApiList(GET_HOME_NOTIFICATIONS),
      input,
      GET_HOME_NOTIFICATIONS,
      RequestType.POST,
    );
  }
}

export default NotificationAPI;
