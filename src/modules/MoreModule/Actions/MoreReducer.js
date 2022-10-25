import {
  API_FAILURE,
  API_START,
  FAQ_GET,
  FEEDBACK_ADD,
  FEEDBACK_GET,
  FEEDBACK_UPDATE,
  GET_MY_ADS,
  VIEW_MY_AD,
  AD_STATISTICS,
  VIEW_AD,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
  FAQList: [],
  adStatistics: undefined,
};

const MoreReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case FAQ_GET: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0) {
        state.FAQList =
          page == 1
            ? action.payload.data
            : [...state.FAQList, ...action.payload.data];
      } else {
        // if(action.payload.page <= action.payload.data.pageCount ) {
        state.FAQList = [];
        // }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        FAQList: [...state.FAQList],
        api: FAQ_GET,
      };
    }

    case FEEDBACK_ADD:
      return {
        ...state,
        error: null,
        feedbackAddSuccess: action.payload.data,
        isLoading: false,
        api: FEEDBACK_ADD,
      };

    case FEEDBACK_GET:
      let feedback = {
        data: {},
      };
      if (action.payload.data === undefined) {
        feedback.data.id = '';
        feedback.data.rating = 3;
        feedback.data.desc = '';
        feedback.data.categoryId = 1;
      } else {
        feedback = action.payload.data;
      }
      feedback.feedbackCategory = action.payload.feedbackCategory;
      return {
        ...state,
        error: null,
        feedbackModel: feedback,
        isLoading: false,
        api: FEEDBACK_GET,
      };

    case FEEDBACK_UPDATE:
      return {
        ...state,
        error: null,
        feedbackModel: action.payload.data,
        successMessage: 'Feedback updated successfully !!!',
        isLoading: false,
        api: FEEDBACK_UPDATE,
      };

    case GET_MY_ADS: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0) {
        state.myAdsList =
          page == 1
            ? action.payload.data
            : [...state.myAdsList, ...action.payload.data];
      } else {
        // if(action.payload.page <= action.payload.data.pageCount ) {
        state.myAdsList = [];
        // }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        myAdsList: [...state.myAdsList],
        api: GET_MY_ADS,
      };
    }

    case VIEW_MY_AD:
      return {
        ...state,
        error: null,
        myAdModel: action.payload.data,
        isLoading: false,
        api: VIEW_MY_AD,
      };

    case AD_STATISTICS:
      return {
        ...state,
        error: null,
        adStatistics: action.payload.data,
        isLoading: false,
        api: AD_STATISTICS,
      };

    case VIEW_AD:
      return {
        ...state,
        error: null,
        adModel: action.payload.data,
        isLoading: false,
        api: VIEW_AD,
      };

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

export default MoreReducer;
