import {
  API_FAILURE,
  API_START,
  FORMS_GET,
  BLOCKS_GET,
  FIELDS_GET,
  APPLICATION_GET,
  APPLICATION_DRAFT,
  APPLICATION_SUBMIT,
  APPLICATION_DETAIL,
  USER_LOGIN,
  USER_LOGOUT,
  PASSWORD_CHANGE,
  PASSWORD_SET,
  PASSWORD_FORGOT,
  OTP_VERIFY,
  OTP_RESEND,
  EMPTY_APPLICATION,
  APPLICATION_COMMENT_ADD,
  REMOVE_PHOTO,
} from './type';
import Moment from 'moment';
import SyncStorage from 'sync-storage';

const clonedeep = require('lodash.clonedeep');

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
  permissions: [],
};

const FormReducer = (state = defaultState, action) => {
  console.log('------------REDUCER-------------');

  switch (action.type) {
    case USER_LOGIN:
      var user = action.payload.data;
      user.permission.map((item, index) => {
        var permission = { id: item.id, url: item.url };
        if (state.permissions) {
          state.permissions = [...state.permissions, permission];

        } else {
          state.permissions = [permission];

        }

        if (item.rights !== undefined && item.rights.length > 0) {
          item.rights.map(rightsItem => {

            state.permissions = [...state.permissions, rightsItem];
          });
        }
      });
      SyncStorage.set('permissions', JSON.stringify(state.permissions));

      var userWithoutPermission = action.payload.data;
      delete userWithoutPermission.permission

      // global.permissions = JSON.stringify(state.permissions);

      return {
        ...state,
        isLoading: false,
        error: null,
        user: {
          ...userWithoutPermission,
          mobile: action.payload.input.phone,
          country: action.payload.input.country,
        },
        permissions: [...state.permissions],
        api: USER_LOGIN,
      };

    case USER_LOGOUT:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: null,
        blocks: undefined,
        blockModel: undefined,
        isUserLogout: true,
        permissions: null,
        api: USER_LOGOUT,
      };

    case FORMS_GET: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0) {
        state.forms =
          page == 1
            ? action.payload.data
            : [...state.forms, ...action.payload.data];
      } else {
        // if(action.payload.page <= action.payload.data.pageCount ) {
        state.forms = [];
        // }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        forms: [...state.forms],
        api: FORMS_GET,
        lastPage: action.payload.data.count,
      };
    }

    case BLOCKS_GET: {
      if (action.payload.data.length > 0) {
        if (state.blocks == undefined) {
          state.blocks = [];
        }
        state.blocks = [...action.payload.data];
      } else {
        // if(action.payload-=]page <= action.payload.data.pageCount ) {
        state.blocks = [];
        // }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        blocks: [...state.blocks],
        api: BLOCKS_GET,
        lastPage: action.payload.data.count,
      };
    }

    case FIELDS_GET: {
      var blockIndex = 0;
      let originalBlock = undefined;
      if (state.blocks === undefined) {
        blockIndex = 0;
      } else {
        blockIndex = state.blocks
          .map(function (item) {
            return item.fbId;
          })
          .indexOf(action.payload.input.blockId);
        originalBlock = state.blocks[blockIndex];
      }

      //lets take take out fields first then for that fields find out values
      let blockModel = action.payload.data;

      if (blockModel.fields !== undefined && blockModel.values !== undefined) {
        blockModel.fields.map(fieldItem => {
          //extract the same object from values

          var valueFieldIndex = blockModel.values
            .map(function (item) {
              return item.fieldId; //find from top values object
            })
            .indexOf(fieldItem.fieldId);

          var valuesItem = blockModel.values[valueFieldIndex];

          //&&
          //valuesItem.childFields !== undefined &&
          // valuesItem.childFields.length > 0
          if (
            fieldItem.childFields !== undefined &&
            fieldItem.childFields.length > 0
          ) {
            // valuesItem.childFields.map(valuesChildField => {
            fieldItem.childFields.map(function (itemChildField) {
              var valueChildFieldIndex = blockModel.values
                .map(function (item) {
                  return item.fieldId; //find from top values object
                })
                .indexOf(itemChildField.fieldId);
              var valuesChildItem = blockModel.values[valueChildFieldIndex];

              if (valuesChildItem !== undefined) {
                if (itemChildField.fieldId == valuesChildItem.fieldId) {
                  itemChildField.value = valuesChildItem.value;
                }
              }
            });
            // });

            // var matchedChildFieldIndex = fieldItem.childFields
            // .map(function(item) {
            //   return item.name; //find from top values object
            // })
            // .indexOf(fieldItem.name);
          } else {
            var valueFieldIndex = blockModel.values
              .map(function (item) {
                return item.fieldId; //find from top values object
              })
              .indexOf(fieldItem.fieldId);

            var valuesItem = blockModel.values[valueFieldIndex];

            if (valuesItem !== undefined) {
              fieldItem.value = valuesItem.value;
            }
          }
        });
      }

      if (state.blocks !== undefined) {
        let updatedBlock = {
          ...originalBlock,
          blockModel: action.payload.data,
        };
        state.blocks[blockIndex] = updatedBlock;
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        blocks: state.blocks,
        blockModel:
          state.blocks !== undefined ? action.payload.data : blockModel,
        // fields: [...state.fields],
        api: FIELDS_GET,
      };
    }

    case APPLICATION_GET: {
      const page = action.payload.page !== undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0) {
        if (state.applications == undefined) {
          state.applications = [];
        }
        state.applications =
          page == 1
            ? action.payload.data
            : [...state.applications, ...action.payload.data];
      } else {
        // if(action.payload.page <= action.payload.data.pageCount ) {
        state.applications = [];
        // }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        applications: [...state.applications],
        applicationModel: undefined,
        api: APPLICATION_GET,
        lastPage: action.payload.data.count,
      };
    }
    case APPLICATION_DRAFT: {
      //registration api
      if (action.payload.input.blockId === '5') {
        return {
          ...state,
          isLoading: false,
          error: null,
          applications: [...state.applications],
          applicationModel: state.applicationModel,
          api: APPLICATION_DRAFT,
        };
      }

      // if(state.applications === undefined) {

      //   state.applications = []
      // }
      let applications = state.applications;

      let applicationModel =
        state.applicationModel !== undefined ? state.applicationModel : {};
      // applicationModel.applicationId =
      //   state.applicationModel !== undefined
      //     ? state.applicationModel.applicationId
      //     : '';
      // applicationModel.id =
      //   state.applicationModel !== undefined
      //     ? state.applicationModel.applicationId
      //     : '';

      Object.keys(action.payload.input).map(function (key) {
        if (applicationModel !== undefined) {
          applicationModel[key] = action.payload.input[key];
        }
      });

      // applications = [action.payload.input];

      if (state.applications === undefined || state.applications.length == 0) {
        state.applications = [applicationModel];
        state.applicationModel = applicationModel;
      } else {
        var applicationIndex = state.applications
          .map(function (item) {
            return item.id;
          })
          .indexOf(action.payload.input.applicationId);

        if (applicationIndex == -1) {
          state.applicationModel = applicationModel;
          // state.applications.insert(0, applicationModel);
        } else {
          let originalApplication = state.applications[applicationIndex];

          let updatedApplication = {
            ...originalApplication,
            ...applicationModel,
          };
          // state.applications[applicationIndex] = updatedApplication;
          state.applicationModel = updatedApplication;
        }
      }

      console.log('--------Application Model is here', state.applicationModel);

      return {
        ...state,
        isLoading: false,
        error: null,
        applications: [...state.applications],
        applicationModel: state.applicationModel,
        api: APPLICATION_DRAFT,
      };
    }

    case APPLICATION_SUBMIT: {
      //registration api
      if (action.payload.input.blockId === '5') {
        if (action.payload.input.applicationId !== undefined) {
          return {
            ...state,
            isLoading: false,
            error: null,
            user: {
              ...action.payload.input,
              ...state.user,
            },
            applicationModel: undefined,
            api: APPLICATION_SUBMIT,
          };
        }
        return {
          ...state,
          isLoading: false,
          error: null,
          user: {
            ...action.payload.data,
            mobile: action.payload.input.mobile,
            country: action.payload.input.country,
            fName: action.payload.input.fName,
            // status:action.payload.
            // token:action.payload.input.token,
          },
          applicationModel: undefined,
          api: APPLICATION_SUBMIT,
        };
      }

      // if(state.applications === undefined) {

      //   state.applications = []
      // }
      let applications = state.applications;

      let applicationModel =
        state.applicationModel !== undefined
          ? clonedeep(state.applicationModel)
          : { test: 'test' };
      // applicationModel.screenNo =  action.payload.input.blockId
      applicationModel.applicationId =
        action.payload.data.applicationId !== undefined
          ? action.payload.data.applicationId
          : undefined;
      applicationModel.id =
        action.payload.data.applicationId !== undefined
          ? action.payload.data.applicationId
          : '';
      applicationModel.title =
        state.applicationModel !== undefined
          ? state.applicationModel.BusinessName !== undefined
            ? state.applicationModel.BusinessName
            : 'Business Permit'
          : action.payload.input.BusinessName;
      applicationModel.postUpdateTime = 'Just Now';
      applicationModel.status = 'Draft';

      Object.keys(action.payload.input).map(function (key) {
        if (applicationModel !== undefined) {
          applicationModel[key] = action.payload.input[key];
        }
      });

      // applications = [action.payload.input];

      if (state.applications === undefined || state.applications.length == 0) {
        state.applications = [applicationModel];
        state.applicationModel = applicationModel;
      } else {
        var applicationIndex = state.applications
          .map(function (item) {
            return item.id;
          })
          .indexOf(action.payload.data.applicationId);

        if (applicationIndex == -1) {
          applicationIndex = state.applications
            .map(function (item) {
              return item.applicationId;
            })
            .indexOf(action.payload.data.applicationId);
        }

        if (applicationIndex == -1) {
          state.applications.insert(0, applicationModel);
          state.applicationModel = applicationModel;
        } else {
          let originalApplication = state.applications[applicationIndex];

          let updatedApplication = {
            ...applicationModel,
            ...originalApplication,
          };
          state.applications[applicationIndex] = updatedApplication;
          state.applicationModel = updatedApplication;
        }
      }
      //Update application id to repspected block
      //     var blockIndex = state.blocks
      //     .map(function(item) {
      //       return item.fbId;
      //     })
      //     .indexOf(action.payload.input.blockId);

      //   const originalBlcok = state.blocks[blockIndex];

      //   let udatedBlock = {
      //     ...originalBlcok,
      //     blockModel: action.payload.data,
      //   };
      // state.blocks[blockIndex] = udatedBlock;

      console.log('--------Application Model is here', state.applicationModel);
      //  = updatedApplication;

      return {
        ...state,
        isLoading: false,
        error: null,
        applications: [...state.applications],
        applicationModel: state.applicationModel,
        api: APPLICATION_SUBMIT,
      };
    }

    case APPLICATION_DETAIL: {
      state.applicationModel = action.payload.data;
      return {
        ...state,
        isLoading: false,
        error: null,
        applicationDetail: state.applicationModel,
        api: APPLICATION_DETAIL,
      };
    }

    case APPLICATION_COMMENT_ADD: {
      let applicationDetail = state.applicationModel;
      let commentModel = {
        remark: action.payload.input.comment,
        addedOn: action.payload.data.addedOn,
        addedBy: action.payload.input.userId,
      };

      if (applicationDetail.comment !== undefined) {
        if (applicationDetail.comment.length === 0) {
          applicationDetail.comment = [commentModel];
        } else {
          applicationDetail.comment.insert(0, commentModel);
        }
      } else {
        applicationDetail.comment = [commentModel];
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        applicationDetail: applicationDetail,
        api: APPLICATION_COMMENT_ADD,
        message: 'Comment added successfully !!!',
      };
    }

    case OTP_VERIFY:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: OTP_VERIFY,
        user: {
          ...state.user,
          status: action.payload.data.status,
        },
      };

    case OTP_RESEND:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: OTP_RESEND,
        user: {
          ...state.user,
          otp: action.payload.data.otp,
        },
      };

    case PASSWORD_SET:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: PASSWORD_SET,
        user: {
          ...state.user,
          status: action.payload.data.status,
          isFromForgot: false,
        },
      };

    case PASSWORD_FORGOT:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: PASSWORD_FORGOT,
        user: {
          ...action.payload.data,
          status: -1,
          mobile: action.payload.input.mobile,
          country: action.payload.input.country,
          email: action.payload.input.email,
          isFromForgot: true,
        },
      };

    case PASSWORD_CHANGE:
      return {
        ...state,
        isLoading: false,
        error: null,
        api: PASSWORD_CHANGE,
        user: {
          ...state.user,
        },
      };

    case EMPTY_APPLICATION: {
      return {
        ...state,
        isLoading: false,
        error: null,
        applicationModel: undefined,
        applications: state.applications,
        api: EMPTY_APPLICATION,
      };
    }

    case REMOVE_PHOTO: {
      return {
        ...state,
        isLoading: false,
        error: null,
        success: 'Remove photo success',
        user: {
          ...action.payload.data,
          photo: null,
        },
        api: REMOVE_PHOTO,
      };
    }

    case API_START:
      return {
        ...state,
        isLoading: true,
        api: state.api,
        error: null,
      };

    case API_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
        api: state.api,
      };

    default:
      return {
        ...state,
        error: null,
        isLoading: false,
        api: null,
      };
  }
};

export default FormReducer;
