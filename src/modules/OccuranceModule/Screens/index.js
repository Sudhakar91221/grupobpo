import {createStackNavigator} from 'react-navigation-stack';
import MyOccurrences from './MyOccurances';
import OccurrenceDetails from './OccurrenceDetails';
import ImageViewer from '../../../components/external/ImageViewer';
import AddOccurrence from './AddOccurrence';
import StaffOccurrences from './StaffOccurrences';
import OccurrenceFilter from './OccurrenceFilter';
import NotificationList from '../../NotificationModule/Screens/NotificationList';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const OccurrenceStack = createStackNavigator(
  {
    Occurrences: {
      screen: MyOccurrences,
      navigationOptions: {
        title: 'Occurrences',
       
      },
    },
    OccurrenceDetails: {
      screen: OccurrenceDetails,
      navigationOptions: {
        title: 'Occurrence Details',
       
      },
    },
    ImageViewer: {
      screen: ImageViewer,
      navigationOptions: {
        title: 'View Image',
        
      },
    },
    AddOccurrence: {
      screen: AddOccurrence,
      navigationOptions: {
        title: 'Add Occurrence',
       
      },
    },
    StaffOccurrences: {
      screen: StaffOccurrences,
      navigationOptions: {
        title: 'Occurrences',
      
      },
    },
    OccurrenceFilter: {
      screen: OccurrenceFilter,
      navigationOptions: {
        title: 'Occurrence Filter',
        
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
  //     initialRouteName: 'Occurrences',
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

export default OccurrenceStack;
