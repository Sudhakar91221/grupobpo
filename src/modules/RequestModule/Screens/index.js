import {createStackNavigator} from 'react-navigation-stack';
import MyRequests from './MyRequests';
import MyRequestDetail from './MyRequestDetail';
import AddRequest from './AddRequest';
import UpdateRequest from './UpdateRequest';
import StaffRequests from './StaffRequests';
import StaffRequestDetailNew from './StaffRequestDetails';
import ImageViewer from '../../../components/external/ImageViewer';
import NotificationList from '../../NotificationModule/Screens/NotificationList';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const PayslipStack = createStackNavigator({
  MyRequests: {
    screen: MyRequests,
    navigationOptions: {
      title: 'Requests',
      
    },
  },
  MyRequestDetail: {
    screen: MyRequestDetail,
    navigationOptions: {
      title: 'Request Details',
    
    },
  },
  AddRequest: {
    screen: AddRequest,
    navigationOptions: {
      title: 'New Request',
     
    },
  },
  UpdateRequest: {
    screen: UpdateRequest,
    navigationOptions: {
      title: 'Update Request',
     
    },
  },
  StaffRequests: {
    screen: StaffRequests,
  },
  StaffRequestDetail: {
    screen: StaffRequestDetailNew,
    navigationOptions: {
      title: 'Request Reply',
     
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
}
);

export default PayslipStack;
