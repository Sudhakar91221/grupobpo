import {
  GET_ALBUMS,
  ALBUM_DELETE,
  ALBUM_ADD,
  ALBUM_EDIT,
  REMOVE_IMAGES,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const AlbumAPIList = type => {
  switch (type) {
    case GET_ALBUMS:
      return '/Album/get';
    case ALBUM_DELETE:
      return '/Album/delete';
    case ALBUM_ADD:
      return '/Album/create';
    case ALBUM_EDIT:
      return '/Album/update';
    case REMOVE_IMAGES:
      return '/Album/removeImages';
  }
};

class AlbumAPI {
  static getAlbums(input) {
    return apiCall(
      AlbumAPIList(GET_ALBUMS),
      input,
      GET_ALBUMS,
      RequestType.POST,
    );
  }
  static albumDelete(input) {
    return apiCall(
      AlbumAPIList(ALBUM_DELETE),
      input,
      ALBUM_DELETE,
      RequestType.GET,
    );
  }
  static albumAdd(input) {
    return apiCall(AlbumAPIList(ALBUM_ADD), input, ALBUM_ADD, RequestType.POST);
  }
  static albumUpdate(input) {
    return apiCall(
      AlbumAPIList(ALBUM_EDIT),
      input,
      ALBUM_EDIT,
      RequestType.POST,
    );
  }
  static removeImages(input) {
    return apiCall(
      AlbumAPIList(REMOVE_IMAGES),
      input,
      REMOVE_IMAGES,
      RequestType.POST,
    );
  }
}

export default AlbumAPI;
