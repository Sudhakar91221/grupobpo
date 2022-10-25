import {
  API_FAILURE,
  API_START,
  GET_MY_TIMESHEETS,
  GET_MY_DETAIL_TIMESHEET,
  GET_COMPANY_PERIOD,
  SUBMIT_TIMESHEET,
  GET_CHECKINS,
  UPDATE_CHECKOUT,
  UPDATE_TASK,
  CHECKIN,
  CHECKOUT,
  SUBMIT_REASON,
  GET_STAFF_TIMESHEETS,
  GET_COMPANY_EMPLOYEE,
  GET_STAFF_DETAIL_TIMESHEET,
  APPROVE_TIMESHEET,
  APPROVE_REJECT_DAY,
  GET_DAILY_DETAILS,
  GET_TIMESHEET_DETAIL_FROM_NOTIFICATION,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const TimesheetReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case GET_MY_TIMESHEETS: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.myTimesheets =
          page == 1
            ? action.payload.data
            : [...state.myTimesheets, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.myTimesheets = [];
        }
        if( action.payload.pageCount === 0) {
          state.myTimesheets = [];

        }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        myTimesheets: [...state.myTimesheets],
        api: GET_MY_TIMESHEETS,
      };
    }

    case GET_MY_DETAIL_TIMESHEET: {
      return {
        ...state,
        isLoading: false,
        error: null,
        myTimesheetModel: action.payload.data,
        api: GET_MY_DETAIL_TIMESHEET,
      };
    }

    case GET_COMPANY_PERIOD: {
      return {
        ...state,
        isLoading: false,
        error: null,
        companyPeriods: action.payload.data,
        api: GET_COMPANY_PERIOD,
      };
    }

    case SUBMIT_TIMESHEET: {
      return {
        ...state,
        isLoading: false,
        error: null,
        message: 'Timesheet submitted',
        api: SUBMIT_TIMESHEET,
      };
    }

    case GET_CHECKINS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        checkins: action.payload.data,
        api: GET_CHECKINS,
      };
    }

    case UPDATE_CHECKOUT: {
      return {
        ...state,
        isLoading: false,
        error: null,
        checkinId: action.payload.data.checkInId,
        api: UPDATE_CHECKOUT,
      };
    }

    case UPDATE_TASK: {
      return {
        ...state,
        isLoading: false,
        error: null,
        taskModel: action.payload.data,
        api: UPDATE_TASK,
      };
    }

    case CHECKIN: {
      return {
        ...state,
        isLoading: false,
        error: null,
        checkinResponse: action.payload.data,
        api: CHECKIN,
      };
    }

    case CHECKOUT: {
      return {
        ...state,
        isLoading: false,
        error: null,
        checkoutResponse: action.payload.data,
        api: CHECKOUT,
      };
    }

    case SUBMIT_REASON:
      return {
        ...state,
        isLoading: false,
        error: null,
        successMessage: 'Success',
        api: SUBMIT_REASON,
      };

    case GET_STAFF_TIMESHEETS: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.staffTimesheets =
          page == 1
            ? action.payload.data
            : [...state.staffTimesheets, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.staffTimesheets = [];
        }
        if( action.payload.pageCount === 0) {
          state.staffTimesheets = [];

        }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        staffTimesheets: [...state.staffTimesheets],
        api: GET_STAFF_TIMESHEETS,
      };
    }

    case GET_COMPANY_EMPLOYEE: {
      return {
        ...state,
        isLoading: false,
        error: null,
        companyEmployees: action.payload.data.data,
        api: GET_COMPANY_EMPLOYEE,
      };
    }

    case GET_STAFF_DETAIL_TIMESHEET: {
      return {
        ...state,
        isLoading: false,
        error: null,
        staffTimesheetModel: action.payload.data,
        api: GET_STAFF_DETAIL_TIMESHEET,
      };
    }

    case APPROVE_TIMESHEET: {
      return {
        ...state,
        isLoading: false,
        error: null,
        timesheetStatus: action.payload.data.timesheetStatus,
        api: APPROVE_TIMESHEET,
      };
    }

    case APPROVE_REJECT_DAY: {
      return {
        ...state,
        isLoading: false,
        error: null,
        dayStatus: action.payload.data.dayStatus,
        api: APPROVE_REJECT_DAY,
      };
    }

    case GET_DAILY_DETAILS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        dailyDetails: action.payload.data.data,
        api: GET_DAILY_DETAILS,
      };
    }

    case GET_TIMESHEET_DETAIL_FROM_NOTIFICATION: {
      return {
        ...state,
        isLoading: false,
        error: null,
        timesheetDetails: action.payload.data,
        api: GET_TIMESHEET_DETAIL_FROM_NOTIFICATION,
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

export default TimesheetReducer;
