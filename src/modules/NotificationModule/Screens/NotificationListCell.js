/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text, Alert} from 'react-native';
import moment from 'moment';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {connect} from 'react-redux';
import {
  isLoadingSelector,
  notificationListSelector,
  apiSelector,
  errorSelector,
  markNotificationReadSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {markNotificationRead} from '../Actions/NotificationActions';
import {MARK_NOTIFICATION_READ} from '../Actions/type';
import {NotificationTypes} from '../Actions/NotificationIntegers';
class NotificationListCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
    this.showDetail = this.showDetail.bind(this);
    this.callMarkNotificationReadAPI = this.callMarkNotificationReadAPI.bind(
      this,
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      this.props.error.request == MARK_NOTIFICATION_READ
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

    //mark notification read
    if (this.props.api === MARK_NOTIFICATION_READ) {
      if (
        this.props.error !== null &&
        this.props.api === MARK_NOTIFICATION_READ
      ) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
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

      if (!this.props.error && this.props.api === MARK_NOTIFICATION_READ) {
        if (this.props.success !== prevProps.success) {
          this.setState({
            notifications: this.props.notifications,
            refreshing: false,
          });
        }
      }
    }
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;

    const time = moment(item.timeStamp).format('DD MMM YYYY @ hh:mm A');

    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: 1,
          }}
          onPress={this.showDetail(item)}>
          <View style={{padding: 5, flex: 1}}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text
                style={
                  ([theme.header],
                  {
                    color: theme.primaryColor,
                    fontWeight: 'bold',
                    fontSize: 16,
                    flex: 1,
                  })
                }>
                {item.msg}
              </Text>
              {item.readStatus === '0' ? (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    margin: 10,
                  }}
                />
              ) : null}
            </View>

            <Text style={[theme.detail, {textAlign: 'left', color: 'gray'}]}>
              {time}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  //MARK: - Event Handlers
  showDetail = item => e => {
    if (item.readStatus === '0') {
      this.callMarkNotificationReadAPI();
    }
    switch (parseInt(item.type)) {
      case NotificationTypes.NOTIFICATION_TYPE_HOLIDAY:
        // no navigation
        break;
      case NotificationTypes.NOTIFICATION_TYPE_ANNOUNCEMENT:
        this.props.navigation.navigate('AnnouncementDetail', {
          announcementId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_EVENT_ADD:
        this.props.navigation.navigate('EventDetail', {
          eventId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_EVENT_RESPONSE:
        this.props.navigation.navigate('EventDetail', {
          eventId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_STAFF_ASSIGN:
        //no navigation
        break;
      case NotificationTypes.NOTIFICATION_TYPE_REQUEST_TO_HR:
        this.props.navigation.navigate('StaffRequestDetail', {
          requestId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_REQUEST_REPLY:
        this.props.navigation.navigate('MyRequestDetail', {
          requestId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_APPLY_LEAVE:
        this.props.navigation.navigate('StaffLeaveDetail', {
          leaveId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_APPROVE_LEAVE:
        this.props.navigation.navigate('LeaveDetail', {
          leaveId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_REJECT_LEAVE:
        this.props.navigation.navigate('LeaveDetail', {
          leaveId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_CANCEL_LEAVE:
        this.props.navigation.navigate('StaffLeaveDetail', {
          leaveId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_ADDED_BY_ADMIN_TO_STAFF:
        this.props.navigation.navigate('LeaveDetail', {
          leaveId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_ADDED_BY_SUPERVISOR:
        this.props.navigation.navigate('StaffLeaveDetail', {
          leaveId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_SUBMIT_TIMESHEET:
        this.props.navigation.navigate('MonthlyTimesheetScreen', {
          timesheetId: item.typeId,
          isMyTimesheet: false,
          isFromNotification: true,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_APPROVE_TIMESHEET:
        this.props.navigation.navigate('MonthlyTimesheetScreen', {
          timesheetId: item.typeId,
          isMyTimesheet: true,
          isFromNotification: true,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_REJECT_TIMESHEET:
        this.props.navigation.navigate('MonthlyTimesheetScreen', {
          timesheetId: item.typeId,
          isMyTimesheet: true,
          isFromNotification: true,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_INVITEE_REMOVED:
        //no navigation
        break;
      case NotificationTypes.NOTIFICATION_TYPE_ACCEPT_REQUEST:
        this.props.navigation.navigate('MyRequestDetail', {
          requestId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_DECLINE_REQUEST:
        this.props.navigation.navigate('StaffRequestDetail', {
          requestId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_EMERGENCY_NUMBER:
        //no navigation
        break;
      case NotificationTypes.NOTIFICATION_TYPE_RESUBMIT_TIMESHEET:
        this.props.navigation.navigate('MonthlyTimesheetScreen', {
          timesheetId: item.typeId,
          isMyTimesheet: false,
          isFromNotification: true,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_UPCOMING_PENDING_LEAVES:
        this.props.navigation.navigate('StaffLeaves', {
          senddate: item.senddate,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_OCCURRENCE_SUBMIT:
        this.props.navigation.navigate('OccurrenceDetails', {
          occId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_OCCURRENCE_APPROVE:
        this.props.navigation.navigate('OccurrenceDetails', {
          occId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_OCCURRENCE_REJECT:
        this.props.navigation.navigate('OccurrenceDetails', {
          occId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_TICKET_ASSIGN:
        this.props.navigation.navigate('SupportDetail', {
          supportId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_TICKET_REPLY:
        this.props.navigation.navigate('SupportDetail', {
          supportId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_TICKET_CLOSED:
        this.props.navigation.navigate('SupportDetail', {
          supportId: item.typeId,
          userId: item.senderId,
        });
        break;
      case NotificationTypes.NOTIFICATION_TYPE_TIMESHEET_SUBMIT_REMINDER:
        this.props.navigation.navigate('MonthlyTimesheetScreen', {
          timesheetId: item.typeId,
          isMyTimesheet: true,
          isFromNotification: true,
          userId: item.senderId,
        });
        break;
    }
  };

  callMarkNotificationReadAPI() {
    var input = {
      userId: this.props.user.userId,
      notiId: this.props.item.notiId,
      request: MARK_NOTIFICATION_READ,
    };
    this.props.markNotificationRead(input);
  }
}

//MARK: - Data Management
function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    notifications: notificationListSelector(state.NotificationReducer),
    isLoading: isLoadingSelector(state.NotificationReducer),
    api: apiSelector(state.NotificationReducer),
    error: errorSelector(state.NotificationReducer),
    success: markNotificationReadSelector(state.NotificationReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    markNotificationRead: input => dispatch(markNotificationRead(input)),
  };
}

const NotificationListCellNew = withTheme(NotificationListCell);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationListCellNew);
