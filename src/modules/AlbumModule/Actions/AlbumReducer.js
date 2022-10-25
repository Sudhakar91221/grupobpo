import {
  API_FAILURE,
  API_START,
  GET_ALBUMS,
  ALBUM_DELETE,
  ALBUM_ADD,
  ALBUM_EDIT,
  REMOVE_IMAGES,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const AlbumReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case GET_ALBUMS: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.albumList =
          page == 1
            ? action.payload.data
            : [...state.albumList, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.albumList = [];
        }
        if( action.payload.pageCount === 0) {
          state.albumList = [];

        }
      }

      return {
        ...state,
        isLoading: false,
        error: null,
        albumList: [...state.albumList],
        api: GET_ALBUMS,
      };
    }

    case ALBUM_DELETE: {
      let albumsList = state.albumList;
      let albumIndex = albumsList
        .map(function(item) {
          return item.albumId;
        })
        .indexOf(action.payload.input.albumId);
      albumsList.splice(albumIndex, 1);
      return {
        ...state,
        isLoading: false,
        error: null,
        albumList: albumsList,
        message: 'Album deleted successfully',
        api: ALBUM_DELETE,
      };
    }

    case ALBUM_ADD: {
      var albumModel = {};
      albumModel.title = action.payload.input.albumName;
      albumModel.count = 0;
      albumModel.images = [];
      state.albumList.push(albumModel);
      return {
        ...state,
        isLoading: false,
        error: null,
        albumId: action.payload.data.albumId,
        api: ALBUM_ADD,
      };
    }

    case ALBUM_EDIT: {
      let albumsList = state.albumList;
      let albumIndex = albumsList
        .map(function(item) {
          return item.albumId;
        })
        .indexOf(action.payload.input.albumId);
      var albummodel = {};
      albummodel.count = action.payload.input.count;
      albummodel.title = action.payload.input.title;
      albummodel.images = action.payload.input.images;
      albumsList[albumIndex] = albummodel;

      return {
        ...state,
        isLoading: false,
        error: null,
        albumsList: albumsList,
        success: 'Album updated successfully',
        api: ALBUM_EDIT,
      };
    }

    case REMOVE_IMAGES: {
      //get selected album from list
      let albumsList = state.albumList;
      let albumIndex = albumsList
        .map(function(item) {
          return item.albumId;
        })
        .indexOf(action.payload.input.albumId);
      var albumModel = albumsList[albumIndex];
      //remove selected images from the album
      for (let i = 0; i < albumModel.images.length; i++) {
        let index = albumModel.images
          .map(function(item) {
            return item.imageId;
          })
          .indexOf(albumModel.images[i].albumId);
        albumModel.images.splice(index, 1);
      }
      //update image count in album list
      albumModel.count = albumModel.images.length;
      state.albumList[albumIndex] = albumModel;

      return {
        ...state,
        isLoading: false,
        error: null,
        albumList: albumsList,
        images: albumModel.images,
        api: REMOVE_IMAGES,
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

export default AlbumReducer;
