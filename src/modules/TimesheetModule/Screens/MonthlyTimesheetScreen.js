/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  View,
  Text,
  Alert,
  FlatList,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {
  GET_MY_DETAIL_TIMESHEET,
  GET_COMPANY_PERIOD,
  SUBMIT_TIMESHEET,
  GET_STAFF_DETAIL_TIMESHEET,
  GET_COMPANY_EMPLOYEE,
  APPROVE_TIMESHEET,
  GET_TIMESHEET_DETAIL_FROM_NOTIFICATION,
} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myDetailTimesheetSelector,
  companyPeriodSelector,
  submitTimesheetSelector,
  staffDetailTimesheetSelector,
  companyEmployeeSelector,
  approveTimesheetSelector,
  timesheetDetailFromNotificationSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  getMyDetailTimesheet,
  getCompanyPeriod,
  submitTimesheet,
  getStaffDetailTimesheet,
  getCompanyEmployee,
  approveTimesheet,
  getTimesheetDetailFromNotification,
} from '../Actions/TimesheetActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import TimesheetDetailCell from '../Components/TimesheetDetailCell';
import EmployeeInfoCell from '../Components/EmployeeInfoCell';
import {Dropdown} from 'react-native-material-dropdown';
import {translate} from '../../../../App';
import {BottomButton} from '../../../components/views/Button';
import moment from 'moment';

class MonthlyTimesheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpinner: true,
      timesheetDetail: undefined,
      periodId: this.props.navigation.getParam('periodId', 1),
      companyPeriods: undefined,
      value: undefined,
      modalVisible: false,
      checkoutFlag: 0,
      isSubmitEnable:0,
      empId: this.props.navigation.getParam('empId', 1),
      isMyTimesheet: this.props.navigation.getParam('isMyTimesheet'),
      isHr: this.props.navigation.getParam('isHr'),
      isSup: this.props.navigation.getParam('isSup'),
      status: this.props.navigation.getParam('status'),
    };
    this.changeText = this.changeText.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
    this.callSubmitTimesheet = this.callSubmitTimesheet.bind(this);
    this.callApproveTimesheet = this.callApproveTimesheet.bind(this);
    this.onApproveButtonTapped = this.onApproveButtonTapped.bind(this);
  }

  setModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
  }

  componentWillMount() {
    if (this.props.navigation.state.params.isFromNotification === true) {
      var input = {
        recId: this.props.navigation.state.params.timesheetId,
        companyId: this.props.user.userCompany,
        userId: this.props.user.userId,
        request: GET_TIMESHEET_DETAIL_FROM_NOTIFICATION,
      };
      this.props.getTimesheetDetailFromNotification(input);
    } else {
      this.callGetDetailTimesheet();
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleStateChange: this.setModalVisible,
    });
  }

  callGetDetailTimesheet() {
    if (this.state.isMyTimesheet === true) {
      var input = {
        companyId: this.props.user.userCompany,
        userId: this.props.user.userId,
        periodId: this.state.periodId,
        empId: this.props.user.userId,
        request: GET_MY_DETAIL_TIMESHEET,
      };
      this.props.getMyDetailTimesheet(input);
    } else {
      var input = {
        companyId: this.props.user.userCompany,
        userId: this.props.user.userId,
        periodId: this.state.periodId,
        empId: this.state.empId,
        request: GET_STAFF_DETAIL_TIMESHEET,
      };
      this.props.getStaffDetailTimesheet(input);
    }
  }

  callCompanyPeriodAPI() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
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
      (this.props.error.request == GET_MY_DETAIL_TIMESHEET ||
        this.props.error.request == GET_COMPANY_PERIOD ||
        this.props.error.request == SUBMIT_TIMESHEET ||
        this.props.error.request == GET_COMPANY_EMPLOYEE ||
        this.props.error.request == APPROVE_TIMESHEET ||
        this.props.error.request == GET_STAFF_DETAIL_TIMESHEET ||
        this.props.error.request == GET_TIMESHEET_DETAIL_FROM_NOTIFICATION)
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
      this.hideSpinner();
    }

    //get my monthly timesheet
    if (this.props.api === GET_MY_DETAIL_TIMESHEET) {
      if (
        this.props.error !== null &&
        this.props.api === GET_MY_DETAIL_TIMESHEET
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
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                },
              },
            ],
            {cancelable: false},
          );
        }
        this.hideSpinner();
      }

      if (!this.props.error && this.props.api === GET_MY_DETAIL_TIMESHEET) {
        if (this.props.timesheetDetail !== this.state.timesheetDetail) {
          this.setState({timesheetDetail: this.props.timesheetDetail});
          this.callCompanyPeriodAPI();
          this.hideSpinner();
          this.state.submitLoader = false;
          var last = this.props.timesheetDetail.period.substring(12, 21);
          var lastDate = moment(last).format('YYYY-MM-DD');
          var today = moment().format('YYYY-MM-DD');
          // if today is before last date then hide submit button
          var d1 = Date.parse(today);
          var d2 = Date.parse(lastDate);
          if (d1 > d2) {
            this.state.checkoutFlag = 0;
            this.state.isSubmitEnable = 1;
          }
          this.state.lastDate = lastDate;
        }
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
          this.hideSpinner();

        }
      }
    }

    //submit timesheet
    if (this.props.api === SUBMIT_TIMESHEET) {
      if (this.props.error !== null && this.props.api === SUBMIT_TIMESHEET) {
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

      if (!this.props.error && this.props.api === SUBMIT_TIMESHEET) {
        if (this.props.message !== this.state.message) {
          this.setState({message: this.props.message, checkoutFlag: 0});
          this.state.submitLoader = false;
          this.callGetDetailTimesheet();
        }
      }
    }

    //get staff monthly timesheet
    if (this.props.api === GET_STAFF_DETAIL_TIMESHEET) {
      if (
        this.props.error !== null &&
        this.props.api === GET_STAFF_DETAIL_TIMESHEET
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
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                },
              },
            ],
            {cancelable: false},
          );
        }
        this.hideSpinner();
      }

      if (!this.props.error && this.props.api === GET_STAFF_DETAIL_TIMESHEET) {
        if (this.props.staffTimesheetDetail !== this.state.timesheetDetail) {
          this.setState({timesheetDetail: this.props.staffTimesheetDetail});
          this.state.submitLoader = false;
          this.hideSpinner();
          this.callCompanyEmployeeAPI();
          // var last = this.props.timesheetDetail.period.substring(12, 21);
          // var lastDate = moment(last).format('YYYY-MM-DD');
          // var today = moment().format('YYYY-MM-DD');
          // // if today is before last date then hide submit button
          // var d1 = Date.parse(today);
          // var d2 = Date.parse(lastDate);
          // if (d1 > d2) {
          //   this.state.checkoutFlag = 0;
          // }
          // this.state.lastDate = lastDate;
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
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                },
              },
            ],
            {cancelable: false},
          );
        }
        this.hideSpinner();
      }

      if (!this.props.error && this.props.api === GET_COMPANY_EMPLOYEE) {
        if (this.props.companyEmployees !== this.state.companyEmployees) {
          //this.callCompanyPeriodAPI();
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

    //approve timesheet
    if (this.props.api === APPROVE_TIMESHEET) {
      if (this.props.error !== null && this.props.api === APPROVE_TIMESHEET) {
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
                onPress: () => {},
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === APPROVE_TIMESHEET) {
        if (this.props.timesheetStatus !== this.state.timesheetStatus) {
          this.setState({timesheetStatus: this.props.timesheetStatus});
          this.state.submitLoader = false;
          Alert.alert(
            'Timesheet approved successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
    }

    //get timesheet details from notification
    if (this.props.api === GET_TIMESHEET_DETAIL_FROM_NOTIFICATION) {
      if (
        this.props.error !== null &&
        this.props.api === GET_TIMESHEET_DETAIL_FROM_NOTIFICATION
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
        this.props.api === GET_TIMESHEET_DETAIL_FROM_NOTIFICATION
      ) {
        if (
          this.props.timesheetDetailFromNotification !==
          this.state.timesheetDetail
        ) {
          this.setState({
            timesheetDetail: this.props.timesheetDetailFromNotification,
            isHr: this.props.timesheetDetailFromNotification.isHr,
            isSup: this.props.timesheetDetailFromNotification.isSup,
            period: this.props.timesheetDetailFromNotification.period,
            periodId: this.props.timesheetDetailFromNotification.periodId,
            status: this.props.timesheetDetailFromNotification.status,
          });
          this.callCompanyPeriodAPI();
          this.hideSpinner();
          this.state.submitLoader = false;
          if (this.props.isMyTimesheet === true) {
            var last = this.props.timesheetDetailFromNotification.period.substring(
              12,
              21,
            );
            var lastDate = moment(last).format('YYYY-MM-DD');
            var today = moment().format('YYYY-MM-DD');
            // if today is before last date then hide submit button
            var d1 = Date.parse(today);
            var d2 = Date.parse(lastDate);
            if (d1 > d2) {
              this.state.checkoutFlag = 0;
            }
            this.state.lastDate = lastDate;
          }
        }
      }
    }
  }

  renderDialogView() {
    const {theme} = this.props;
    return (
      <View>
        <Text
          style={[
            theme.header,
            {
              color: theme.primaryColor,
              fontWeight: 'bold',
              fontSize: 18,
              alignSelf: 'center',
              marginBottom: 10,
            },
          ]}
          numberOfLines={1}>
          {translate('timesheet_dialog_header')}
        </Text>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: theme.weeklyOff,
              marginLeft: 10,
            }}
          />
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('weekly_off')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: theme.approvedLeave,
              marginLeft: 10,
            }}
          />
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('approved_leave')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: theme.publicHoliday,
              marginLeft: 10,
            }}
          />
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('public_holiday')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: theme.empResubmit,
              marginLeft: 10,
              borderRadius: 20,
            }}
          />
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('resubmitted_by_employee')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: theme.supResubmit,
              marginLeft: 10,
              borderRadius: 20,
            }}
          />
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('resubmitted_by_supervisor')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: theme.approvedBySup,
              marginLeft: 10,
              borderRadius: 20,
            }}
          />
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('approved_by_supervisor')}/{translate('submitted_to_hr')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: theme.approvedByHr,
              marginLeft: 10,
              borderRadius: 20,
            }}
          />
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('approved_by_hr')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: theme.rejected,
              marginLeft: 10,
              borderRadius: 20,
            }}
          />
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('rejected_by_sup_hr')}
          </Text>
        </View>
        <View
          style={{width: '100%', height: 1, backgroundColor: 'lightgray'}}
        />
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible();
          }}>
          <Text
            style={{
              color: theme.primaryColor,
              fontWeight: 'bold',
              fontSize: 18,
              alignSelf: 'center',
              marginBottom: 10,
              textTransform: 'uppercase',
              marginTop: 10,
            }}>
            OK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {theme} = this.props;

    if (this.state.timesheetDetail === undefined) {
      return  <ActivityIndicatorCustom
      isSpinner={this.state.isSpinner}
      style={{paddingTop: 20, height: 60}}
    />
    }
    return (
      <ScrollView style={{flex: 1}}>
      
        <View style={{flex: 1}}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  marginRight: '10%',
                  marginLeft: '10%',
                  backgroundColor: 'white',
                  borderColor: 'gray',
                  borderRadius: 5,
                  borderWidth: 1,
                  padding: 5,
                }}>
                {this.renderDialogView()}
              </View>
            </View>
          </Modal>
          {this.state.isMyTimesheet === true ? (
            this.state.companyPeriods === undefined ? null : (
              this.renderDropdown()
            )
          ) : (
            <View>
              {this.state.companyEmployees === undefined
                ? null
                : this.renderEmployeeDropDown()}
              <Text
                style={[
                  theme.header,
                  {
                    color: theme.primaryColor,
                    fontWeight: 'bold',
                    paddingTop: 10,
                    paddingBottom: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  },
                ]}
                numberOfLines={1}>
                {this.props.navigation.getParam('startPeriod')}-
                {this.props.navigation.getParam('endPeriod')}
              </Text>
            </View>
          )}

