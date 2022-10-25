import React, {Component} from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import LinearGradient from 'react-native-linear-gradient';

import {StyleSheet} from 'react-native';
import {fromLeft, fromRight, zoomOut} from 'react-navigation-transitions';

import ImageViewer from '../../../components/external/ImageViewer';
import VideoPlayer from '../../../components/external/VideoPlayer';

import DrawerScreen from './DrawerScreen';

// import AnnouncementList from '../AnnouncementModule/Screens/AnnouncementList';
// import AnnouncementDetail from '../AnnouncementModule/Screens/AnnouncementDetail';
// import AnnouncementAdd from '../AnnouncementModule/Screens/AnnouncementAdd';
import HomeStack from '../../HomeModule/Screens';
import BottomTab from '../BottomTab/BottomTab';
import Home from './Home';
import HomeNew from './Home';
import MoreStack from '../../MoreModule/Screens/index';
import NotificationStack from '../../NotificationModule/Screens/index';
import DashboardStack from '../../DashboardModule/Screens/index';
import TimesheetStack from '../../TimesheetModule/Screens/index';
import HolidayStack from '../../HolidayModule/Screens/index';
import LeaveStack from '../../LeaveModule/Screens/index';
import AnnouncementStack from '../../AnnouncementModule/Screens/index';
import DirectoryStack from '../../DirectoryModule/Screens/index';
import PayslipStack from '../../PayslipModule/Screens/index';
import RequestStack from '../../RequestModule/Screens/index';
import EventStack from '../../CalenderModule/Screens/index';
import MemberStack from '../../MemberModule/Screens/index';
import AlbumStack from '../../AlbumModule/Screens/index';
import OccurrenceStack from '../../OccuranceModule/Screens/index';
import SupportStack from '../../SupportModule/Screens/index';

export const DrawerNavigator = createDrawerNavigator(
  {
    // Album: AlbumStack,
    Dashboard: {
      screen: DashboardStack,
    },
    TimesheetStack: {
      screen: TimesheetStack,
    },
    HolidayStack: {
      screen: HolidayStack,
    },
    More: {
      screen: MoreStack,
    },
    LeaveStack: {
      screen: LeaveStack,
    },
    AnnouncementStack: {
      screen: AnnouncementStack,
    },
    DirectoryStack: {
      screen: DirectoryStack,
    },
    PayslipStack: {
      screen: PayslipStack,
    },
    RequestStack: {
      screen: RequestStack,
    },
    EventStack: {
      screen: EventStack,
    },
    MemberStack: {
      screen: MemberStack,
    },
    Album: {
      screen: AlbumStack,
    },
    Occurrence: {
      screen: OccurrenceStack,
    },
    Support: {
      screen: SupportStack,
    },
    Notification: {
      screen: NotificationStack,
    },
  },

  // {
  //   initialRouteName: 'Dashboard',
  //   contentComponent: DrawerScreen,
  //   drawerWidth: 290,
  //   // headerMode:'none',
  //   // navigationOptions: {
  //   //   title: 'Drawer',
  //   // },
  // },
  {
    initialRouteName: 'Dashboard',
    contentComponent: DrawerScreen,
    drawerWidth: 290,
    // defaultNavigationOptions: ({ screenProps }) => {
    //   return {
    //     headerBackground: (
    //       <LinearGradient
    //         colors={['#10356c', '#474F6A']}
    //         style={{ flex: 1 }}
    //         // start={{x: 0, y: 0}}
    //          end={{x: 1, y: 0}}

    //         start={{x: 0.0, y: 0.0}}
    //     // end={{x: 1.0, y: 1.0}}
    //     locations={[0.1, 0.9]}
    //       />
    //     ),
    //     headerStyle: {
    //       backgroundColor: screenProps.theme.backgroundColor,
    //     },
    //     headerTintColor: screenProps.theme.navBarHeaderColor,
    //     headerTitleStyle: {
    //       color: screenProps.theme.navBarHeaderColor,
    //       fontSize: 22,
    //       fontWeight: 'bold',
    //         // textAlign: 'left',
    //         // alignSelf: 'flex-start',
    //         // flex: 1,
    //         // paddingRight: 0,
    //         // fontSize: 26,
    //         // color: 'white',
    //         // marginTop: 10,
         
    //     }
    //   };
    // }
  },
);
