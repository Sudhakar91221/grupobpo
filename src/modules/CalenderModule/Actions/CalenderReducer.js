import {
  API_FAILURE,
  API_START,
  GET_TODAY_EVENT,
  EVENT_DETAIL,
  GET_EVENT_ATTENDEE,
  GIVE_EVENT_ATTENDANCE,
  DELETE_EVENT,
  GET_EVENTS,
  ADD_EVENT,
  UPDATE_EVENT,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const CalenderReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case GET_TODAY_EVENT: {
      return {
        ...state,
        isLoading: false,
        error: null,
        todayEvents: action.payload.data.data,
        api: GET_TODAY_EVENT,
      };
    }

    case GET_EVENTS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        events: action.payload.data.data,
        api: GET_EVENTS,
      };
    }

    case EVENT_DETAIL: {
      return {
        ...state,
        isLoading: false,
        error: null,
        eventModel: action.payload.data.data[0],
        api: EVENT_DETAIL,
      };
    }

    case GET_EVENT_ATTENDEE: {
      return {
        ...state,
        isLoading: false,
        error: null,
        eventAttendee: action.payload.data,
        api: GET_EVENT_ATTENDEE,
      };
    }

    case GIVE_EVENT_ATTENDANCE: {
      return {
        ...state,
        isLoading: false,
        error: null,
        attendanceSuccess: 'Attendance marked successfully',
        api: GIVE_EVENT_ATTENDANCE,
      };
    }

    case DELETE_EVENT: {
      let eventsList = state.events;
      let eventIndex = eventsList
        .map(function(item) {
          return item.eventId;
        })
        .indexOf(action.payload.input.eventId);
      eventsList.splice(eventIndex, 1);
      return {
        ...state,
        isLoading: false,
        error: null,
        deleteEventSuccess: 'Event deleted successfully',
        api: DELETE_EVENT,
      };
    }

    case ADD_EVENT: {
      var eventModel = {};
      eventModel.title = action.payload.input.title;
      eventModel.flag = 1;
      eventModel.type = action.payload.input.type;
      eventModel.startTime = action.payload.input.startTime;
      eventModel.endTime = action.payload.input.endTime;
      state.events.push(eventModel);
      return {
        ...state,
        isLoading: false,
        error: null,
        eventId: action.payload.data.eventId,
        api: ADD_EVENT,
      };
    }

    case UPDATE_EVENT: {
      let eventsList = state.events;
      let eventIndex = eventsList
        .map(function(item) {
          return item.eventId;
        })
        .indexOf(action.payload.input.eventId);
      var eventData = {};
      eventData.title = action.payload.input.title;
      eventData.flag = 1;
      eventData.type = action.payload.input.type;
      eventData.startTime = action.payload.input.startTime;
      eventData.endTime = action.payload.input.endTime;
      eventsList[eventIndex] = eventData;
      return {
        ...state,
        isLoading: false,
        error: null,
        eventUpdateSuccess: 'Event updated successfully',
        api: UPDATE_EVENT,
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

export default CalenderReducer;
