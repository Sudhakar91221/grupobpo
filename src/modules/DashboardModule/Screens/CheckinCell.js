/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import {withTheme} from '../../../components/common/Theme/themeProvider';

class CheckinCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;

    return (
      <View
        style={[
          styless.textVertical,
          {
            width: '100%',
            height: '100%',
            flexDirection: 'row',
            padding: 5,
          },
        ]}>
        <Text style={[theme.detail, {flex: 1}]} numberOfLines={1}>
          {item.placeName}
        </Text>
        <Text
          style={[
            theme.detail,
            {
              textAlign: 'center',
              flex: 0.3,
              color: theme.greenText,
              alignSelf: 'center',
              textTransform: 'uppercase',
              fontSize:12,
              fontWeight:'bold'

            },
          ]}
          numberOfLines={1}>
          {Moment(this.props.date + ' ' + item.inTime).format('hh:mm A')}
        </Text>
        <Text
          style={[
            theme.detail,
            {
              textAlign: 'center',
              flex: 0.3,
              color: theme.redText,
              alignSelf: 'center',
              textTransform: 'uppercase',
              fontSize:12,
              fontWeight:'bold'

            },
          ]}
          numberOfLines={1}>
          {item.outTime === '-'
            ? item.outTime
            : Moment(this.props.date + ' ' + item.outTime).format('hh:mm A')}
        </Text>
      </View>
    );
  }
}

export default withTheme(CheckinCell);
