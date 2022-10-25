const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const myLeavesListSelector = state => state.leaves;
const dashboardLeavesListSelector = state => state.dashboardLeaves;
const myBalanceLeavesSelector = state => state.balanceLeaves;
const applyLeaveSelector = state => state.leaveId;
const leaveDetailSelector = state => state.leaveDetail;
const cancelLeaveSelector = state => state.leaveCancelSuccess;
const updateLeaveSelector = state => state.updatedLeaveId;
const staffLeavesListSelector = state => state.staffLeaves;
const staffLeaveDetailSelector = state => state.staffLeaveDetail;
const approveLeaveSelector = state => state.leaveApproveSuccess;
const rejectLeaveSelector = state => state.leaveRejectSuccess;
const applyStaffLeaveSelector = state => state.staffLeaveId;
const computeTotalDaysSelector = state => state.totalDaysData;
const updateStaffLeaveSelector = state => state.updatedStaffLeaveId;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  myLeavesListSelector,
  dashboardLeavesListSelector,
  myBalanceLeavesSelector,
  applyLeaveSelector,
  leaveDetailSelector,
  cancelLeaveSelector,
  updateLeaveSelector,
  staffLeavesListSelector,
  staffLeaveDetailSelector,
  approveLeaveSelector,
  rejectLeaveSelector,
  applyStaffLeaveSelector,
  computeTotalDaysSelector,
  updateStaffLeaveSelector,
};
