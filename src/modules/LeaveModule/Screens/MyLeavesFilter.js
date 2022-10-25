/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import CustomMultiPicker from '../../../components/external/CustomMultiPicker/index';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';

const status = {
  '0': 'Pending',
  '1': 'Approved',
  '2': 'Rejected',
  '3': 'Cancelled',
};

class TimesheetFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStatus: '',
    };
    this.onApplyButtonTapped = this.onApplyButtonTapped.bind(this);
    this.onClearButtonTapped = this.onClearButtonTapped.bind(this);
  }
  onSelectionChange = status => {
    //Alert.alert('selected index - fsdf', status.toString());
    this.setState({selectedStatus: status});
  };

  render() {
    const {theme} = this.props;

    return (
      <ScrollView style={{flex: 1}}>
        {this.renderStatusView()}
        {this.renderButtons()}
      </ScrollView>
    );
  }

  renderButtons() {
    return (
      <View style={{flexDirection: 'row', padding: 10}}>
        <BottomButton
          style={{flex: 1, borderRadius: 50, margin: 10}}
          title={translate('apply')}
          action={() => this.onApplyButtonTapped()}
        />
        <BottomButton
          style={{flex: 1, borderRadius: 50, margin: 10}}
          title={translate('clear')}
          action={() => this.onClearButtonTapped()}
        />
      </View>
    );
  }

  onApplyButtonTapped() {
    this.props.navigation.state.params.getSelectedValues(
      this.state.selectedStatus,
    );
    this.props.navigation.goBack();
  }

  onClearButtonTapped() {
    this.props.navigation.state.params.getSelectedValues(
      this.state.selectedStatus,
    );
    this.props.navigation.goBack();
  }

  renderStatusView() {
    const {theme} = this.props;
    return (
      <View style={{flex: 1}}>
        <Text
          style={[
            theme.header,
            {
              color: theme.primaryColor,
              fontWeight: 'bold',
              paddingTop: 20,
              paddingLeft: 20,
            },
          ]}
          numberOfLines={1}>
          Status
        </Text>
        <View style={{marginLeft: 20}}>
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
            selectedIconName={'ios-checkbox'}
            unselectedIconName={'ios-square-outline'}
            scrollViewHeight={200}
            selected={
              this.state.selectedStatus ? this.state.selectedStatus : ['0']
            } // list of options which are selected by default
            //selected={this.state.selectedStatus}
            onSelectionChange={this.onSelectionChange}
            labelStyle={styless.headerSmall}
          />
        </View>
      </View>
    );
  }
}
const TimesheetFilterNew = withTheme(TimesheetFilter);
TimesheetFilterNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
  };
};

export default TimesheetFilterNew;
