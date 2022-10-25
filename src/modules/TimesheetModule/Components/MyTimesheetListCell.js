/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import CardView from 'react-native-cardview';

class MyLeaveCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;
    var status = '';
    switch (item.status) {
      case '0':
        status = 'open';
        break;
      case '1': {
        if (item.resubmitFlag === 1) {
          status = 'resubmitted';
        } else if (item.resubmitFlag === 0) {
          status = 'submitted';
        }
        break;
      }
      case '2':
        if (item.resubmitFlag === 1) {
          status = 'resubmitted';
        } else if (item.resubmitFlag === 0) {
          status = 'submitted';
        }
        break;
      case '3':
        status = 'rejected_by_supervisor';
        break;
      case '4':
        status = 'resubmitted';
        break;
      case '5':
        status = 'approved_by_hr';
        break;
      case '6':
        status = 'submitted';
        if (item.resubmitFlag === 1) {
          status = 'resubmitted';
        } else if (item.resubmitFlag === 0) {
          status = 'submitted';
        }
        break;
      case '7':
        status = 'resubmitted';
    }

    return (
      <View style={{margin: 2, flex: 1}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <TouchableOpacity
            style={[
              styless.textVertical,
              {
                width: '100%',
                height: '100%',
                padding: 5,
              },
            ]}
            onPress={() =>
              this.props.navigation.navigate('MonthlyTimesheet', {
                periodId: item.periodId,
                timesheetId: item.id,
                isMyTimesheet: true,
              })
            }>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  theme.header,
                  {color: theme.primaryColor, fontWeight: 'bold'},
                ]}
                numberOfLines={1}>
                {item.startPeriod}{' '}
              </Text>
              <Text
                style={[
                  theme.header,
                  {color: theme.primaryColor, fontWeight: 'bold'},
                ]}
                numberOfLines={1}>
                - {item.endPeriod}
              </Text>
              <View style={{flex: 1, marginRight: 5}}>
                <Text
                  style={[
                    theme.detail,
                    {textAlign: 'right', color: theme.disableButtonColor},
                  ]}
                  numberOfLines={1}>
                  {item.totalTime}
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text
                  style={[
                    theme.detail,
                    {textAlign: 'left', color: theme.disableButtonColor},
                  ]}
                  numberOfLines={1}>
                  {translate(status)}
                </Text>
              </View>
              <View style={{flex: 1, marginRight: 5}}>
                <Text
                  style={[
                    theme.detail,
                    {textAlign: 'right', color: theme.disableButtonColor},
                  ]}
                  numberOfLines={1}>
                  {translate('hours')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </CardView>
      </View>
    );
  }
}

export default withTheme(MyLeaveCell);
