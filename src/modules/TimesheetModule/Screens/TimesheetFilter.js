/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {GET_COMPANY_PERIOD, GET_COMPANY_EMPLOYEE} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myTimesheetListSelector,
  companyPeriodSelector,
  companyEmployeeSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  getMyTimesheets,
  getCompanyPeriod,
  getCompanyEmployee,
} from '../Actions/TimesheetActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {Dropdown} from 'react-native-material-dropdown';
import CustomMultiPicker from '../../../components/external/CustomMultiPicker/index';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';

const status = {
  '0': 'Open',
  '1': 'Submitted/Reconsideration',
  '2': 'Approved',
  '3': 'Rejected',
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

  componentWillMount() {
    this.callCompanyEmployeeAPI();
  }

  callCompanyPeriodAPI() {
    var input = {
      companyId: this.props.user.userCompany,
      //userId: this.props.user.userId,
      request: GET_COMPANY_PERIOD,
    };
    this.props.getCompanyPeriod(input);
  }

  callCompanyEmployeeAPI() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      request: GET_COMPANY_EMPLOYEE,
    };
    this.props.getCompanyEmployee(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_COMPANY_PERIOD ||
        this.props.error.request == GET_COMPANY_EMPLOYEE)
    ) {
      if (
        this.props.error !== prevProps.error &&
        this.props.error.message !== ''
      ) {
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                //this.props.navigation.navigate('Login');
                console.log('OK Pressed');
              },
            },
          ],

          {cancelable: false},
        );
      }
    }

    //get company period
    if (this.props.api === GET_COMPANY_PERIOD) {
      if (this.props.error !== null && this.props.api === GET_COMPANY_PERIOD) {
        if (
          this.props.error !== prevProps.error &&
          this.props.error.message !== ''
        ) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (this.props.error.message === 'Invalid Token') {
                    this.props.navigation.navigate('Login');
                  }
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === GET_COMPANY_PERIOD) {
        if (this.props.companyPeriods !== this.state.companyPeriods) {
          let list = [];
          Object.keys(this.props.companyPeriods.data).map(key => {
            list = [
              ...list,
              {
                index: key,
                value: this.props.companyPeriods.data[key].period,
              },
            ];
          });
          this.state.companyPeriods = list;
          this.state.submitLoader = false;
        }
      }
    }

    //get company employee
    if (this.props.api === GET_COMPANY_EMPLOYEE) {
      if (
        this.props.error !== null &&
        this.props.api === GET_COMPANY_EMPLOYEE
      ) {
        if (
          this.props.error !== prevProps.error &&
          this.props.error.message !== ''
        ) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (this.props.error.message === 'Invalid Token') {
                    this.props.navigation.navigate('Login');
                  }
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === GET_COMPANY_EMPLOYEE) {
        if (this.props.companyEmployees !== this.state.companyEmployees) {
          this.callCompanyPeriodAPI();
          let list = [];
          Object.keys(this.props.companyEmployees).map(key => {
            list = [
              ...list,
              {
                index: key,
                value: this.props.companyEmployees[key].userName,
              },
            ];
          });
          this.state.companyEmployees = list;
          this.state.submitLoader = false;
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    if (this.state.companyEmployees === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
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
            Employee
          </Text>
          {this.state.companyEmployees === undefined
            ? null
            : this.renderEmployeeDropDown()}
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
          {this.state.companyPeriods === undefined
            ? null
            : this.renderPeriodDropDown()}

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
    let employeeModel = {};
    if (this.state.employeeName !== undefined) {
      employeeModel.employeeId = this.state.employeeId;
      employeeModel.empName = this.state.employeeName;
    }
    let periodModel = {};
    if (this.state.periodName !== undefined) {
      periodModel.periodId = this.state.periodId;
      periodModel.periodName = this.state.periodName;
    } else {
      periodModel.periodId = this.props.companyPeriods.data[0].periodId;
      periodModel.periodName = this.props.companyPeriods.data[0].period;
    }
    this.props.navigation.state.params.getSelectedValues(
      employeeModel,
      periodModel,
      this.state.selectedStatus,
    );
    this.props.navigation.goBack();
  }

  onClearButtonTapped() {
    let employeeModel = {};
    let periodModel = {};
    this.props.navigation.state.params.getSelectedValues(
      employeeModel,
      periodModel,
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
            // selected={
            //   this.state.selectedStatus ? this.state.selectedStatus : ['1']
            // } // list of options which are selected by default
            selected={this.state.selectedStatus}
            onSelectionChange={this.onSelectionChange}
            labelStyle={styless.headerSmall}
          />
        </View>
      </View>
    );
  }

  renderPeriodDropDown() {
    const {theme} = this.props;
    var periodName = '';
    if (this.state.periodName !== undefined) {
      periodName = this.state.periodName;
    } else {
      periodName = this.state.companyPeriods[0].value;
    }

    return (
      <View style={{padding: 5, paddingLeft: '5%', paddingRight: '5%'}}>
        <View
          style={{
            paddingLeft: '5%',
            paddingRight: '5%',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'gray',
          }}>
          <Dropdown
            data={this.state.companyPeriods}
            value={periodName}
            textColor={theme.headerColor}
            baseColor={'gray'}
            fontSize={16}
            tintColor={theme.centerColor}
            onChangeText={this.changePeriodText}
            animationDuration={0}
          />
        </View>
      </View>
    );
  }

  renderEmployeeDropDown() {
    const {theme} = this.props;
    var employeeName = '';
    if (this.state.employeeName !== undefined) {
      employeeName = this.state.employeeName;
    } else {
      employeeName = this.state.companyEmployees[0].value;
    }

    return (
      <View style={{padding: 5, paddingLeft: '5%', paddingRight: '5%'}}>
        <View
          style={{
            paddingLeft: '5%',
            paddingRight: '5%',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'gray',
          }}>
          <Dropdown
            data={this.state.companyEmployees}
            value={employeeName}
            textColor={theme.headerColor}
            baseColor={'gray'}
            fontSize={16}
            tintColor={theme.centerColor}
            onChangeText={this.changeEmployeeText}
            animationDuration={0}
          />
        </View>
      </View>
    );
  }

  changePeriodText = text => {
    var index = this.props.companyPeriods.data.findIndex(
      obj => obj.period === text,
    );
    var periodModel = this.props.companyPeriods.data[index];
    this.setState({
      periodId: periodModel.periodId,
      periodName: periodModel.period,
    });
  };

  changeEmployeeText = text => {
    var index = this.props.companyEmployees.findIndex(
      obj => obj.userName === text,
    );
    var userModel = this.props.companyEmployees[index];
    this.setState({
      employeeId: userModel.userId,
      employeeName: userModel.userName,
    });
  };
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

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.TimesheetReducer),
    api: apiSelector(state.TimesheetReducer),
    error: errorSelector(state.TimesheetReducer),
    timesheets: myTimesheetListSelector(state.TimesheetReducer),
    companyPeriods: companyPeriodSelector(state.TimesheetReducer),
    companyEmployees: companyEmployeeSelector(state.TimesheetReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMyTimesheets: input => dispatch(getMyTimesheets(input)),
    getCompanyPeriod: input => dispatch(getCompanyPeriod(input)),
    getCompanyEmployee: input => dispatch(getCompanyEmployee(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimesheetFilterNew);
