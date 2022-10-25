import MemberAPI from './MemberAPI';
import {
  API_START,
  API_FAILURE,
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

//MARK: - Action Methods call from js files

export const getUsers = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getUsers(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getUserSuccess( data.data,
            input.page,
            data.pageCount));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getUserSuccess( data.data,
          input.page,
          data.pageCount));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getUserDropdown = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getUserDropdown(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getUserDropdownSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getUserDropdownSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getPersonalDropdown = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getPersonalDropdown(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getPersonalDropdownSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getPersonalDropdownSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getShiftDropdown = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getShiftDropdown(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getShiftDropdownSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getShiftDropdownSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const addMember = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.addMember(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(addMemberSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(addMemberSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const editMember = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.editMember(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(editMemberSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(editMemberSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getAddress = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getAddress(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getAddressSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getAddressSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateAddress = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.updateAddress(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(updateAddressSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(updateAddressSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getJob = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getJob(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getJobSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getJobSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateJob = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.updateJob(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(updateJobSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(updateJobSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getDesignationList = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getDesignationList(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getDesignationListSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getDesignationListSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getDepartmentList = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getDepartmentList(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getDepartmentListSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getDepartmentListSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getSalary = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getSalary(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getSalarySuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getSalarySuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateSalary = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.updateSalary(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(updateSalarySuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(updateSalarySuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getBank = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getBank(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getBankSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getBankSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateBank = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.updateBank(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(updateBankSuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(updateBankSuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getFamily = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getFamily(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getFamilySuccess(data));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getFamilySuccess(data));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const deleteFamily = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.deleteFamily(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(deleteFamilySuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(deleteFamilySuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const addFamily = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.addFamily(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(addFamilySuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(addFamilySuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const updateFamily = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.updateFamily(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(updateFamilySuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(updateFamilySuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getLeaveDropdown = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getLeaveDropdown(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getLeaveDropdownSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getLeaveDropdownSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

export const getLeaveInfo = input => dispatch => {
  var errorObject = {
    message: '',
    code: '',
    request: input.request,
  };
  dispatch(apiBegins());
  return MemberAPI.getLeaveInfo(input)
    .then(data => {
      if (data === undefined) {
        dispatch(apiFailure(errorObject));
        return;
      }

      if (data.ErrorMessage || data.code) {
        if (data.code == -1) {
          //-1 for network error
          errorObject.code = -1;
          dispatch(apiFailure(errorObject));
          return;
        }

        if (data.code == 0) {
          dispatch(getLeaveInfoSuccess(data, input));
          return;
        }
        if (data.ErrorMessage) {
          errorObject.message = data.ErrorMessage;
          errorObject.period = data.period;
          dispatch(apiFailure(errorObject));
          return;
        }
        errorObject.code = data.code;
        switch (data.code) {
          case 1:
            errorObject.message = 'All fields are mandatory';
            break;
          case 2:
            errorObject.message = 'Invalid Token';
            break;
          case 3:
            errorObject.message = 'Something went wrong';
            break;
        }

        dispatch(apiFailure(errorObject));
      } else {
        dispatch(getLeaveInfoSuccess(data, input));
      }
    })
    .catch(error => {
      throw error;
    });
};

//MARK: - Success Methods

export const getUserSuccess = (data, page, pageCount = 1) => ({
  type: GET_USERS,
  payload: {data, page, pageCount},
});

export const getUserDropdownSuccess = data => ({
  type: GET_USER_DROPDOWN,
  payload: {data},
});

export const getPersonalDropdownSuccess = data => ({
  type: GET_PERSONAL_DROPDOWN,
  payload: {data},
});

export const getShiftDropdownSuccess = data => ({
  type: GET_SHIFT_DROPDOWN,
  payload: {data},
});

export const addMemberSuccess = (data, input) => ({
  type: ADD_MEMBER,
  payload: {data, input},
});

export const editMemberSuccess = (data, input) => ({
  type: EDIT_MEMBER,
  payload: {data, input},
});

export const getAddressSuccess = (data, input) => ({
  type: GET_ADDRESS,
  payload: {data, input},
});

export const updateAddressSuccess = (data, input) => ({
  type: UPDATE_ADDRESS,
  payload: {data, input},
});

export const getJobSuccess = (data, input) => ({
  type: GET_JOB,
  payload: {data, input},
});

export const updateJobSuccess = (data, input) => ({
  type: UPDATE_JOB,
  payload: {data, input},
});

export const getDesignationListSuccess = (data, input) => ({
  type: GET_DESIGNATION,
  payload: {data, input},
});

export const getDepartmentListSuccess = (data, input) => ({
  type: GET_DEPARTMENT,
  payload: {data, input},
});

export const getSalarySuccess = data => ({
  type: GET_SALARY,
  payload: {data},
});

export const updateSalarySuccess = data => ({
  type: UPDATE_SALARY,
  payload: {data},
});

export const getBankSuccess = data => ({
  type: GET_BANK,
  payload: {data},
});

export const updateBankSuccess = data => ({
  type: UPDATE_BANK,
  payload: {data},
});

export const getFamilySuccess = data => ({
  type: GET_FAMILY,
  payload: {data},
});

export const deleteFamilySuccess = (data, input) => ({
  type: DELETE_FAMILY,
  payload: {data, input},
});

export const addFamilySuccess = (data, input) => ({
  type: ADD_FAMILY,
  payload: {data, input},
});

export const updateFamilySuccess = (data, input) => ({
  type: UPDATE_FAMILY,
  payload: {data, input},
});

export const getLeaveDropdownSuccess = (data, input) => ({
  type: GET_LEAVE_DROPDOWN,
  payload: {data, input},
});

export const getLeaveInfoSuccess = (data, input) => ({
  type: GET_LEAVE_INFO,
  payload: {data, input},
});

export const apiFailure = error => ({
  type: API_FAILURE,
  payload: {error},
});

export const apiBegins = () => ({
  type: API_START,
});
