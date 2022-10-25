/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import Moment from 'moment';
import {translate} from '../../../../App';

class MyPayslipCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;
    let color = theme.white;
    let status;
    switch (item.dayType) {
      case '1':
        status = '';
        break;
      case '2':
        status = 'weekly_off';
        color = theme.weeklyOff;
        break;
      case '3':
        status = 'public_holiday';
        color = theme.payslip_public_holiday;
        break;
      case '4':
        status = 'special_holiday';
        color = theme.payslip_special_day;
        break;
      case '5':
        status = 'double_holiday';
        color = theme.payslip_double_holiday;
        break;
    }

    return (
      <View style={{margin: 2, flex: 1, padding: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[
              theme.detail,
              {
                textAlign: 'center',
                color: theme.black,
                fontSize: 16,
                flex: 1,
              },
            ]}
            numberOfLines={1}>
            {Moment(item.date, 'DD-MM-YYYY').format('DD MMM YY')}
          </Text>

          <Text
            style={[
              theme.detail,
              {
                textAlign: 'center',
                color: theme.black,
                fontSize: 16,
                flex: 1,
              },
            ]}
            numberOfLines={1}>
            {item.regularTime}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                textAlign: 'center',
                color: theme.black,
                flex: 1,
                fontSize: 16,
              },
            ]}
            numberOfLines={1}>
            {item.overTime}
          </Text>
        </View>
        <View style={[styless.textVertical, {alignItems: 'flex-start'}]}>
          {item.dayType === '1' ? null : (
            <Text
              style={[
                theme.detail,
                {
                  borderRadius: 5,
                  borderColor: color,
                  borderWidth: 1,
                  backgroundColor: color,
                  color: theme.white,
                  padding: 5,
                  fontWeight: '800',
                  textTransform: 'none',
                },
              ]}>
              {translate(status)}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

export default withTheme(MyPayslipCell);
