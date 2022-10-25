/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';

class DayStatus extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const dayStatus = this.props.item;
    const timesheetStatus = this.props.timesheetStatus;

    let status = 'submitted';
    let color = theme.publicHoliday;
    switch (timesheetStatus) {
      case '1': {
        status = 'submitted';
        break;
      }
      case '2': {
        status = 'submitted';
        break;
      }
      case '3': {
        switch (dayStatus) {
          case '2':
            status = 'submitted';
            break;
          case '3':
            status = 'rejected';
            color = theme.rejected;
            break;
          case '4':
            status = 'reconsideration';
            color = theme.empResubmit;
            break;
        }
        break;
      }
      case '4': {
        switch (dayStatus) {
          case '2':
            status = 'submitted';
            break;
          case '3':
            status = 'submitted';
            break;
          case '4':
            status = 'submitted';
            break;
        }
        break;
      }
      case '5': {
        if (dayStatus === 5) {
          status = 'approved_by_hr';
          color = theme.approvedByHr;
        }
        break;
      }
      case '6': {
        switch (dayStatus) {
          case '5':
            status = 'submitted';
            break;
          case '6':
            status = 'submitted';
            break;
          case '7':
            status = 'submitted';
            break;
        }
        break;
      }
      case '7': {
        switch (dayStatus) {
          case '2':
            status = 'submitted';
            break;
          case '5':
            status = 'submitted';
            break;
          case '6':
            status = 'submitted';
            break;
          case '7':
            status = 'submitted';
            break;
        }
        break;
      }
    }

    if (timesheetStatus === '0') {
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
      <View style={[styless.textVertical, {alignItems: 'flex-end'}]}>
        <Text
          style={[
            theme.detail,
            {
              color: color,
              borderRadius: 5,
              borderColor: color,
              borderWidth: 1,
              padding: 5,
              fontWeight: '800',
              textTransform: 'none',
            },
          ]}>
          {translate(status)}
        </Text>
      </View>
    );
  }
}

export default withTheme(DayStatus);
