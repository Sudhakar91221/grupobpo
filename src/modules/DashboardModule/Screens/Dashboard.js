/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  Alert,
  FlatList,
  ScrollView,
  Linking,
  RefreshControl,
  AppState,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {DrawerIcon, NotificationButton} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {connect} from 'react-redux';
import {BottomButton, WhiteButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {GET_MY_DASHBOARD, EMERGENCY_CALL} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myDashboardSelector,
} from '../Actions/selector';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getMyDashboard, emergencyCall} from '../Actions/DashboardActions';
import CardView from 'react-native-cardview';
import Moment from 'moment';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {
  ScreenHeight,
  ScreenWidth,
  isIOS,
} from '../../../components/utility/Settings';
import {
  flatListItemSeparator,
  flatListItemSpaceSeparator,
} from '../../../components/utility/common';
import CheckinCell from './CheckinCell';
import FloatingButton from '../../../components/views/FloatingButton';
import {styless} from '../../../components/common/Styles';
import {eventListSelector} from '../../CalenderModule/Actions/selectors';
import {getTodayEvent} from '../../CalenderModule/Actions/CalenderActions';
import {GET_TODAY_EVENT} from '../../CalenderModule/Actions/type';
import EventCell from '../../CalenderModule/Screens/EventCell';
import moment from 'moment';
import {dashboardLeavesListSelector} from '../../LeaveModule/Actions/selectors';
import {getDashboardLeaves} from '../../LeaveModule/Actions/LeaveActions';
import {GET_DASHBOARD_LEAVES} from '../../LeaveModule/Actions/type';
import MyLeaveCell from '../../LeaveModule/Screens/MyLeaveCell';
import {
  CHECKIN,
  CHECKOUT,
  UPDATE_TASK,
  UPDATE_CHECKOUT,
} from '../../TimesheetModule/Actions/type';
import {
  checkin,
  checkout,
} from '../../TimesheetModule/Actions/TimesheetActions';
import {
  checkinSelector,
  checkoutSelector,
  updateTaskSelector,
} from '../../TimesheetModule/Actions/selectors';
import {homeNotificationListSelector} from '../../NotificationModule/Actions/selectors';
import MapView, {Marker} from 'react-native-maps';
import Icons from '../../../components/common/Icons';
import GPSState from 'react-native-gps-state';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitGray: false,
      submitLoader: false,
      checkinButtonText: 'checkin',
      lastStatusText: 'check_in',
      buttonColor: this.props.theme.greenText,
      latitude: 0.0,
      longitude: 0.0,
      location: '',
      title: 'Loading ...',
      changeButtonColor: this.props.theme.blueColor,
      isChangeLocationButtonEnabled: false,
      granted: true,
      isSpinner:false
    };

    this.renderChangeLocationButton = this.renderChangeLocationButton.bind(
      this,
    );
    this.renderCheckinButton = this.renderCheckinButton.bind(this);
    this.renderLastCheckinView = this.renderLastCheckinView.bind(this);
    this.callMyDashboard = this.callMyDashboard.bind(this);
    this.onChangeLocationTapped = this.onChangeLocationTapped.bind(this);
    this.renderLastCheckin = this.renderLastCheckin.bind(this);
    this.onSOSButtonTapped = this.onSOSButtonTapped.bind(this);
    this.callPhone = this.callPhone.bind(this);
    this.renderTodayEvents = this.renderTodayEvents.bind(this);
    this.callGetEvents = this.callGetEvents.bind(this);
    this.callGetLeaves = this.callGetLeaves.bind(this);
    this.renderUpcomingLeaves = this.renderUpcomingLeaves.bind(this);
    this.renderViewMoreCheckinButton = this.renderViewMoreCheckinButton.bind(
      this,
    );
    this.renderTodayCheckin = this.renderTodayCheckin.bind(this);
    this.onViewCheckinsButtonTapped = this.onViewCheckinsButtonTapped.bind(
      this,
    );
    this.onCheckinButtonTapped = this.onCheckinButtonTapped.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.refreshScreen = this.refreshScreen.bind(this);
  }

  onRefresh = () => {
    this.setState(
      {
        dataSource: [],
        isLoading: false,
        refreshing: true,
        seed: 1,
        page: 1,
      },
      () => this.fetchData(),
    );
  };

  fetchData() {
    this.callMyDashboard();
    this.callGetEvents();
    this.callGetLeaves();
  }

  // componentWillMount() {
  //   if (!isIOS) {
  //     check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
  //       .then(result => {
  //         switch (result) {
  //           case RESULTS.UNAVAILABLE:
  //             break;
  //           case RESULTS.DENIED:
  //             request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
  //               type: 'always',
  //             }).then(response => {
  //               this.setState({granted: true});
  //               this.watchID = Geolocation.watchPosition(
  //                 position => {
  //                   // Create the object to update this.state.mapRegion through the onRegionChange function
  //                   let region = {
  //                     latitude: position.coords.latitude,
  //                     longitude: position.coords.longitude,
  //                     latitudeDelta: 0.00922 * 1.5,
  //                     longitudeDelta: 0.00421 * 1.5,
  //                   };
  //                   this.onRegionChange(
  //                     region,
  //                     region.latitude,
  //                     region.longitude,
  //                   );
  //                 },
  //                 error => console.log('ERROR => ' + JSON.stringify(error)),
  //               );
  //             });
  //             break;
  //           case RESULTS.GRANTED:
  //             request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
  //               type: 'always',
  //             }).then(response => {
  //               this.setState({granted: true});
  //               this.watchID = Geolocation.watchPosition(
  //                 position => {
  //                   // Create the object to update this.state.mapRegion through the onRegionChange function
  //                   let region = {
  //                     latitude: position.coords.latitude,
  //                     longitude: position.coords.longitude,
  //                     latitudeDelta: 0.00922 * 1.5,
  //                     longitudeDelta: 0.00421 * 1.5,
  //                   };
  //                   this.onRegionChange(
  //                     region,
  //                     region.latitude,
  //                     region.longitude,
  //                   );
  //                 },
  //                 error => console.log('ERROR => ' + JSON.stringify(error)),
  //               );
  //             });
  //             break;
  //           case RESULTS.BLOCKED:
  //             request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
  //               type: 'always',
  //             }).then(response => {
  //               this.setState({granted: true});
  //             });
  //             break;
  //         }
  //       })
  //       .catch(error => {
  //         console.log('ERROR => ' + error);
  //       });
  //   } else {
  //     check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
  //       .then(result => {
  //         switch (result) {
  //           case RESULTS.UNAVAILABLE:
  //             break;
  //           case RESULTS.DENIED:
  //             request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, {
  //               type: 'always',
  //             }).then(response => {
  //               this.setState({granted: true});
  //               this.watchID = Geolocation.watchPosition(
  //                 position => {
  //                   // Create the object to update this.state.mapRegion through the onRegionChange function
  //                   let region = {
  //                     latitude: position.coords.latitude,
  //                     longitude: position.coords.longitude,
  //                     latitudeDelta: 0.00922 * 1.5,
  //                     longitudeDelta: 0.00421 * 1.5,
  //                   };
  //                   this.onRegionChange(
  //                     region,
  //                     region.latitude,
  //                     region.longitude,
  //                   );
  //                 },
  //                 error => console.log('ERROR => ' + JSON.stringify(error)),
  //               );
  //             });
  //             break;
  //           case RESULTS.GRANTED:
  //             this.setState({granted: true});
  //             this.watchID = Geolocation.watchPosition(
  //               position => {
  //                 // Create the object to update this.state.mapRegion through the onRegionChange function
  //                 let region = {
  //                   latitude: position.coords.latitude,
  //                   longitude: position.coords.longitude,
  //                   latitudeDelta: 0.00922 * 1.5,
  //                   longitudeDelta: 0.00421 * 1.5,
  //                 };
  //                 this.onRegionChange(
  //                   region,
  //                   region.latitude,
  //                   region.longitude,
  //                 );
  //               },
  //               error => console.log('ERROR => ' + JSON.stringify(error)),
  //             );
  //             break;
  //           case RESULTS.BLOCKED:
  //             request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, {
  //               type: 'always',
  //             }).then(response => {
  //               this.setState({granted: true});
  //             });
  //             break;
  //         }
  //       })
  //       .catch(error => {
  //         console.log('ERROR => ' + error);
  //       });
  //    }
  // }

  componentDidMount() {
    this.showSpinner();
    console.log(AppState._eventHandlers.change.size);
    // if(AppState._eventHandlers.change.size === 0 && !isIOS) {
    //   AppState.addEventListener('change', this.handleAppStateChange)
    // }
    AppState.addEventListener('change', this._handleAppStateChange);

    // this.accessPermission();
    // this.accessLocationPermission();
    // this.getCurrentLocation();
    
    this.fetchData();
  }

  getCurrentLocation() {
    if (this.state.title === 'Loading ...') {
      Geolocation.getCurrentPosition(
        position => {
          this.hideSpinner();
          // this.setState({
          //   region: {
          //     latitude: position.coords.latitude,
          //     longitude: position.coords.longitude,
          //     latitudeDelta: 0.0462,
          //     longitudeDelta: 0.0261,
          //   },
          // });
          const location = JSON.stringify(position);

          // this.setState({address: location, title:location});

          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922 * 1.5,
            longitudeDelta: 0.00421 * 1.5,
          };
          this.onRegionChange(region, region.latitude, region.longitude);
        },
        error => {
          // alert(JSON.stringify(error))
          console.log('current lcoation issue');
          console.log(JSON.stringify(error));
          this.hideSpinner()
          // this.accessPermission()
        },
        // { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 }
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 120000,
          showLocationDialog: true,
          forceRequestLocation: true,
        },
      );
    }
  }
  // accessPermission() {
  //   var watchOptions = {
  //     frequency: 1000,
  //     timeout: 3000,
  //     enableHighAccuracy: false, // may cause errors if true
  //   };

  //   if (!isIOS) {
  //     check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
  //       .then(result => {
  //         switch (result) {
  //           case RESULTS.UNAVAILABLE:
  //             break;
  //           case RESULTS.DENIED:
  //             request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
  //               type: 'always',
  //             }).then(response => {
  //               this.setState({granted: true});
  //               this.watchID = Geolocation.watchPosition(
  //                 // watchOptions,
  //                 position => {
  //                   // Create the object to update this.state.mapRegion through the onRegionChange function
  //                   let region = {
  //                     latitude: position.coords.latitude,
  //                     longitude: position.coords.longitude,
  //                     latitudeDelta: 0.00922 * 1.5,
  //                     longitudeDelta: 0.00421 * 1.5,
  //                   };
  //                   this.onRegionChange(
  //                     region,
  //                     region.latitude,
  //                     region.longitude,
  //                   );
  //                   // this.getCurrentLocation();
  //                 },
  //                 error => this.setState({granted: false}),
  //                 // console.log('ERROR => ' + JSON.stringify(error)),
  //               );
  //             });
  //             break;
  //           case RESULTS.GRANTED:
  //             this.setState({granted: true});
  //             this.watchID = Geolocation.watchPosition(
  //               // watchOptions,
  //               position => {
  //                 // Create the object to update this.state.mapRegion through the onRegionChange function
  //                 let region = {
  //                   latitude: position.coords.latitude,
  //                   longitude: position.coords.longitude,
  //                   latitudeDelta: 0.00922 * 1.5,
  //                   longitudeDelta: 0.00421 * 1.5,
  //                 };
  //                 this.onRegionChange(
  //                   region,
  //                   region.latitude,
  //                   region.longitude,
  //                 );
  //                 //this.getCurrentLocation();
  //               },
  //               error => {
  //                 this.setState({granted: false}),
  //                   console.log('ERROR => ' + JSON.stringify(error));
  //               },
  //             );
  //             break;
  //           case RESULTS.BLOCKED:
  //             // this.hideSpinner();

  //             this.setState({granted: false});
  //         }
  //       })
  //       .catch(error => {
  //         console.log('ERROR => ' + error);

  //         this.setState({granted: false});
  //       });
  //   } else {
  //     check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
  //       .then(result => {
  //         switch (result) {
  //           case RESULTS.UNAVAILABLE:
  //             break;
  //           case RESULTS.DENIED:
  //             // case RESULTS.BLOCKED:

  //             request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, {
  //               // type: 'always',
  //             }).then(response => {
  //               this.setState({granted: true});
  //               this.watchID = Geolocation.watchPosition(
  //                 // watchOptions,
  //                 position => {
  //                   // Create the object to update this.state.mapRegion through the onRegionChange function
  //                   let region = {
  //                     latitude: position.coords.latitude,
  //                     longitude: position.coords.longitude,
  //                     latitudeDelta: 0.00922 * 1.5,
  //                     longitudeDelta: 0.00421 * 1.5,
  //                   };
  //                   this.onRegionChange(
  //                     region,
  //                     region.latitude,
  //                     region.longitude,
  //                   );
  //                   // this.getCurrentLocation();
  //                 },
  //                 error =>
  //                   console.log(
  //                     'ERROR => grant or block' + JSON.stringify(error),
  //                   ),
  //                 this.setState({granted: false}),
  //               );
  //             });
  //             break;
  //           case RESULTS.GRANTED:
  //             this.setState({granted: true});
  //             this.watchID = Geolocation.watchPosition(
  //               // watchOptions,
  //               position => {
  //                 // Create the object to update this.state.mapRegion through the onRegionChange function
  //                 let region = {
  //                   latitude: position.coords.latitude,
  //                   longitude: position.coords.longitude,
  //                   latitudeDelta: 0.00922 * 1.5,
  //                   longitudeDelta: 0.00421 * 1.5,
  //                 };
  //                 this.onRegionChange(
  //                   region,
  //                   region.latitude,
  //                   region.longitude,
  //                 );
  //                 // this.getCurrentLocation();
  //               },
  //               error => console.log('ERROR => grant' + JSON.stringify(error)),
  //               this.setState({granted: false}),
  //             );
  //             break;
  //           case RESULTS.BLOCKED:
  //             // this.hideSpinner();
  //             this.setState({granted: false});

  //             break;
  //         }
  //       })
  //       .catch(error => {
  //         console.log('ERROR => catch' + error);

  //         this.setState({granted: false});
  //       });
  //   }
  // }

  onRegionChange(region, latitude, longitude) {
    var that = this;
    this.setState(
      {
        mapRegion: region,
        // If there are no new values set the current ones
        latitude: latitude || this.state.region.latitude,
        longitude: longitude || this.state.region.longitude,
      },
      () => {
        Geocoder.init('AIzaSyAG7cm7UkuotOiW5rCWV4Cv7Zogze9rZcU', {
          language: 'en',
        });
        Geocoder.from(latitude, longitude)
          .then(json => {
            var addressComponent = json.results[0].address_components[0];
            that.setState({
              address: addressComponent.long_name,
              title: addressComponent.long_name,
            });
            // that.fetchData();
          })
          .catch(error => console.log(JSON.stringify(error)));
      },
    );
  }

  componentWillUnmount() {
    // Geolocation.stopObserving()
    // LocationServicesDialogBox.stopListener()


    if (this.watchID) {
      Geolocation.clearWatch(this.watchID);
    }
    
    AppState.removeEventListener('change', this._handleAppStateChange);
    GPSState.removeListener();
  }

  // componentDidMount() {
  //       // this.showSpinner();
  //       // this.fetchData()
  //       AppState.addEventListener('change', this._handleAppStateChange);
  //       this.accessLocationPermission();
  //       this.fetchData()

  // }
  _handleAppStateChange = nextAppState => {
    // this.setState({appState: nextAppState});
    this.state.appState = nextAppState;
    this.state.granted = false;

    if (nextAppState === 'background') {
      // Do something here on app background.
      // console.log('App is in Background Mode.');
    }

    if (nextAppState === 'active') {
      // Do something here on app active foreground mode.
      //console.log('App is in Active Foreground Mode.');
      //this.accessLocationPermission();
      if(!isIOS) {
        // this.getAndroidLocationPermission();
        this.getLocationPermission();

      }else {
        this.getLocationPermission();
      }
     
    }

    if (nextAppState === 'inactive') {
      // Do something here on app inactive mode.
      //  console.log('App is in inactive Mode.');
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_MY_DASHBOARD ||
        this.props.error.request == GET_TODAY_EVENT ||
        this.props.error.request == GET_DASHBOARD_LEAVES || this.props.error.request == CHECKOUT)
    ) {
      if (this.props.error !== prevProps.error) {
        if (
          this.props.error.message === '-1' &&
          this.props.error.request == CHECKOUT
        ) {
          this.state.submitLoader = false;

          Alert.alert(
            '',
            translate('checkout_error'),
            [
              {
                text: 'OK',
                onPress: () => {
                  let input = {
                    userId: this.props.user.userId,
                    dayId: this.state.dashboardModel.dayId,
                    date: this.state.dashboardModel.checkin.date,
                  };

                  this.props.navigation.navigate('ManualCheckout', {
                    input: input,
                    selectedDay: this.state.dashboardModel.checkin.date,
                    fetchData: () => this.fetchData(),
                  });
                  console.log('OK Pressed');
                },
              },
            ],
            {cancelable: false},
          );
        } else {
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
    }

    //get my dashboard
    if (this.props.dashoardApi === GET_MY_DASHBOARD) {
      if (
        this.props.error !== null &&
        this.props.dashoardApi === GET_MY_DASHBOARD
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

      if (!this.props.error && this.props.dashoardApi === GET_MY_DASHBOARD) {
        if (this.props.dashboardModel !== this.state.dashboardModel) {
          this.setState({dashboardModel: this.props.dashboardModel});
          this.state.submitLoader = false;
          if (this.props.dashboardModel.checkin !== null) {
            switch (this.props.dashboardModel.checkin.status) {
              case 0:
                this.state.checkinButtonText = 'checkin';
                this.state.lastStatusText = 'check_out';
                this.state.buttonColor = this.props.theme.greenText;
                this.state.changeButtonColor = this.props.theme.blueColor;
                this.state.isChangeLocationButtonEnabled = true;
                break;
              case 1:
                this.state.checkinButtonText = 'checkout';
                this.state.lastStatusText = 'check_in';
                this.state.buttonColor = this.props.theme.redText;
                this.state.changeButtonColor = this.props.theme.grayText;
                this.state.isChangeLocationButtonEnabled = false;
                break;
              case 2:
                this.state.checkinButtonText = 'add_task';
                this.state.lastStatusText = 'check_out';
                this.state.buttonColor = this.props.theme.primaryColor;
                this.state.changeButtonColor = this.props.theme.grayText;
                this.state.isChangeLocationButtonEnabled = false;
                break;
            }
          }
        }
      }
    }

    //get events
    if (this.props.eventApi === GET_TODAY_EVENT) {
      if (
        this.props.error !== null &&
        this.props.eventApi === GET_TODAY_EVENT
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

      if (!this.props.error && this.props.eventApi === GET_TODAY_EVENT) {
        if (this.props.todayEvents !== this.state.todayEvents) {
          this.setState({todayEvents: this.props.todayEvents});
        }
      }
    }

    //get leaves
    if (this.props.leaveApi === GET_DASHBOARD_LEAVES) {
      if (
        this.props.error !== null &&
        this.props.leaveApi === GET_DASHBOARD_LEAVES
      ) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
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

      if (!this.props.error && this.props.leaveApi === GET_DASHBOARD_LEAVES) {
        if (this.props.dashboardLeaves !== this.state.dashboardLeaves) {
          this.setState({
            dashboardLeaves: this.props.dashboardLeaves,
            refreshing: false,
          });
        }
      }
    }

    //checkin
    if (this.props.checkinApi === CHECKIN) {
      if (this.props.error !== null && this.props.checkinApi === CHECKIN) {
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

      if (
        !this.props.error &&
        this.props.checkinApi === CHECKIN &&
        this.state.dashboardModel !== undefined
      ) {
        if (this.props.checkinResponse !== this.state.checkinResponse) {
          if (this.state.dashboardModel.checkin === null) {
            var checkinModel = {
              date: moment().format('DD-MM-YYYY'),
              time: this.props.checkinResponse.time,
              status: this.props.checkinResponse.checkInStatus,
              place: this.props.checkinResponse.checkInPlace,
              id: this.props.checkinResponse.checkInId,
            };
            this.state.dashboardModel.checkin = checkinModel;
          } else {
            this.state.dashboardModel.checkin.date = moment().format(
              'DD-MM-YYYY',
            );
            this.state.dashboardModel.checkin.time = this.props.checkinResponse.time;
            this.state.dashboardModel.checkin.id = this.props.checkinResponse.checkInId;
            this.state.dashboardModel.checkin.place = this.props.checkinResponse.checkInPlace;
            this.state.dashboardModel.checkin.status = this.props.checkinResponse.checkInStatus;
          }
          this.setState({checkinResponse: this.props.checkinResponse,submitLoader:false});
          switch (this.props.checkinResponse.checkInStatus) {
            case 0:
              this.state.checkinButtonText = 'checkin';
              this.state.lastStatusText = 'check_out';
              this.state.buttonColor = this.props.theme.greenText;
              this.state.changeButtonColor = this.props.theme.blueColor;
              this.state.isChangeLocationButtonEnabled = true;
              break;
            case 1:
              this.state.checkinButtonText = 'checkout';
              this.state.lastStatusText = 'check_in';
              this.state.buttonColor = this.props.theme.redText;
              this.state.changeButtonColor = this.props.theme.grayText;
              this.state.isChangeLocationButtonEnabled = false;
              break;
            case 2:
              this.state.checkinButtonText = 'add_task';
              this.state.lastStatusText = 'check_out';
              this.state.buttonColor = this.props.theme.primaryColor;
              this.state.changeButtonColor = this.props.theme.grayText;
              this.state.isChangeLocationButtonEnabled = false;
              break;
          }
        }
      }
    }

    //checkout
    if (this.props.checkinApi === CHECKOUT) {
      if (this.props.error !== null && this.props.checkinApi === CHECKOUT) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  let input = {
                    userId: this.props.user.userId,
                    dayId: this.state.dashboardModel.dayId,
                    date: this.state.dashboardModel.checkin.date,
                  };

                  this.props.navigation.navigate('ManualCheckout', {
                    input: input,
                    selectedDay: this.state.dashboardModel.checkin.date,
                    fetchData: () => this.fetchData(),
                  });
                  console.log('OK Pressed');
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.checkinApi === CHECKOUT) {
        if (this.props.checkoutResponse !== this.state.checkoutResponse && this.state.dashboardModel) {
          this.state.dashboardModel.checkin.date = this.props.checkoutResponse.checkInDate;
          this.state.dashboardModel.checkin.time = this.props.checkoutResponse.time;
          this.state.dashboardModel.checkin.id = this.props.checkoutResponse.checkInId;
          this.state.dashboardModel.checkin.place = this.props.checkoutResponse.checkInPlace;
          this.state.dashboardModel.checkin.status = this.props.checkoutResponse.checkInStatus;
          this.setState({checkoutResponse: this.props.checkoutResponse,submitLoader:false});
          switch (this.props.checkoutResponse.checkInStatus) {
            case 0:
              this.state.checkinButtonText = 'checkin';
              this.state.lastStatusText = 'check_out';
              this.state.buttonColor = this.props.theme.greenText;
              this.state.changeButtonColor = this.props.theme.blueColor;
              this.state.isChangeLocationButtonEnabled = true;
              break;
            case 1:
              this.state.checkinButtonText = 'checkout';
              this.state.lastStatusText = 'check_in';
              this.state.buttonColor = this.props.theme.redText;
              this.state.changeButtonColor = this.props.theme.grayText;
              this.state.isChangeLocationButtonEnabled = false;
              break;
            case 2:
              this.state.checkinButtonText = 'add_task';
              this.state.lastStatusText = 'check_out';
              this.state.buttonColor = this.props.theme.primaryColor;
              this.state.changeButtonColor = this.props.theme.grayText;
              this.state.isChangeLocationButtonEnabled = false;
              break;
          }
          let input = {
            userId: this.props.user.userId,
            dayId: this.state.dashboardModel.dayId,
            date: this.state.dashboardModel.checkin.date,
          };
    
          this.props.navigation.navigate('ManualCheckout', {
            input: input,
            selectedDay: this.state.dashboardModel.checkin.date,
            fetchData: () => this.fetchData(),
            refreshScreen: () => this.refreshScreen(),
          });
        }
      }
    }

    //add task
    if (
      this.props.error &&
      (this.props.error.request == UPDATE_TASK ||
        this.props.error.request == UPDATE_CHECKOUT)
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
    //update task
    if (this.props.api === UPDATE_TASK) {
      if (this.props.error !== null && this.props.api === UPDATE_TASK) {
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
                  console.log();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === UPDATE_TASK) {
        /* if (this.props.taskResponse !== this.state.taskResponse) {

          this.state.dashboardModel.checkin.date = this.props.checkoutResponse.checkInDate;
          this.state.dashboardModel.checkin.time = this.props.checkoutResponse.time;
          this.state.dashboardModel.checkin.id = this.props.taskResponse.checkInId;
          this.state.dashboardModel.checkin.place = this.props.taskResponse.checkInPlace;
          this.state.dashboardModel.checkin.status = this.props.taskResponse.checkInStatus;
          this.setState({taskResponse: this.props.taskResponse});
          switch (this.props.taskResponse.checkInStatus) {
            case 0:
              this.state.checkinButtonText = 'checkin';
              this.state.lastStatusText = 'check_out';
              this.state.buttonColor = this.props.theme.greenText;
              this.state.changeButtonColor = this.props.theme.blueColor;
              this.state.isChangeLocationButtonEnabled = true;
              break;
            case 1:
              this.state.checkinButtonText = 'checkout';
              this.state.lastStatusText = 'check_in';
              this.state.buttonColor = this.props.theme.redText;
              this.state.changeButtonColor = this.props.theme.grayText;
              this.state.isChangeLocationButtonEnabled = false;
              break;
            case 2:
              this.state.checkinButtonText = 'add_task';
              this.state.lastStatusText = 'check_out';
              this.state.buttonColor = this.props.theme.primaryColor;
              this.state.changeButtonColor = this.props.theme.grayText;
              this.state.isChangeLocationButtonEnabled = false;
              break;
          }

        }*/
        this.setState({refreshing: true});
      }
    }

    //update checkout
  }

  callMyDashboard() {
    var input = {
      companyId: this.props.user.userCompany,
      employeeId: this.props.user.userId,
      request: GET_MY_DASHBOARD,
    };
    this.props.getMyDashboard(input);
  }

  callGetEvents() {
    var today = moment().format('YYYY-MM-DD');
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      startDate: today,
      endDate: today,
      page: 1,
      pageFlag: 1,
      request: GET_TODAY_EVENT,
    };
    this.props.getTodayEvent(input);
  }

  callGetLeaves() {
    var today = moment().format('DD-MM-YYYY');
    const endOfMonth = moment()
      .endOf('month')
      .format('DD-MM-YYYY');
    var input = {
      userId: this.props.user.userId,
      fromDate: today,
      toDate: endOfMonth,
      status: '0,1,2,3',
      leaveId: '',
      page: 1,
      request: GET_DASHBOARD_LEAVES,
    };
    this.props.getDashboardLeaves(input);
  }

  componentWillMount() {
    if(!isIOS) {
      // this.getAndroidLocationPermission();
      this.getLocationPermission();
    }else {
      this.getLocationPermission();
    }
  }
  accessLocationPermission() {
    GPSState.addListener(status => {
      switch (status) {
        case GPSState.NOT_DETERMINED:
          this.setState({granted: false});
          alert(
            'Please, allow the location, for us to do amazing things for you!',
          );
          break;

        case GPSState.RESTRICTED:
          this.setState({granted: false});

          // GPSState.openLocationSettings()
          break;

        case GPSState.DENIED:
          this.setState({granted: false});
          //   alert('It`s a shame that you do not allowed us to use location :(');
          break;

        case GPSState.AUTHORIZED_ALWAYS:
          this.setState({granted: true});
          //   alert('It`s a shame that you do not allowed us to use location :(');
          break;
        case GPSState.AUTHORIZED_WHENINUSE:
          this.setState({granted: true});
          // this.watchID = Geolocation.watchPosition(
          //   // watchOptions,
          //   position => {
          //     // Create the object to update this.state.mapRegion through the onRegionChange function
          //     let region = {
          //       latitude: position.coords.latitude,
          //       longitude: position.coords.longitude,
          //       latitudeDelta: 0.00922 * 1.5,
          //       longitudeDelta: 0.00421 * 1.5,
          //     };
          //     this.onRegionChange(region, region.latitude, region.longitude);
          //     // this.getCurrentLocation();
          //   },
          //   error => this.setState({granted: false}),
          //   // console.log('ERROR => ' + JSON.stringify(error)),
          // );
          //TODO do something amazing with you app
          break;

        //TODO do something amazing with you app
      }
    });
    GPSState.requestAuthorization(GPSState.AUTHORIZED_WHENINUSE);
  }

  render() {
    const {theme} = this.props;

    if (this.state.dashboardModel === undefined) {
      return <ActivityIndicatorCustom />;
    }
    
    return (
      <View
        style={
          (styless.container,
          {
            flex: 1,
          })
        }>
        
        <View style={{padding: 0, flex: 1}}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 80}}
        />
          {this.state.granted !== true ? (
            this.renderLocationOffView(theme)
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }>
              {this.renderLastCheckin()}
              {this.renderTodayCheckin()}
              {this.renderTodayEvents()}
              {this.renderUpcomingLeaves()}
            </ScrollView>
          )}
        </View>
        <FloatingButton
          title={'SOS'}
          onFloatButtonTapped={() =>
            Alert.alert(
              translate('call'),
              translate('call_alert'),
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: this.onSOSButtonTapped},
              ],
              {cancelable: false},
            )
          }
        />
      </View>
    );
  }

  renderLocationView(theme) {
    return (
      <View
        style={{
          flex: 1,
          marginTop: 15,
          marginBottom: 15,
        }}>
        <View style={[styless.leftRight]}>
          <View style={{flex: 1, marginLeft: 10}}>
            <View style={styless.leftRight}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('PlacesMapScreen', {
                    getSelectedPlace: this.getSelectedPlace.bind(this),
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                  })
                }
              />
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
          }}>
          {this.state.granted != false && this.state.granted != undefined ? (
            <View
              style={{
                height: ScreenHeight - 20,
                marginTop: 10,
              }}>
              this.renderLocationOffView()
            </View>
          ) : (
            <View style={{height: 100}}>
              <MapView
                style={{flex: 1}}
                zoomEnabled={true}
                zoomControlEnabled={true}
                region={this.state.region}
                showsUserLocation={false}>
                <Marker
                  coordinate={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                  }}
                  title={this.state.address}
                />
              </MapView>
            </View>
          )}
        </View>
      </View>
    );
  }

  renderLocationOffView() {
    const {theme} = this.props;
    return (
      <View
        style={[
          styless.textVertical,
          {
            backgroundColor: 'white',
            flex: 1,
            height: ScreenHeight,
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 120,
          },
        ]}>
        {/* <View
          style={{paddingTop: 100,  alignSelf: 'center',flex:4}}> */}
        {/* <Icons.MaterialIcons
            name="location-off"
            size={ScreenHeight * 0.35}
            color={theme.primaryColor}
            backgroundColor= 'blue'
          /> */}
        <Image
          source={require('../../../assets/location_off.png')}
          style={{
            width: ScreenWidth - 100,
            height: ScreenHeight * 0.25,
            // marginLeft: 10,
            //backgroundColor: '#343957',
            // bottom:10,
            // bottom:100
          }}
          resizeMode="contain"
        />
        {/* </View> */}
        <View style={{alignSelf: 'center'}}>
          <Text
            style={[
              theme.header,
              {
                textAlign: 'center',
                alignSelf: 'center',
                height: 25,
                marginTop: 20,
              },
            ]}>
            {' '}
            Location Services OFF{' '}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                // paddingHorizontal: 20,
                // paddingTop: 30,
                alignSelf: 'center',
                textAlign: 'center',
                textTransform: 'none',
                height: 25,
              },
            ]}>
            {' '}
            Please enable location services{' '}
          </Text>
        </View>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 0,
            // position: 'absolute',
            // top: 0,
            fontWeight: 10,
            width: '80%',
            top: 80,
          }}
          backgroundColor={theme.greenText}
          title={translate('enable_location')}
          action={this.onLocationSettingsButtonTapped.bind(this)}
          activeState={true}
          isLoader={false}
          isGray={false}
        />
      </View>
    );
  }

  renderLocationSettingsButton() {
    const {theme} = this.props;

    return (
      <BottomButton
        style={{
          height: 50,
          borderRadius: 0,
          position: 'absolute',
          // top: 0,
          fontWeight: 10,
          width: '80%',
          marginBottom: 100,
        }}
        backgroundColor={theme.greenText}
        title={translate('enable_location')}
        action={this.onLocationSettingsButtonTapped.bind(this)}
        activeState={true}
        isLoader={this.state.submitLoader}
        isGray={this.state.submitGray}
      />
    );
  }

  onLocationSettingsButtonTapped = () => {
    if (isIOS) {
      openSettings()
        .then(result => {
          console.warn('result,........', result);
        })
        .catch(() => console.warn('cannot open settings'));
    } else {
      GPSState.openLocationSettings();
      // openSettings()
      //   .then(result => {
      //     console.warn('result,........', result);
      //   })
      //   .catch(() => console.warn('cannot open settings'));
    }
  };
  renderBlockHeader(number) {
    const {theme} = this.props;
    return (
      <View
        style={{
          backgroundColor: theme.primaryColor,
          borderRadius: 40,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          width: 50,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            alignSelf: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 28,
          }}>
          {number}
        </Text>
      </View>
    );
  }
  onSOSButtonTapped() {
    if (!isIOS) {
      check(PERMISSIONS.ANDROID.CALL_PHONE)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              break;
            case RESULTS.DENIED:
              request(PERMISSIONS.ANDROID.CALL_PHONE, {
                type: 'always',
              }).then(response => {
                this.callPhone();
              });
              break;
            case RESULTS.GRANTED:
              this.callPhone();
              break;
            case RESULTS.BLOCKED:
              request(PERMISSIONS.ANDROID.CALL_PHONE, {
                type: 'always',
              }).then(response => {
                this.callPhone();
              });
              break;
          }
        })
        .catch(error => {
          console.log('ERROR => ' + error);
        });
    } else {
      this.callPhone();
    }
  }

  callPhone() {
    let mobile = '911';
    Linking.openURL(`tel:${mobile}`);
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      request: EMERGENCY_CALL,
    };
    this.props.emergencyCall(input);
  }

  renderLastCheckin() {
    const {theme} = this.props;
    return (
      <CardView
        style={{
          width: '100%',
          flex: 1,
          padding: 5,
          backgroundColor: 'white',
        }}
        cardElevation={5}
        cardMaxElevation={2}
        cornerRadius={10}>
        <View style={{flex: 1, padding: 5}}>
          <Text style={theme.header}>{translate('current_location')}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={[theme.detail, {flex: 1, marginRight: 5}]}>
              {this.state.title}
            </Text>
            {this.renderChangeLocationButton()}
          </View>
          {this.renderCheckinButton()}
          {this.renderLastCheckinView()}
        </View>
      </CardView>
    );
  }

  renderTodayCheckin() {
    const {theme} = this.props;
    return (
      <CardView
        style={{
          width: '100%',
          flex: 1,
          padding: 5,
          marginTop: 15,
          backgroundColor: 'white',
        }}
        cardElevation={5}
        cardMaxElevation={2}
        cornerRadius={10}>
        <View style={{flex: 1, padding: 5}}>
          <Text style={[theme.header, {textTransform: 'none'}]}>
            {translate('todays_checkin')}
          </Text>
          {this.state.dashboardModel.todayscheckin.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                data={this.state.dashboardModel.todayscheckin}
                renderItem={this.renderCheckinItem}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                extraData={this.props}
                ItemSeparatorComponent={flatListItemSeparator}
              />
            </View>
          )}

          {this.state.dashboardModel.todayscheckin.length === 0
            ? null
            : this.renderViewMoreCheckinButton()}
        </View>
      </CardView>
    );
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

  renderTodayEvents() {
    const {theme} = this.props;
    return (
      <CardView
        style={{
          width: '100%',
          flex: 1,
          padding: 5,
          marginTop: 15,
          backgroundColor: 'white',
        }}
        cardElevation={5}
        cardMaxElevation={2}
        cornerRadius={10}>
        <View style={{flex: 1, padding: 5}}>
          <Text style={[theme.header, {textTransform: 'none'}]}>
            {translate('todays_events')}
          </Text>
          {this.state.todayEvents === undefined ? (
            this.renderNoRecords()
          ) : this.state.todayEvents.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                data={this.state.todayEvents}
                renderItem={this.renderEventItem}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                extraData={this.props}
                ItemSeparatorComponent={flatListItemSeparator}
              />
            </View>
          )}
        </View>
      </CardView>
    );
  }

  renderUpcomingLeaves() {
    const {theme} = this.props;
    return (
      <CardView
        style={{
          width: '100%',
          flex: 1,
          padding: 5,
          marginTop: 15,
          backgroundColor: 'white',
        }}
        cardElevation={5}
        cardMaxElevation={2}
        cornerRadius={10}>
        <View style={{flex: 1, padding: 5}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[theme.header, {textTransform: 'none'}]}>
              {translate('upcoming_leaves')}
            </Text>
            <Text
              style={[
                theme.detail,
                {textTransform: 'none', color: 'gray', marginTop: 5},
              ]}>
              {translate('this_month')}
            </Text>
          </View>
          {this.state.dashboardLeaves === undefined ? (
            this.renderNoRecords()
          ) : this.state.dashboardLeaves.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                data={this.state.dashboardLeaves}
                renderItem={this.renderLeaveItem}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                extraData={this.props}
                ItemSeparatorComponent={flatListItemSpaceSeparator}
              />
            </View>
          )}
        </View>
      </CardView>
    );
  }

  renderLeaveItem = ({item}) => {
    return <MyLeaveCell item={item} navigation={this.props.navigation} />;
  };

  renderEventItem = ({item}) => {
    return <EventCell item={item} navigation={this.props.navigation} />;
  };

  renderCheckinItem = ({item}) => {
    return (
      <CheckinCell
        item={item}
        navigation={this.props.navigation}
        date={this.state.dashboardModel.checkin.date}
      />
    );
  };

  renderChangeLocationButton() {
    const {theme} = this.props;
    return (
      <View
        style={{
          width: '25%',
          height: 35,
        }}>
        <WhiteButton
          style={{
            backgroundColor: 'white',
            marginBottom: 15,
            width: '100%',
          }}
          title={translate('change')}
          action={
            this.state.isChangeLocationButtonEnabled
              ? this.onChangeLocationTapped
              : null
          }
          color={this.state.changeButtonColor}
        />
      </View>
    );
  }

  renderViewMoreCheckinButton() {
    const {theme} = this.props;
    return (
      <View
        style={{
          width: '40%',
          height: 40,
          alignSelf: 'flex-end',
          marginTop: 10,
        }}>
        <WhiteButton
          style={{
            backgroundColor: 'white',
            marginBottom: 10,
            alignSelf: 'flex-end',
            width: '80%',
          }}
          title={translate('view_more')}
          action={this.onViewCheckinsButtonTapped}
          color={theme.blueColor}
        />
      </View>
    );
  }

  onViewCheckinsButtonTapped() {
    var date = Moment(
      this.state.dashboardModel.checkin.date,
      'YYYY-MM-DD',
    ).format('DD-MM-YYYY');
    let input = {
      userId: this.props.user.userId,
      dayId: this.state.dashboardModel.dayId,
      date: date,
    };

    this.props.navigation.navigate('CheckinsList', {
      input: input,
      selectedDay: date,
      fetchData: () => this.fetchData(),
    });
    this.fetchData();
  }

  onChangeLocationTapped() {
    this.props.navigation.navigate('PlacesScreen', {
      getSelectedPlace: this.getSelectedPlace.bind(this),
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    });
  }

  getSelectedPlace(data, details, title, id) {
    this.setState({
      location: data,
      placeLat: details.lat,
      placeLong: details.lng,
      title: title,
      placeId: id,
    });
  }

  renderCheckinButton() {
    const {theme} = this.props;

    return (
      <View style={{backgroundColor: 'white', height: 50, marginTop: 10}}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 0,
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}
          backgroundColor={this.state.buttonColor}
          fontWeight={'bold'}
          title={translate(this.state.checkinButtonText)}
          action={this.onCheckinButtonTapped}
          activeState={true}
          isLoader={this.state.submitLoader}
          isGray={this.state.title !== 'Loading ...' ? this.state.submitGray : true}
        />
      </View>
    );
  }

  onCheckinButtonTapped = () => {
    if(this.state.title !== "Loading ...") {

    
    this.setState({submitLoader: true},() => {

      if (this.state.checkinButtonText === 'checkin') {
        var input = {
          userId: this.props.user.userId,
          inLatitude: this.state.latitude,
          inLongitude: this.state.longitude,
          companyId: this.props.user.userCompany,
          placeTitle:
            this.state.title === undefined
              ? this.state.location
              : this.state.title,
          placeAddress:
            this.state.location === '' ? this.state.title : this.state.location,
          placeLat:
            this.state.placeLat === undefined
              ? this.state.latitude
              : this.state.placeLat,
          placeLong:
            this.state.placeLong === undefined
              ? this.state.longitude
              : this.state.placeLong,
          request: CHECKIN,
        };
        {
          this.state.title === 'Loading ...' ? null : this.props.checkin(input);
        }
      } else if (this.state.checkinButtonText === 'checkout') {
        var input = {
          userId: this.props.user.userId,
          outLatitude: this.state.latitude,
          outLongitude: this.state.longitude,
          checkInId: this.state.dashboardModel.checkin.id,
          placeId: this.state.dashboardModel.checkin.place,
          request: CHECKOUT,
        };
        {
          this.state.title === 'Loading ...' ? null : this.props.checkout(input);
        }
      } else if (this.state.checkinButtonText === 'add_task') {
        this.state.submitLoader = false;
        let input = {
          userId: this.props.user.userId,
          dayId: this.state.dashboardModel.dayId,
          date: this.state.dashboardModel.checkin.date,
        };
  
        this.props.navigation.navigate('ManualCheckout', {
          input: input,
          selectedDay: this.state.dashboardModel.checkin.date,
          fetchData: () => this.fetchData(),
          refreshScreen: () => this.refreshScreen(),
        });
      }
    });
  }

 
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
  refreshScreen = () => {
    this.setState({refreshing: true});
  };

  renderLastCheckinView() {
    // console.log('original date is',this.state.dashboardModel.checkin.date)
    // console.log('the date is now',Moment(this.state.dashboardModel.checkin.date).format('DD MMM YYYY'));

    var date = '';
    var time = '';
    if (this.state.dashboardModel) {
      date = Moment(this.state.dashboardModel.checkin.date).format(
        'DD MMM YYYY',
      );
      time = Moment(
        this.state.dashboardModel.checkin.date +
          ' ' +
          this.state.dashboardModel.checkin.time,
      ).format('hh:mm A');

      if (date == 'Invalid date' || date == undefined) {
        date = Moment(
          this.state.dashboardModel.checkin.date,
          'DD-MM-YYYY',
        ).format('DD MMM YYYY');
        time = Moment(
          this.state.dashboardModel.checkin.date +
            ' ' +
            this.state.dashboardModel.checkin.time,
          'DD-MM-YYYY HH:mm',
        ).format('hh:mm A');
      }
    }

    const {theme} = this.props;
    return (
      <View style={{flex: 1}}>
        {this.state.dashboardModel.checkin === null ? null : (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'center',
            }}>
            <Text style={theme.detail}>Last </Text>
            <Text style={theme.detail}>
              {translate(this.state.lastStatusText)} :{' '}
            </Text>
            <Text style={[theme.detail, {fontWeight: 'bold', fontSize: 16}]}>
              {date}{' '}
            </Text>
            <Text
              style={[
                theme.detail,
                {fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase'},
              ]}>
              @ {time}
            </Text>
          </View>
        )}
      </View>
    );
  }

 
  getLocationPermission() {
    var that = this;
    //Checking for the permission just after component loaded
    if (isIOS) {
      this.callLocation(that);
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            that.setState({granted:true})

            that.callLocation(that);
          } else {
            alert('Permission Denied');
            that.setState({granted:false})
          }
        } catch (err) {
          alert('err', err);
          that.setState({granted:false})

          console.warn(err);
        }
      }
      requestLocationPermission();
    }
  };
  callLocation(that) {
    //alert("callLocation Called");
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        //getting the Latitude from the location json
        that.setState({currentLongitude: currentLongitude, granted: true});
        //Setting state Longitude to re re-render the Longitude Text
        that.setState({currentLatitude: currentLatitude});
        //Setting state Latitude to re re-render the Longitude Text

        that.setState(
          {
            // mapRegion: region,
            // If there are no new values set the current ones
            latitude: currentLatitude ,
            longitude: currentLongitude,
            granted:true,
          });
        Geocoder.init('AIzaSyAG7cm7UkuotOiW5rCWV4Cv7Zogze9rZcU', {
          language: 'en',
        });
        Geocoder.from(currentLatitude, currentLongitude)
          .then(json => {
            var addressComponent = json.results[0].address_components[0];
            that.setState({
              address: addressComponent.long_name,
              title: addressComponent.long_name,
            });
            that.hideSpinner()
            // that.fetchData();
          })
          .catch(error => console.log(JSON.stringify(error)));
      },
      error =>{  that.setState({granted:false}),this.hideSpinner(),         console.log('unable to get locaiton ')
    },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000},
    );
    // that.watchID = Geolocation.watchPosition(position => {
    //   //Will give you the location on location change
    //   console.log(position);
    //   const currentLongitude = JSON.stringify(position.coords.longitude);
    //   //getting the Longitude from the location json
    //   const currentLatitude = JSON.stringify(position.coords.latitude);
    //   //getting the Latitude from the location json
    //   that.setState({currentLongitude: currentLongitude,granted:true});
    //   //Setting state Longitude to re re-render the Longitude Text
    //   that.setState({currentLatitude: currentLatitude});
    //   //Setting state Latitude to re re-render the Longitude Text

    //   Geocoder.init('AIzaSyAG7cm7UkuotOiW5rCWV4Cv7Zogze9rZcU', {
    //     language: 'en',
    //   });
    //   Geocoder.from(latitude, longitude)
    //     .then(json => {
    //       var addressComponent = json.results[0].address_components[0];
    //       that.setState({
    //         address: addressComponent.long_name,
    //         title: addressComponent.long_name,
    //       });
    //       // that.fetchData();
    //     })
    //     .catch(error => console.log(JSON.stringify(error)));
    // });
  }
}
const DashboardScreen = withTheme(Dashboard);

