import DeviceInfo from 'react-native-device-info';
import React from 'react';
import {View, Text} from 'react-native';
import {BASE_URL, API_KEY} from '../../network/config';

import {withTheme} from '../common/Theme/themeProvider';

const flatListItemSeparator = withTheme(({theme, setTheme}) => {
  return (
    //Item Separator
    <View
      style={{height: 0.8, width: '100%', backgroundColor: theme.dividerColor}}
    />
  );
});

const flatListItemSpaceSeparator = withTheme(({theme, setTheme, height}) => {
  return (
    //Item Separator
    <View
      style={{
        height: 10.0,
        width: '100%',
        backgroundColor: theme.backgroundColor,
      }}
    />
  );
});

const NoRecordAvailableView = withTheme(object => {
  return (
    <View
      style={{
        justifyContent: 'center',
        flex: 1,
        backgroundColor: object.theme.backgroundColor,
      }}>
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 24,
          color: object.theme.primaryColor,
        }}>
        No Records Available!!
      </Text>
    </View>
  );
});
function removeObject(object, arr) {
  var array = arr; // make a separate copy of the array
  var index = array.indexOf(object);
  if (index !== -1) {
    array.splice(index, 1);
    return array;
  }
}

function isSimulator() {
  return DeviceInfo.isEmulator();
}
function isNumeric(s) {
  return !isNaN(parseInt(s, 10));
}
 const getAttachmentUrl = async(attachment) => {

  const requestHeader = {
    'x-api-key': API_KEY,
  };
  let url = BASE_URL + '/File/downloadFile/'+ attachment
  const response = await fetch(url, {
    method: "GET",
    headers: requestHeader,
  }).then(response => {
    return response.json()
  } ).then(responseJson => {
    return responseJson.downloadUrl
 }).catch((error) => {
    console.error(error);
 });
  
 return response
  
};

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const removeWord = (searchWord, actualString) => {
  var str = actualString;
  var n = str.search(searchWord);
  while (str.search(searchWord) > -1) {
    n = str.search(searchWord);
    str =
      str.substring(0, n) + str.substring(n + searchWord.length, str.length);
  }
  return str;
};

String.prototype.equalIgnoreCase = function(str) {
  return (
    str != null &&
    typeof str === 'string' &&
    this.toUpperCase() === str.toUpperCase()
  );
};

export {
  flatListItemSeparator,
  flatListItemSpaceSeparator,
  NoRecordAvailableView,
  removeWord,
  isSimulator,
  isNumeric,
  isJsonString,
  removeObject,
  getAttachmentUrl,
};
