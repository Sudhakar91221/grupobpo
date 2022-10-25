/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, TouchableOpacity, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {LEAVE_DETAIL, CANCEL_LEAVE} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  leaveDetailSelector,
  cancelLeaveSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getLeaveDetail, cancelLeave} from '../Actions/LeaveActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import moment from 'moment';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {isPermissionAllowed} from '../../../network/APICall';
import DialogInput from '../../../components/views/DialogueInput';
import HeaderDetailComponent from '../../../components/views/HeaderDetailComponent';
import {downloadFile} from '../../FileModule/Actions/FileActions';
import {downloadFileSelector} from '../../FileModule/Actions/selectors';
import {DOWNLOAD_FILE} from '../../FileModule/Actions/type';

class LeaveDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leaveDetail: undefined,
    };
    this.renderLeaveDetailView = this.renderLeaveDetailView.bind(this);
  }

  componentWillMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == LEAVE_DETAIL ||
        this.props.error.request == CANCEL_LEAVE ||
        this.props.error.request == DOWNLOAD_FILE)
    ) {
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

    //get leave details
    if (this.props.api === LEAVE_DETAIL) {
      if (this.props.error !== null && this.props.api === LEAVE_DETAIL) {
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

      if (!this.props.error && this.props.api === LEAVE_DETAIL) {
        if (this.props.leaveDetail !== this.state.leaveDetail) {
          this.setState({leaveDetail: this.props.leaveDetail}, () =>
            this.callDownloadFile(),
          );
        }
      }
    }

    //cancel leave
    if (this.props.api === CANCEL_LEAVE) {
      if (this.props.error !== null && this.props.api === CANCEL_LEAVE) {
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

      if (!this.props.error && this.props.api === CANCEL_LEAVE) {
        if (this.props.leaveId !== this.state.leaveId) {
          Alert.alert(
            'Leave cancelled successfully',
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

    //download file
    if (this.props.downloadAPI === DOWNLOAD_FILE) {
      if (
        this.props.error !== null &&
        this.props.downloadAPI === DOWNLOAD_FILE
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

      if (!this.props.error && this.props.downloadAPI === DOWNLOAD_FILE) {
        if (this.props.downloadUrl !== prevProps.downloadUrl) {
          this.setState({downloadUrl: this.props.downloadUrl});
        }
      }
    }
  }

  render() {
    if (this.state.leaveDetail === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.state.isRemarkViewVisible === true ? (
            <DialogInput
              isDialogVisible={this.state.isRemarkViewVisible}
              title="Remark"
              message="Cancel remark"
              hintInput="Enter remark here"
              submitInput={inputText => {
                this.sendReason(inputText);
              }}
              closeDialog={this.onCancelReasonTapped}
              // onEndEditing={this.onEndEditingDialgueInput}
              onChangeText={this.onStartTypingReason}
              error={this.state.dialogueError}
            />
          ) : null}

          {this.renderLeaveDetailView()}

          <View style={{flexDirection: 'row'}}>
            {isPermissionAllowed('Leave/update') &&
            this.isDateValid() &&
            this.state.leaveDetail.user === this.props.user.userId &&
            this.state.leaveDetail.leaveStatus === '0' ? (
              <View
                style={{
                  paddingLeft: '5%',
                  paddingRight: '5%',
                  paddingBottom: 10,
                  paddingTop: 10,
                  flex: 1,
                }}>
                <BottomButton
                  style={styless.bottomButton}
                  title={translate('update')}
                  action={() =>
                    this.props.navigation.navigate('UpdateLeave', {
                      leaveDetail: this.state.leaveDetail,
                    })
                  }
                  isLoader={this.state.submitLoader}
                  isGray={this.state.submitGray}
                />
              </View>
            ) : null}
            {isPermissionAllowed('Leave/cancel') &&
            this.isDateValid() &&
            this.state.leaveDetail.user === this.props.user.userId &&
            (this.state.leaveDetail.leaveStatus === '0' ||
              this.state.leaveDetail.leaveStatus === '1') ? (
              <View
                style={{
                  paddingLeft: '5%',
                  paddingRight: '5%',
                  paddingBottom: 10,
                  paddingTop: 10,
                  flex: 1,
                }}>
                <BottomButton
                  style={styless.bottomButton}
                  title={translate('cancel')}
                  action={() => this.setState({isRemarkViewVisible: true})}
                  isLoader={this.state.submitLoader}
                  isGray={this.state.submitGray}
                />
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    );
  }

  renderLeaveDetailView() {
    const {theme} = this.props;
    const item = this.state.leaveDetail;
    var leaveStatus = '';
    switch (item.leaveStatus) {
      case '0':
        leaveStatus = translate('pending');
        break;
      case '1':
        leaveStatus = translate('approved');
        break;
      case '2':
        leaveStatus = translate('rejected');
        break;
      case '3':
        leaveStatus = translate('cancelled');
        break;
    }
    var leavePeriod =
      item.leaveDays > 1
        ? item.leaveStart + ' - ' + item.leaveEnd
        : item.leaveStart;
    var session =
      item.leaveDays > 0.5
        ? item.leaveDays
        : item.leaveDays + ' (' + this.getSession(item.leaveSession) + ')';
    var appliedBy =
      item.user === this.props.user.userId
        ? translate('you') + ' @ ' + item.leaveApplyOn
        : item.leaveAppliedByName + ' @ ' + item.leaveApplyOn;
    return (
      <View style={{flex: 1}}>
        <HeaderDetailComponent
          header={translate('subject')}
          image={'ic_leave_description'}
          description={item.leaveTitle}
        />
        <HeaderDetailComponent
          header={translate('description')}
          image={'ic_leave_description'}
          description={item.leaveReason}
        />
        <HeaderDetailComponent
          header={translate('leave_type_status')}
          image={'ic_leave_leave_status'}
          description={item.leaveTypeName + '  (' + leaveStatus + ')'}
        />
        <HeaderDetailComponent
          header={translate('leave_period')}
          image={'ic_leave_calendar'}
          description={leavePeriod}
        />
        <HeaderDetailComponent
          header={translate('days_session')}
          image={'ic_leave_balance'}
          description={session}
        />
        <HeaderDetailComponent
          header={translate('applied_by')}
          image={'ic_leave_approving_officer'}
          description={appliedBy}
        />
        {item.attachment === null ? null : (
          <TouchableOpacity
            onPress={() =>
              this.state.downloadUrl === undefined
                ? null
                : this.props.navigation.navigate('ImageViewer', {
                    imageUrl: this.state.downloadUrl,
                    downloadImage: false,
                  })
            }>
            <HeaderDetailComponent
              header={translate('attachment')}
              image={'ic_leave_attachment'}
              description={item.attachment}
              isAttachment={true}
            />
          </TouchableOpacity>
        )}
        <HeaderDetailComponent
          header={translate('approving_officer')}
          image={'ic_leave_approving_officer'}
          description={item.leaveApprovalOfcName}
        />
        {item.leaveStatus === '2' ? (
          <HeaderDetailComponent
            header={translate('rejected_by')}
            image={'ic_leave_approving_officer'}
            description={item.leaveApproveRejectByName}
          />
        ) : null}
        {item.leaveStatus === '1' ? (
          <HeaderDetailComponent
            header={translate('approved_by')}
            image={'ic_leave_approving_officer'}
            description={item.leaveApproveRejectByName}
          />
        ) : null}
        {item.leaveStatus === '1' || item.leaveStatus === '2' ? (
          <HeaderDetailComponent
            header={translate('approve_reject_remarks')}
            image={'ic_leave_approving_officer'}
            description={item.leaveApproveRejectRemark}
          />
        ) : null}
        {item.leaveStatus === '3' ? (
          <HeaderDetailComponent
            header={translate('cancelled_by')}
            image={'ic_leave_approving_officer'}
            description={item.leaveCancelByName}
          />
        ) : null}
        {item.leaveStatus === '3' ? (
          <HeaderDetailComponent
            header={translate('cancel_remark')}
            image={'ic_leave_approving_officer'}
            description={item.leaveCancelRemark}
          />
        ) : null}
      </View>
    );
  }

  getSession(session) {
    var sessionValue = '';
    switch (session) {
      case 0:
        sessionValue = translate('full_day');
        break;
      case 0:
        sessionValue = translate('am');
        break;
      case 0:
        sessionValue = translate('pm');
        break;
    }
    return sessionValue;
  }

  isDateValid() {
    var last = this.state.leaveDetail.leaveStart;
    var startDate = moment(last).format('YYYY-MM-DD');
    var today = moment().format('YYYY-MM-DD');
    // if today is before last date then hide submit button
    var d1 = Date.parse(today);
    var d2 = Date.parse(startDate);
    if (d2 > d1) {
      return true;
    }
    return false;
  }

  onCancelReasonTapped = () => {
    this.setState({remark: null, isRemarkViewVisible: false});
  };

  onStartTypingReason = input => {
    if (input.length > 0) {
      if (this.state.dialogueError) {
        this.setState({dialogueError: null});
      }
    }
  };

  sendReason(inputText) {
    if (inputText) {
      this.setState(
        {dialogueError: null, remark: inputText, isRemarkViewVisible: false},
        () => {
          Alert.alert(
            translate('confirmation'),
            translate('cancel_leave_hint'),
            [
              {text: 'No', onPress: () => {}},
              {
                text: 'Yes',
                onPress: () => {
                  this.setState({isLoading: true}, () => {
                    this.cancelLeave();
                  });
                },
              },
            ],
            // {cancelable: false},
          );
        },
      );
    } else {
      this.setState({dialogueError: 'Mandatory'});
    }
  }

  cancelLeave() {
    var input = {
      leaveId: this.props.navigation.state.params.leaveId,
      user: this.state.leaveDetail.user,
      remark: this.state.remark,
      request: CANCEL_LEAVE,
    };
    this.props.cancelLeave(input);
  }

  fetchData() {
    var input = {
      leaveId: this.props.navigation.state.params.leaveId,
      request: LEAVE_DETAIL,
    };
    this.props.getLeaveDetail(input);
  }

  callDownloadFile() {
    var input = {
      fileName: this.state.leaveDetail.attachment,
      request: DOWNLOAD_FILE,
    };
    this.props.downloadFile(input);
  }
}
const LeaveDetailNew = withTheme(LeaveDetail);
LeaveDetailNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    leaveDetail: leaveDetailSelector(state.LeaveReducer),
    leaveId: cancelLeaveSelector(state.LeaveReducer),
    downloadAPI: apiSelector(state.FileReducer),
    downloadUrl: downloadFileSelector(state.FileReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getLeaveDetail: input => dispatch(getLeaveDetail(input)),
    cancelLeave: input => dispatch(cancelLeave(input)),
    downloadFile: input => dispatch(downloadFile(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaveDetailNew);
