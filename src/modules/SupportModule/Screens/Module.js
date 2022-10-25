import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
// import { AppContainer } from './AppContainer';
//import AppContainer from '../../helpers/routers/index'
import {
  createSwitchNavigator,
  createAppContainer,
  createStackNavigator,
} from 'react-navigation';

import React, {Component} from 'react';
import {Provider} from 'react-redux';

import configureStore from '../../../../app/Helpers/Network/store/Store';
const initialState = {};

const store = configureStore();
import {SupportStack, SupportDetailStack} from '../../Drawer/Drawer';

export default class SupportModule extends Component {
  constructor(props) {
    super(props);
    console.log(
      '---------------********************---------------------****************---------------------',
    );
    console.log(props);

    this.state = {
      //uncomment for hybird

      rootTag: this.props.rootTag,
      email: this.props.email,
      versionName: this.props.versionName,
      deviceId: this.props.deviceId,
      password: this.props.password,
      ticketNo: this.props.ticketNo,
    };

    (global.email = this.state.email), (global.password = this.state.password);
    global.versionName = this.state.versionName;
    global.deviceId = this.state.deviceId;
  }
  render() {
    return (
      <Provider store={store}>
        {/* <SafeAreaView style={styles.safeArea}> */}
        {/* <StatusBar barStyle="light-content" backgroundColor="#383C55"/> */}

        {this.state.ticketNo === undefined ? (
          <SupportContainer
            screenProps={{
              isFromStaff: this.state.isFromStaff,
              rootTag: this.state.rootTag,
            }}
          />
        ) : (
          <SupportDetailContainer
            screenProps={{
              rootTag: this.state.rootTag,
              ticketNo: this.state.ticketNo,
            }}
          />
        )}

        {/* </SafeAreaView> */}
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ddd',
  },
});

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
//need to make it only for ios

export const SupportDetailContainer = createAppContainer(
  createSwitchNavigator(
    {
      Support: SupportDetailStack,
    },
    {
      initialRouteName: 'Support',
    },
  ),
);

export const SupportContainer = createAppContainer(
  createSwitchNavigator(
    {
      Support: SupportStack,
    },
    {
      initialRouteName: 'Support',
    },
  ),
);
