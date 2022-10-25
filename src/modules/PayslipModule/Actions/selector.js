const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const myPayslipSelector = state => state.myPayslipData;
const salaryDetailSelector = state => state.salaryModel;
const staffPayslipSelector = state => state.staffPayslipData;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  myPayslipSelector,
  salaryDetailSelector,
  staffPayslipSelector,
};
