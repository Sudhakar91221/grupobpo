const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const eventListSelector = state => state.todayEvents;
const eventDetailSelector = state => state.eventModel;
const eventAttendeeSelector = state => state.eventAttendee;
const eventAttendanceSelector = state => state.attendanceSuccess;
const eventDeleteSelector = state => state.deleteEventSuccess;
const getEventsSelector = state => state.events;
const addEventSelector = state => state.eventId;
const updateEventSelector = state => state.eventUpdateSuccess;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  getEventsSelector,
  eventListSelector,
  eventDetailSelector,
  eventDeleteSelector,
  eventAttendeeSelector,
  eventAttendanceSelector,
  addEventSelector,
  updateEventSelector,
};
