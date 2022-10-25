const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const myRequestSelector = state => state.myRequests;
const deleteRequestSelector = state => state.message;
const addRequestSelector = state => state.requestId;
const updateRequestSelector = state => state.success;
const incomingRequestSelector = state => state.incomingRequests;
const outgoingRequestSelector = state => state.outgoingRequests;
const acceptRequestSelector = state => state.acceptSuccess;
const declineRequestSelector = state => state.declineSuccess;
const replyRequestSelector = state => state.reply;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  myRequestSelector,
  deleteRequestSelector,
  addRequestSelector,
  updateRequestSelector,
  incomingRequestSelector,
  outgoingRequestSelector,
  acceptRequestSelector,
  declineRequestSelector,
  replyRequestSelector,
};
