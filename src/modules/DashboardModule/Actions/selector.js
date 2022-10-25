const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const myDashboardSelector = state => state.dashboardModel;
const contentsSelector = state => state.pageContents;
const updateProfileSelector = state => state.photo;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  myDashboardSelector,
  contentsSelector,
  updateProfileSelector,
};
