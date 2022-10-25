import {
  API_FAILURE,
  API_START,
  GET_MY_REQUESTS,
  DELETE_REQUEST,
  ADD_REQUEST,
  UPDATE_REQUEST,
  INCOMING_REQUESTS,
  OUTGOING_REQUESTS,
  ACCEPT_REQUEST,
  DECLINE_REQUEST,
  REPLY_REQUEST,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const RequestReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case GET_MY_REQUESTS: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.myRequests =
          page == 1
            ? action.payload.data
            : [...state.myRequests, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.myRequests = [];
        }
        if( action.payload.pageCount === 0) {
          state.myRequests = [];

        }

      }
      return {
        ...state,
        isLoading: false,
        error: null,
        myRequests: [...state.myRequests],
        api: GET_MY_REQUESTS,
      };
    }

    case DELETE_REQUEST: {
      let myRequestsList = state.myRequests;
      let requestIndex = myRequestsList
        .map(function(item) {
          return item.requestId;
        })
        .indexOf(action.payload.input.requestId);
      myRequestsList.splice(requestIndex, 1);
      return {
        ...state,
        isLoading: false,
        error: null,
        myRequests: myRequestsList,
        message: 'Request deleted successfully',
        api: DELETE_REQUEST,
      };
    }

    case ADD_REQUEST: {
      var requestmodel = {};
      requestmodel.categoryType = action.payload.input.categoryType;
      requestmodel.addedon = action.payload.input.requiredDate;
      requestmodel.status = '1';
      state.myRequests.push(requestmodel);
      return {
        ...state,
        isLoading: false,
        error: null,
        requestId: action.payload.data.requestId,
        api: ADD_REQUEST,
      };
    }

    case UPDATE_REQUEST: {
      let requestsList = state.myRequests;
      let requestIndex = requestsList
        .map(function(item) {
          return item.requestId;
        })
        .indexOf(action.payload.input.requestId);
      var requestmodel = {};
      requestmodel.categoryType = action.payload.input.categoryType;
      requestmodel.addedon = action.payload.input.requiredDate;
      requestmodel.status = '1';
      requestsList[requestIndex] = requestmodel;

      return {
        ...state,
        isLoading: false,
        error: null,
        myRequests: requestsList,
        success: 'request updated successfully',
        api: UPDATE_REQUEST,
      };
    }

    case INCOMING_REQUESTS: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.incomingRequests =
          page == 1
            ? action.payload.data
            : [...state.incomingRequests, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.incomingRequests = [];
        }
        if( action.payload.pageCount === 0) {
          state.incomingRequests = [];

        }

      }
      return {
        ...state,
        isLoading: false,
        error: null,
        incomingRequests: [...state.incomingRequests],
        api: INCOMING_REQUESTS,
      };
    }

    case OUTGOING_REQUESTS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        outgoingRequests: action.payload.data.data,
        api: OUTGOING_REQUESTS,
      };
    }

    case ACCEPT_REQUEST: {
      let requestsList = state.incomingRequests;
      let requestIndex = state.incomingRequests
        .map(function(item) {
          return item.requestId;
        })
        .indexOf(action.payload.input.requestId);
      var requestmodel = {};
      requestmodel.categoryType = action.payload.input.categoryType;
      requestmodel.addedon = action.payload.input.requiredDate;
      requestmodel.status = '2';
      state.incomingRequests[requestIndex] = requestmodel;

      return {
        ...state,
        isLoading: false,
        error: null,
        incomingRequests: state.incomingRequests,
        acceptSuccess: 'request updated successfully',
        api: ACCEPT_REQUEST,
      };
    }

    case DECLINE_REQUEST: {
      let requestsList = state.incomingRequests;
      let requestIndex = state.incomingRequests
        .map(function(item) {
          return item.requestId;
        })
        .indexOf(action.payload.input.requestId);
      var requestmodel = {};
      requestmodel.categoryType = action.payload.input.categoryType;
      requestmodel.addedon = action.payload.input.requiredDate;
      requestmodel.status = '3';
      state.incomingRequests[requestIndex] = requestmodel;

      return {
        ...state,
        isLoading: false,
        error: null,
        incomingRequests: state.incomingRequests,
        declineSuccess: 'request updated successfully',
        api: DECLINE_REQUEST,
      };
    }

    case REPLY_REQUEST: {
      //remove from incoming request list
      let requestsList = state.incomingRequests;
      let requestIndex = state.incomingRequests
        .map(function(item) {
          return item.requestId;
        })
        .indexOf(action.payload.input.requestId);
      state.incomingRequests.splice(requestIndex, 1);
      //add in outgoing request list
      var requestmodel = {};
      requestmodel.categoryType = action.payload.input.categoryType;
      requestmodel.addedon = action.payload.input.requiredDate;
      requestmodel.status = '0';
      let outgoingRequestsList = state.outgoingRequests;
      outgoingRequestsList.push(requestmodel);
      return {
        ...state,
        isLoading: false,
        error: null,
        reply: action.payload.data.comment,
        incomingRequests: state.incomingRequests,
        outgoingRequests: outgoingRequestsList,
        api: REPLY_REQUEST,
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

export default RequestReducer;
