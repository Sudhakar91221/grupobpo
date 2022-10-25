import {
  API_FAILURE,
  API_START,
  GET_ANNOUNCEMENTS_PUBLISHED,
  GET_ANNOUNCEMENTS_UPCOMING,
  ADD_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const AnnouncementReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case GET_ANNOUNCEMENTS_PUBLISHED: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.publishedAnnouncements =
          page == 1
            ? action.payload.data
            : [...state.publishedAnnouncements, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.publishedAnnouncements = [];
        }
        if( action.payload.pageCount === 0) {
          state.publishedAnnouncements = [];

        }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        publishedAnnouncements: [...state.publishedAnnouncements],
        api: GET_ANNOUNCEMENTS_PUBLISHED,
      };
    }

    case GET_ANNOUNCEMENTS_UPCOMING: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.upcomingAnnouncements =
          page == 1
            ? action.payload.data
            : [...state.upcomingAnnouncements, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.upcomingAnnouncements = [];
        }
        if( action.payload.pageCount === 0) {
          state.upcomingAnnouncements = [];

        }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        upcomingAnnouncements: [...state.upcomingAnnouncements],
        api: GET_ANNOUNCEMENTS_UPCOMING,
      };
    }

    case ADD_ANNOUNCEMENT: {
      var announcementModel = {};
      announcementModel.title = action.payload.input.title;
      announcementModel.date = action.payload.input.date;
      announcementModel.details = action.payload.input.details;
      announcementModel.type = action.payload.input.type;
      announcementModel.attachment = action.payload.input.attachment;
      state.upcomingAnnouncements.push(announcementModel);
      return {
        ...state,
        isLoading: false,
        error: null,
        announcementId: action.payload.data.announcementId,
        api: ADD_ANNOUNCEMENT,
      };
    }

    case DELETE_ANNOUNCEMENT: {
      let announcementsList = state.upcomingAnnouncements;
      let announcementIndex = announcementsList
        .map(function(item) {
          return item.announcementId;
        })
        .indexOf(action.payload.input.announcementId);
      announcementsList.splice(announcementIndex, 1);
      return {
        ...state,
        isLoading: false,
        error: null,
        upcomingAnnouncements: announcementsList,
        message: 'Announcement deleted successfully',
        api: DELETE_ANNOUNCEMENT,
      };
    }

    case UPDATE_ANNOUNCEMENT: {
      let announcementsList = state.upcomingAnnouncements;
      let announcementIndex = announcementsList
        .map(function(item) {
          return item.announcementId;
        })
        .indexOf(action.payload.input.announcementId);
      var announcementmodel = {};
      announcementmodel.date = action.payload.input.date;
      announcementmodel.title = action.payload.input.title;
      announcementmodel.details = action.payload.input.details;
      announcementsList[announcementIndex] = announcementmodel;

      return {
        ...state,
        isLoading: false,
        error: null,
        upcomingAnnouncements: announcementsList,
        success: 'announcement updated successfully',
        api: UPDATE_ANNOUNCEMENT,
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

export default AnnouncementReducer;
