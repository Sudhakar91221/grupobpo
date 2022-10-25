/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import CardView from 'react-native-cardview';

class StaffLeaveCell extends React.PureComponent {
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
    switch (item.leaveStatus) {
      case 0:
        status = 'pending';
        break;
      case 1:
        status = 'approved';
        break;
      case 2:
        status = 'rejected';
        break;
      case 3:
        status = 'cancelled';
    }

    return (
      <View
        style={[
          styless.textVertical,
          {
            width: '100%',
            height: '100%',
            padding: 2,
          },
        ]}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            padding: 5,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('StaffLeaveDetail', {
                leaveId: item.leaveId,
                leaveAppliedBy: item.leaveAppliedBy,
              })
            }>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[theme.header, {flex: 1, color: theme.primaryColor}]}
                numberOfLines={1}>
                {item.leaveAppliedByName}
              </Text>
              <Text
                style={[theme.detail, {textAlign: 'right'}]}
                numberOfLines={1}>
                {item.leaveStart}{' '}
              </Text>
              <Text
                style={[theme.detail, {textAlign: 'right'}]}
                numberOfLines={1}>
                - {item.leaveEnd}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={[theme.detail]} numberOfLines={1}>
                {item.leaveTitle}
              </Text>
              <View style={{flex: 1}}>
                <Text
                  style={[
                    theme.header,
                    {textAlign: 'right', color: theme.primaryColor},
                  ]}
                  numberOfLines={1}>
                  {translate(status)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </CardView>
      </View>
    );
  }
}

export default withTheme(StaffLeaveCell);
