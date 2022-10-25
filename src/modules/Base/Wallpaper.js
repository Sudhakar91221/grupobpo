/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, ImageBackground, View, Image} from 'react-native';
import {styless} from '../../components/common/Styles';

import {withTheme} from '../../components/common/Theme/themeProvider';
import {ScreenWidth, ScreenHeight} from '../../components/utility/Settings';
import LinearGradient from 'react-native-linear-gradient';

class Wallpaper extends Component {
  render() {
    const {theme} = this.props;
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          style={styles.picture}
          resizeMode="contain"
          // source={require('../../asset/logo.png')}
          source={require('../../assets/LNWLogo.png')}
          >
          {this.props.children}
        </ImageBackground>
      </View>
    );
  }
}

export default withTheme(Wallpaper);
const styles = StyleSheet.create({
  picture: {
    flex: 1,
    margin: 50,
    justifyContent: 'center',
  },
  bottom: {
    flex: 1.9,
    width: '100%',
    // resizeMode: 'stretch',
    // justifyContent: 'center',
    // margin: 0,
    // backgroundColor: 'transparent'
    // overflow: 'visible',
  },
});