{this.props.user &&
          <EmployeeInfoCell
            userName={
              this.props.user.userId === this.state.timesheetDetail.userId
                ? 'You'
                : this.state.timesheetDetail.userName
            }
            totalHours={this.state.timesheetDetail.totalHours}
            status={this.state.timesheetDetail.status}
            photo={this.state.timesheetDetail.photo}
          />
} 
          <View style={{flex: 1, padding: 10}}>
            {this.state.timesheetDetail === undefined ? (
              this.renderNoRecords()
            ) : this.state.timesheetDetail.length === 0 ? (
              this.renderNoRecords()
            ) : (
              <View style={{flex: 1}}>
                <FlatList
                  data={this.state.timesheetDetail.data}
                  renderItem={this.renderTimesheetItem}
                  numColumns={1}
                  keyExtractor={this._keyExtractor}
                  extraData={this.props}
                  ItemSeparatorComponent={flatListItemSpaceSeparator}
                />

                {this.state.isSubmitEnable === 1 && (this.props.timesheetDetail.status === '0' || this.props.timesheetDetail.status === undefined) && this.state.isMyTimesheet === true ? (
                  <BottomButton
                    style={{
                      borderRadius: 30,
                      backgroundColor: theme.centerColor,
                      width: '40%',
                      height: 50,
                      marginTop: 10,
                    }}
                    title={translate('submit')}
                    action={
                      !this.state.submitLoader && !this.state.submitGray
                        ? this.onSubmitTapped
                        : null
                    }
                    isLoader={this.state.submitLoader}
                    isGray={this.state.submitGray}
                  />
                ) : null}

                {(this.props.timesheetDetail.status === '1' ||
                this.props.timesheetDetail.status === '4') && this.props.timesheetDetail.isSup === 1  && this.state.isMyTimesheet !== true ? (
                  <BottomButton
                    style={{
                      borderRadius: 30,
                      backgroundColor: theme.centerColor,
                      width: '40%',
                      height: 50,
                      marginTop: 10,
                    }}
                    title={translate('approve')}
                    action={
                      !this.state.submitLoader && !this.state.submitGray
                        ? this.onApproveButtonTapped
                        : null
                    }
                    isLoader={this.state.submitLoader}
                    isGray={this.state.submitGray}
                  />
                ) : null}

                {(this.props.timesheetDetail.status === '2' ||
                this.props.timesheetDetail.status === '7') && this.props.timesheetDetail.isHr === 1 && this.state.isMyTimesheet !== true ? (
                  <BottomButton
                    style={{
                      borderRadius: 30,
                      backgroundColor: theme.centerColor,
                      width: '40%',
                      height: 50,
                      marginTop: 10,
                    }}
                    title={translate('approve')}
                    action={
                      !this.state.submitLoader && !this.state.submitGray
                        ? this.onApproveButtonTapped
                        : null
                    }
                    isLoader={this.state.submitLoader}
                    isGray={this.state.submitGray}
                  />
                ) : null}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  onApproveButtonTapped() {
    Alert.alert(
      '',
      translate('approve_timesheet_hint'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this.callApproveTimesheet},
      ],
      {cancelable: false},
    );
  }

  callApproveTimesheet() {
    var input = {
      isHr: this.state.isHr,
      isSup: this.state.isSup,
      status: this.state.status,
      userId: this.props.user.userId,
      periodId: this.state.periodId,
      empId: this.state.empId,
      request: APPROVE_TIMESHEET,
    };
    this.props.approveTimesheet(input);
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
      this.callGetDetailTimesheet(),
    );
  };

  onSubmitTapped() {
    Alert.alert(
      '',
      translate('submit_timesheet'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this.callSubmitTimesheet},
      ],
      {cancelable: false},
    );
  }

  callSubmitTimesheet() {
    var input = {
      recId: this.props.navigation.getParam('timesheetId', 1),
      userId: this.props.user.userId,
      periodId: this.state.periodId,
      request: SUBMIT_TIMESHEET,
    };
    this.props.submitTimesheet(input);
  }

  renderDropdown() {
    const {theme} = this.props;
    var value = '';
    if (this.state.value !== undefined) {
      value = this.state.value;
    } else {
      value = this.state.companyPeriods[0].value;
    }

    return (
      <View style={{padding: 5}}>
        <View
          style={{
            paddingLeft: '5%',
            paddingRight: '5%',
            borderRadius: 5,
            borderColor: 'gray',
            borderWidth: 1,
          }}>
          <Dropdown
            data={this.state.companyPeriods}
            value={value}
            textColor={theme.headerColor}
            baseColor={'gray'}
            fontSize={16}
            tintColor={theme.centerColor}
            onChangeText={this.changeText}
            animationDuration={0}
          />
        </View>
      </View>
    );
  }

  changeText = text => {
    var index = this.props.companyPeriods.data.findIndex(
      obj => obj.period === text,
    );
    var periodModel = this.props.companyPeriods.data[index];
    this.setState(
      {
        periodId: periodModel.periodId,
        timesheetDetail: undefined,
        value: periodModel.period,
      },
      () => this.callGetDetailTimesheet(),
    );
  };

  renderTimesheetItem = ({item, index}) => {
    if (this.state.isMyTimesheet === true) {
      if (item.inTime !== '-' && item.outTime === '-') {
        this.setState({checkoutFlag: 1});
      } else {
        this.setState({checkoutFlag: 0});
      }
    }
    return (
      <TimesheetDetailCell
        item={item}
        navigation={this.props.navigation}
        timesheetStatus={this.state.timesheetDetail.status}
        totalData={this.state.timesheetDetail}
        index={index}
      />
    );
  };
   //MARK : - Event Handlers
   showSpinner() {
    this.setState({isSpinner: true});
  }

  hideSpinner() {
    if (this.state.isSpinner == true) {
      this.setState({isSpinner: false});
    }
  }

  renderNoRecords() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
          }}>
          No Records Available
        </Text>
      </View>
    );
  }
}
const MonthlyTimesheetNew = withTheme(MonthlyTimesheet);
MonthlyTimesheetNew.navigationOptions = ({navigation, screenProps}) => {
  const {theme} = screenProps;
  const {params = {}} = navigation.state;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
    headerRight: () => (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => params.handleStateChange()}>
          <Image
            source={require('../../../assets/ic_info.png')}
            style={{
              width: 30,
              height: 30,
              marginRight: 10,
              //backgroundColor: '#343957',
            }}
          />
        </TouchableOpacity>
      </View>
    ),
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.TimesheetReducer),
    api: apiSelector(state.TimesheetReducer),
    error: errorSelector(state.TimesheetReducer),
    timesheetDetail: myDetailTimesheetSelector(state.TimesheetReducer),
    companyPeriods: companyPeriodSelector(state.TimesheetReducer),
    message: submitTimesheetSelector(state.TimesheetReducer),
    staffTimesheetDetail: staffDetailTimesheetSelector(state.TimesheetReducer),
    companyEmployees: companyEmployeeSelector(state.TimesheetReducer),
    timesheetStatus: approveTimesheetSelector(state.TimesheetReducer),
    timesheetDetailFromNotification: timesheetDetailFromNotificationSelector(
      state.TimesheetReducer,
    ),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMyDetailTimesheet: input => dispatch(getMyDetailTimesheet(input)),
    getCompanyPeriod: input => dispatch(getCompanyPeriod(input)),
    submitTimesheet: input => dispatch(submitTimesheet(input)),
    getStaffDetailTimesheet: input => dispatch(getStaffDetailTimesheet(input)),
    getCompanyEmployee: input => dispatch(getCompanyEmployee(input)),
    approveTimesheet: input => dispatch(approveTimesheet(input)),
    getTimesheetDetailFromNotification: input =>
      dispatch(getTimesheetDetailFromNotification(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MonthlyTimesheetNew);
