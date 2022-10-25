/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Alert,
  NativeEventEmitter,
  NativeModules,
  Image,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  submitReasonSelector,
  approveRejectDaySelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import NewPager from '../Components/NewPager';
import {PrevNextButton} from '../../../components/views/Button';
import {newColorOfTheDay} from '../Components/TimesheetApproval1';
import DialogInput from '../../../components/views/DialogueInput';
import {
  decideTheButtonOnBottomForSelectedDay,
  TimesheetStatus,
  loginUser,
} from '../Components/TimesheetApproval';
import {BottomGreenButton} from '../../../components/views/Button';
import {submitReason, approveRejectDay} from '../Actions/TimesheetActions';
import {SUBMIT_REASON, APPROVE_REJECT_DAY} from '../Actions/type';
import {Dropdown} from 'react-native-material-dropdown';
import {ProgressDialog, ConfirmDialog} from 'react-native-simple-dialogs';
import {translate} from '../../../../App';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';

export const DetailBottomButton = {
  Submit: 1,
  ApproveReject: 2,
  Resubmit: 3,
  None: 0,
};

class DailyTimesheet extends React.PureComponent {
  constructor(props) {
    super(props);
    let totalData = props.navigation.getParam('totalData', {});
    this.state = {
      isSpinner: true,
      data: totalData.data,
      totalData: totalData,
      index: this.props.navigation.getParam('index', 0),
      isReasonVisible: false,
      isOvertimeDropDownVisible: false,
    };
    this.onSelectedTimesheetDay = this.onSelectedTimesheetDay.bind(this);
    this.onOvertimeChangeText = this.onOvertimeChangeText.bind(this);
    this.onNightOTChangeText = this.onNightOTChangeText.bind(this);
    this.showNightAndOvertimeDropdown = this.showNightAndOvertimeDropdown.bind(
      this,
    );
    this.callApproveRejectDay = this.callApproveRejectDay.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    const currentSelectedDay = this.state.selectedDay
      ? this.state.selectedDay
      : this.state.totalData.data[this.state.index];

    this.setState({
      isLoading: false,
      theRemarkReasonViewResult: newColorOfTheDay(
        this.state.totalData.status,
        this.state.totalData,
        currentSelectedDay
          ? currentSelectedDay
          : this.state.totalData.data[this.state.index],
      ),
    });
       

    const monthModel = this.state.totalData;

    const timesheetStatus = this.state.completeTimesheetStatus;
    let isHrLogin = monthModel.isHr ? true : false; //login user type
    let isSupLogin = monthModel.isSup ? true : false; //for the timesheet he is viewing
    let isEmpLogin = global.loginUserId == monthModel.userId ? true : false; //My timesheet

    var loginUserType = loginUser.isEmp;
    if (isEmpLogin) {
      loginUserType = loginUser.isEmp;
    } else if (isSupLogin) {
      loginUserType = loginUser.isSup;
    } else if (isHrLogin) {
      loginUserType = loginUser.isHr;
    }

    //   setInterval(() => {
    //      this.setState({
    //        isLoading: false,
    //        loginUserType:loginUserType
    //      });
    //    }, 3000);

    // this.setState({
    //      buttonsType:decideTheButtonOnBottomForSelectedDay(
    //                     this.state.totalData  ,
    //                     this.state.selectedDay ? this.state.selectedDay : this.state.totalData.data[this.state.index] ,
    //                     timesheetStatus),
    //      // loginUserType:loginUserType
    // } )

    console.log(
      'test 123 ------',
      newColorOfTheDay(
        this.state.totalData.status,
        this.state.totalData,
        currentSelectedDay
          ? currentSelectedDay
          : this.state.totalData.data[this.state.index],
      ),
    );
    this.setState({
      buttonsType: decideTheButtonOnBottomForSelectedDay(
        this.state.totalData,
        currentSelectedDay
          ? currentSelectedDay
          : this.state.totalData.data[this.state.index],
        this.state.totalData.status,
      ),
      selectedDay: this.state.totalData.data[this.state.index],
    });
    console.log('');
    this.hideSpinner()
  }
   //MARK : - Event Handlers
  showSpinner() {
    this.setState({isSpinner: true});
  }

