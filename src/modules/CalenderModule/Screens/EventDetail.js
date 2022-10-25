/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import {
  EVENT_DETAIL,
  GET_EVENT_ATTENDEE,
  GIVE_EVENT_ATTENDANCE,
  DELETE_EVENT,
} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  eventDetailSelector,
  eventAttendeeSelector,
  eventAttendanceSelector,
  eventDeleteSelector,
} from '../Actions/selectors';
import { getAttachmentUrl } from '../../../components/utility/common'
import { userLoginSelector } from '../../AuthModule/Actions/selectors';
import {
  eventDetail,
  getEventAttendee,
  giveEventAttendance,
  deleteEvent,
} from '../Actions/CalenderActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import { connect } from 'react-redux';
import moment from 'moment';
import { translate } from '../../../../App';
import HeaderDetailComponent from '../../../components/views/HeaderDetailComponent';
// import CardView from 'react-native-cardview';
import { BottomButton } from '../../../components/views/Button';
import { isPermissionAllowed } from '../../../network/APICall';
import { styless } from '../../../components/common/Styles';
import { downloadFile } from '../../FileModule/Actions/FileActions';
import { downloadFileSelector } from '../../FileModule/Actions/selectors';
import { DOWNLOAD_FILE } from '../../FileModule/Actions/type';
import { ImageComponent } from '../../FormsComponent/Component/Image/ImageComponent';
import { ScreenHeight, ScreenWidth } from '../../../components/utility/Settings'
import InputForm from '../../FormsComponent/Forms/InputForm';

