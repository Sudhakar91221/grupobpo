/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {
  GET_MY_BALANCE,
  APPLY_LEAVE,
  APPLY_STAFF_LEAVE,
  COMPUTE_TOTAL_DAYS,
} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myBalanceLeavesSelector,
  applyStaffLeaveSelector,
  computeTotalDaysSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  getMyBalance,
  applyStaffLeave,
  computeTotalDays,
} from '../Actions/LeaveActions';
import {connect} from 'react-redux';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {Dropdown} from 'react-native-material-dropdown';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import moment from 'moment';
import {ImageComponent} from '../../FormsComponent/Component/Image/ImageComponent';
import {GET_COMPANY_EMPLOYEE} from '../../TimesheetModule/Actions/type';
import {companyEmployeeSelector} from '../../TimesheetModule/Actions/selectors';
import {getCompanyEmployee} from '../../TimesheetModule/Actions/TimesheetActions';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';

class ApplyStaffLeave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balanceLeaves: undefined,
      leaveBalance: 'Unlimited',
      value: 'Unpaid',
      sessionValue: 0,
    };
    this.currentPageRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
    this.callApplyLeave = this.callApplyLeave.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
  }

  componentWillMount() {
    this.callCompanyEmployeeAPI();
    let list = [];
    var lastYearObj = {index: 0, value: translate('full_day')};
    var currentYearObj = {index: 1, value: translate('am')};
    var nextYearObj = {index: 2, value: translate('pm')};
    list.push(lastYearObj);
    list.push(currentYearObj);
    list.push(nextYearObj);
    this.state.typeList = list;
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
      (this.props.error.request == GET_MY_BALANCE ||
        this.props.error.request == APPLY_LEAVE ||
        this.props.error.request == GET_COMPANY_EMPLOYEE ||
        this.props.error.request == COMPUTE_TOTAL_DAYS)
    ) {
      if (this.props.error !== prevProps.error) {
        this.setState({submitLoader: false});
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

    //get my balance
    if (this.props.api === GET_MY_BALANCE) {
      if (this.props.error !== null && this.props.api === GET_MY_BALANCE) {
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

      if (!this.props.error && this.props.api === GET_MY_BALANCE) {
        if (this.props.balanceLeaves !== this.state.balanceLeavesData) {
          let list = [];
          Object.keys(this.props.balanceLeaves).map(key => {
            list = [
              ...list,
              {
                index: key,
                value: this.props.balanceLeaves[key].leaveTypeName,
              },
            ];
          });
          this.setState({
            balanceLeavesList: list,
            balanceLeavesData: this.props.balanceLeaves,
            leaveType:
              this.props.balanceLeaves.length === 0
                ? 1
                : this.props.balanceLeaves[0].leaveType,
          });
        }
      }
    }

    //apply leave
    if (this.props.api === APPLY_STAFF_LEAVE) {
      if (this.props.error !== null && this.props.api === APPLY_STAFF_LEAVE) {
        if (this.props.error !== prevProps.error) {
          this.setState({submitLoader: false});
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

      if (!this.props.error && this.props.api === APPLY_STAFF_LEAVE) {
        if (this.props.staffLeaveId !== prevProps.staffLeaveId) {
          Alert.alert(
            'Leave applied successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  this.props.navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
    }

    //get company employee
    if (this.props.employeeApi === GET_COMPANY_EMPLOYEE) {
      if (
        this.props.error !== null &&
        this.props.employeeApi === GET_COMPANY_EMPLOYEE
      ) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (
        !this.props.error &&
        this.props.employeeApi === GET_COMPANY_EMPLOYEE
      ) {
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
          this.setState(
            {
              companyEmployees: list,
              empId: this.props.companyEmployees[0].userId,
            },
            () => this.callGetMyBalanceAPI(),
          );
        }
      }
    }

    //compute total days
    if (this.props.api === COMPUTE_TOTAL_DAYS) {
      if (this.props.error !== null && this.props.api === COMPUTE_TOTAL_DAYS) {
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

      if (!this.props.error && this.props.api === COMPUTE_TOTAL_DAYS) {
        if (this.props.totalDaysData !== this.state.totalDaysData) {
          if (
            this.props.totalDaysData.ErrorMessage === undefined &&
            this.props.totalDaysData.totalDays > 0 &&
            this.props.totalDaysData.leaves > 0
          ) {
            this.callApplyLeave();
          } else {
            Alert.alert(
              '',
              this.props.totalDaysData.ErrorMessage,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // if (this.props.error.message === 'Invalid Token') {
                    //   this.props.navigation.navigate('Login');
                    // }
                    this.props.navigation.goBack();
                  },
                },
              ],
              {cancelable: false},
            );
          }
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
          {this.state.companyEmployees === undefined
            ? null
            : this.renderEmployeeDropDown()}
          {this.renderLeaveTypeView()}
            <InputForm
              onRef={ref => {
                this.currentPageRef['leave'] = ref;
              }}
              item={formData}
              blockModel={formData}
              formId={'0'}
              navigation={this.props.navigation}
              editable={true}
              fromDetail={true}
              hideBottomButton={true}
              isRequireHeader={false}
            />
          {this.renderSessionView()}
          <View
            style={{
              paddingLeft: '25%',
              paddingRight: '25%',
              paddingTop: 20,
              paddingBottom: 30,
            }}>
            <BottomButton
              style={styless.bottomButton}
              title={translate('submit')}
              action={
                !this.state.submitLoader && !this.state.submitGray
                  ? this.onSubmitTapped
                  : null
              }
              isLoader={this.state.submitLoader}
              isGray={this.state.submitGray}
            />
          </View>
        </View>
      </ScrollView>
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
        <Dropdown
          data={this.state.companyEmployees}
          value={employeeName}
          textColor={theme.headerColor}
          baseColor={'gray'}
          fontSize={16}
          tintColor={theme.centerColor}
          onChangeText={this.changeEmployeeText}
          animationDuration={0}
          label={'Member'}
        />
      </View>
    );
  }

  changeEmployeeText = text => {
    var index = this.props.companyEmployees.findIndex(
      obj => obj.userName === text,
    );
    var userModel = this.props.companyEmployees[index];
    this.state.empId = userModel.userId;
    this.setState(
      {
        empId: userModel.userId,
        employeeName: userModel.userName,
        timesheetDetail: undefined,
      },
      () => this.callGetMyBalanceAPI(),
    );
  };

  getUploadedFileName = (imageToUpload, tempImageName) => {
    this.state.imageToUpload = imageToUpload;
  };

  onSubmitTapped() {
    this.setState({submitLoader: false});
    var date = this.currentPageRef.leave.currentFieldsRef.date.state.date;
    var momentObj = moment(date, 'DD/MM/YYYY');
    let startDate = moment(momentObj).format('YYYY-MM-DD');
    var date = this.currentPageRef.leave.currentFieldsRef.date.state.date;
    var momentObj = moment(date, 'DD/MM/YYYY');
    let endDate = moment(momentObj).format('YYYY-MM-DD');
    let attachment = this.currentPageRef.leave.currentFieldsRef.attachment.state.attachment[1].imageToUpload

    var input = {
      company: this.props.user.userCompany,
      userId: this.state.empId,
      userType: this.props.user.userType,
      startDate: startDate,
      endDate: endDate,
      session: this.state.sessionValue,
      leaveType: this.state.leaveType,
      request: COMPUTE_TOTAL_DAYS,
      attachment:attachment
    };
    this.props.computeTotalDays(input);
  }

  callApplyLeave() {
    this.currentPageRef.leave.validationMethod()

    let details = this.currentPageRef.leave.currentFieldsRef

    var title = details.title.state.title;
    var description = details.description
      .state.description;
    
      
      var startDate = details.date.fromDate.state.date;
      let momentObj = moment(startDate, 'DD/MM/YYYY');
      let formattedStartDate = moment(momentObj).format('YYYY-MM-DD');
  
      var endDate = details.date.toDate.state.date;
      let momentObj1 = moment(endDate, 'DD/MM/YYYY');
      let formattedEndDate = moment(momentObj1).format('YYYY-MM-DD');

    var input = {
      companyId: this.props.user.userCompany,
      user: this.props.user.userId,
      title: title,
      reason: description,
      start: formattedStartDate,
      end: formattedEndDate,
      session: this.state.sessionValue,
      leaveType: this.state.leaveType,
      employee: this.state.empId,
      request: APPLY_STAFF_LEAVE,

    };

    let attachmentRef = this.currentPageRef.leave.currentFieldsRef.attachment[1]
    if(attachmentRef) {
      let attachment = attachmentRef.state.attachment[1].imageToUpload
      input['attachment'] = attachment
    }
    this.props.applyStaffLeave(input);
  }

  renderLeaveTypeView() {
    const {theme} = this.props;
    var value = '';
    if (this.state.value !== undefined) {
      value = this.state.value;
    } else {
      value = this.state.balanceLeavesList[0].value;
    }
    return (
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            padding: 5,
            flex: 1,
          }}>
          <View
            style={{
              paddingLeft: '5%',
              paddingRight: '5%',
            }}>
            <Dropdown
              data={this.state.balanceLeavesList}
              value={value}
              label={translate('leave_type')}
              textColor={theme.headerColor}
              baseColor={'gray'}
              fontSize={16}
              tintColor={theme.centerColor}
              onChangeText={this.changeText}
              animationDuration={0}
            />
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text
            style={[
              theme.detail,
              {
                color: 'gray',
                paddingTop: 15,
                fontWeight: 'bold',
                paddingLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('leave_balance')}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                paddingTop: 10,
                paddingLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {this.state.leaveBalance}
          </Text>
        </View>
      </View>
    );
  }

  renderSessionView() {
    var sessionValue = '';
    if (this.state.sessionName !== undefined) {
      sessionValue = this.state.sessionName;
    } else {
      sessionValue = this.state.typeList[0].value;
    }
    const {theme} = this.props;
    return (
      <View
        style={{
          padding: 5,
          paddingLeft: '5%',
          paddingRight: '5%',
          flex: 1,
        }}>
        <View>
          <Dropdown
            data={this.state.typeList}
            value={sessionValue}
            label={translate('session')}
            textColor={theme.headerColor}
            baseColor={'gray'}
            fontSize={16}
            tintColor={theme.centerColor}
            onChangeText={this.changeSessionText}
            animationDuration={0}
          />
        </View>
      </View>
    );
  }

  changeText = text => {
    var index = this.props.balanceLeaves.findIndex(
      obj => obj.leaveTypeName === text,
    );
    var leaveModel = this.props.balanceLeaves[index];
    if (leaveModel.unlimted === 1) {
      this.setState({
        leaveBalance: 'Unlimited',
        value: text,
        leavetype: leaveModel.leaveType,
      });
    } else {
      this.setState({
        leaveBalance: leaveModel.leaveBalance,
        value: text,
        leavetype: leaveModel.leaveType,
      });
    }
  };

  changeSessionText = text => {
    var index = this.state.typeList.findIndex(obj => obj.value === text);
    var sessionModel = this.state.typeList[index];
    this.setState({
      sessionName: sessionModel.value,
      sessionValue: sessionModel.index,
    });
  };

  callGetMyBalanceAPI() {
    var input = {
      userId: this.state.empId,
      request: GET_MY_BALANCE,
    };
    this.props.getMyBalance(input);
  }
}
const ApplyStaffLeaveNew = withTheme(ApplyStaffLeave);
ApplyStaffLeaveNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    isLoading: isLoadingSelector(state.LeaveReducer),
    api: apiSelector(state.LeaveReducer),
    error: errorSelector(state.LeaveReducer),
    balanceLeaves: myBalanceLeavesSelector(state.LeaveReducer),
    staffLeaveId: applyStaffLeaveSelector(state.LeaveReducer),
    companyEmployees: companyEmployeeSelector(state.TimesheetReducer),
    employeeApi: apiSelector(state.TimesheetReducer),
    totalDaysData: computeTotalDaysSelector(state.LeaveReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMyBalance: input => dispatch(getMyBalance(input)),
    applyStaffLeave: input => dispatch(applyStaffLeave(input)),
    getCompanyEmployee: input => dispatch(getCompanyEmployee(input)),
    computeTotalDays: input => dispatch(computeTotalDays(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyStaffLeaveNew);
let formData = {
  fields: [
    {
      name: 'title',
      type: '1',
      lable: 'Title',
      rules: 'required',
    },
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
    {
      name: 'description',
      type: '1',
      lable: 'Description',
      rules: 'required',
    },
    {
      "name": "attachment",
      "type": "3",
      "lable": "Attachment",
    },
  ],
};
