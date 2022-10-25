const isLoadingSelector = state => state.isLoading;
const FAQListSelector = state => state.FAQList;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const feedbackAddSelector = state => state.feedbackAddSuccess;
const feedbackGetSelector = state => state.feedbackModel;
const feedbackUpdateSelector = state => state.successMessage;
const getMyAdsSelector = state => state.myAdsList;
const viewMyAdSelector = state => state.myAdModel;
const viewAdStatisticsSelector = state => state.adStatistics;
const viewAdSelector = state => state.adModel;

export {
  isLoadingSelector,
  FAQListSelector,
  apiSelector,
  errorSelector,
  successSelector,
  feedbackAddSelector,
  feedbackGetSelector,
  feedbackUpdateSelector,
  getMyAdsSelector,
  viewMyAdSelector,
  viewAdStatisticsSelector,
  viewAdSelector,
};
