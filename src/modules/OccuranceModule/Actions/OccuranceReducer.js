import {
  API_FAILURE,
  API_START,
  GET_MY_OCCURRENCES,
  OCCURRENCE_DETAIL,
  DELETE_OCCURRENCE,
  ADD_OCCURRENCE,
  GET_STAFF_OCCURRENCES,
  REJECT_OCCURRENCE,
  APPROVE_OCCURRENCE,
} from './type';

const defaultState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
  api: null,
};

const OccurrenceReducer = (state = defaultState, action) => {
  console.log('-------------------------');
  console.log(action.payload);

  switch (action.type) {
    case GET_MY_OCCURRENCES: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.myOccurrences =
          page == 1
            ? action.payload.data
            : [...state.myOccurrences, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.myOccurrences = [];
        }
        if( action.payload.pageCount === 0) {
          state.myOccurrences = [];

        }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        myOccurrences: [...state.myOccurrences],
        api: GET_MY_OCCURRENCES,
      };
    }

    case OCCURRENCE_DETAIL: {
      return {
        ...state,
        isLoading: false,
        error: null,
        occurrenceDetail: action.payload.data.data[0],
        api: OCCURRENCE_DETAIL,
      };
    }

    case DELETE_OCCURRENCE: {
      let occurrencesList = state.myOccurrences;
      let occurrenceIndex = occurrencesList
        .map(function(item) {
          return item.occId;
        })
        .indexOf(action.payload.input.occId);
      occurrencesList.splice(occurrenceIndex, 1);
      return {
        ...state,
        isLoading: false,
        error: null,
        myOccurrences: occurrencesList,
        message: 'Occurrence deleted successfully',
        api: DELETE_OCCURRENCE,
      };
    }

    case ADD_OCCURRENCE: {
      var occurrencemodel = {};
      occurrencemodel.userId = action.payload.input.userId;
      occurrencemodel.detail = action.payload.input.detail;
      occurrencemodel.type = action.payload.input.type;
      occurrencemodel.option = action.payload.input.option;
      occurrencemodel.remarks = null;
      occurrencemodel.status = '0';
      state.myOccurrences.push(occurrencemodel);
      return {
        ...state,
        isLoading: false,
        error: null,
        occId: action.payload.data.id,
        api: ADD_OCCURRENCE,
      };
    }

    case GET_STAFF_OCCURRENCES: {
      const page = action.payload.page != undefined ? action.payload.page : 1;
      if (action.payload.data.length > 0 && page <= action.payload.pageCount) {
        state.staffOccurrences =
          page == 1
            ? action.payload.data
            : [...state.staffOccurrences, ...action.payload.data];
      } else {
        if(action.payload.page <= action.payload.pageCount ) {
        state.staffOccurrences = [];
        }
        if( action.payload.pageCount === 0) {
          state.staffOccurrences = [];

        }
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        staffOccurrences: [...state.staffOccurrences],
        api: GET_STAFF_OCCURRENCES,
      };
    }

    case REJECT_OCCURRENCE: {
      let occsList = state.staffOccurrences;
      let occIndex = occsList
        .map(function(item) {
          return item.occId;
        })
        .indexOf(action.payload.input.occId);
      let occModel = {};
      occModel.status = '2';
      occsList[occIndex] = occModel;
      return {
        ...state,
        isLoading: false,
        error: null,
        occRejectSuccess: 'Occurrence rejected successfully',
        staffOccurrences: occsList,
        api: REJECT_OCCURRENCE,
      };
    }

    case APPROVE_OCCURRENCE: {
      let occsList = state.staffOccurrences;
      let occIndex = occsList
        .map(function(item) {
          return item.occId;
        })
        .indexOf(action.payload.input.occId);
      let occModel = {};
      occModel.status = '1';
      occsList[occIndex] = occModel;
      return {
        ...state,
        isLoading: false,
        error: null,
        occApproveSuccess: 'Occurrence approved successfully',
        staffOccurrences: occsList,
        api: APPROVE_OCCURRENCE,
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

export default OccurrenceReducer;
