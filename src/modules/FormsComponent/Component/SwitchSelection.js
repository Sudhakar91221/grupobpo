/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Switch, Text, View} from 'react-native';
import {styless} from '../../../components/common/Styles';
import InputForm from '../Forms/InputForm';

export const SwitchSelection = ({item, theme, handleChangeSwitch,navigation,applicationId,defaultSelection}) => {
  const [switchValue, setSwitchValue] = React.useState(defaultSelection);
  const toggleSwitch = value => {
    
    handleChangeSwitch(item.name, value);
    setSwitchValue(value);
  };
  const componentDidMount = () => {
    if(item.childFields[0].value !== '') {
      setSwitchValue(true);
    }

  }


  return (
    <View style= {{flex:1}}>
    <View style={{height: 60, paddingTop: 3}}>
      <View style={{height: 1.0, backgroundColor: 'lightgray'}} />
      <View style={styless.leftRight}>
        <Text
          style={[
            theme.detailLarge,
            {justifyContent: 'center', alignSelf: 'center'},
          ]}>
          {item.lable}
        </Text>
        <Switch onValueChange={toggleSwitch} value={switchValue} />
      </View>
      <View style={{height: 1.0, backgroundColor: 'lightgray'}} />
      {item.hintText !== undefined && (
        <Text style={[theme.detailSmall, {paddingTop: 5}]}>
          {' '}
          {item.hintText}
        </Text>
      )}
      </View>
      {switchValue == true &&
      <InputForm
              // onRef={ref => {
              //   this.currentPageRef[item.name] = ref;
              // }}
              item={item}
              navigation={navigation}
              innerPage={true}
              submitButtonEnable={true}
              blockModel={item}
              isRequireHeader={false}
              sendDataBack={true}
              applicationId={applicationId}
              submitButtonEnable={true}
              sendDataBack={true}
              goBackOnSuccess={true}
              // onAnotherScreenSaveButtonTapped={this.props.onAnotherScreenSaveButtonTapped}
              editable={true}
            />
      }
    </View>
  );
};
