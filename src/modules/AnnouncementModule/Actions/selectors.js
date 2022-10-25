const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const publishedAnnouncementsSelector = state => state.publishedAnnouncements;
const upcomingAnnouncementsSelector = state => state.upcomingAnnouncements;
const addAnnouncementSelector = state => state.announcementId;
const deleteAnnouncementSelector = state => state.message;
const updateAnnouncementSelector = state => state.success;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  publishedAnnouncementsSelector,
  upcomingAnnouncementsSelector,
  addAnnouncementSelector,
  deleteAnnouncementSelector,
  updateAnnouncementSelector,
};
