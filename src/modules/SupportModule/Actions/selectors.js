import {createSelector} from 'reselect';

const isLoadingSelector = state => state.isLoading;
const supportListSelector = state => state.supportList;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const supportCommentListSelector = state => state.commentList;
const supportDetailSelector = state => state.supportModel;
const imageUploadSelector = state => state.fileName;

//we can apply local operations here

const filterSelector = createSelector(supportListSelector, data =>
  state.supportList.filter(d => d[0] === 'Facebook'),
);

const supportListConverted = createSelector(
  [supportListSelector],
  supportList => {
    if (supportList === undefined) {
      return undefined;
    }
    const supports = supportList;

    const publicHoliday = {
      key: 'publicholiday',
      color: 'red',
      selectedDotColor: 'white',
    };
    const support = {key: 'support', color: 'blue', selectedDotColor: 'white'};

    var result = [];
    const datesWithSupports = [];

    supports.forEach(function(item) {
      if (!result[item.startDate]) {
        result[item.startDate] = [item];
      } else {
        result[item.startDate].push(item);
      }
    });

    console.log('here is new JSON');
    console.log(result);

    supports.forEach(function(item) {
      console.log('here is our item', item);

      if (
        datesWithSupports.filter(e => e.title === item.startDate).length > 0
      ) {
        let index = datesWithSupports.findIndex(
          obj => obj.title === item.startDate,
        );
        datesWithSupports[index].data.dots = [publicHoliday, support];
        datesWithSupports[index].data.push(item);
      } else {
        const newObject = [];
        newObject['title'] = item.startDate;
        newObject['data'] = [item];
        newObject['data'].dots = [publicHoliday, support];
        datesWithSupports.push(newObject);
      }
    });
    console.log('here is another new JSON');
    console.log(datesWithSupports);

    console.log(
      'hey-------------------i ma from selector class hey hey hipp hipp hurrey',
    );

    return datesWithSupports;
  },
);

export {
  isLoadingSelector,
  supportListSelector,
  apiSelector,
  errorSelector,
  supportListConverted,
  supportCommentListSelector,
  supportDetailSelector,
  imageUploadSelector,
  filterSelector,
};
