const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const myOccurrencesListSelector = state => state.myOccurrences;
const occurrenceDetailSelector = state => state.occurrenceDetail;
const deleteOccurrenceSelector = state => state.message;
const addOccurrenceSelector = state => state.occId;
const getStaffOccurrencesSelector = state => state.staffOccurrences;
const rejectOccurrenceSelector = state => state.occRejectSuccess;
const approveOccurrenceSelector = state => state.occApproveSuccess;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  myOccurrencesListSelector,
  occurrenceDetailSelector,
  deleteOccurrenceSelector,
  addOccurrenceSelector,
  getStaffOccurrencesSelector,
  rejectOccurrenceSelector,
  approveOccurrenceSelector,
};
