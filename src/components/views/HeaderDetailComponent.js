/* eslint-disable react-native/no-inline-styles */

import {Button, Image, View, Alert, Text} from 'react-native';
import {withTheme} from '../common/Theme/themeProvider';
import React from 'react';
import PropTypes from 'prop-types';

class HeaderDetailComponent extends React.Component {
  render() {
    const {theme} = this.props;
    const {image, header, description, detail} = this.props;
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          {image ? (
            <Image
              source={{uri: image}}
              style={{height: 20, width: 20, marginTop: 7, marginLeft: 10}}
            />
          ) : null}

          <Text
            style={[
              theme.detail,
              {
                color: 'gray',
                paddingTop: 5,
                fontWeight: '600',
                paddingLeft: 10,
              },
            ]}>
            {header}
          </Text>
        </View>
        {detail ? (
          <View>
            <Text
              style={[
                theme.detail,
                {
                  color: theme.primaryColor,
                  paddingLeft: 20,
                  fontWeight: '600',
                  fontSize: 16,
                },
              ]}>
              {detail[0]}
            </Text>
            <Text
              style={[
                theme.detail,
                {
                  color: theme.primaryColor,
                  paddingLeft: 20,
                  fontWeight: '600',
                  fontSize: 16,
                },
              ]}>
              {detail[1]}
            </Text>
            <Text
              style={[
                theme.detail,
                {
                  color: theme.primaryColor,
                  paddingLeft: 20,
                  fontWeight: '600',
                  fontSize: 16,
                },
              ]}>
              {detail[2]}
            </Text>
            <Text
              style={[
                theme.detail,
                {
                  color: theme.primaryColor,
                  paddingLeft: 20,
                  fontWeight: '600',
                  fontSize: 16,
                },
              ]}>
              {detail[3]}
            </Text>
            <Text
              style={[
                theme.detail,
                {
                  color: theme.primaryColor,
                  paddingLeft: 20,
                  fontWeight: '600',
                  fontSize: 16,
                },
              ]}>
              {detail[4]}
            </Text>
            <Text
              style={[
                theme.detail,
                {
                  color: theme.primaryColor,
                  paddingLeft: 20,
                  fontWeight: '600',
                  fontSize: 16,
                },
              ]}>
              {detail[5]}
            </Text>
            <Text
              style={[
                theme.detail,
                {
                  color: theme.primaryColor,
                  paddingLeft: 20,
                  fontWeight: '600',
                  fontSize: 16,
                },
              ]}>
              {detail[6]}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              theme.detail,
              {
                color:
                  this.props.isAttachment === true
                    ? 'blue'
                    : theme.primaryColor,
                paddingLeft: 20,
                fontWeight: '600',
                fontSize: 16,
              },
            ]}>
            {description}
          </Text>
        )}
      </View>
    );
  }
}

HeaderDetailComponent.propTypes = {
  image: PropTypes.string,
  header: PropTypes.string,
  description: PropTypes.string,
};

export default withTheme(HeaderDetailComponent);
