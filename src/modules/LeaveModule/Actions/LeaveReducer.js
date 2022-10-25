import {
  API_FAILURE,
  API_START,
  GET_MY_LEAVES,
  GET_MY_BALANCE,
  APPLY_LEAVE,
  LEAVE_DETAIL,
  CANCEL_LEAVE,
  UPDATE_LEAVE,
  GET_STAFF_LEAVES,
  STAFF_LEAVE_DETAIL,
  APPROVE_LEAVE,
  REJECT_LEAVE,
  APPLY_STAFF_LEAVE,
  COMPUTE_TOTAL_DAYS,
  UPDATE_STAFF_LEAVE,
  GET_DASHBOARD_LEAVES,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const LeaveReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case GET_MY_LEAVES: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.leaves =
          page == 1
            ? action.payload.data
            : [...state.leaves, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.leaves = [];
        }
        if( action.payload.pageCount === 0) {
          state.leaves = [];

        }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        leaves: [...state.leaves],
        api: GET_MY_LEAVES,
      };
    }

    case GET_DASHBOARD_LEAVES: {
      return {
        ...state,
        isLoading: false,
        error: null,
        dashboardLeaves: action.payload.data.data,
        api: GET_DASHBOARD_LEAVES,
      };
    }

    case GET_MY_BALANCE: {
      return {
        ...state,
        isLoading: false,
        error: null,
        balanceLeaves: action.payload.data.data,
        api: GET_MY_BALANCE,
      };
    }

    case APPLY_LEAVE: {
      var leaveModel = {};
      leaveModel.title = action.payload.input.title;
      leaveModel.leaveStatus = '0';
      leaveModel.leaveStart = action.payload.input.start;
      leaveModel.leaveEnd = action.payload.input.end;
      state.leaves.push(leaveModel);
      return {
        ...state,
        isLoading: false,
        error: null,
        leaveId: action.payload.data.leaveId,
        api: APPLY_LEAVE,
      };
    }

    case LEAVE_DETAIL: {
      return {
        ...state,
        isLoading: false,
        error: null,
        leaveDetail: action.payload.data.data,
        api: LEAVE_DETAIL,
      };
    }

    case CANCEL_LEAVE: {
      let leavesList = state.leaves;
      let leaveIndex = leavesList
        .map(function(item) {
          return item.leaveId;
        })
        .indexOf(action.payload.input.leaveId);
      var leavemodel = {};
      leavemodel.leaveStatus = '3';
      leaveModel.title = leavesList[leaveIndex].title;
      leaveModel.leaveStart = leavesList[leaveIndex].leaveStart;
      leaveModel.leaveEnd = leavesList[leaveIndex].leaveEnd;
      leavesList[leaveIndex] = leavemodel;
      return {
        ...state,
        isLoading: false,
        error: null,
        leaveCancelSuccess: 'Leave cancelled successfully',
        leaves: leavesList,
        api: CANCEL_LEAVE,
      };
    }

    case UPDATE_LEAVE: {
      let leavesList = state.leaves;
      let leaveIndex = leavesList
        .map(function(item) {
          return item.leaveId;
        })
        .indexOf(action.payload.input.leaveId);
      var leaveModel = {};
      leaveModel.title = action.payload.input.title;
      leaveModel.leaveStatus = 0;
      leaveModel.leaveStart = action.payload.input.start;
      leaveModel.leaveEnd = action.payload.input.end;
      leavesList[leaveIndex] = leavemodel;
      return {
        ...state,
        isLoading: false,
        error: null,
        updatedLeaveId: action.payload.data.leaveId,
        api: UPDATE_LEAVE,
      };
    }

    case GET_STAFF_LEAVES: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.staffLeaves =
          page == 1
            ? action.payload.data
            : [...state.users, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.staffLeaves = [];
        }
        if( action.payload.pageCount === 0) {
          state.staffLeaves = [];

        }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        staffLeaves: [...state.staffLeaves],
        api: GET_STAFF_LEAVES,
      };
    }

    case STAFF_LEAVE_DETAIL: {
      return {
        ...state,
        isLoading: false,
        error: null,
        staffLeaveDetail: action.payload.data.data[0],
        api: STAFF_LEAVE_DETAIL,
      };
    }

    case APPROVE_LEAVE: {
      let leavesList = state.staffLeaves;
      let leaveIndex = leavesList
        .map(function(item) {
          return item.leaveId;
        })
        .indexOf(action.payload.input.leaveId);
      var leavemodel = {};
      leavemodel.leaveStatus = 1;
      leaveModel.title = leavesList[leaveIndex].title;
      leaveModel.leaveStart = leavesList[leaveIndex].leaveStart;
      leaveModel.leaveEnd = leavesList[leaveIndex].leaveEnd;
      leavesList[leaveIndex] = leavemodel;
      return {
        ...state,
        isLoading: false,
        error: null,
        leaveApproveSuccess: 'Leave approved successfully',
        staffLeaves: leavesList,
        api: APPROVE_LEAVE,
      };
    }

    case REJECT_LEAVE: {
      let leavesList = state.staffLeaves;
      let leaveIndex = leavesList
        .map(function(item) {
          return item.leaveId;
        })
        .indexOf(action.payload.input.leaveId);
      var leavemodel = {};
      leavemodel.leaveStatus = 2;
      leaveModel.title = leavesList[leaveIndex].title;
      leaveModel.leaveStart = leavesList[leaveIndex].leaveStart;
      leaveModel.leaveEnd = leavesList[leaveIndex].leaveEnd;
      leavesList[leaveIndex] = leavemodel;
      return {
        ...state,
        isLoading: false,
        error: null,
        leaveRejectSuccess: 'Leave rejected successfully',
        staffLeaves: leavesList,
        api: REJECT_LEAVE,
      };
    }

    case APPLY_STAFF_LEAVE: {
      var leave = {};
      leave.title = action.payload.input.title;
      leave.leaveStatus = '0';
      leave.leaveStart = action.payload.input.start;
      leave.leaveEnd = action.payload.input.end;
      state.staffLeaves.push(leave);

      return {
        ...state,
        isLoading: false,
        error: null,
        staffLeaveId: action.payload.data.leaveId,
        api: APPLY_STAFF_LEAVE,
      };
    }

    case COMPUTE_TOTAL_DAYS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        totalDaysData: action.payload.data,
        api: COMPUTE_TOTAL_DAYS,
      };
    }

    case UPDATE_STAFF_LEAVE: {
      let leavesList = state.staffLeaves;
      let leaveIndex = leavesList
        .map(function(item) {
          return item.leaveId;
        })
        .indexOf(action.payload.input.leaveId);
      var leaveModel = {};
      leaveModel.title = action.payload.input.title;
      leaveModel.leaveStatus = 0;
      leaveModel.leaveStart = action.payload.input.start;
      leaveModel.leaveEnd = action.payload.input.end;
      leavemodel.userName = action.payload.input.userName;
      leavesList[leaveIndex] = leavemodel;
      return {
        ...state,
        isLoading: false,
        error: null,
        updatedStaffLeaveId: action.payload.data.leaveId,
        api: UPDATE_STAFF_LEAVE,
      };
    }

    case API_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
        api: null,
      };

    case API_START:
      return {
        ...state,
        isLoading: true,
        api: state.api,
        error: null,
      };

    default:
      return {
        ...state,
        error: null,
        isLoading: false,
        api: state.api,
      };
  }
};

Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
};

export default LeaveReducer;
