import {createSelector} from 'reselect';

const isLoadingSelector = state => state.isLoading;
const fileAddSelector = state => state.fileId;
const apiSelector = state => state.api;
const errorSelector = state => state.error;
const progressSelector = state => state.progress;
const downloadFileSelector = state => state.downloadUrl;
const getDocumentsSelector = state => state.documentsData;
const deleteDocumentSelector = state => state.deleteDocumentSuccess;
const deleteFileSelector = state => state.fileDeleteSuccess;

//we can apply local operations here

const filterSelector = createSelector(
  fileAddSelector,
  data => data.filter(d => d[0] === 'Facebook'),
);

const fileListConverted = createSelector(
  [fileAddSelector],
  fileList => {
    if (fileList === undefined) {
      return undefined;
    }
    const files = fileList;

    const publicHoliday = {
      key: 'publicholiday',
      color: 'red',
      selectedDotColor: 'white',
    };
    const file = {key: 'file', color: 'blue', selectedDotColor: 'white'};

    var result = [];
    const datesWithFiles = [];

    files.forEach(function(item) {
      if (!result[item.startDate]) {
        result[item.startDate] = [item];
      } else {
        result[item.startDate].push(item);
      }
    });

    console.log('here is new JSON');
    console.log(result);

    files.forEach(function(item) {
      console.log('here is our item', item);

      if (datesWithFiles.filter(e => e.title === item.startDate).length > 0) {
        let index = datesWithFiles.findIndex(
          obj => obj.title === item.startDate,
        );
        datesWithFiles[index].data.dots = [publicHoliday, file];
        datesWithFiles[index].data.push(item);
      } else {
        const newObject = [];
        newObject.title = item.startDate;
        newObject.data = [item];
        newObject.data.dots = [publicHoliday, file];
        datesWithFiles.push(newObject);
      }
    });
    console.log('here is another new JSON');
    console.log(datesWithFiles);

    console.log(
      'hey-------------------i ma from selector class hey hey hipp hipp hurrey',
    );

    return datesWithFiles;
  },
);

export {
  isLoadingSelector,
  fileAddSelector,
  apiSelector,
  errorSelector,
  progressSelector,
  downloadFileSelector,
  getDocumentsSelector,
  deleteDocumentSelector,
  deleteFileSelector,
};
