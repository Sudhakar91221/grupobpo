import {createStackNavigator} from 'react-navigation-stack';
import HolidaysList from './HolidaysList';
import AddHoliday from './AddHoliday';
import UpdateHoliday from './UpdateHoliday';
import NotificationList from '../../NotificationModule/Screens/NotificationList';
import LinearGradient from "react-native-linear-gradient";
import React from 'react';
const HolidayStack = createStackNavigator(
  {
    Holidays: {
      screen: HolidaysList,
      // navigationOptions: {
      //   title: 'Public Holidays',
      //   headerTitleStyle: {
      //     textAlign: 'left',
      //     alignSelf: 'flex-start',
      //     flex: 1,
      //     paddingRight: 0,
      //     fontSize: 26,
      //     color: 'white',
      //     marginTop: 10,
      //   },
      // },
    },
    AddHoliday: {
      screen: AddHoliday,
      // navigationOptions: {
      //   title: 'New Holiday',
      //   headerTitleStyle: {
      //     textAlign: 'left',
      //     alignSelf: 'flex-start',
      //     flex: 1,
      //     paddingRight: 0,
      //     fontSize: 26,
      //     color: 'white',
      //     marginTop: 10,
      //   },
      // },
    },
    UpdateHoliday: {
      screen: UpdateHoliday,
      // navigationOptions: {
      //   title: 'Update Holiday',
      //   headerTitleStyle: {
      //     textAlign: 'left',
      //     alignSelf: 'flex-start',
      //     flex: 1,
      //     paddingRight: 0,
      //     fontSize: 26,
      //     color: 'white',
      //     marginTop: 10,
      //   },
      // },
    },
    Notification: {
      screen: NotificationList,
      // navigationOptions: {
      //   title: 'Notifications',
      //   headerTitleStyle: {
      //     textAlign: 'left',
      //     alignSelf: 'flex-start',
      //     flex: 1,
      //     paddingRight: 0,
      //     fontSize: 26,
      //     color: 'white',
      //     marginTop: 10,
      //   },
      // },
    },
  },

  {
    initialRouteName: 'Holidays',
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



export default HolidayStack;
