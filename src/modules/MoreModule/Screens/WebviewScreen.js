/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import {withTheme} from '../../../components/common/Theme/themeProvider';

class WebviewScreen extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <WebView source={{uri: this.props.navigation.state.params.url}} />
      </View>
    );
  }
}

const WebviewScreenNew = withTheme(WebviewScreen);

WebviewScreenNew.navigationOptions = ({navigation, screenProps, params}) => {
  //To hide the NavigationBar from current Screen
  const {theme} = screenProps;

  return {
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      paddingTop: 13,
      fontSize: 22,
      color: 'black',
      fontWeight: 'bold',
    },
    title: navigation.state.params.title,
    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

export default WebviewScreenNew;
