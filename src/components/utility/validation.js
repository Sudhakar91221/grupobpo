export const validateField = (val, rules, connectedValue) => {
  let isValid = true;
  for (let rule in rules) {
    switch (rule) {
      case 'isEmail':
        isValid = isValid && emailValidator(val);
        break;
      case 'minLength':
        isValid = isValid && minLengthValidator(val, rules[rule]);
        break;
      case 'maxLength':
        isValid = isValid && maxLengthValidator(val, rules[rule]);
        break;
      case 'equalTo':
        isValid = isValid && equalToValidator(val, rules[rule], connectedValue);
        break;
      case 'notEmpty':
        isValid = isValid && notEmptyValidator(val);
        break;
      case 'numberOnly':
        isValid = isValid && numberOnlyValidator(val);
        break;
      case 'isUrl':
        isValid = isValid && urlValidator(val);
        break;
      default:
        isValid = true;
    }
  }

  return isValid;
};

const emailValidator = val => {
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    val,
  );
};

const urlValidator = val => {
  return /^([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+(\.[a-zA-Z0-9]+))$/.test(val);
};

const numberOnlyValidator = val => {
  return /^\d+$/.test(val);
};
const minLengthValidator = (val, minLength) => {
  return val.length >= minLength;
};

const maxLengthValidator = (val, maxLength) => {
  return val.length <= maxLength;
};
const equalToValidator = (val, equalTo, checkValue) => {
  return val == checkValue;
};

const notEmptyValidator = val => {
  return val.trim() !== '';
};

export const emptyRule = {
  validationRules: {
    notEmpty: true,
  },
};

export const passwordRule = {
  validationRules: {
    equalTo: true,
    // minLength: 3,
    // maxLength: 6,
  },
};
export const emailRule = {
  validationRules: {
    isEmail: true,
    notEmpty: true,
  },
};

export const mobileRule = {
  validationRules: {
    minLength: 10,
    notEmpty: true,
  },
};
export const numberOnlyRule = {
  validationRules: {
    numberOnly: true,
  },
};

export const urlRule = {
  validationRules: {
    isUrl: true,
    notEmpty: true,
  },
};
