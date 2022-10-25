/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Alert, AppState } from 'react-native';
import Main from './src/modules/Base/Main';

import { notifications, NotificationMessage, Android } from 'react-native-firebase-push-notifications'

import SyncStorage from 'sync-storage';
import { withTheme } from './src/components/common/Theme/themeProvider';
// import crashlytics from '@react-native-firebase/crashlytics';

export const MainWithTheme = ({ navigation }) => {
  return <Main screenProps={{ navigation }} />;
};

export default class App extends React.PureComponent {
  render() {
    return <Main screenProps={{ selectedTab: this.state.selectedTab }} />;
  }

  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config

    this.state = {
      selectedTab: 0,
      appState: AppState.currentState,
      isFromNotification: false,
    };
    this.createNotificationListeners = this.createNotificationListeners.bind(
      this,
    );
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  async componentDidMount() {
    // Create notification channel required for Android devices
    // crashlytics().log('App mounted.');

    this.createNotificationChannel();
    this.checkPermission();
    //
    RNLocalize.addEventListener('change', this.handleLocalizationChange);

    if (isIOS) {
      this.createNotificationListeners(this.props.navigation);
      AppState.addEventListener('change', this._handleAppStateChange);
    }
  }

  async componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);

    if (isIOS) {
      this.notificationListener();
      this.notificationOpenedListener();
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
  }

  createNotificationChannel = async () => {
    // Build a android notification channel

    //required for Android
    const channel = new Android.Channel(
      "reminder",
      "Reminders Channel",
      Android.Importance.Max
    ).setDescription("Used for getting reminder notification")

    // for android create the channel
    notifications.android().createChannel(channel)
    await notifications.displayNotification(
      new NotificationMessage()
        .setNotificationId("reminder")
        .setTitle("Reminders Channel")
        .setBody("Used for getting reminder notification")
        .android.setChannelId("reminder") //required for android
    )

  };

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
  };
  _handleAppStateChange = nextAppState => {
    this.setState({ appState: nextAppState });

    if (nextAppState === 'background') {
      // Do something here on app background.
      console.log('App is in Background Mode.');
    }

    if (nextAppState === 'active') {
      // Do something here on app active foreground mode.
      //console.log('App is in Active Foreground Mode.');
    }

    if (nextAppState === 'inactive') {
      // Do something here on app inactive mode.
      console.log('App is in inactive Mode.');
    }
  };

  //1
  async checkPermission() {

    const enabled = await notifications.hasPermission()
    if (enabled) {
      this.getToken();

      // We've the permission
      this.notificationListener = notifications
        .onNotification(async notification => {
          // Display your notification
          await notifications.displayNotification(notification);
        });
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = SyncStorage.get('fcmToken');
    if (!fcmToken) {
      fcmToken = await notifications.getToken();
      if (fcmToken) {
        // user has a device token
        await SyncStorage.set('fcmToken', fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await notifications.requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    // * Triggered when a particular notification has been received in foreground
    // *
    this.notificationDisplayedListener = notifications
      .onNotificationDisplayed(notification => {
        const { title, body } = notification;

        this.handleNotification(notification.notification);

        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });

    this.notificationListener = notifications
      .onNotification(notification => {
        this.handleNotification(notification.notification);
      });

    // * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    // *
    this.notificationOpenedListener = notifications
      .onNotificationOpened(notificationOpen => {
        const { title, body } = notificationOpen.notification;

        this.handleNotification(notificationOpen.notification);
        // this.render();
      });

    // * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    // *
    const notificationOpen = await notifications
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;

      this.handleNotification(notificationOpen.notification);
    }

    //TODO -- Need to chnage the notification message 

    // * Triggered for data only payload in foreground
    // *
    // this.messageListener = notifications.onMessage(message => {
    //   // let notificationObject = JSON.parse(
    //   //     notificationOpen.notification.data['gcm.notification.data'],
    //   //   );
    //   let notiType = message.data.type;

    //   switch (notiType) {
    //     case 1:
    //     // this.navigator.dispatch(
    //     //   NavigationActions.navigate({routeName: 'eApplications'}),
    //     // );
    //     // break;
    //   }
    //   // this.showAlert(message.title + 'notificationOpenedListner', notiType);

    //   global.selectedTab = EcityTabs[notiType];
    //   console.log(JSON.stringify(message));
    //   // this.callAddNotifications()

    //   // this.showAlert(message.data.msg, message.data.msg);
    // });
  }
  handleNotification(notification) {
    // let notificationObject = JSON.parse(
    //   notification.data['gcm.notification.data'],
    // );
    let notificationObject = notification.data;
    let notiType = notificationObject.type;

    switch (parseInt(notiType)) {
      case 1:
      // this.navigator.dispatch(
      //   NavigationActions.navigate({routeName: 'eApplications'}),
      // );
      // break;
    }
    // this.showAlert(notification.title + 'notificationOpenedListner', notiType);

    global.selectedTab = EcityTabs[notiType];
    global.isFromiOSNotification = true;
    this.setState({ isFromNotification: true });
    // this.callAddNotifications(notificationObject)
  }
  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  }
}

//MARK- Internationalizations

import { I18nManager, SafeAreaView, StyleSheet, Text } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import { NavigationActions } from 'react-navigation';
import { EcityTabs } from './src/modules/Base/BottomTab/BottomTab';
import { isIOS, ScreenWidth } from './src/components/utility/Settings';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./src/translations/en.json'),
  hi: () => require('./src/translations/hi.json'),
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = { languageTag: 'en', isRTL: false };

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

//testing of gitflow working
