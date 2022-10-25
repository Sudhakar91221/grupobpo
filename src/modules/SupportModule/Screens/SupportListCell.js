/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {StackActions, ThemeColors} from 'react-navigation';
import Moment from 'moment';
import {
  getTicketStatusText,
  getTicketStatusColor,
} from '../Actions/APIIntegers';
import {styless} from '../../../components/common/Styles';
import CardView from 'react-native-cardview';
import {withTheme} from '../../../components/common/Theme/themeProvider';

class SupportListCell extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const {theme} = this.props;
    const item = this.props.item;
    const statusBackground = getTicketStatusColor(item.status);

    const time = Moment.unix(item.postedOn).format('DD-MM-YYYY HH:mm:ss');

    return (
      <CardView
        style={{
          width: '100%',
          flex: 1,
          margin: 1,
        }}
        cardElevation={5}
        cardMaxElevation={2}
        cornerRadius={10}>
        <TouchableOpacity
          style={[styless.leftRight, {padding: 5}]}
          onPress={() =>
            this.props.navigation.navigate('SupportDetail', {
              supportId: item.ticketNo,
            })
          }>
          <View style={[styless.textVertical]}>
            <Text style={[styless.header, {color: theme.primaryColor}]}>
              {item.ticketNo}
            </Text>
            <Text style={[styless.detail, {color: 'gray'}]}>
              {item.subject}
            </Text>
            {item.postedOn != 'Just' ? (
              <Text style={[styless.detail, {color: 'gray'}]}>
                {Moment(time, 'DD-MM-YYYY HH:mm:ss').fromNow()}
              </Text>
            ) : (
              <Text style={[styless.detail, {color: 'gray'}]}>Just Now</Text>
            )}
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={[
                styless.header,
                {
                  backgroundColor: statusBackground,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  paddingVertical: 3,
                  width: 110,
                  marginRight: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                },
              ]}>
              {getTicketStatusText(item.status)}
            </Text>
          </View>
        </TouchableOpacity>
      </CardView>
    );
  }
}
export default withTheme(SupportListCell);
