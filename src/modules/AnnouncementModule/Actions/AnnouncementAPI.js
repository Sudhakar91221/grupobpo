import {
  GET_ANNOUNCEMENTS_PUBLISHED,
  GET_ANNOUNCEMENTS_UPCOMING,
  ADD_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const AnnouncementAPIList = type => {
  switch (type) {
    case GET_ANNOUNCEMENTS_PUBLISHED:
      return '/Announcement/get';
    case GET_ANNOUNCEMENTS_UPCOMING:
      return '/Announcement/get';
    case ADD_ANNOUNCEMENT:
      return '/Announcement/add';
    case DELETE_ANNOUNCEMENT:
      return '/Announcement/delete';
    case UPDATE_ANNOUNCEMENT:
      return '/Announcement/update';
  }
};

class AnnouncementAPI {
  static getPublishedAnnouncements(input) {
    return apiCall(
      AnnouncementAPIList(GET_ANNOUNCEMENTS_PUBLISHED),
      input,
      GET_ANNOUNCEMENTS_PUBLISHED,
      RequestType.POST,
    );
  }
  static getUpcomingAnnouncements(input) {
    return apiCall(
      AnnouncementAPIList(GET_ANNOUNCEMENTS_UPCOMING),
      input,
      GET_ANNOUNCEMENTS_UPCOMING,
      RequestType.POST,
    );
  }
  static addAnnouncement(input) {
    return apiCall(
      AnnouncementAPIList(ADD_ANNOUNCEMENT),
      input,
      ADD_ANNOUNCEMENT,
      RequestType.POST,
    );
  }
  static deleteAnnouncement(input) {
    return apiCall(
      AnnouncementAPIList(DELETE_ANNOUNCEMENT),
      input,
      DELETE_ANNOUNCEMENT,
      RequestType.POST,
    );
  }
  static updateAnnouncement(input) {
    return apiCall(
      AnnouncementAPIList(UPDATE_ANNOUNCEMENT),
      input,
      UPDATE_ANNOUNCEMENT,
      RequestType.POST,
    );
  }
}

export default AnnouncementAPI;
