import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
// import ReportStack from '../../ReportModule/Screens/index';
import HomeStack from '../../HomeModule/Screens/index';
import NotificationStack from '../../NotificationModule/Screens/index';
import MoreStack from '../../MoreModule/Screens';
import HomeNew from '../Drawer/Home';

export const EcityTabs = {
  3: 'Home',
  1: 'eApplications',
  2: 'Report',
  4: 'Notification',
  5: 'More',
}; //type according to notifications

export default createMaterialBottomTabNavigator(
  {
    Home: {
      screen: NotificationStack,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({focused}) => {
          const image = focused
            ? require('../../../asset/siren_selected.png')
            : require('../../../asset/siren.png');
          return <Image source={image} style={styles.iconStyle} />;
        },
      },
    },
    Notification: {
      screen: NotificationStack,
      navigationOptions: {
        tabBarLabel: 'Notification',
        tabBarIcon: ({focused}) => {
          const image = focused
            ? require('../../../asset/notification_selected.png')
            : require('../../../asset/notification.png');
          return <Image source={image} style={styles.iconStyle} />;
        },
      },
    },
    More: {
      screen: MoreStack,
      navigationOptions: {
        tabBarLabel: 'More',
        tabBarIcon: ({focused}) => {
          const image = focused
            ? require('../../../asset/more_selected.png')
            : require('../../../asset/more.png');
          return <Image source={image} style={styles.iconStyle} />;
        },
      },
    },
  },
  {
    tabBarOptions: {
      style: {
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        borderTopWidth: 1,
        borderTopColor: 'gray',
      },
    },
    initialRouteName:'Home',
    labeled: true,
    shifting: false,
    activeColor: '#81B833',
    activeTintColor: '#81B833',
    inactiveColor: '#454545',
    inactiveTintColor: '#454545',
    barStyle: {
      backgroundColor: '#F8F8F8EB',
      borderTopColor: '#454545',
      borderTopWidth: 1,
    },
  },
);
const styles = StyleSheet.create({
  iconStyle: {
    resizeMode: 'contain',
    height: 20,
    width: 20,
  },
});
