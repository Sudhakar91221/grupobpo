import {Image, TouchableOpacity} from 'react-native';
import {
  createStackNavigator,
  DrawerActions,
  DrawerNavigator,
} from 'react-navigation';

const MenuImage = ({navigation}) => {
  if (!navigation.state.isDrawerOpen) {
    return <Image source={require('../../assets/Checkout_icon.png')} />;
  } else {
    return <Image source={require('../../assets/Checkout_icon.png')} />;
  }
};

const StackNavigator = createStackNavigator(
  {
    //important: key and screen name (i.e. DrawerNavigator) should be same while using the drawer navigator inside stack navigator.

    DrawerNavigator: {
      screen: DrawerNavigator,
    },
  },
  {
    navigationOptions: ({navigation}) => ({
      title: 'ReactNavigation', // Title to appear in status bar
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
          }}>
          <MenuImage style="styles.bar" navigation={navigation} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#333',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }),
  },
);
