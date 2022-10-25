const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const getUserSelector = state => state.users;
const getUserDropdownSelector = state => state.userDropdown;
const getPersonalDropdownSelector = state => state.personalDropdown;
const getShiftDropdownSelector = state => state.shiftDropdown;
const addMemberSelector = state => state.employeeId;
const editMemberSelector = state => state.editSuccess;
const getAddressSelector = state => state.addressModel;
const updateAddressSelector = state => state.addressSuccess;
const getJobSelector = state => state.jobData;
const updateJobSelector = state => state.jobSuccess;
const getDesignationSelector = state => state.designation;
const getDepartmentSelector = state => state.department;
const getSalarySelector = state => state.salaryModel;
const updateSalarySelector = state => state.salarySuccess;
const getBankSelector = state => state.bankModel;
const updateBankSelector = state => state.bankSuccess;
const getFamilySelector = state => state.familyList;
const deleteFamilySelector = state => state.message;
const addFamilySelector = state => state.ufId;
const updateFamilySelector = state => state.familySuccess;
const leaveDropdownSelector = state => state.leaveDropdown;
const leaveInfoSelector = state => state.leaveInfo;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  getUserSelector,
  getUserDropdownSelector,
  getPersonalDropdownSelector,
  getShiftDropdownSelector,
  addMemberSelector,
  editMemberSelector,
  getAddressSelector,
  updateAddressSelector,
  getJobSelector,
  updateJobSelector,
  getDesignationSelector,
  getDepartmentSelector,
  getSalarySelector,
  updateSalarySelector,
  getBankSelector,
  updateBankSelector,
  getFamilySelector,
  deleteFamilySelector,
  addFamilySelector,
  updateFamilySelector,
  leaveDropdownSelector,
  leaveInfoSelector,
};
