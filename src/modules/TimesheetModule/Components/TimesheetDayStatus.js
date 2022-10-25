/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';

class TimesheetDayStatus extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;
    let day = '';
    let color = '';
    switch (item) {
      case 1: {
        day = 'weekly_off';
        color = theme.weeklyOff;
        break;
      }
      case 1: {
        day = 'public_holiday';
        color = theme.publicHoliday;
        break;
      }
      case 1: {
        day = 'approved_leave';
        color = theme.approvedLeave;
        break;
      }
    }

    if (item === 0) {
      return (
        <View
          style={[
            styless.textVertical,
            {
              width: '100%',
              height: '100%',
              padding: 10,
            },
          ]}
        />
      );
    }
    return (
      <View style={[styless.textVertical]}>
        <Text
          style={[
            theme.detail,
            {
              color: 'white',
              borderRadius: 5,
              backgroundColor: color,
              padding: 5,
              fontWeight: '800',
            },
          ]}>
          {translate(day)}
        </Text>
      </View>
    );
  }
}

export default withTheme(TimesheetDayStatus);
