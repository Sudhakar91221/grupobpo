import {
  API_FAILURE,
  API_START,
  GET_HOLIDAYS,
  ADD_HOLIDAY,
  DELETE_HOLIDAY,
  UPDATE_HOLIDAY,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const HolidayReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case GET_HOLIDAYS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        holidays: action.payload.data.data,
        api: GET_HOLIDAYS,
      };
    }

    case ADD_HOLIDAY: {
      var holidaymodel = {};
      holidaymodel.date = action.payload.input.date;
      holidaymodel.title = action.payload.input.title;
      holidaymodel.type = action.payload.input.type.toString();
      holidaymodel.holidayId = action.payload.data.holidayId;
      state.holidays.push(holidaymodel);
      return {
        ...state,
        isLoading: false,
        error: null,
        holidayId: action.payload.data.holidayId,
        api: ADD_HOLIDAY,
      };
    }

    case DELETE_HOLIDAY: {
      let holidaysList = state.holidays;
      let holidayIndex = holidaysList
        .map(function(item) {
          return item.holidayId;
        })
        .indexOf(action.payload.input.holidayId);
      holidaysList.splice(holidayIndex, 1);
      return {
        ...state,
        isLoading: false,
        error: null,
        holidays: holidaysList,
        message: 'Holiday deleted successfully',
        api: DELETE_HOLIDAY,
        request : action.payload.input.request
      };
    }

    case UPDATE_HOLIDAY: {
      let holidaysList = state.holidays;
      let holidayIndex = holidaysList
        .map(function(item) {
          return item.holidayId;
        })
        .indexOf(action.payload.input.holidayId);
      var holidaymodel = holidaysList[holidayIndex];
      
      if(action.payload.input.title) {
        holidaymodel.title = action.payload.input.title
      }
      if(action.payload.input.date) {
        holidaymodel.date = action.payload.input.date;
      }
      if(action.payload.input.type) {
        holidaymodel.type = action.payload.input.type.toString();
      }
      state.holidays[holidayIndex] = holidaymodel;

      return {
        ...state,
        isLoading: false,
        error: null,
        holidays: holidaysList,
        success: 'Holiday updated successfully',
        api: UPDATE_HOLIDAY,
      };
    }

    case API_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
        api: null,
        request:action.payload.request
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

export default HolidayReducer;
