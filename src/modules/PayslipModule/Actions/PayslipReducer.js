import {
  API_FAILURE,
  API_START,
  GET_MY_PAYSLIPS,
  GET_SALARY_DETAIL,
  GET_STAFF_PAYSLIPS,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const PayslipReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    
    case GET_MY_PAYSLIPS: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.myPayslipData =
          page == 1
            ? action.payload.data
            : [...state.myPayslipData, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.myPayslipData = [];
        }
        if( action.payload.pageCount === 0) {
          state.myPayslipData = [];

        }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        myPayslipData: [...state.myPayslipData],
        api: GET_MY_PAYSLIPS,
      };
    }

    case GET_SALARY_DETAIL: {
      return {
        ...state,
        isLoading: false,
        error: null,
        salaryModel: action.payload.data,
        api: GET_SALARY_DETAIL,
      };
    }

    case GET_STAFF_PAYSLIPS: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.staffPayslipData =
          page == 1
            ? action.payload.data
            : [...state.staffPayslipData, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.staffPayslipData = [];
        }
        if( action.payload.pageCount === 0) {
          state.staffPayslipData = [];

        }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        staffPayslipData: [...state.staffPayslipData],
        api: GET_STAFF_PAYSLIPS,
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

export default PayslipReducer;
