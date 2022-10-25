import {createSelector} from 'reselect';

const isLoadingSelector = state => state.isLoading;
const notificationListSelector = state => state.notifications;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const markNotificationReadSelector = state => state.success;
const homeNotificationListSelector = state => state.homeNotifications;
export {
  isLoadingSelector,
  notificationListSelector,
  apiSelector,
  errorSelector,
  successSelector,
  markNotificationReadSelector,
  homeNotificationListSelector,
};
