import React from 'react';
import { NetInfo, Alert } from 'react-native';
// import APIManager from './APIManager';
import {
  API_KEY,
  BASE_URL,
  SUPPORT_URL,
  SUPPORT_API_KEY,
  COMPANY_DOMAIN_API_KEY,
  COMPANY_DOMAIN_URL,
  COMMON_APP_URL_OLYMPIC,
} from './config';
import Console from '../components/common/CustomConsole';
import axios from 'axios';
// import { TIMESHEET_CHECKOUT } from '../../Modules/Timesheet/TimesheetModule/Actions/type';
const FETCH_TIMEOUT = 200000;
let didTimeOut = false;
var housecall = require('./queue.js');
var queue = housecall({ concurrency: 1, cooldown: 1000 });
import {
  COMPANY_DOMAIN,
  COUNTRY_GET,
  COMMON_FILE_UPLOAD,
  USER_LOGIN,
} from '../modules/AuthModule/Actions/type';
import CountryData from '../components/common/Country/CountryList.json';
// import {PRODUCT_GET} from '../modules/ProductModule/Actions/type';
// import {NEWSFEED_GET, JOBLIST_GET} from '../modules/NewsModule/Actions/type';
// import {REPORT_GET} from '../modules/ReportModule/Actions/type';
import {
  FORMS_GET,
  BLOCKS_GET,
  APPLICATION_GET,
  APPLICATION_DRAFT,
  EMPTY_APPLICATION,
} from '../modules/FormsComponent/Actions/type';
import { NOTIFICATION_GET } from '../modules/NotificationModule/Actions/type';
import { HOME_GET } from '../modules/HomeModule/Actions/type';

export const requestHeader = {
  'x-api-key': '123456',
  //  'Content-Type': 'multipart/form-data',
  'Content-Type':
    'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
};
export const requestHeaderSupport = {
  'x-api-key': SUPPORT_API_KEY,
  //  'Content-Type': 'multipart/form-data',
  'Content-Type':
    'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
};
export const RequestType = {
  GET: 'GET',
  POST: 'POST',
};

