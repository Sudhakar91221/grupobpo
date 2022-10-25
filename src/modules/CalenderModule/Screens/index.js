import {createStackNavigator} from 'react-navigation-stack';
import EventDetail from './EventDetail';
import AttendeeList from './AttendeeList';
import CalendarScreen from './CalendarScreen';
import AddEvent from './AddEvent';
import SelectMembers from '../../PayslipModule/Screens/SelectMembers';
import EventUpdate from './EventUpdate';
import ImageViewer from '../../../components/external/ImageViewer';
import NotificationList from '../../NotificationModule/Screens/NotificationList';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const EventStack = createStackNavigator(
  {
    CalendarScreen: {
      screen: CalendarScreen,
      navigationOptions: {
        title: 'Company Calendar',
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
    AddEvent: {
      screen: AddEvent,
      navigationOptions: {
        title: 'New Event',
      
      },
    },
    SelectMembers: {
      screen: SelectMembers,
      navigationOptions: {
        title: 'Select Members',
      
      },
    },
    EventUpdate: {
      screen: EventUpdate,
      navigationOptions: {
        title: 'Update Event',
      
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
    initialRouteName: 'CalendarScreen',
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

export default EventStack;
