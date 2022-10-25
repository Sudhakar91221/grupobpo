/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Alert} from 'react-native';
import {styless} from '../../../components/common/Styles';
import RadioButton from '../../../components/external/RadioButtons';
import CustomMultiPicker from '../../../components/external/CustomMultiPicker/index';

export const MultipleSelection = ({options, theme}) => {
  const status = {
    '1': 'Open',
    '2': 'Close',
  };
  const [selectedStatus, setSelectedStatus] = React.useState(0);

  const onSelectionChange = status => {
    Alert.alert('selected index - fsdf', status.toString());
    setSelectedStatus(status);
  };
  return (
    <View>
      <Text style={theme.H1}> Condition </Text>

      <CustomMultiPicker
        options={status}
        search={false} // should show search bar?
        multiple={true} //
        placeholder={'Search'}
        placeholderTextColor={'#757575'}
        returnValue={'value'} // label or value
        callback={res => {
          console.log(res);
        }} // callback, array of selected items
        rowBackgroundColor={'white'}
        rowHeight={40}
        rowRadius={5}
        iconColor={'#2E324C'}
        iconSize={30}
        selectedIconName={'ios-checkmark-circle-outline'}
        unselectedIconName={'ios-radio-button-off'}
        scrollViewHeight={100}
        selected={selectedStatus ? selectedStatus : ['1']} // list of options which are selected by default
        onSelectionChange={onSelectionChange}
        labelStyle={styless.headerSmall}
      />
    </View>
  );
};
