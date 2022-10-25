import React from 'react';
import {FlatList, View} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {DrawerIcon, NotificationButton} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {flatListItemSeparator} from '../../../components/utility/common';
import SettingsListCell from './SettingsListCell';

class Settings extends React.Component {
  render() {
    return (
      <View>
        <FlatList
          data={data}
          renderItem={this.renderMoreItem}
          numColumns={1}
          keyExtractor={this._keyExtractor}
          extraData={this.props}
          ItemSeparatorComponent={flatListItemSeparator}
        />
        <View
          style={{height: 0.8, width: '100%', backgroundColor: '#C8C8C8'}}
        />
      </View>
    );
  }
  renderMoreItem = ({item}) => {
    return <SettingsListCell item={item} navigation={this.props.navigation} />;
  };
}
const SettingsNew = withTheme(Settings);
SettingsNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
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
        isBadgeShown={true}
      />
    ),
  };
};
export default SettingsNew;
const data = [
  {title: 'Change Password'},
  {title: 'Terms Of Use'},
  {title: 'Privacy Policy'},
  {title: 'Checkout Reminder'},
  {title: 'App Version', version: 2.4},
];
