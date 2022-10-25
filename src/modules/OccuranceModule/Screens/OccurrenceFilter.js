/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {GET_COMPANY_EMPLOYEE} from '../../TimesheetModule/Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  companyEmployeeSelector,
} from '../../TimesheetModule/Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getCompanyEmployee} from '../../TimesheetModule/Actions/TimesheetActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {Dropdown} from 'react-native-material-dropdown';
import CustomMultiPicker from '../../../components/external/CustomMultiPicker/index';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';

const status = {
  '0': 'Pending',
  '1': 'Approved',
  '2': 'Rejected',
};

class OccurrenceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStatus: 0,
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
    var typeList = [];
    typeList.push({key: '1', value: translate('change_marital_status')});
    typeList.push({
      key: '2',
      value: translate('request_for_maternity_leave'),
    });
    typeList.push({
      key: '3',
      value: translate('request_for_extended_maternity_leave'),
    });
    typeList.push({
      key: '4',
      value: translate('request_for_victims'),
    });
    typeList.push({
      key: '5',
      value: translate('request_for_paternity_leave'),
    });
    typeList.push({key: '6', value: translate('request_for_solo_parent')});
    typeList.push({key: '7', value: translate('request_for_resign')});
    this.state.typeList = typeList;
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
    if (this.props.error && this.props.error.request == GET_COMPANY_EMPLOYEE) {
      if (this.props.error !== prevProps.error) {
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

    //get company employee
    if (this.props.api === GET_COMPANY_EMPLOYEE) {
      if (
        this.props.error !== null &&
        this.props.api === GET_COMPANY_EMPLOYEE
      ) {
        if (this.props.error !== prevProps.error) {
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
        if (this.props.companyEmployees !== prevProps.companyEmployees) {
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
          this.setState({companyEmployees: list});
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
            Type
          </Text>
          {this.state.typeList === undefined ? null : this.renderTypeDropDown()}

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
    let typeModel = {};
    if (this.state.typeName !== undefined) {
      typeModel.typeId = this.state.typeId;
      typeModel.typeName = this.state.typeName;
    } else {
      typeModel.typeId = '0';
      typeModel.typeName = 'All Types';
    }
    this.props.navigation.state.params.getSelectedValues(
      employeeModel,
      typeModel,
      this.state.selectedStatus,
    );
    this.props.navigation.goBack();
  }

  onClearButtonTapped() {
    let employeeModel = {};
    let typeModel = {};
    this.props.navigation.state.params.getSelectedValues(
      employeeModel,
      typeModel,
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

  renderTypeDropDown() {
    const {theme} = this.props;
    var typeName = '';
    if (this.state.typeName !== undefined) {
      typeName = this.state.typeName;
    } else {
      typeName = this.state.typeList[0].value;
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
            data={this.state.typeList}
            value={typeName}
            textColor={theme.headerColor}
            baseColor={'gray'}
            fontSize={16}
            tintColor={theme.centerColor}
            onChangeText={this.changeTypeText}
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

  changeTypeText = text => {
    var index = this.state.typeList.findIndex(obj => obj.value === text);
    var typeModel = this.state.typeList[index];

    this.setState({
      typeId: typeModel.key,
      typeName: text,
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
const OccurrenceFilterNew = withTheme(OccurrenceFilter);
OccurrenceFilterNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    companyEmployees: companyEmployeeSelector(state.TimesheetReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getCompanyEmployee: input => dispatch(getCompanyEmployee(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OccurrenceFilterNew);
