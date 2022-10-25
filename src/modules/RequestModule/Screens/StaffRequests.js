import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import CustomTopTab from './StaffRequestTab';
import IncomingRequests from './IncomingRequests';
import OutgoingRequests from './OutgoingRequests';
import {DrawerIcon, NotificationButton} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {withCollapsibleForTab} from 'react-navigation-collapsible';

const Announcement = createMaterialTopTabNavigator(
  {
    Incoming: {screen: IncomingRequests},
    Outgoing: {screen: OutgoingRequests},
  },
  {
    tabBarComponent: prop => <CustomTopTab {...prop} />,
  },
);

Announcement.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    title: 'Requests',
  
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
    headerRight: (
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