export function apiCall(
  request,
  inputData,
  type,
  requestType,
  isSupport,
  cancelToken,
) {
  console.log('test me test me ', BASE_URL);
  let url = BASE_URL + request;
  let requestHeaderNew = {
    'x-api-key': API_KEY,
    'Content-Type':
      'multipart/form-data; charset=utf-8; boundary="another cool boundary"',
    'Accept': "application/json",
    // 'Cache-Control': 'no-cache, no-store, must-revalidate',
    // 'Pragma': 'no-cache',
    // 'Expires': 0,


  };
  var form_data = new FormData();
  const getRequest = requestType === RequestType.GET ? true : false;

  if (type === COUNTRY_GET) {
    return import('../components/common/Country/CountryList.json').then(
      responseJson => {
        Console.localResponse(responseJson.default.data);
        return responseJson.default.data;
      },
    );
  }

  //Single app with multiple domain and theme
  if (type === COMPANY_DOMAIN) {
    url = COMPANY_DOMAIN_URL;
    requestHeaderNew = {
      'x-api-key': COMPANY_DOMAIN_API_KEY,
      'Content-Type':
        'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
      'Accept': "application/json",
      // 'Cache-Control': 'no-cache, no-store, must-revalidate',
      // 'Pragma': 'no-cache',
      // 'Expires': 0,


    };
  } else if (isSupport === true) {
    url = SUPPORT_URL + request;
    requestHeaderNew = {
      'x-api-key': SUPPORT_API_KEY,
      'Content-Type':
        'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
      'Accept': "application/json",
      // 'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0,

    };
  }
  // else

  // if (type === COMMON_FILE_UPLOAD) {
  //   url = BASE_URL + request;
  //   requestHeaderNew = {
  //     'x-api-key': API_KEY,
  //     'Content-Type':
  //       'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
  //   };
  // }

  //MARK: - this is for data stubbing from jsonz

  switch (type) {
    // case USER_LOGIN:
    //   return import('../modules/AuthModule/Actions/login.json').then(
    //     responseJson => {
    //       Console.localResponse(responseJson.default);
    //       return responseJson.default;
    //     },
    //   );

    case FORMS_GET:
      return import('../modules/FormsComponent/Actions/Forms.json').then(
        responseJson => {
          Console.localResponse(responseJson.default);
          return responseJson.default;
        },
      );
    // case NOTIFICATION_GET:
    //   return import('../modules/NotificationModule/Actions/Notification.json')
    //     .then()
    //     .then(responseJson => {
    //       Console.localResponse(responseJson.default);
    //       return responseJson.default;
    //     });
    // case HOME_GET:
    //   return import('../modules/NotificationModule/Actions/Notification.json')
    //     .then()
    //     .then(responseJson => {
    //       Console.localResponse(responseJson.default);
    //       return responseJson.default;
    //     });
    case APPLICATION_DRAFT:
      return import('../modules/FormsComponent/Actions/Application.json').then(
        responseJson => {
          Console.localResponse(responseJson.default);
          return responseJson.default;
        },
      );

    case EMPTY_APPLICATION:
      return import('../modules/FormsComponent/Actions/Application.json').then(
        responseJson => {
          Console.localResponse(responseJson.default);
          return responseJson.default;
        },
      );
  }

  Console.apiUrl(url);
  Console.apiParams(inputData);

  if (requestType === RequestType.GET) {
    for (var key in inputData) {
      url = url + '/';
      url = url + inputData[key];
      console.log(url);
    }
  } else {
    for (var key in inputData) {
      //TODO://poonam
      // if(inputData[key] !== undefined) {

      // }
      form_data.append(key, inputData[key]);
    }
    console.log(form_data);
  }
  console.log(requestType);

  if (requestType === RequestType.GET) {
    return axios
      .get(url, {
        headers: requestHeaderNew,
        timeout: FETCH_TIMEOUT,
        requestId: cancelToken,
      })
      .then(response => {
        console.log('---------------------------------------------');
        console.log('what is the actual responce is here = = ', response.data);
        console.log('status ===>' + response.status);
        console.log('url ===>' + response.request._url);
        if (response.config.data !== undefined) {
          console.log('input ===>' + response.config.data._parts);
        }
        console.log('---------------------------------------------');

        if (response.data === undefined) {
          console.log(response.data);
          return { code: 0 };
        }
        return response.data;
      })
      .catch(error => {
        console.log('------------------error---------------------------');
        console.log(error);
        console.log('message ===>' + error.message);
        console.log('status ===>' + error.request.status);
        console.log('url ===>' + error.request._url);

        if (error.response !== undefined) {
          console.log('input ===>' + error.response.config.data._parts);
        }
        if (error.request.config !== undefined) {
          console.log('input ===>' + error.request.config.data._parts);
        }
        if (error.request.config.data !== undefined) {
          console.log('input ===>' + error.request.config.data._parts);
        }

        if (axios.isCancel(error)) {
          console.log('Request canceled', error);
          return undefined;
        }

        if (
          error.message === 'Network Error' ||
          error.code === 'ECONNABORTED'
        ) {
          return { code: -1, message: 'Network error' };
        }
        if (error.response.status === 500) {
          // Alert.alert('Something went wrong on server');
          return { ErrorMessage: 'Something went wrong on server' };
        } else if (error.response.status === 404) {
          // Alert.alert('Bad Requests');
          return { ErrorMessage: 'Bad Requests' };
        } else if (error.response.status === 403) {
          // Alert.alert('May be wrong x-api-key');
          return { ErrorMessage: 'May be wrong x-api-key' };
        } else if (error.response.status === 400) {
          console.log('check here');
          console.log(error.response.data);

          if (
            error.response.data.ErrorMessage != null ||
            error.response.data.ErrorMessage != ''
          ) {
            // if(requestType === TIMESHEET_CHECKOUT && error.response.data.ErrorMessage === "-1") {
            //   Alert.alert('Total working hours can not exceed 20 hours.')
            //   return undefined
            // }\
            console.log(error.response.data.ErrorMessage);
            // Alert.alert(error.response.data.ErrorMessage)
            return error.response.data;
            // Alert.alert(error.response.data.ErrorMessage)
          } else {
            return error.response.data;
          }
        }

        if (
          error.response.ErrorMessage != null ||
          error.response.ErrorMessage != ''
        ) {
          console.log('..........No code returned here..............');
          return error.response.data;
        }
        console.log('---------------------------------------------');
        // throw(error);
        return undefined;
      });
  } else {
    return axios
      .post(url, form_data, {
        headers: requestHeaderNew,
        timeout: FETCH_TIMEOUT,
        requestId: cancelToken,

        onUploadProgress: p => {
          let progress = p.loaded / p.total;
          return { progress: progress };
        },
      })
      .then(response => {
        console.log('---------------------------------------------');
        console.log('what is the actual responce is here = = ', response.data);
        console.log('status ===>' + response.status);
        console.log('url ===>' + response.request._url);
        console.log('input ===>' + response.config.data._parts);
        console.log('---------------------------------------------');

        if (response.data === undefined || response.data === '') {
          console.log(response.data);
          return { code: 0 };
        }

        return response.data ? response.data : undefined;
      })
      .catch(error => {
        console.log('------------------error---------------------------');
        console.log(error);
        console.log('message ===>' + error.message);
        console.log('status ===>' + error.request.status);
        console.log('url ===>' + error.request._url);
        if (error.response !== undefined) {
          console.log('input ===>' + error.response.config.data._parts);
        }
        if (error.request.config !== undefined) {
          console.log('input ===>' + error.request.config.data._parts);
        }
        console.log('------------------error---------------------------');

        if (axios.isCancel(error)) {
          console.log('Request canceled', error);
          return undefined;
        }

        if (
          error.message === 'Network Error' ||
          error.code === 'ECONNABORTED'
        ) {
          // Alert.alert('Network error');
          return { code: -1, message: 'Network error' };

          //return undefined
          //return {code: -1}; //TODO:
        }

        if (error.response.status === 500) {
          // Alert.alert('Something went wrong on server');
          return { ErrorMessage: 'Something went wrong on server' };
        } else if (error.response.status === 404) {
          // Alert.alert('Bad Requests');
          return { ErrorMessage: 'Bad Requests' };
        } else if (error.response.status === 403) {
          // Alert.alert('May be wrong x-api-key');
          return { ErrorMessage: 'May be wrong x-api-key' };
        } else if (error.response.status === 400) {
          console.log('check here');
          console.log(error.response.data);

          if (
            error.response.data.ErrorMessage != null ||
            error.response.data.ErrorMessage != ''
          ) {
            // if(requestType === TIMESHEET_CHECKOUT && error.response.data.ErrorMessage === "-1") {
            //   Alert.alert('Total working hours can not exceed 20 hours.')
            //   return undefined
            // }\
            console.log(error.response.data.ErrorMessage);
            // Alert.alert(error.response.data.ErrorMessage)
            return error.response.data;
            // Alert.alert(error.response.data.ErrorMessage)
          } else {
            return error.response.data;
          }
        }
        if (
          error.response.ErrorMessage != null ||
          error.response.ErrorMessage != ''
        ) {
          console.log('..........No code returned here..............');
          console.log(error.response);
          return error.response.data;
        }

        console.log('---------------------------------------------');
        // throw(error);
        return undefined;
      });
  }
}

