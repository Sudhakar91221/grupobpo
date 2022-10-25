import {createSelector} from 'reselect';

const isLoadingSelector = state => state.isLoading;
const notificationListSelector = state => state.notifications;
const jobListSelector = state => state.jobList;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const notificationDetailSelector = state => state.notificationModel;
const notificationCountSelector = state => state.notificationsCount;
const successSelector = state => state.successMessage;
export {
  isLoadingSelector,
  notificationListSelector,
  apiSelector,
  errorSelector,
  notificationDetailSelector,
  notificationCountSelector,
  successSelector,
  jobListSelector,
};
