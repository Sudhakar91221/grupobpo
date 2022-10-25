import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import CustomAdvertisementTopTab from './AnnouncementTab';
import PublishedAnnouncements from './PublishedAnnouncements';
import UpcomingAnnouncements from './UpcomingAnnouncements';
import {
  DrawerIcon,
  AddButton,
  NotificationButton,
} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {withCollapsibleForTab} from 'react-navigation-collapsible';
import {isPermissionAllowed} from '../../../network/APICall';

const Announcement = createMaterialTopTabNavigator(
  {
    Published: {screen: PublishedAnnouncements},
    Upcoming: {screen: UpcomingAnnouncements},
  },
  {
    tabBarComponent: prop => <CustomAdvertisementTopTab {...prop} />,
  },
);

Announcement.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    title: 'Announcements',
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      fontSize: 26,
      color: 'white',
      marginTop: 10,
      backgroundColor: theme.primaryColor,
      shadowColor: 'transparent',
      borderBottomWidth: 0,
    },
    headerTintColor: 'white',
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerLeft: (
      <DrawerIcon
        navigation={navigation}
        action={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    ),
    headerRight: isPermissionAllowed('Announcement/add') ? (
      <AddButton
        navigation={navigation}
        action={() => navigation.navigate('AddAnnouncement')}
        notiaction={() => navigation.navigate('Notification')}
        isBadgeShown={global.isBadgeShown}
      />
    ) : (
      <NotificationButton
        navigation={navigation}
        action={() => navigation.navigate('Notification')}
        isBadgeShown={global.isBadgeShown}
      />
    ),
  };
};

const GroupImageHeader = ({navigation, collapsible}) => {
  const {translateY, translateOpacity, translateProgress} = collapsible;
  //return <BaseClass title={translate('my_advertisements')} />;
  return null;
};
const collapsibleParams = {
  collapsibleComponent: GroupImageHeader,
  collapsibleBackgroundStyle: {
    height: 0,
    backgroundColor: 'white',
    disableFadeoutInnerComponent: true,
  },
};
export default withCollapsibleForTab(Announcement, collapsibleParams);
