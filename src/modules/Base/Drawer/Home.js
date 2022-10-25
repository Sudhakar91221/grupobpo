import React from 'react';
import {Button, Image, View} from 'react-native';
import {polyfill} from 'react-lifecycles-compat';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {NavSearchBar, DrawerIcon} from '../../../components/views/NavBar';

class Home extends React.Component {
  render() {
    return (
      <View style={{backgroundColor: 'pink', flex: 1}}>
        <Button
          // onPress={() => this.props.navigation.navigate('Notifications')}
          title="Go to notifications"
        />
      </View>
    );
  }
}
const HomeNew = withTheme(Home);
HomeNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      fontSize: 30,
      color: 'black',
    },
    defaultNavigationOptions: {
        gesturesEnabled: true,
      },

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
    headerLeft: (
      <DrawerIcon
        navigation={navigation}
        action={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    ),
  };

};

// polyfill(Home);
export default HomeNew;
