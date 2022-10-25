import {createStackNavigator} from 'react-navigation-stack';
import NotificationList from './NotificationList';
import ImageViewer from '../../../components/external/ImageViewer';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const HomeStack = createStackNavigator(
  {
    Notification: {
      screen: NotificationList,
      navigationOptions: {
        title: 'Notifications',
        
      },
    },
   
    ImageViewer: {
      screen: ImageViewer,
      navigationOptions: {
        title: 'View Image',
       
      },
    },
  },
  {
    initialRouteName: 'Notification',
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

HomeStack.navigationOptions = ({navigation}) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'Notification') {
        tabBarVisible = true;
      } else if (route.routeName === 'ApplicationDetail') {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
  };
};

export default HomeStack;