DashboardScreen.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
    headerLeft: (
      <DrawerIcon
        navigation={navigation}
        action={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    ),
    headerRight: (
      <NotificationButton
        navigation={navigation}
        action={() => navigation.navigate('Notification')}
        isBadgeShown={global.isBadgeShown}
      />
    ),
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.DashboardReducer),
    dashoardApi: apiSelector(state.DashboardReducer),
    eventApi: apiSelector(state.CalenderReducer),
    leaveApi: apiSelector(state.LeaveReducer),
    error: errorSelector(state.DashboardReducer),
    dashboardModel: myDashboardSelector(state.DashboardReducer),
    todayEvents: eventListSelector(state.CalenderReducer),
    dashboardLeaves: dashboardLeavesListSelector(state.LeaveReducer),
    checkinResponse: checkinSelector(state.TimesheetReducer),
    checkinApi: apiSelector(state.TimesheetReducer),
    taskResponse: updateTaskSelector(state.TimesheetReducer),
    checkoutResponse: checkoutSelector(state.TimesheetReducer),
    homeNotifications: homeNotificationListSelector(state.NotificationReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMyDashboard: input => dispatch(getMyDashboard(input)),
    emergencyCall: input => dispatch(emergencyCall(input)),
    getTodayEvent: input => dispatch(getTodayEvent(input)),
    getDashboardLeaves: input => dispatch(getDashboardLeaves(input)),
    checkin: input => dispatch(checkin(input)),
    checkout: input => dispatch(checkout(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardScreen);
