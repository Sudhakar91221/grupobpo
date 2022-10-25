import {
  API_FAILURE,
  API_START,
  GET_USERS,
  GET_USER_DROPDOWN,
  GET_PERSONAL_DROPDOWN,
  GET_SHIFT_DROPDOWN,
  ADD_MEMBER,
  EDIT_MEMBER,
  GET_ADDRESS,
  UPDATE_ADDRESS,
  GET_JOB,
  UPDATE_JOB,
  GET_DESIGNATION,
  GET_DEPARTMENT,
  GET_SALARY,
  UPDATE_SALARY,
  GET_BANK,
  UPDATE_BANK,
  GET_FAMILY,
  DELETE_FAMILY,
  ADD_FAMILY,
  UPDATE_FAMILY,
  GET_LEAVE_DROPDOWN,
  GET_LEAVE_INFO,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const MemberReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {


    case GET_USERS: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.users =
          page == 1
            ? action.payload.data
            : [...state.users, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.users = [];
        }
        if( action.payload.pageCount === 0) {
          state.users = [];

        }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        users: [...state.users],
        api: GET_USERS,
      };
    }

    case GET_USER_DROPDOWN: {
      return {
        ...state,
        isLoading: false,
        error: null,
        userDropdown: action.payload.data.usersList,
        api: GET_USER_DROPDOWN,
      };
    }

    case GET_PERSONAL_DROPDOWN: {
      return {
        ...state,
        isLoading: false,
        error: null,
        personalDropdown: action.payload.data,
        api: GET_PERSONAL_DROPDOWN,
      };
    }

    case GET_SHIFT_DROPDOWN: {
      return {
        ...state,
        isLoading: false,
        error: null,
        shiftDropdown: action.payload.data,
        api: GET_SHIFT_DROPDOWN,
      };
    }

    case ADD_MEMBER: {
      var memberModel = {};
      memberModel.code = action.payload.data.employeeId;
      memberModel.photo = null;
      memberModel.firstName = action.payload.input.firstName;
      memberModel.lastName = action.payload.input.lastName;
      memberModel.designation = action.payload.input.designation;
      memberModel.userGroup = {};
      memberModel.userGroup.name = action.payload.input.designation;
      state.users.push(memberModel);
      return {
        ...state,
        isLoading: false,
        error: null,
        employeeId: action.payload.data.employeeId,
        api: ADD_MEMBER,
      };
    }

    case EDIT_MEMBER: {
      return {
        ...state,
        isLoading: false,
        error: null,
        editSuccess: action.payload.data.employeeId,
        api: EDIT_MEMBER,
      };
    }

    case GET_ADDRESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        addressModel: action.payload.data,
        api: GET_ADDRESS,
      };
    }

    case UPDATE_ADDRESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        addressSuccess: 'Address updated successfully',
        api: UPDATE_ADDRESS,
      };
    }

    case GET_JOB: {
      return {
        ...state,
        isLoading: false,
        error: null,
        jobData: action.payload.data,
        api: GET_JOB,
      };
    }

    case UPDATE_JOB: {
      return {
        ...state,
        isLoading: false,
        error: null,
        jobSuccess: 'Job updated successfully',
        api: UPDATE_JOB,
      };
    }

    case GET_DESIGNATION: {
      return {
        ...state,
        isLoading: false,
        error: null,
        designation: action.payload.data,
        api: GET_DESIGNATION,
      };
    }

    case GET_DEPARTMENT: {
      return {
        ...state,
        isLoading: false,
        error: null,
        department: action.payload.data,
        api: GET_DEPARTMENT,
      };
    }

    case GET_SALARY: {
      return {
        ...state,
        isLoading: false,
        error: null,
        salaryModel: action.payload.data,
        api: GET_SALARY,
      };
    }

    case UPDATE_SALARY: {
      return {
        ...state,
        isLoading: false,
        error: null,
        salarySuccess: 'Salary updated successfully',
        api: UPDATE_SALARY,
      };
    }

    case GET_BANK: {
      return {
        ...state,
        isLoading: false,
        error: null,
        bankModel: action.payload.data,
        api: GET_BANK,
      };
    }

    case UPDATE_BANK: {
      return {
        ...state,
        isLoading: false,
        error: null,
        bankSuccess: 'Bank updated successfully',
        api: UPDATE_BANK,
      };
    }

    case GET_FAMILY: {
      return {
        ...state,
        isLoading: false,
        error: null,
        familyList: action.payload.data,
        api: GET_FAMILY,
      };
    }

    case DELETE_FAMILY: {
      let familyList = state.familyList.data;
      let index = familyList
        .map(function(item) {
          return item.ufId;
        })
        .indexOf(action.payload.input.ufId);
      familyList.splice(index, 1);
      return {
        ...state,
        isLoading: false,
        error: null,
        familyList: familyList,
        message: 'Member deleted successfully',
        api: DELETE_FAMILY,
      };
    }

    case ADD_FAMILY: {
      var memberModel = {};
      memberModel.relation = action.payload.input.relation;
      memberModel.dob = action.payload.input.dob;
      memberModel.age =
        action.payload.input.year + 'y ' + action.payload.input.month + 'm';
      state.familyList.data.push(memberModel);
      return {
        ...state,
        isLoading: false,
        error: null,
        ufId: action.payload.data.ufId,
        api: ADD_FAMILY,
      };
    }

    case UPDATE_FAMILY: {
      var memberModel = {};
      memberModel.relation = action.payload.input.relation;
      memberModel.dob = action.payload.input.dob;
      memberModel.age =
        action.payload.input.year + 'y ' + action.payload.input.month + 'm';
      let familyList = state.familyList.data;
      let index = familyList
        .map(function(item) {
          return item.ufId;
        })
        .indexOf(action.payload.input.ufId);
      familyList[index] = memberModel;
      return {
        ...state,
        isLoading: false,
        error: null,
        familyList: familyList,
        familySuccess: 'Family member updated successfully',
        api: UPDATE_FAMILY,
      };
    }

    case GET_LEAVE_DROPDOWN: {
      return {
        ...state,
        isLoading: false,
        error: null,
        leaveDropdown: action.payload.data.data,
        api: GET_LEAVE_DROPDOWN,
      };
    }

    case GET_LEAVE_INFO: {
      return {
        ...state,
        isLoading: false,
        error: null,
        leaveInfo: action.payload.data.data,
        api: GET_LEAVE_INFO,
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

export default MemberReducer;