//TODO: need to change this logic
export async function isPermissionAllowed(id) {
  // let permission = JSON.parse(await AsyncStorage.getItem('permissions'));
  // if (permission.includes(id)) {
  //   return true;
  // }
  // return false;
  return true;
}

export const PermissionHelper = [
  { id: '1', url: 'Holiday' },
  { id: '2', url: 'Holiday/get' },
  { id: '3', url: 'Holiday/add' },
  { id: '4', url: 'Holiday/update' },
  { id: '5', url: 'Holiday/delete' },
  { id: '6', url: 'Announcement' },
  { id: '7', url: 'Announcement/get' },
  { id: '8', url: 'Announcement/add' },
  { id: '10', url: 'Announcement/delete' },
  { id: '9', url: 'Announcement/update' },
  { id: '16', url: 'Leavegroup' },
  { id: '18', url: 'Leavegroup/add' },
  { id: '20', url: 'Leavegroup/delete' },
  { id: '19', url: 'Leavegroup/update' },
  { id: '17', url: 'Leavegroup/get' },
  { id: '21', url: 'Leavetype' },
  { id: '23', url: 'Leavetype/add' },
  { id: '25', url: 'Leavetype/delete' },
  { id: '22', url: 'Leavetype/get' },
  { id: '24', url: 'Leavetype/update' },
  { id: '120', url: 'Leavetype/actdeact' },
  { id: '26', url: 'Staff' },
  { id: '27', url: 'Employee/getUsers' },
  { id: '28', url: 'Employee/add' },
  { id: '29', url: 'Employee/edit' },
  { id: '30', url: 'Employee/delete' },
  { id: '31', url: 'Shift' },
  { id: '36', url: 'Department' },
  { id: '84', url: 'Salary' },
  { id: '101', url: 'Salary/getMySalaries' },
  { id: '100', url: 'Salary/getStaffSalaries' },
  { id: '86', url: 'Album' },
  { id: '89', url: 'Album/moveImages' },
  { id: '92', url: 'Album/uploadImage' },
  { id: '87', url: 'Album/create' },
  { id: '88', url: 'Album/delete' },
  { id: '90', url: 'Album/removeImages' },
  { id: '91', url: 'Album/get' },
  { id: '102', url: 'Occurrence Type' },
  { id: '66', url: 'Directory' },
  { id: '71', url: 'Employee/get' },
  { id: '11', url: 'Event' },
  { id: '12', url: 'Event/get' },
  { id: '13', url: 'Event/add' },
  { id: '14', url: 'Event/update' },
  { id: '15', url: 'Event/delete' },
  { id: '68', url: 'Event/giveEventResponce' },
  { id: '93', url: 'Feedback' },
  { id: '96', url: 'Feedback/add' },
  { id: '94', url: 'Feedback/getMyList' },
  { id: '97', url: 'Feedback/detail' },
  { id: '65', url: 'StaffRequests' },
  { id: '64', url: 'Requests/reply' },
  { id: '70', url: 'Requests/getHRReq' },
  { id: '106', url: 'Requests/acceptDeclineRequest' },
  { id: '58', url: 'StaffTimesheets' },
  { id: '77', url: 'Timesheet/givedayApproval' },
  { id: '67', url: 'Timesheet/getStafftimesheet' },
  { id: '73', url: 'Setting/index' },
  { id: '54', url: 'Checkin/outModule' },
  { id: '76', url: 'Timesheet/submitTimesheet' },
  { id: '75', url: 'Timesheet/givereason' },
  { id: '72', url: 'Timesheet/updateCheckout' },
  { id: '55', url: 'Timesheet/checkin' },
  { id: '56', url: 'Timesheet/get' },
  { id: '80', url: 'OccuranceReport' },
  { id: '82', url: 'OccuranceReport/get' },
  { id: '105', url: 'OccuranceReport/add' },
  { id: '119', url: 'OccuranceReport/delete' },
  { id: '117', url: 'Staff occurrences' },
  { id: '83', url: 'OccuranceReport/approve' },
  { id: '81', url: 'OccuranceReport/getStaffOccurance' },
  { id: '43', url: 'Leave' },
  { id: '45', url: 'Leave/apply' },
  { id: '46', url: 'Leave/update' },
  { id: '44', url: 'Leave/getMyLeaves' },
  { id: '47', url: 'Leave/cancel' },
  { id: '48', url: 'Staffleave' },
  { id: '49', url: 'Leave/getStaffLeaves' },
  { id: '53', url: 'Leave/approve' },
  { id: '50', url: 'Leave/applyStaffLeave' },
  { id: '51', url: 'Leave/updateStaffLeave' },
  { id: '52', url: 'Leave/cancel' },
  { id: '59', url: 'Requests' },
  { id: '63', url: 'Requests/delete' },
  { id: '61', url: 'Requests/add' },
  { id: '62', url: 'Requests/update' },
  { id: '60', url: 'Requests/getEmployeeReq' },
];
