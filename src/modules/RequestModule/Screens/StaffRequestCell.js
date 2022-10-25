/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import CardView from 'react-native-cardview';

class StaffRequestCell extends React.PureComponent {
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
      case '1':
        status = 'pending';
        break;
      case '2':
        status = 'in_progress';
        break;
      case '3':
        status = 'declined';
    }

    var title = '';
    switch (item.categoryType) {
      case '1':
        title = 'gmbc';
        break;
      case '2':
        title = 'bir';
        break;
      case '3':
        title = 'coe';
        break;
      case '4':
        title = 'reimbursement';
        break;
      case '5':
        title = 'other';
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
              item.status === '0' || item.status === '3'
                ? this.props.navigation.navigate('MyRequestDetail', {
                    item: item,
                  })
                : this.props.navigation.navigate('StaffRequestDetail', {
                    item: item,
                  })
            }>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  theme.header,
                  {
                    flex: item.categoryType === '5' ? 0.2 : 1,
                    color: theme.primaryColor,
                    textTransform: 'none',
                  },
                ]}>
                {translate(title)}
              </Text>
              {item.categoryType === '5' ? (
                <Text style={[theme.header, {color: theme.primaryColor}]}>
                  : {item.categorySpecified}
                </Text>
              ) : null}
            </View>

            <Text style={[theme.detail]} numberOfLines={1}>
              {translate('requested_by')} : {item.requestByName}
            </Text>

            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Text style={[theme.detail]} numberOfLines={1}>
                {translate('required_date')} :{' '}
                {Moment(item.addedon).format('DD MMM YYYY')}
              </Text>

              {this.props.isIncoming === true ? (
                <View
                  style={{
                    flex: 1,
                    alignContent: 'flex-end',
                    marginLeft: '15%',
                  }}>
                  <Text
                    style={[
                      theme.detail,
                      {
                        textAlign: 'center',
                        color: theme.white,
                        backgroundColor: theme.primaryColor,
                        borderRadius: 20,
                      },
                    ]}
                    numberOfLines={1}>
                    {translate(status)}
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        </CardView>
      </View>
    );
  }
}

export default withTheme(StaffRequestCell);
