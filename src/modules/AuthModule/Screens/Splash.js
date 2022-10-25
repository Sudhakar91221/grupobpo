/* eslint-disable no-lone-blocks */
import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator, Alert, AppState} from 'react-native';
import Wallpaper from '../../Base/Wallpaper';
import {
  ScreenWidth,
  ScreenHeight,
  isIOS,
} from '../../../components/utility/Settings';
import SyncStorage from 'sync-storage';
import firebase, {NotificationOpen, Notification} from 'react-native-firebase';
import {EcityTabs} from '../../Base/BottomTab/BottomTab';
import {StackActions, NavigationActions} from 'react-navigation';

import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {loginUser} from '../../FormsComponent/Actions/FormActions';
import {USER_LOGIN} from '../../FormsComponent/Actions/type';

import {connect} from 'react-redux';
import {
  homeNotificationListSelector,
  isLoadingSelector,
  apiSelector,
  errorSelector,
  successSelector,
} from '../../NotificationModule/Actions/selectors';
import {
  addNotification,
  getHomeNotifications,
} from '../../NotificationModule/Actions/NotificationActions';
import {GET_HOME_NOTIFICATIONS} from '../../NotificationModule/Actions/type';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLaunch: false,
      appState: AppState.currentState,
      isFromNotification: false,
      userLoggedIn: false,
    };

    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  static navigationOptions = ({navigation}) => {
    return null;
  };

  componentWillUnmount() {
    if (!isIOS) {
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
  }

  _handleAppStateChange = nextAppState => {
    this.setState({appState: nextAppState});

    if (nextAppState === 'background') {
      // Do something here on app background.
      console.log('App is in Background Mode.');
    }

    if (nextAppState === 'active') {
      // Do something here on app active foreground mode.
      // console.log('App is in Active Foreground Mode.');
    }

    if (nextAppState === 'inactive') {
      // Do something here on app inactive mode.
      console.log('App is in inactive Mode.');
    }
  };

  async componentWillMount() {
    // if(!isIOS) {
    this.notificationListener();
    this.notificationOpenedListener();
    AppState.addEventListener('change', this._handleAppStateChange);
    // }
  }

  async componentDidMount() {
    
    this.createNotificationListeners();
    
    setTimeout(() => {
      SyncStorage.get('isFromLogout').then(value => {
        if (value === 'true') {
          SyncStorage.get('user').then(value => {
            if (value === null) {
              SyncStorage.get('alreadyLaunched').then(value => {
                if (value === null) {
                  SyncStorage.set('alreadyLaunched', 'true');
                  this.props.navigation.navigate('Login');
                } else {
                  this.props.navigation.navigate('Login');
                }
              });
            } else {
              const user = JSON.parse(value);
              global.user = user;
              global.loginUserId = user.userId;

              var input = {
                userId: user.userId,
                page: 1,
                request: GET_HOME_NOTIFICATIONS,
              };
              this.props.getHomeNotifications(input);

              if (user.verifyApprover === '0') {
                //in show review process
                this.props.navigation.navigate('Login');
              } else if (user.verifyApprover === '1') {
                //can access app
                this.props.navigation.navigate('Login');
              } else {
                this.props.navigation.navigate('Login');
              }
            }
          });
        } else {
          SyncStorage.get('user').then(value => {
            if (value === null) {
              SyncStorage.get('alreadyLaunched').then(value => {
                if (value === null) {
                  SyncStorage.set('alreadyLaunched', 'true');
                  this.props.navigation.navigate('Login');
                } else {
                  this.props.navigation.navigate('Login');
                }
              });
            } else {
              const user = JSON.parse(value);
              global.user = user;
              global.loginUserId = user.userId;

              var input = {
                userId: user.userId,
                page: 1,
                request: GET_HOME_NOTIFICATIONS,
              };
              this.props.getHomeNotifications(input);

              console.log(user);
              if (user === null || user === undefined) {
                Alert.alert('the user object comes null');
                this.props.navigation.navigate('Login');
              }

              if (user.isFromForgot === true) {
                this.props.navigation.navigate('Login');
              } else {
                //can access app
                global.loginUserId = user.userId;
                this.loadHomePage();
              }
            }
          });
        }
      });
    }, 2 * 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    // if (
    //   this.props.loginError &&
    //   this.props.loginError.request !== undefined &&
    //   this.props.loginError.request == USER_LOGIN
    // ) {
    //   if (this.props.loginError !== prevProps.error) {
    //     if (typeof this.props.loginError.message === 'string') {
    //       Alert.alert(
    //         this.props.loginError.message,
    //         '',
    //         [
    //           {
    //             text: 'OK',
    //             onPress: this.moveToLogin,
    //           },
    //         ],
    //         {cancelable: false},
    //       );
    //     }
    //   }
    // }

    // if (this.props.loginError && this.props.loginError.request == USER_LOGIN) {
    //   if (this.props.loginError !== prevProps.error) {
    //     this.setState({submitLoader: false}, () => {
    //       Alert.alert(this.props.loginError.message);
    //     });
    //   }
    // }

    // if (this.props.loginError !== null && this.props.loginApi == USER_LOGIN) {
    //   if (this.props.loginError !== prevProps.error) {
    //     this.setState({submitLoader: false});
    //     Alert.alert(this.props.loginError.message);
    //   }
    // }
    if (this.props.isLoading == true && this.props.loginApi == USER_LOGIN) {
      this.state.submitLoader = true;
    }

    if (
      !this.props.loginError &&
      this.props.loginApi == USER_LOGIN &&
      this.state.userLoggedIn == false
    ) {
      if (this.props.user !== prevState.user) {
        // SyncStorage.set('loggedIn', "true");
        this.setState({userLoggedIn: true}, () => {
          SyncStorage.set('user', JSON.stringify(this.props.user));

          if (this.props.permissions) {
            SyncStorage.set(
              'permissions',
              JSON.stringify(this.props.permissions),
            );
          }

          global.loginUserId = this.props.user.userId;
          global.user = this.props.user;
          this.props.navigation.navigate('AppStack');
        });
      }
    }

    //home notifications
    if (!this.props.error && this.props.api == GET_HOME_NOTIFICATIONS) {
      if (this.props.homeNotifications !== prevState.homeNotifications) {
        if (
          this.props.homeNotifications !== undefined ||
          this.props.homeNotifications.length != 0
        ) {
          global.isBadgeShown = true;
        } else {
          global.isBadgeShown = false;
        }
      }
    }

    if (
      this.props.error &&
      this.props.error.request !== undefined &&
      this.props.error.request == USER_LOGIN
    ) {
      if (this.props.error !== prevProps.error) {
        if (typeof this.props.error.message === 'string') {
          this.setState({submitLoader: false}, () => {
            // Alert.alert(this.props.error.message);
            // SyncStorage.set('isFromLogout', true.toString());
            // SyncStorage.remove('user');
            // SyncStorage.remove('permissions');
            this.props.navigation.navigate('Login');

          });
        }
      }
    }
  }

  loadHomePage() {
    SyncStorage.get('loginRequest').then(value => {
      this.props.loginUser(JSON.parse(value));
    });

    // if (this.state.isFromNotification == true) {
    //   // let resetAction = StackActions.reset({
    //   //   index: 0,
    //   //   actions: [NavigationActions.navigate({routeName: global.selectedTab})],
    //   // });
    //   this.props.navigation.navigate(global.selectedTab);
    //   switch (global.selectedTab) {
    //     case EcityTabs[1]:
    //       {
    //         this.props.navigation.navigate('ApplicationDetail', {
    //           applicationId: this.state.typeId,
    //         });
    //       }
    //       break;
    //     case EcityTabs[2]:
    //       {
    //         this.props.navigation.navigate('ReportDetail', {
    //           reportId: this.state.typeId,
    //         });
    //       }
    //       break;
    //   }
    // } else {
    //   this.props.navigation.navigate('AppStack');
    // }
  }

  render() {
    return (
      <Wallpaper>
        {/* <ActivityIndicator size="large" color="blue" /> */}
      </Wallpaper>
    );
  }

  async createNotificationListeners() {
    // * Triggered when a particular notification has been received in foreground
    // *
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        const {title, body} = notification;

        this.handleNotification(notification);

        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });

    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        this.handleNotification(notification);
      });

    // * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    // *
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {title, body} = notificationOpen.notification;

        this.handleNotification(notificationOpen);
        // this.render();
      });

    // * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    // *
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;

      this.handleNotification(notificationOpen);
    }

    // * Triggered for data only payload in foreground
    // *
    this.messageListener = firebase.messaging().onMessage(message => {
      // let notificationObject = JSON.parse(
      //     notificationOpen.notification.data['gcm.notification.data'],
      //   );
      let notiType = message.data.type;

      switch (notiType) {
        case 1:
        // this.navigator.dispatch(
        //   NavigationActions.navigate({routeName: 'eApplications'}),
        // );
        // break;
      }
      // this.showAlert(message.title + 'notificationOpenedListner', notiType);

      global.selectedTab = EcityTabs[notiType];
      console.log(JSON.stringify(message));
      // this.callAddNotifications()

      // this.showAlert(message.data.msg, message.data.msg);
    });
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
    // this.showAlert(
    //   notificationObject.title + 'notificationOpenedListner',
    //   notiType,
    // );

    global.selectedTab = EcityTabs[notiType];
    this.setState({
      isFromNotification: true,
      typeId: notificationObject.typeId,
    });
    // this.callAddNotifications(notificationObject)
  }
  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  //MARK: - API CALL

  callAddNotifications(notificationObject) {
    // var input = {
    //   notiId: notificationObject.notiId,
    //   type: 1,
    //   typeId: 4,
    //   senderId: 1,
    //   senderPhoto: 20191118_062020.png,
    //   msg: ,
    //   readStatus: 0,
    //   timeStamp: 1576155161000,
    //   senddate: 2019-12-12

    // };
    this.props.addNotification(notificationObject);
  }
}

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    homeNotifications: homeNotificationListSelector(state.NotificationReducer),
    isLoading: isLoadingSelector(state.NotificationReducer),
    api: apiSelector(state.NotificationReducer),
    error: errorSelector(state.NotificationReducer),
    loginApi: apiSelector(state.FormReducer),
    loginError: errorSelector(state.FormReducer),
    successMessage: successSelector(state.NotificationReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addNotification: input => dispatch(addNotification(input)),
    loginUser: (input, USER_LOGIN) => dispatch(loginUser(input, USER_LOGIN)),
    getHomeNotifications: input => dispatch(getHomeNotifications(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Splash);

//MARK:- Initializations
//MARK: - LIfeCycle Methods
//MARK: - Event Handlers
//MARK: - UI Render
//MARK: - Cell Creation
//MARK: - Data Management  constructor(props) {
