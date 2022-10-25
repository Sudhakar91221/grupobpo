const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const holidaysListSelector = state => state.holidays;
const addHolidaySelector = state => state.holidayId;
const deleteHolidaySelector = state => state.message;
const updateHolidaySelector = state => state.success;
const requestSelector = state => state.request;



export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  holidaysListSelector,
  addHolidaySelector,
  deleteHolidaySelector,
  updateHolidaySelector,
  requestSelector
};
