import {createStackNavigator} from 'react-navigation-stack';
import MyLeaves from './MyLeaves';
import MyLeavesFilter from './MyLeavesFilter';
import ApplyLeave from './ApplyLeave';
import LeaveDetail from './LeaveDetail';
import UpdateLeave from './UpdateLeave';
import StaffLeaves from './StaffLeaves';
import StaffLeavesFilter from './StaffLeavesFilter';
import StaffLeaveDetail from './StaffLeaveDetail';
import ApplyStaffLeave from './ApplyStaffLeave';
import UpdateStaffLeave from './UpdateStaffLeave';
import ImageViewer from '../../../components/external/ImageViewer';
import NotificationList from '../../NotificationModule/Screens/NotificationList';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";

const LeaveStack = createStackNavigator(
  {
    MyLeaves: {
      screen: MyLeaves,
      navigationOptions: {
        title: 'My Leaves',
       
      },
    },
    MyLeavesFilter: {
      screen: MyLeavesFilter,
      navigationOptions: {
        title: 'Leave Filter',
      
      },
    },
    ApplyLeave: {
      screen: ApplyLeave,
      navigationOptions: {
        title: 'Apply Leave',
       
      },
    },
    LeaveDetail: {
      screen: LeaveDetail,
      navigationOptions: {
        title: 'Leave Detail',
     
      },
    },
    UpdateLeave: {
      screen: UpdateLeave,
      navigationOptions: {
        title: 'Update Leave',
      
      },
    },
    StaffLeaves: {
      screen: StaffLeaves,
      navigationOptions: {
        title: 'Staff Leaves',
      
      },
    },
    StaffLeavesFilter: {
      screen: StaffLeavesFilter,
      navigationOptions: {
        title: 'Leave Filter',
       
      },
    },
    StaffLeaveDetail: {
      screen: StaffLeaveDetail,
      navigationOptions: {
        title: 'Leave Detail',
       
      },
    },
    ApplyStaffLeave: {
      screen: ApplyStaffLeave,
      navigationOptions: {
        title: 'Apply Leave',
       
      },
    },
    UpdateStaffLeave: {
      screen: UpdateStaffLeave,
      navigationOptions: {
        title: 'Update Leave',
      
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

export default LeaveStack;
