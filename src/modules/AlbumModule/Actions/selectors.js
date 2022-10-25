const isLoadingSelector = state => state.isLoading;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const successSelector = state => state.successMessage;
const albumListSelector = state => state.albumList;
const albumDeleteSelector = state => state.message;
const albumAddSelector = state => state.albumId;
const albumEditSelector = state => state.success;
const removeImagesSelector = state => state.images;

export {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
  albumListSelector,
  albumDeleteSelector,
  albumAddSelector,
  albumEditSelector,
  removeImagesSelector,
};