  hideSpinner() {
    if (this.state.isSpinner == true) {
      this.setState({isSpinner: false});
    }
    
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == SUBMIT_REASON ||
        this.props.error.request == APPROVE_REJECT_DAY)
    ) {
      if (this.props.error !== prevProps.error) {
        this.hideSpinner();

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

    //submit reason
    if (this.props.api === SUBMIT_REASON) {
      if (this.props.error !== null && this.props.api === SUBMIT_REASON) {
        if (this.props.error !== prevProps.error) {
          this.hideSpinner();

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
                  console.log('OK Pressed');
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === SUBMIT_REASON) {
        if (this.props.successMessage !== this.state.successMessage) {
          this.hideSpinner();

          Alert.alert(
            'Reason submitted sucessfully ',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.setState({
                    index: this.state.index + 1,
                    remark: undefined,
                  });
                  this.state.submitLoader = false;
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
    }

    // approve/reject day
    if (this.props.api === APPROVE_REJECT_DAY) {
      if (this.props.error !== null && this.props.api === APPROVE_REJECT_DAY) {
        if (this.props.error !== prevProps.error) {
          this.hideSpinner();

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
                  console.log('OK Pressed');
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === APPROVE_REJECT_DAY) {
        if (this.props.dayStatus !== this.state.dayStatus) {
          this.setState({isApproveRejectSuccess: true});
          // Alert.alert(
          //   'Reason submitted sucessfully ',
          //   '',
          //   [
          //     {
          //       text: 'OK',
          //       onPress: () => {
          //         this.setState({
          //           index: this.state.index + 1,
          //           remark: undefined,
          //         });
          //         this.state.submitLoader = false;
          //       },
          //     },
          //   ],
          //   {cancelable: false},
          // );
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    return (
      <ScrollView style={{bottom: 0, flex: 1}}
      contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled">
      <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        <View style={{flex:1, backgroundColor: '#fafafa'}}>
        
        {/* <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        /> */}
          {this.renderRemarkView()}
          {this.showNightAndOvertimeDropdown()}
          {this.renderApprovalOrRejectionSuccessDialogue()}
          <NewPager
            ref={ref => (this.pager = ref)}
            timesheetDays={this.state.data}
            navigation={this.props.navigation}
            selectedTimesheetDay={this.onSelectedTimesheetDay}
            timesheetUser={this.state.totalData.userId}
            index={this.state.index ? this.state.index : 0}
            currentOpenDay={this.state.index ? this.state.index : 0}
            theRemarkReasonViewResult={newColorOfTheDay(
              this.state.totalData.status,
              this.state.totalData,
              this.state.totalData.data[this.state.index],
            )}
            // timesheetFinalStatus={this.state.totalData.status}
            // monthModel = {this.state.totalData}
          />
          {this.renderPrevNextButtons()}
          {this.renderBottomButtonView(this.state.buttonsType)} 
        </View>
      </ScrollView>
    );
  }

  renderApprovalOrRejectionSuccessDialogue() {
    console.log('----------approve reject view is shoiwing-----------');
    console.log(this.state.isApproveRejectSuccess);
    console.log(this.state.isLoading);

    if (this.state.isApproveRejectSuccess == true) {
      return (
        <ConfirmDialog
          title={this.state.isFromApprove ? 'Approved' : 'Rejected'}
          visible={true}
          positiveButton={{
            title: 'Ok',
            onPress: this.onApproveRejectOkTapped,
          }}>
          <View>
            <Image
              style={
                this.state.isFromApprove
                  ? {
                      width: 60,
                      height: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      tintColor: 'green',
                    }
                  : {
                      width: 60,
                      height: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      tintColor: 'red',
                    }
              }
              source={
                this.state.isFromApprove
                  ? require('../../../assets/ic_check_circle.png')
                  : require('../../../assets/ic_cancel_white.png')
              }
              tintColor={this.state.isFromApprove ? 'green' : 'red'}
            />
          </View>
        </ConfirmDialog>
      );
    }
  }

  showNightAndOvertimeDropdown() {
    const selectedDay = this.state.selectedDay
      ? this.state.selectedDay
      : this.state.totalData.data[this.state.index];

    if (selectedDay && this.state.isOvertimeDropDownVisible) {
      let otDataSource = [];
      let nightDataSource = [];

      if (selectedDay.overTime) {
        var ot = 0.0;
        for (let i = 0; i <= selectedDay.overTime * 2; i++) {
          otDataSource = [...otDataSource, {value: ot.toString()}];
          ot = ot + 0.5;
        }
      }

      if (selectedDay.nightOT) {
        var nightOt = 0.0;
        for (let i = 0; i <= selectedDay.nightOT * 2; i++) {
          nightDataSource = [...nightDataSource, {value: nightOt.toString()}];
          nightOt = nightOt + 0.5;
        }
      }
      console.log('------datasources--------');
      console.log('------datasources--------');

      console.log(this.state.otDataSource);
      console.log(this.state.nightDataSource);
      if (otDataSource.length <= 1 && nightDataSource.length <= 1) {
        this.onSubmitOvertimeTapped();
      } else {
        return (
          <ConfirmDialog
            title="Select Overtime"
            // onTouchOutside={ () => this.openConfirm(false) }
            visible={this.state.isOvertimeDropDownVisible}
            negativeButton={{
              title: 'Cancel',
              onPress: this.onCancelOvertimeTapped,
              // disabled: true,
              titleStyle: {
                color: 'blue',
                colorDisabled: 'aqua',
              },
              style: {
                backgroundColor: 'transparent',
                backgroundColorDisabled: 'transparent',
              },
            }}
            positiveButton={{
              title: 'Submit',
              onPress: this.onSubmitOvertimeTapped,
            }}>
            <View>
              {selectedDay.overTime &&
                selectedDay.overTime > 0 &&
                otDataSource.length > 1 && (
                  <Dropdown
                    ref={this.otDropdownRef}
                    value={this.state.overtime}
                    onChangeText={this.onOvertimeChangeText}
                    label="Overtime"
                    data={otDataSource}
                    baseColor="black"
                    textColor="black"
                    style={{flex: 1, color: 'black'}}
                    tintColor="black"
                  />
                )}
              {selectedDay.nightOT &&
                selectedDay.nightOT > 0 &&
                nightDataSource.length > 1 && (
                  <Dropdown
                    ref={this.nightOtDropdownRef}
                    value={this.state.nightOvertime}
                    onChangeText={this.onNightOTChangeText}
                    label="Night Overtime"
                    data={nightDataSource}
                    baseColor="black"
                    textColor="black"
                    style={{flex: 1, color: 'black'}}
                    tintColor="black"
                  />
                )}
            </View>
          </ConfirmDialog>
        );
      }
    }
  }

  onOvertimeChangeText = (text, id, data) => {
    this.setState({overTime: text});
  };

  onNightOTChangeText = (text, id, data) => {
    this.setState({nightOvertime: text});
  };

  renderRemarkView() {
    console.log('issue in reerReamrk --------');
    if (
      this.state.data === undefined ||
      this.state.data[this.state.index] === undefined
    ) {
      console.log(this.state.data[this.state.index]);
      console.log(
        '...............1111tetsting counting of timesheets records ---------------',
      );
      console.log(this.state.index);
      console.log(this.state.totalData.length);
      // if( this.state.data[this.state.index].dayStatus === undefined || this.state.data[this.state.index].dayStatus === null) {
      //      console.log(this.state.data[this.state.index])

      // }
      // console.log(this.state.data[this.state.index])
    } else {
      console.log('issue in reerReamrk --------');
      console.log('issue in reerReamrk --------');
      console.log(this.state.data[this.state.index]);
      console.log(this.state.data[this.state.index].dayStatus);

      if (
        this.state.data[this.state.index].dayStatus !== undefined &&
        this.state.data[this.state.index].dayStatus ==
          TimesheetStatus.RejectByHr &&
        this.state.totalData.userId != this.props.user.userId
      ) {
        return (
          <DialogInput
            isDialogVisible={this.state.isReasonVisible}
            title="Reason"
            message="Reason for resubmit"
            hintInput="Enter reason here"
            submitInput={inputText => {
              this.sendReason(inputText);
            }}
            closeDialog={this.onCancelReasonTapped}
            // onEndEditing={this.onEndEditingDialgueInput}
            onChangeText={this.onStartTypingReason}
            error={this.state.dialogueError}
          />
        );
      } else {
        return (
          <DialogInput
            isDialogVisible={this.state.isReasonVisible}
            title={
              this.state.totalData.userId == this.props.user.userId
                ? 'Reason'
                : 'Remark'
            }
            message={
              this.state.totalData.userId == this.props.user.userId
                ? 'Reason for resubmit'
                : 'Remark for rejecting'
            }
            hintInput={
              this.state.totalData.userId == this.props.user.userId
                ? 'Enter reason here'
                : 'Enter remark here'
            }
            submitInput={inputText => {
              this.sendReason(inputText);
            }}
            closeDialog={this.onCancelReasonTapped}
            // onEndEditing={this.onEndEditingDialgueInput}
            onChangeText={this.onStartTypingReason}
            error={this.state.dialogueError}
          />
        );
      }
    }
  }

  renderBottomButtonView(buttonsType) {
    // console.log(buttonsType)
    // var this = this

    console.log('what is the button type here');
    console.log(buttonsType);
    console.log('---------');

    switch (buttonsType) {
      case DetailBottomButton.Submit:
        return (
          <View style={{flexDirection: 'row', padding: 10, width: '100%'}}>
            <BottomGreenButton
              style={{flex: 1}}
              title="Submit"
              action={() => this.onSubmitButtonTapped()}
            />
          </View>
        );
      //return <View style={{flexDirection: 'row', padding: 0, height: 0}} />;

      case DetailBottomButton.ApproveReject:
        return (
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <BottomGreenButton
              style={{flex: 1}}
              title="Approve"
              action={this.onApproveButtonTapped}
            />
            <BottomGreenButton
              style={{flex: 1}}
              title="Reject"
              action={this.onRejectButtonTapped}
            />
          </View>
        );

      case DetailBottomButton.Resubmit:
        return (
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <BottomGreenButton
              style={{flex: 1}}
              title="Resubmit"
              action={this.onReSubmitButtonTapped}
            />
          </View>
        );

      case DetailBottomButton.None:
        return <View style={{flexDirection: 'row', padding: 0, height: 0}} />;

      default:
        return <View style={{flexDirection: 'row', padding: 0, height: 0}} />;
    }
  }

  onStartTypingReason = input => {
    if (input.length > 0) {
      if (this.state.dialogueError) {
        this.setState({dialogueError: null});
      }
    }
  };

  //Event Handlers
  onCancelOvertimeTapped() {
    this.setState({
      overtime: '',
      nightOvertime: '',
      isOvertimeDropDownVisible: false,
    });
  }
  onSubmitOvertimeTapped = () => {
    // this.otDropdownRef = null
    //  this.nightOtDropdownRef = null

    this.setState({isOvertimeDropDownVisible: false}, () => {
      Alert.alert(
        'Confirmation',
        'Do you really want to approve timesheet day?',
        [
          {
            text: 'No',
            onPress: () => {
              // this.setState({isOvertimeDropDownVisible:false})
            },
          },
          {
            text: 'Yes',
            onPress: () => {
              this.setState({isLoading: true, isApproveDay: true}, () => {
                this.callApproveRejectDay();
              });
            },
          },
        ],
        // {cancelable: false},
      );
    });
  };

  callApproveRejectDay() {
    //approve day
    if (this.state.isApproveDay === true) {
      var input = {
        overTime: this.state.overTime,
        nightOverTime: this.state.nightOvertime,
        status: 2,
        userId: this.props.user.userId,
        dayId: this.state.data[this.state.index].dayId,
        remark: '',
        request: APPROVE_REJECT_DAY,
      };
      this.props.approveRejectDay(input);
    }

    //reject day
    if (this.state.isApproveDay === false) {
      var statusToSend = '';
      if (
        this.state.selectedDay.dayStatus === '2' ||
        this.state.selectedDay.dayStatus === '7'
      ) {
        //API
        statusToSend = '6';
      } else if (
        this.state.selectedDay.dayStatus === '1' ||
        this.state.selectedDay.dayStatus === '4'
      ) {
        //API call
        statusToSend = '3';
      }

      let input = {
        userId: global.loginUserId,
        status: statusToSend,
        dayId: this.state.data[this.state.index].dayId,
        remark: this.state.remark ? this.state.remark : '',
        // overTime : this.state.overtime ? this.state.overtime  : "",
        // nightOverTime : this.state.nightOvertime ? this.state.nightOvertime :""
      };
      this.props.approveRejectDay(input);
    }
  }

  onCancelReasonTapped = () => {
    this.setState({remark: null, isReasonVisible: false});
  };
  onSubmitReasonTapped() {
    if (this.state.remark) {
      Alert.alert(
        'Confirmation',
        'Do you really want to reject timesheet day?',
        [
          {text: 'No', onPress: () => {}},
          {
            text: 'Yes',
            onPress: () => {
              this.setState({isLoading: true, isApproveDay: false}, () => {
                this.callApproveRejectDay();
              });
            },
          },
        ],
        // {cancelable: false},
      );
    } else {
      this.setState({dialogueError: 'Mandatory'});
    }
  }

  onApproveButtonTapped = () => {
    this.setState({isOvertimeDropDownVisible: true});
  };

  onRejectButtonTapped = () => {
    this.setState({isReasonVisible: true});
  };

  onSubmitButtonTapped = () => {
    this.setState({isReasonVisible: true});
  };

  onReSubmitButtonTapped = () => {
    this.setState({isReasonVisible: true});
  };

  onCancelReasonTapped = () => {
    this.setState({remark: null, isReasonVisible: false});
  };

  sendReason(inputText) {
    if (inputText) {
      this.setState(
        {dialogueError: null, remark: inputText, isReasonVisible: false},
        () => {
          // if(this.state.selectedDay.dayStatus != TimesheetStatus.RejectByHr) {
          if (global.loginUserId == this.state.totalData.userId) {
            Alert.alert(
              translate('confirmation'),
              translate('timesheet_resubmit_hint'),
              [
                {text: 'No', onPress: () => {}},
                {
                  text: 'Yes',
                  onPress: () => {
                    this.setState({isLoading: true}, () => {
                      this.submitReason();
                    });
                  },
                },
              ],
              // {cancelable: false},
            );
          } else {
            console.log('issue in rbutton action --------');

            if (
              this.state.data[this.state.index].dayStatus ==
              TimesheetStatus.RejectByHr
            ) {
              Alert.alert(
                translate('confirmation'),
                translate('timesheet_resubmit_hint'),
                [
                  {text: 'No', onPress: () => {}},
                  {
                    text: 'Yes',
                    onPress: () => {
                      this.setState({isLoading: true}, () => {
                        this.submitReason();
                      });
                    },
                  },
                ],
                // {cancelable: false},
              );
            } else {
              this.setState({isLoading: true, isApproveDay: false}, () => {
                this.callApproveRejectDay();
              });
            }
          }
        },
      );
    } else {
      this.setState({dialogueError: 'Mandatory'});
    }
  }

  submitReason() {
    this.setState({submitLoader: true});
    var input = {
      dayId: this.state.data[this.state.index].dayId,
      userId: this.props.user.userId,
      reason: this.state.remark,
      request: SUBMIT_REASON,
    };
    this.props.submitReason(input);
  }

  renderPrevNextButtons() {
    return (
      <View
        style={{
          position: 'absolute',
          paddingTop: 20,
          height: 80,
          width: '100%',
          backgroundColor: 'clear',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <PrevNextButton title="<" action={this.onPrevButtonTapped} />
        <PrevNextButton title=">" action={this.onNextButtonTapped} />
      </View>
    );
  }

  onPrevButtonTapped = () => {
    // if(this.state.index >= 0 ) {
    this.setState({index: this.state.index - 1});
    this.pager.prevButtonPress(this.state.index - 1);
    // }
  };

  onNextButtonTapped = () => {
    // if(this.state.index < this.state.totalData.data.length ) {
    this.setState({index: this.state.index + 1});
    this.pager.nextButtonPress(this.state.index + 1);
    // }
  };

  onSelectedTimesheetDay(newIndex) {
    if (this.state.totalData !== undefined) {
      const currentSelectedDay = this.state.totalData.data[newIndex];

      // decideTheButtonOnBottomForSelectedDay( this.state.totalData  ,this.state.totalData.data[newIndex], this.state.totalData.status).then( (buttonsType) => {
      //      this.setState({
      //           buttonsType:buttonsType
      //       })
      //    })
      this.setState({
        buttonsType: decideTheButtonOnBottomForSelectedDay(
          this.state.totalData,
          currentSelectedDay
            ? currentSelectedDay
            : this.state.totalData.data[this.state.index],
          this.state.totalData.status,
        ),
        selectedDay: this.state.totalData.data[newIndex],
        index: newIndex,
      });
    }
  }
}

const DailyTimesheetNew = withTheme(DailyTimesheet);

DailyTimesheetNew.navigationOptions = ({navigation, screenProps}) => {
  const {theme} = screenProps;
  const {params = {}} = navigation.state;
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
    successMessage: submitReasonSelector(state.TimesheetReducer),
    dayStatus: approveRejectDaySelector(state.TimesheetReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    submitReason: input => dispatch(submitReason(input)),
    approveRejectDay: input => dispatch(approveRejectDay(input)),
    // getMyDetailTimesheet: input => dispatch(getMyDetailTimesheet(input)),
    // getCompanyPeriod: input => dispatch(getCompanyPeriod(input)),
    // submitTimesheet: input => dispatch(submitTimesheet(input)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(DailyTimesheetNew);
