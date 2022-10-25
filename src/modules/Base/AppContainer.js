import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {withTheme} from '../../components/common/Theme/themeProvider';
import {AuthAppSwitch} from './BottomTab/Stack';

export const AppContainer = createAppContainer(AuthAppSwitch);
// export const NewAppContainer = createAppContainer(NewAuthAppSwitch);

export const AppContainerWithTheme = withTheme(({theme, setTheme}) => {

  // if(global.isFromIOSN) {
    
  // // }
  // const componentDidMount = () => {
  //   console.log('component mounted'); // not working
  // }


  return <AppContainer screenProps={{theme, setTheme}} />;
});
