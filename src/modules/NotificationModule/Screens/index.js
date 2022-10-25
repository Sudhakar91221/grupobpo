import {createStackNavigator} from 'react-navigation-stack';
import NotificationList from './NotificationList';
import AnnouncementDetail from '../../AnnouncementModule/Screens/AnnouncementDetail';
import EventDetail from '../../CalenderModule/Screens/EventDetail';
import StaffRequestDetails from '../../RequestModule/Screens/StaffRequestDetails';
import MyRequestDetail from '../../RequestModule/Screens/MyRequestDetail';
import StaffLeaveDetail from '../../LeaveModule/Screens/StaffLeaveDetail';
import LeaveDetail from '../../LeaveModule/Screens/LeaveDetail';
import MonthlyTimesheetScreen from '../../TimesheetModule/Screens/MonthlyTimesheetScreen';
import OccurrenceDetails from '../../OccuranceModule/Screens/OccurrenceDetails';
import SupportDetail from '../../SupportModule/Screens/SupportDetail';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const NotificationStack = createStackNavigator(
  {
    Notification: {
      screen: NotificationList,
      navigationOptions: {
        title: 'Notifications',
      
      },
    },
    AnnouncementDetail: {
      screen: AnnouncementDetail,
      navigationOptions: {
        title: 'Announcement Detail',
      
      },
    },
    EventDetail: {
      screen: EventDetail,
      navigationOptions: {
        title: 'Event Details',
       
      },
    },
    StaffRequestDetail: {
      screen: StaffRequestDetails,
      navigationOptions: {
        title: 'Request Details',
      
      },
    },
    MyRequestDetails: {
      screen: MyRequestDetail,
      navigationOptions: {
        title: 'Request Details',
       
      },
    },
    StaffLeaveDetail: {
      screen: StaffLeaveDetail,
      navigationOptions: {
        title: 'Leave Details',
       
      },
    },
    LeaveDetail: {
      screen: LeaveDetail,
      navigationOptions: {
        title: 'Leave Details',
        
      },
    },
    MonthlyTimesheetScreen: {
      screen: MonthlyTimesheetScreen,
      navigationOptions: {
        title: 'Timesheet Details',
       
      },
    },
    OccurrenceDetails: {
      screen: OccurrenceDetails,
      navigationOptions: {
        title: 'Occurrence Details',
       
      },
    },
    SupportDetail: {
      screen: SupportDetail,
      navigationOptions: {
        title: 'Support Details',
       
      },
    },
  },
  
   {
  //   initialRouteName: 'Notification',
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
       
      },
    };
  },
   },
);

export default NotificationStack;
