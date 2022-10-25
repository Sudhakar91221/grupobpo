const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const myTimesheetListSelector = state => state.myTimesheets;
const myDetailTimesheetSelector = state => state.myTimesheetModel;
const companyPeriodSelector = state => state.companyPeriods;
const submitTimesheetSelector = state => state.message;
const getCheckinsSelector = state => state.checkins;
const updateCheckoutSelector = state => state.checkinId;
const updateTaskSelector = state => state.taskModel;
const checkinSelector = state => state.checkinResponse;
const checkoutSelector = state => state.checkoutResponse;
const submitReasonSelector = state => state.successMessage;
const staffTimesheetListSelector = state => state.staffTimesheets;
const companyEmployeeSelector = state => state.companyEmployees;
const staffDetailTimesheetSelector = state => state.staffTimesheetModel;
const approveTimesheetSelector = state => state.timesheetStatus;
const approveRejectDaySelector = state => state.dayStatus;
const dailyDetailsSelector = state => state.dailyDetails;
const timesheetDetailFromNotificationSelector = state => state.timesheetDetails;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  myTimesheetListSelector,
  myDetailTimesheetSelector,
  companyPeriodSelector,
  submitTimesheetSelector,
  getCheckinsSelector,
  updateCheckoutSelector,
  updateTaskSelector,
  checkinSelector,
  checkoutSelector,
  submitReasonSelector,
  staffTimesheetListSelector,
  companyEmployeeSelector,
  staffDetailTimesheetSelector,
  approveTimesheetSelector,
  approveRejectDaySelector,
  dailyDetailsSelector,
  timesheetDetailFromNotificationSelector,
};
