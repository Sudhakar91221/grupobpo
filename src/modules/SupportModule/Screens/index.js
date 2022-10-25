import {createStackNavigator} from 'react-navigation-stack';
import SupportList from './SupportList';
import SupportFilterNew from './SupportFilter';
import SupportDetail from './SupportDetail';
import ImageViewer from '../../../components/external/ImageViewer';
import CommentList from './CommentList';
import SupportAdd from './SupportAdd';
import NotificationList from '../../NotificationModule/Screens/NotificationList';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const SupportStack = createStackNavigator(
  {
    SupportList: {
      screen: SupportList,
      navigationOptions: {
        title: 'Support',
        
      },
    },
    SupportFilter: {
      screen: SupportFilterNew,
      navigationOptions: {
        title: 'Support Filter',
      
      },
    },
    CommentList: {
      screen: CommentList,
      navigationOptions: {
      
      },
    },
    SupportDetail: {
      screen: SupportDetail,
      navigationOptions: {
        
      },
    },
    SupportAdd: {
      screen: SupportAdd,
      navigationOptions: {
        title: 'New Ticket',
     
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
  //     initialRouteName: 'Holidays',
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

export default SupportStack;
