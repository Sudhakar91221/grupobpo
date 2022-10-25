/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import CustomMultiPicker from '../../../components/external/CustomMultiPicker/index';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import FromToDatePicker from '../../../components/views/FromToDatePicker';
import TwoDateFields from '../../FormsComponent/Component/TwoDateFields';
import InputForm from '../../FormsComponent/Forms/InputForm';
import moment from 'moment';
const status = {
  '0': 'Pending',
  '1': 'Approved',
  '2': 'Rejected',
  '3': 'Cancelled',
};

const period = {
  '1': 'Upcoming',
  '2': 'Past',
  '3': 'Today',
};

class StaffLeavesFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStatus: '',
      selectedPeriod: '',
    };
    this.currentFieldsRef = {};
    this.currentPageRef = {};
    this.onApplyButtonTapped = this.onApplyButtonTapped.bind(this);
    this.onClearButtonTapped = this.onClearButtonTapped.bind(this);
  }

  onStatusSelectionChange = status => {
    this.setState({selectedStatus: status});
  };

  onPeriodSelectionChange = period => {
    this.setState({selectedPeriod: period});
  };

  render() {
    const {theme} = this.props;

    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.renderDateView()}
          {this.renderPeriodView()}
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
    let details = this.currentPageRef.event.currentFieldsRef
    var startDate = details.date.fromDate.state.date;

    var endDate = details.date.toDate.state.date;
    this.props.navigation.state.params.getSelectedValues(
      this.state.selectedStatus,
      this.state.selectedPeriod,
      startDate,
      endDate,
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
            scrollViewHeight={200}
            selected={
              this.state.selectedStatus ? this.state.selectedStatus : ['0']
            } // list of options which are selected by default
            //selected={this.state.selectedStatus}
            onSelectionChange={this.onStatusSelectionChange}
            labelStyle={styless.headerSmall}
          />
        </View>
      </View>
    );
  }

  renderPeriodView() {
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
          Period
        </Text>
        <View style={{marginLeft: 20}}>
          <CustomMultiPicker
            options={period}
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
              this.state.selectedPeriod ? this.state.selectedPeriod : ['0']
            } // list of options which are selected by default
            //selected={this.state.selectedStatus}
            onSelectionChange={this.onPeriodSelectionChange}
            labelStyle={styless.headerSmall}
          />
        </View>
      </View>
    );
  }

  renderDateView() {
    const {theme} = this.props;
    var item = {
      lable: 'from',
      name: 'from',
    };
    var itemValue = '';

    return (
      <View style={{flex: 1, padding: 5}}>
        <Text
          style={[
            theme.header,
            {
              color: theme.primaryColor,
              fontWeight: 'bold',
              paddingTop: 20,
              paddingLeft: 20,
              paddingBottom: 10,
            },
          ]}
          numberOfLines={1}>
          Date
        </Text>
        <View style={{backgroundColor: 'white', flex: 1, padding: 2}}>
        <InputForm
            onRef={ref => {
              this.currentPageRef['event'] = ref;
            }}
            item={formData}
            blockModel={formData}
            formId={'0'}
            navigation={this.props.navigation}
            editable={true}
            fromDetail={true}
            hideBottomButton={true}
            isRequireHeader={false}
            // onAnotherScreenSaveButtonTapped={this.onSubmitTapped}
            submitButtonTapped={this.onApplyButtonTapped}
          />
        </View>
      </View>
    );
  }
}
const StaffLeavesFilterNew = withTheme(StaffLeavesFilter);
StaffLeavesFilterNew.navigationOptions = ({
  navigation,
  screenProps,
  params,
}) => {
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

export default StaffLeavesFilterNew;
let formData = {
  fields: [
    {
      name: 'date',
      mode:'date',
      type: '26',
      lable: 'Date',
      // rules: 'required',
      controller: 'TwoFields',
      childFields : [
        {
          name: 'fromDate',
          type: '7',
          lable: 'From Date',
          // rules: 'required',
        },
        {
          name: 'toDate',
          type: '7',
          lable: 'To Date',
          // rules: 'required',
        },
      ],
    },
  ],
};
