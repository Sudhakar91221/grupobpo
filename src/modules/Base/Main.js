import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View
} from 'react-native';
// import { AppContainer } from './AppContainer';
//import AppContainer from '../../helpers/routers/index'

import React, { Component } from 'react';
import { Provider } from 'react-redux';

import configureStore from '../../store/Store';
import { AppContainerWithTheme } from './AppContainer';
import { ThemeContextProvider } from '../../components/common/Theme/themeProvider';
import {
  setTheServerSettings,
  setTheServerSettingsOriginal,
} from '../../network/config';
import CustomStatusBar from '../../components/views/CustomStatusBar';
import SyncStorage from 'sync-storage';
import { UserType } from '../AuthModule/Actions/APIIntegers';

const store = configureStore();
console.disableYellowBox = true;

export const CompanyType = {
  eCity: 'eCity',
};

export default class Main extends Component {

  componentDidMount() {
    console.log('component mounted'); // not working
  }


  render() {
    global.CompanyType = CompanyType.eCity;
    global.selectedUserType = UserType.USER;
    setTheServerSettingsOriginal(global.CompanyType);
    SyncStorage.set('isFromLogout', false.toString());
    return (
      <Provider store={store}>
        {/* <SafeAreaView  style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}> */}
        <ThemeContextProvider>

          <View style={[styles.container]}>
            {/* <CustomStatusBar /> */}
            <AppContainerWithTheme
              ref={mynav => {
                this.navigator = mynav;
              }}
            />
          </View>
        </ThemeContextProvider>

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
  container: {
    flex: 1
  }
});
