import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import CustomAlbumTopTab from './AlbumTab';
import {
  DrawerIcon,
  AddButton,
  NotificationButton,
} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {withCollapsibleForTab} from 'react-navigation-collapsible';
import {isPermissionAllowed} from '../../../network/APICall';
import AlbumGrid from './AlbumGrid';
import AlbumList from './AlbumList';

const Album = createMaterialTopTabNavigator(
  {
    Grid: {screen: AlbumGrid},
    List: {screen: AlbumList},
  },
  {
    tabBarComponent: prop => <CustomAlbumTopTab {...prop} />,
  },
);

Album.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    title: 'Albums',
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
    headerRight: isPermissionAllowed('Album/create') ? (
      <AddButton
        navigation={navigation}
        action={() => navigation.navigate('AddAlbum')}
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
export default withCollapsibleForTab(Album, collapsibleParams);
