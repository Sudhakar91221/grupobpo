import {
  API_FAILURE,
  API_START,
  FILE_GET,
  FILE_ADD,
  FILE_EDIT,
  FILE_DELETE,
  FILE_UPLOAD_PROGRESS,
  FILE_REMOVE_IMAGES,
  DOWNLOAD_FILE,
  GET_DOCUMENT,
  DELETE_DOCUMENT,
} from './type';
import {AttachmentTypes} from './FileIntegers';
import moment from 'moment';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const FileReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case FILE_GET: {
      if (action.payload.data.data.length > 0) {
        state.data =
          action.payload.page == 1
            ? action.payload.data.data
            : [...state.data, ...action.payload.data.data];
      } else {
        // if(action.payload.page <= action.payload.data.pageCount ) {
        state.data = [];
        // }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        fileList: [...state.data],
        api: FILE_GET,
        lastPage: action.payload.data.pageCount,
      };
    }

    // case FILE_DELETE: {
    //   const indexOfExpenseToDelete = state.data.findIndex(occurModel => {
    //     return occurModel.occId == action.payload.data;
    //   });
    //   state.data.splice(indexOfExpenseToDelete, 1);

    //   return {
    //     ...state,
    //     fileList: [...state.data],
    //     isLoading: false,
    //     error: false,
    //     api: FILE_DELETE,
    //   };
    // }

    case FILE_UPLOAD_PROGRESS:
      let progress = state.progress ? state.progress : 0 + 0.1;

      return {
        ...state,
        isLoading: false,
        error: null,
        progress: progress,
        api: FILE_UPLOAD_PROGRESS,
      };

    case FILE_ADD:
      if (
        action.payload.input.type === AttachmentTypes.UPLOAD_FILE_TYPE_ALBUM
      ) {
        let albumsList = state.albumList;
        let albumIndex = albumsList
          .map(function(item) {
            return item.albumId;
          })
          .indexOf(action.payload.input.typeId);
        var albummodel = {};
        albummodel.count = albummodel.count + 1;
        albummodel.images.push(action.payload.input.file);
        albumsList[albumIndex] = albummodel;
      } else if (
        action.payload.input.type ===
          AttachmentTypes.UPLOAD_FILE_TYPE_DOCUMENT_BIRTH ||
        action.payload.input.type ===
          AttachmentTypes.UPLOAD_FILE_TYPE_DOCUMENT_MARRIAGE ||
        action.payload.input.type ===
          AttachmentTypes.UPLOAD_FILE_TYPE_DOCUMENT_BIRTH_CERTIFICATE ||
        action.payload.input.type ===
          AttachmentTypes.UPLOAD_FILE_TYPE_DOCUMENT_CERTIFICATE ||
        action.payload.input.type ===
          AttachmentTypes.UPLOAD_FILE_TYPE_DOCUMENT_BIR ||
        action.payload.input.type ===
          AttachmentTypes.UPLOAD_FILE_TYPE_DOCUMENT_MEDICAL ||
        action.payload.input.type ===
          AttachmentTypes.UPLOAD_FILE_TYPE_DOCUMENT_GOVERNMENT ||
        action.payload.input.type ===
          AttachmentTypes.UPLOAD_FILE_TYPE_DOCUMENT_NBI
      ) {
        let documents = state.documentsData;
        const index = documents.findIndex(item => {
          return item.type == action.payload.input.type;
        });

        let filesModel = documents[index];
        let imageModel = {};
        imageModel.fName = action.payload.input.title;
        imageModel.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        filesModel.images.push(imageModel);
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        fileId: action.payload.data.fileId,
        progress: action.payload.progress,
        api: FILE_ADD,
      };

    case FILE_DELETE:
      return {
        ...state,
        isLoading: false,
        error: null,
        fileDeleteSuccess: 'File deleted successfully',
        api: FILE_DELETE,
      };

    case DOWNLOAD_FILE:
      return {
        ...state,
        isLoading: false,
        error: null,
        downloadUrl: action.payload.data.downloadUrl,
        api: DOWNLOAD_FILE,
      };

    case GET_DOCUMENT:
      return {
        ...state,
        isLoading: false,
        error: null,
        documentsData: action.payload.data.data,
        api: GET_DOCUMENT,
      };

    case DELETE_DOCUMENT:
      let documents = state.documentsData;
      const index = documents.findIndex(item => {
        return item.type == action.payload.input.type;
      });
      let filesModel = documents[index];
      const fileIndex = filesModel.images.findIndex(item => {
        return item.fId == action.payload.input.fileId;
      });
      filesModel.images.splice(fileIndex, 1);
      return {
        ...state,
        isLoading: false,
        error: null,
        deleteDocumentSuccess: 'Document deleted successfully',
        api: DELETE_DOCUMENT,
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
        api: null,
        error: null,
      };

    default:
      return {
        ...state,
        error: null,
        isLoading: false,
        api: null,
      };
  }
};

export default FileReducer;
