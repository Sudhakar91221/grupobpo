// TabBar.js
import React from 'react';
import {StyleSheet} from 'react-native';
import {BottomTabBar} from 'react-navigation';

import {withTheme} from '../../components/common/Theme/themeProvider';

const TabBar = props => {
  return (
    <BottomTabBar
      {...props}
      activeTintColor={props.theme.startColor}
      inactiveTintColor={props.theme.endColor}
      //activeColor = {props.theme.startColor}
      //  inactiveColor = {props.theme.startColor}
      activeBackgroundColor={'white'}
      inactiveBackgroundColor={'white'}
      labelStyle={style.label}
    />
  );
};

const style = StyleSheet.create({
  label: {fontSize: 22, fontWeight: '400'},
});

export default withTheme(TabBar);
