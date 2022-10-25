/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import Icons from '../../../components/common/Icons';
import { styless } from '../../../components/common/Styles';
import CardView from '../../../components/views/CardView';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import { ListItem } from 'react-native-elements';
import firebase from 'react-native-firebase';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import SyncStorage from 'sync-storage';
class SettingsListCell extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);

    this.state = {
      isDateTimePickerVisible: false,
    };
    this.showDetail = this.showDetail.bind(this);
  }

  componentDidMount() {
    SyncStorage.get('isCheckoutReminderEnabled').then(value => {
      if (value === 'true') {
        this.setState({ enableNotification: true });
      } else {
        this.setState({ enableNotification: false });
      }
    });
    SyncStorage.get('CheckoutTimeFormatted').then(value => {
      this.setState({
        notificationTime: value === null ? moment({ hour: 17 }) : value,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { notificationTime, enableNotification } = this.state;

    if (
      enableNotification !== prevState.enableNotification ||
      notificationTime !== prevState.notificationTime
    ) {
      this.setReminder();
    }
  }

  setReminder = async () => {
    const { notificationTime, enableNotification } = this.state;

    if (enableNotification) {
      firebase.notifications().scheduleNotification(this.buildNotification(), {
        fireDate: notificationTime.valueOf(),
        repeatInterval: 'day',
        exact: true,
      });
    } else {
      return false;
    }
  };

  buildNotification = () => {
    const title = Platform.OS === 'android' ? 'Checkout Reminder' : '';
    const notification = new firebase.notifications.Notification()
      .setNotificationId('100')
      .setTitle(title)
      .setBody('This is a notification')
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .android.setChannelId('reminder')
      .android.setAutoCancel(true);

    return notification;
  };

  enableNotification = value => {
    SyncStorage.set('isCheckoutReminderEnabled', value.toString());

    this.setState({
      enableNotification: value,
    });
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.hideDateTimePicker();

    this.setState({
      notificationTime: moment(date),
    });
    SyncStorage.set(
      'CheckoutTime',
      date,
      'CheckoutTimeFormatted',
      moment(date).format('LT'),
    );
  };

  //MARK: - Main Render

  render() {
    const { theme } = this.props;
    const item = this.props.item;
    const {
      enableNotification,
      isDateTimePickerVisible,
      notificationTime,
    } = this.state;

    return (
      <View
        style={{
          padding: 10,
          justifyContent: 'flex-start',
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: 1,
          }}
          onPress={this.showDetail(item)}>
          <CardView
            cardElevation={0}
            cardMaxElevation={0}
            cornerRadius={0}
            style={styless.leftRight}>
            {item.title === 'Checkout Reminder' ? (
              <View style={{ flex: 1 }}>
                <ListItem
                  title="Checkout Reminder"
                  bottomDivider
                  titleStyle={{ fontSize: 16, color: '#585858' }}
                  switch={{
                    onValueChange: this.enableNotification,
                    value: enableNotification,
                  }}
                />
                {this.state.enableNotification === true ? (
                  <View>
                    <ListItem
                      title="Select time"
                      titleStyle={{ fontSize: 16, color: '#585858' }}
                      onPress={this.showDateTimePicker}
                      rightElement={
                        <Text style={{ opacity: 0.7 }}>
                          {moment(notificationTime).format('LT')}
                        </Text>
                      }
                    />
                    <DateTimePicker
                      isVisible={isDateTimePickerVisible}
                      onConfirm={this.handleDatePicked}
                      onCancel={this.hideDateTimePicker}
                      mode="time"
                      is24Hour={false}
                      date={new Date(notificationTime)}
                      titleIOS="Pick time"
                    />
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10 }}>
                <Text
                  style={[
                    theme.detailLarge,
                    { textTransform: 'none', flex: 0.9 },
                  ]}>
                  {item.title}
                </Text>
                {item.detail !== undefined && (
                  <Text
                    style={[
                      theme.header,
                      { textAlign: 'right', justifyContent: 'flex-end' },
                    ]}
                    textAlign={'right'}>
                    {item.detail}
                  </Text>
                )}
                {item.version === undefined ? (
                  <Icons.MaterialIcons
                    name="keyboard-arrow-right"
                    size={30}
                    color="gray"
                    style={0.1}
                  />
                ) : (
                  <Text
                    style={[
                      theme.header,
                      { textAlign: 'right', justifyContent: 'flex-end' },
                    ]}
                    textAlign={'right'}>
                    {item.version}
                  </Text>
                )}
              </View>
            )}
          </CardView>
        </TouchableOpacity>
      </View>
    );
  }

  //MARK: - Event Handlers
  showDetail = item => e => {
    switch (item.title) {
      case 'Change Password':
        this.props.navigation.navigate('ChangePassword');
        break;
      case 'Privacy Policy':
        this.props.navigation.navigate('WebviewScreen', {
          title: 'Privacy Policy',
        });
        break;
      case 'Terms Of Use':
        this.props.navigation.navigate('WebviewScreen', {
          title: 'Terms Of Use',
        });
        break;
    }
  };

  //MARK: - Render UI
}

export default withTheme(SettingsListCell);