class EventDetail extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      eventModel: undefined,
      total: 0,
      downloadUrl: undefined,
      formData: undefined
    };


    this.currentPageRef = {};
    this.renderEventDetailView = this.renderEventDetailView.bind(this);
    this.renderCards = this.renderCards.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.callAttendanceAPI = this.callAttendanceAPI.bind(this);
    this.showDeleteAlert = this.showDeleteAlert.bind(this);
    this.onDeleteButtonTapped = this.onDeleteButtonTapped.bind(this);
    this.callDownloadFile = this.callDownloadFile.bind(this);
  }
  async setData() {
    let attachment = await getAttachmentUrl(this.state.eventModel.attachment);
    let formData = {
      fields: [
        {
          "name": "attachment",
          "type": "3",
          "lable": "Attachment",
          value: attachment,

        },
      ],
    };
    this.setState({ attachment: attachment, formData: formData });
  }
  // async componentWillMount() {
  // }

  async componentDidMount() {
    this.fetchData();

  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == EVENT_DETAIL ||
        this.props.error.request == GET_EVENT_ATTENDEE ||
        this.props.error.request == GIVE_EVENT_ATTENDANCE ||
        this.props.error.request == DELETE_EVENT ||
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

          { cancelable: false },
        );
      }
    }

    //get event details
    if (this.props.api === EVENT_DETAIL) {
      if (this.props.error !== null && this.props.api === EVENT_DETAIL) {
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
            { cancelable: false },
          );
        }
      }

      if (!this.props.error && this.props.api === EVENT_DETAIL) {
        if (this.props.eventModel !== prevProps.eventModel) {
          this.setState({ eventModel: this.props.eventModel }, () =>
            this.setData(),

            // this.callDownloadFile(),
          );
          var input = {
            userId: this.props.user.userId,
            eventId: this.props.navigation.state.params.eventId,
            request: GET_EVENT_ATTENDEE,
          };
          this.props.getEventAttendee(input);
        }
      }
    }

    //get event attendees
    if (this.props.api === GET_EVENT_ATTENDEE) {
      if (this.props.error !== null && this.props.api === GET_EVENT_ATTENDEE) {
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
            { cancelable: false },
          );
        }
      }

      if (!this.props.error && this.props.api === GET_EVENT_ATTENDEE) {
        if (this.props.eventAttendee !== prevProps.eventAttendee) {
          let going = this.props.eventAttendee.going.length;
          let notGoing = this.props.eventAttendee.notgoing.length;
          let maybe = this.props.eventAttendee.maybe.length;
          let pending = this.props.eventAttendee.pending.length;
          let total = going + notGoing + maybe + pending;
          this.setState({
            eventAttendee: this.props.eventAttendee,
            total: total,
            going: going,
            notGoing: notGoing,
            maybe: maybe,
          });
        }
      }
    }

    //give event attendance
    if (this.props.api === GIVE_EVENT_ATTENDANCE) {
      if (
        this.props.error !== null &&
        this.props.api === GIVE_EVENT_ATTENDANCE
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
            { cancelable: false },
          );
        }
      }

      if (!this.props.error && this.props.api === GIVE_EVENT_ATTENDANCE) {
        if (this.props.attendanceSuccess !== prevProps.attendanceSuccess) {
          this.props.navigation.goBack();
        }
      }
    }

    //delete event
    if (this.props.api === DELETE_EVENT) {
      if (this.props.error !== null && this.props.api === DELETE_EVENT) {
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
            { cancelable: false },
          );
        }
      }

      if (!this.props.error && this.props.api === DELETE_EVENT) {
        if (this.props.deleteEventSuccess !== prevProps.deleteEventSuccess) {
          Alert.alert(
            'Event deleted successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.navigation.goBack();
                },
              },
            ],
            { cancelable: false },
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
            { cancelable: false },
          );
        }
      }

      if (!this.props.error && this.props.downloadAPI === DOWNLOAD_FILE) {
        if (this.props.downloadUrl !== prevProps.downloadUrl) {
          this.setState({ downloadUrl: this.props.downloadUrl });
        }
      }
    }
  }

  render() {
    if (this.state.eventModel === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {this.renderEventDetailView()}

          {isPermissionAllowed('Event/giveEventResponce') && this.isDateValid()
            ? this.renderButtons()
            : null}

          {this.renderUpdateDeleteButtons()}
        </View>
      </ScrollView>
    );
  }

  renderEventDetailView() {
    const item = this.state.eventModel;

    let momentObj = moment(item.startTime, 'HH:mm:ss');
    let startTime = moment(momentObj).format('HH:mm a');
    let momentObj1 = moment(item.endTime, 'HH:mm:ss');
    let endTime = moment(momentObj1).format('HH:mm a');
    var time = startTime + ' to ' + endTime;

    var date =
      moment(item.startDate).format('DD MMM YYYY') +
      ' to ' +
      moment(item.endDate).format('DD MMM YYYY');

    let attendee = 'Invited ' + this.state.total + ' people for this event';

    return (
      <View style={{ flex: 1, padding: 10 }}>
        <HeaderDetailComponent
          header={translate('event_type')}
          image={'ic_leave_description'}
          description={item.type}
        />
        <HeaderDetailComponent
          header={translate('event_title')}
          image={'ic_leave_description'}
          description={item.title}
        />
        <HeaderDetailComponent
          header={translate('event_date')}
          image={'ic_leave_calendar'}
          description={date}
        />
        <HeaderDetailComponent
          header={translate('event_time')}
          image={'ic_leave_calendar'}
          description={time}
        />
        <HeaderDetailComponent
          header={translate('event_description')}
          image={'ic_leave_description'}
          description={item.details}
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
            {this.state.formData !== undefined &&
              <InputForm
                onRef={ref => {
                  this.currentPageRef['event'] = ref;
                }}
                item={this.state.formData}
                blockModel={this.state.formData}
                formId={'0'}
                navigation={this.props.navigation}
                hideBottomButton={true}
              />
            }
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('AttendeeList', {
              attendeeList: this.state.eventModel.list,
              title: translate('attendees'),
            })
          }>
          <HeaderDetailComponent
            header={translate('attendees')}
            image={'ic_leave_approving_officer'}
            description={attendee}
          />
        </TouchableOpacity>
        {this.renderCards()}
      </View>
    );
  }

  renderCards() {
    const { theme } = this.props;
    return (
      <View style={{ flexDirection: 'row' }}>
        {/* <CardView
          style={{
            width: '100%',
            flex: 1,
            padding: 5,
            margin: 10,
            marginBottom: 10,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}> */}
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() =>
            this.props.navigation.navigate('AttendeeList', {
              attendeeList: this.state.eventAttendee.going,
              title: translate('going'),
            })
          }>
          <Text
            style={[
              theme.detail,
              {
                color: 'gray',
                fontWeight: '600',
                fontSize: 16,
              },
            ]}>
            {translate('going')}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.primaryColor,
                fontWeight: 'bold',
                fontSize: 18,
              },
            ]}>
            {this.state.going}
          </Text>
        </TouchableOpacity>
        {/* </CardView>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            padding: 5,
            margin: 10,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}> */}
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() =>
            this.props.navigation.navigate('AttendeeList', {
              attendeeList: this.state.eventAttendee.notgoing,
              title: translate('notGoing'),
            })
          }>
          <Text
            style={[
              theme.detail,
              {
                color: 'gray',
                fontWeight: '600',
                fontSize: 16,
              },
            ]}>
            {translate('notGoing')}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.primaryColor,
                fontWeight: 'bold',
                fontSize: 18,
              },
            ]}>
            {this.state.notGoing}
          </Text>
        </TouchableOpacity>
        {/* </CardView>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            padding: 5,
            margin: 10,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}> */}
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() =>
            this.props.navigation.navigate('AttendeeList', {
              attendeeList: this.state.eventAttendee.maybe,
              title: translate('maybe'),
            })
          }>
          <Text
            style={[
              theme.detail,
              {
                color: 'gray',
                fontWeight: '600',
                fontSize: 16,
              },
            ]}>
            {translate('maybe')}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.primaryColor,
                fontWeight: 'bold',
                fontSize: 18,
              },
            ]}>
            {this.state.maybe}
          </Text>
        </TouchableOpacity>
        {/* </CardView> */}
      </View>
    );
  }

  renderUpdateDeleteButtons() {
    return (
      <View style={{ flexDirection: 'row', padding: 10, marginTop: 50 }}>
        {isPermissionAllowed('Event/update') &&
          this.isDateValid() &&
          this.state.eventModel.userId === this.props.user.userId ? (
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
                this.props.navigation.navigate('EventUpdate', {
                  item: this.state.eventModel,
                })
              }
              isLoader={this.state.submitLoader}
              isGray={this.state.submitGray}
            />
          </View>
        ) : null}
        {isPermissionAllowed('Event/delete') &&
          this.isDateValid() &&
          this.state.eventModel.userId === this.props.user.userId ? (
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
              title={translate('delete')}
              action={() => this.showDeleteAlert()}
              isLoader={this.state.submitLoader}
              isGray={this.state.submitGray}
            />
          </View>
        ) : null}
      </View>
    );
  }

  callDownloadFile() {
    var input = {
      fileName: this.state.eventModel.attachment,
      request: DOWNLOAD_FILE,
    };
    this.props.downloadFile(input);
  }

  showDeleteAlert() {
    Alert.alert(
      '',
      translate('delete_event'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: this.onDeleteButtonTapped },
      ],
      { cancelable: false },
    );
  }

  onDeleteButtonTapped() {
    var input = {
      eventId: this.state.eventModel.eventId,
      userId: this.props.user.userId,
      request: DELETE_EVENT,
    };
    this.props.deleteEvent(input);
  }

  renderButtons() {
    return (
      <View style={{ flexDirection: 'row', padding: 10, marginTop: 50 }}>
        <BottomButton
          style={{ flex: 1, borderRadius: 50, margin: 10 }}
          title={translate('going')}
          action={() => this.callAttendanceAPI(1)}
        />
        <BottomButton
          style={{ flex: 1, borderRadius: 50, margin: 10 }}
          title={translate('notGoing')}
          action={() => this.callAttendanceAPI(3)}
        />
        <BottomButton
          style={{ flex: 1, borderRadius: 50, margin: 10 }}
          title={translate('maybe')}
          action={() => this.callAttendanceAPI(2)}
        />
      </View>
    );
  }

  callAttendanceAPI(status) {
    var input = {
      userId: this.props.user.userId,
      eventId: this.state.eventModel.eventId,
      responceStatus: status,
      request: GIVE_EVENT_ATTENDANCE,
    };
    this.props.giveEventAttendance(input);
  }

  isDateValid() {
    var last = this.state.eventModel.startDate;
    var startDate = moment(last).format('YYYY-MM-DD');
    var today = moment().format('YYYY-MM-DD');
    // if today is before last date then hide button
    var d1 = Date.parse(today);
    var d2 = Date.parse(startDate);
    if (d2 > d1) {
      return true;
    }
    return false;
  }

  fetchData() {
    if (this.props.navigation.state.params) {
      var input = {
        userId: this.props.user.userId,
        companyId: this.props.user.userCompany,
        startDate: '',
        endDate: '',
        page: 0,
        pageFlag: 1,
        eventId: this.props.navigation.state.params.eventId,
        request: EVENT_DETAIL,
      };
      this.props.eventDetail(input);
    }
  }
}
const EventDetailNew = withTheme(EventDetail);
EventDetailNew.navigationOptions = ({ navigation, screenProps, params }) => {
  const { theme } = screenProps;
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
    isLoading: isLoadingSelector(state.CalenderReducer),
    api: apiSelector(state.CalenderReducer),
    error: errorSelector(state.CalenderReducer),
    eventModel: eventDetailSelector(state.CalenderReducer),
    eventAttendee: eventAttendeeSelector(state.CalenderReducer),
    attendanceSuccess: eventAttendanceSelector(state.CalenderReducer),
    deleteEventSuccess: eventDeleteSelector(state.CalenderReducer),
    downloadAPI: apiSelector(state.FileReducer),
    downloadUrl: downloadFileSelector(state.FileReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    eventDetail: input => dispatch(eventDetail(input)),
    getEventAttendee: input => dispatch(getEventAttendee(input)),
    giveEventAttendance: input => dispatch(giveEventAttendance(input)),
    deleteEvent: input => dispatch(deleteEvent(input)),
    downloadFile: input => dispatch(downloadFile(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetailNew);
