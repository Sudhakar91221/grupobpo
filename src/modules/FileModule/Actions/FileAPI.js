import {
  FILE_GET,
  FILE_ADD,
  FILE_EDIT,
  FILE_DELETE,
  FILE_REMOVE_IMAGES,
  FILE_UPLOAD_PROGRESS,
  DOWNLOAD_FILE,
  GET_DOCUMENT,
  DELETE_DOCUMENT,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

const FileApiList = type => {
  switch (type) {
    case FILE_GET:
      return '/File/get';
    case FILE_ADD:
      return '/File/add';
    case FILE_EDIT:
      return '/File/update';
    case FILE_DELETE:
      return '/File/delete';
    case FILE_REMOVE_IMAGES:
      return '/File/removeImages';
    case DOWNLOAD_FILE:
      return '/File/downloadFile';
    case GET_DOCUMENT:
      return '/File/getdocument';
    case DELETE_DOCUMENT:
      return '/File/deleteDocument';
  }
};

class FileAPI {
  static getFile(input) {
    return apiCall(FileApiList(FILE_GET), input, FILE_GET, RequestType.POST);
  }

  static addFile(input) {
    return apiCall(FileApiList(FILE_ADD), input, FILE_ADD, RequestType.POST);
  }

  static updateFile(input) {
    return apiCall(FileApiList(FILE_EDIT), input, FILE_EDIT, RequestType.POST);
  }

  static deleteFile(input) {
    return apiCall(
      FileApiList(FILE_DELETE),
      input,
      FILE_DELETE,
      RequestType.POST,
    );
  }

  static removeImages(input) {
    return apiCall(
      FileApiList(FILE_REMOVE_IMAGES),
      input,
      FILE_REMOVE_IMAGES,
      RequestType.POST,
    );
  }

  static downloadFile(input) {
    return apiCall(
      FileApiList(DOWNLOAD_FILE),
      input,
      DOWNLOAD_FILE,
      RequestType.GET,
    );
  }

  static getDocuments(input) {
    return apiCall(
      FileApiList(GET_DOCUMENT),
      input,
      GET_DOCUMENT,
      RequestType.POST,
    );
  }

  static deleteDocument(input) {
    return apiCall(
      FileApiList(DELETE_DOCUMENT),
      input,
      DELETE_DOCUMENT,
      RequestType.POST,
    );
  }
}

export default FileAPI;
