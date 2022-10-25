/* eslint-disable react-native/no-inline-styles */

import {Button, Image, View, Alert, Text} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import React from 'react';
import PropTypes from 'prop-types';

class PayslipComponent extends React.Component {
  render() {
    const {theme} = this.props;
    const {type, amt} = this.props.item;
    const {currency} = this.props;
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[
              theme.header,
              {
                textAlign: 'left',
                color: 'gray',
                flex: 1,
                fontWeight: 'normal',
                textTransform: 'none',
              },
            ]}>
            {type}
          </Text>
          <Text
            style={[
              theme.header,
              {
                textAlign: 'right',
                color: 'gray',
                flex: 1,
                fontWeight: 'normal',
              },
            ]}>
            {currency}
            {amt}
          </Text>
        </View>
      </View>
    );
  }
}

PayslipComponent.propTypes = {
  type: PropTypes.string,
  amt: PropTypes.string,
};

export default withTheme(PayslipComponent);
