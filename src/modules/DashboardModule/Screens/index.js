import {createStackNavigator} from 'react-navigation-stack';
import DashboardScreen from './Dashboard';
import PlacesScreen from './PlacesScreen';
import CheckinsList from '../../TimesheetModule/Screens/CheckinsList';
import CheckinMapScreen from '../../TimesheetModule/Screens/CheckinMapScreen';
import ManualCheckout from '../../TimesheetModule/Screens/ManualCheckout';
import SettingsScreen from './SettingsScreen';
import ChangePassword from './ChangePassword';
import WebviewScreen from './WebviewScreen';
import LeaveDetail from '../../LeaveModule/Screens/LeaveDetail';
import Profile from './Profile';
import ImageViewer from '../../../components/external/ImageViewer';
import EventDetail from '../../CalenderModule/Screens/EventDetail';
import AttendeeList from '../../CalenderModule/Screens/AttendeeList';
import NotificationList from '../../NotificationModule/Screens/NotificationList';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const DashboardStack = createStackNavigator(
  {
    Dashboard: {
      screen: DashboardScreen,
      navigationOptions: {
        title: 'My Dashboard',
       
      },
    },
    PlacesScreen: {
      screen: PlacesScreen,
      navigationOptions: {
        title: 'Select your location',
       
      },
    },
    CheckinsList: {
      screen: CheckinsList,
      navigationOptions: {
        //title: 'Daily Timesheet',
       
      },
    },
    CheckinMapScreen: {
      screen: CheckinMapScreen,
      navigationOptions: {
        title: 'Check-in',
       
      },
    },
    ManualCheckout: {
      screen: ManualCheckout,
      navigationOptions: {
        //title: 'Daily Timesheet',
       
      },
    },
    SettingsScreen: {
      screen: SettingsScreen,
      navigationOptions: {
        title: 'Settings',
        
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        title: 'Change Password',
       
      },
    },
    WebviewScreen: {
      screen: WebviewScreen,
    },
    LeaveDetail: {
      screen: LeaveDetail,
      navigationOptions: {
        title: 'Leave Detail',
       
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        title: 'Profile',
      
      },
    },
    ImageViewer: {
      screen: ImageViewer,
      navigationOptions: {
        title: 'View Image',
       
      },
    },
    EventDetail: {
      screen: EventDetail,
      navigationOptions: {
        title: 'Event Detail',
       
      },
    },
    AttendeeList: {
      screen: AttendeeList,
      navigationOptions: {
        //title: 'Attendee List',
       
      },
    },
    Notification: {
      screen: NotificationList,
      navigationOptions: {
        title: 'Notifications',
       
      },
    },
  },
 
  {
    initialRouteName: 'Dashboard',
    defaultNavigationOptions: ({ screenProps }) => {
      return {
        headerBackground: (
          <LinearGradient
            colors={['#10356c', '#474F6A']}
            style={{ flex: 1 }}
            // start={{x: 0, y: 0}}
             end={{x: 1, y: 0}}

            start={{x: 0.0, y: 0.0}}
        // end={{x: 1.0, y: 1.0}}
        locations={[0.1, 0.9]}
          />
        ),
        headerStyle: {
          backgroundColor: screenProps.theme.backgroundColor,
        },
        headerTintColor: screenProps.theme.navBarHeaderColor,
        headerTitleStyle: {
          color: screenProps.theme.navBarHeaderColor,
          fontSize: 22,
          fontWeight: 'bold',
            // textAlign: 'left',
            // alignSelf: 'flex-start',
            // flex: 1,
            // paddingRight: 0,
            // fontSize: 26,
            // color: 'white',
            // marginTop: 10,
         
        }
      };
    }
  },
);

// DashboardStack.navigationOptions = ({navigation}) => {
//   let tabBarVisible;
//   if (navigation.state.routes.length > 1) {
//     navigation.state.routes.map(route => {
//       if (route.routeName === 'More') {
//         tabBarVisible = true;
//       } else {
//         tabBarVisible = false;
//       }
//     });
//   }

//   return {
//     tabBarVisible,
//   };
// };

export default DashboardStack;
