import {createSelector} from 'reselect';


const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const userApiSelector = state => state.api;
const errorSelector = state => state.error;

const userRegisterSelector = state => state.user;
const userNewRegisterSelector = state => state.user;
const otpVerifySelector = state => state.registrationStatus;
const registerStepSelector = state => state.registerStep;
const commonFileUploadedSelector = state => state.fileUploaded;

const userLoginSelector = state => {
  if (state.user !== undefined) {
    // global.user = null
    return state.user;
  } else {
    
    const user = global.user;

    return (state.user = user);
  }
};

const userLogoutSelector = state => state.user

const companySelector = state => state.company;
const countryListSelector = state => state.countryData;

//we can apply local operations here

const countrySelector = createSelector([countryListSelector], CountryData => {
  let countriesList = [];

  if (CountryData === undefined) {
    return undefined;
  }
  CountryData.map(
    item =>
      (countriesList = [
        ...countriesList,
        {
          value: '+(' + item.country_code + ') ' + item.country_shortname,
          label: item.country_name + '+(' + item.country_code + ') ',
          actualValue: {id: item.country_id},
        },
      ]),
  );

  return countriesList;
});
const companyDetailSelector = createSelector([companySelector], company => {
  let companyData = [];

  if (company === undefined) {
    return undefined;
  }
  company.map(item => (companyData = [...companyData, item.name]));

  return companyData;
});

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
  userLoginSelector,
  apiSelector,
  errorSelector,
  companySelector,
  companyDetailSelector,
  countrySelector,
  userRegisterSelector,
  userApiSelector,
  otpVerifySelector,
  registerStepSelector,
  commonFileUploadedSelector,
  changePasswordSelector,
  userNewRegisterSelector,
  userLogoutSelector,
};
