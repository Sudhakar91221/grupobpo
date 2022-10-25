/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import CustomMultiPicker from '../../../components/external/CustomMultiPicker/index';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';

const type = {
  '0': 'All',
  '1': 'Admin',
  '2': 'HR',
  '3': 'Supervisor',
  '4': 'Employee',
  // '5': 'S-AL',
};

const status = {
  '1': 'All',
  '2': 'Working',
  '3': 'Disengaged/Terminated',
};

class MemberFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: ['0'],
      selectedPrevType: this.props.navigation.state.params.selectedType,
      selectedStatus: [],
    };
    if(this.state.selectedPrevType) {
      this.state.selectedType = this.state.selectedPrevType
    }
    this.onApplyButtonTapped = this.onApplyButtonTapped.bind(this);
    this.onClearButtonTapped = this.onClearButtonTapped.bind(this);
  }

  onTypeSelectionChange = type => {
    this.setState({selectedType: type});
  };

  onStatusSelectionChange = status => {
    this.setState({selectedStatus: status});
  };

  render() {
    const {theme} = this.props;

    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.renderTypeView()}
          {this.renderStatusView()}
          {this.renderButtons()}
        </View>
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
      this.state.selectedType,
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

  renderTypeView() {
    const {theme} = this.props;
    return (
      <View>
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
          User Type
        </Text>
        <View style={{marginLeft: 20}}>
          <CustomMultiPicker
            options={type}
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
            scrollViewHeight={300}
            selected={
              this.state.selectedType
            } // list of options which are selected by default
            //selected={this.state.selectedStatus}
            onSelectionChange={this.onTypeSelectionChange}
            labelStyle={styless.headerSmall}
          />
        </View>
      </View>
    );
  }
  renderStatusView() {
    const {theme} = this.props;
    return (
      <View>
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
            //scrollViewHeight={200}
            selected={
              this.state.selectedStatus
            } // list of options which are selected by default
            //selected={this.state.selectedStatus}
            onSelectionChange={this.onStatusSelectionChange}
            labelStyle={styless.headerSmall}
          />
        </View>
      </View>
    );
  }
}
const MemberFilterNew = withTheme(MemberFilter);
MemberFilterNew.navigationOptions = ({navigation, screenProps, params}) => {
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

export default MemberFilterNew;
