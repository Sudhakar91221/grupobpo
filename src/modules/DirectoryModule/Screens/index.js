import {createStackNavigator} from 'react-navigation-stack';
import DirectoryScreen from './DirectoryScreen';
import EmployeeDetail from './EmployeeDetail';
import MonthlyTimesheet from '../../TimesheetModule/Screens/MonthlyTimesheetScreen';
import DailyTimesheet from '../../TimesheetModule/Screens/DailyTimesheet';
import CheckinsList from '../../TimesheetModule/Screens/CheckinsList';
import CheckinMapScreen from '../../TimesheetModule/Screens/CheckinMapScreen';
import ImageViewer from '../../../components/external/ImageViewer';
import NotificationList from '../../NotificationModule/Screens/NotificationList';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const DirectoryStack = createStackNavigator(
  {
    Directory: {
      screen: DirectoryScreen,
      navigationOptions: {
        title: 'Directory',
       
      },
    },
    EmployeeDetail: {
      screen: EmployeeDetail,
      navigationOptions: {
        title: 'Directory',
      
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
    initialRouteName: 'Directory',
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
    },
  },
);

export default DirectoryStack;
