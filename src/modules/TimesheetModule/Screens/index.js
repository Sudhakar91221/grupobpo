import {createStackNavigator} from 'react-navigation-stack';
import MyTimesheetList from './MyTimesheetList';
import MonthlyTimesheet from './MonthlyTimesheetScreen';
import DailyTimesheet from './DailyTimesheet';
import CheckinsList from './CheckinsList';
import CheckinMapScreen from './CheckinMapScreen';
import ManualCheckout from './ManualCheckout';
import StaffTimesheetList from './StaffTimesheetList';
import TimesheetFilter from './TimesheetFilter';
import ImageViewer from '../../../components/external/ImageViewer';
import NotificationList from '../../NotificationModule/Screens/NotificationList';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const TimesheetStack = createStackNavigator(
  {
    MyTimesheetList: {
      screen: MyTimesheetList,
      navigationOptions: {
        title: 'My Timesheets',
        
      },
    },
    MonthlyTimesheet: {
      screen: MonthlyTimesheet,
      navigationOptions: {
        title: 'Monthly Timesheet',
        
      },
    },
    DailyTimesheet: {
      screen: DailyTimesheet,
      navigationOptions: {
        title: 'Daily Timesheet',
       
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
        
      },
    },
    StaffTimesheetList: {
      screen: StaffTimesheetList,
      navigationOptions: {
        title: 'Timesheets',
       
      },
    },
    TimesheetFilter: {
      screen: TimesheetFilter,
      navigationOptions: {
        title: 'Timesheet Filter',
        
      },
    },
    ImageViewer: {
      screen: ImageViewer,
      navigationOptions: {
        title: 'View Image',
        
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
    //initialRouteName: 'Dashboard',
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

// TimesheetStack.navigationOptions = ({navigation}) => {
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

export default TimesheetStack;
