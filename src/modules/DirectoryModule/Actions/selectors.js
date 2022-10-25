const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const getDirectorySelector = state => state.directoryData;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  getDirectorySelector,
};
