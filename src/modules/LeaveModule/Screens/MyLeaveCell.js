/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
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
              this.props.navigation.navigate('LeaveDetail', {
                leaveId: item.leaveId,
              })
            }>
            <Text
              style={[theme.header, {flex: 1}]}
              numberOfLines={1}>
              {item.leaveTitle}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={[theme.detail]} numberOfLines={1}>
                Date : {item.leaveStart}{' '}
              </Text>
              <Text style={[theme.detail]} numberOfLines={1}>
                - {item.leaveEnd}
              </Text>
              <View style={{flex: 1}}>
                <Text
                  style={[
                    theme.header,
                    {textAlign: 'right'},
                  ]}
                  numberOfLines={1}>
                  {translate(status)}
                </Text>
              </View>
            </View>
            {item.leaveStatus === 1 || item.leaveStatus === 2 ? (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[theme.detail]}
                  numberOfLines={1}>
                  {translate(status)} by :-
                </Text>
                <Text
                  style={[theme.detail]}
                  numberOfLines={1}>
                  {' '}
                  {item.leaveApprovalOfcName}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </CardView>
      </View>
    );
  }
}

export default withTheme(MyLeaveCell);
