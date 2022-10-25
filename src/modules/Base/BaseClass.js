/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import Toast from '../../components/views/Toast';
import OfflineNotice from '../../components/views/OfflineNotice';
import {withTheme} from '../../components/common/Theme/themeProvider';

class BaseClass extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    const {theme} = this.props;
    return (
      <View style={{flex: 1, height: 0}}>
        {/* {this.props.title !== undefined && (
          <Text style={[theme.navHeader]}>{this.props.title} </Text>
        )}
        {this.props.showToastMessage !== undefined && (
          <Toast message={this.props.showToastMessage} backColor={'orange'} />
        )}
        <OfflineNotice message="Looks like you are offline" /> */}
        <View style={{flex: 1, height: 0}}>{this.props.children}</View>
      </View>
    );
  }
}

export default withTheme(BaseClass);
