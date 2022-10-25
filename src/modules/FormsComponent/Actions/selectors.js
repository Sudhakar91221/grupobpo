import {createSelector} from 'reselect';

const isLoadingSelector = state => state.isLoading;
const formListSelector = state => state.forms;
const blockListSelector = state => state.blocks;
const registerBlockListSelector = state => state.registerBlock;
const fieldsListSelector = state => state.blockModel;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const applicationsListSelector = state => state.applications;
const applicationSubmitSelector = state => state.applicationModel;
const userRegisterSelector = state => state.user;
const profileBlockListSelector = state => state.blocks;
const applicationDetailSelector = state => state.applicationDetail;
const userLoginSelector = state => state.user;
const userLogoutSelector = state => state.isUserLogout;
const otpVerifySelector = state => state.registrationStatus;
const registerStepSelector = state => state.registerStep;
const emptyApplicationSelector = state => state.applicationModel;
const applicationCommentAddSelector = state => state.message;
const permissionListSelector = state => state.permissions;
const removePhotoSelector = state => state.success;

const changePasswordSelector = state => {
  if (state.user !== undefined) {
    // global.user = null
    return state.user;
  } else {
    const user = global.user;

    return (state.user = user);
  }
};

export {
  isLoadingSelector,
  formListSelector,
  blockListSelector,
  fieldsListSelector,
  apiSelector,
  errorSelector,
  applicationsListSelector,
  applicationSubmitSelector,
  registerBlockListSelector,
  userRegisterSelector,
  profileBlockListSelector,
  applicationDetailSelector,
  userLoginSelector,
  userLogoutSelector,
  otpVerifySelector,
  changePasswordSelector,
  registerStepSelector,
  emptyApplicationSelector,
  applicationCommentAddSelector,
  permissionListSelector,
  removePhotoSelector,
};
