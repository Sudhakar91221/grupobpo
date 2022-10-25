/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text,Image} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import {USER_IMAGE_DOWNLOAD_URL, API_KEY} from '../../../network/config';
import AsyncImage from '../../../components/views/AsyncImage';

class EmployeeInfoCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    let height = 80;
    let uri = `${this.props.photo}`;
    var status = '';
    switch (this.props.status) {
      case '0':
        status = 'open';
        break;
      case '1':
        status = 'submitted';
        break;
      case '2':
        status = 'resubmitted';
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
        break;
      case '7':
        status = 'resubmitted';
    }
    return (
      <View
        style={{
          margin: 5,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: 'gray',
          height: 90,
        }}>
        <View
          style={[
            styless.textVertical,
            {
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              padding: 5,
            },
          ]}>
          <View style={{flexDirection: 'row', flex: 0.3}}>
            {this.props.photo !== undefined && this.props.photo !== null ? (
              <AsyncImage
                source={{
                  uri: uri,
                  // method: 'GET',
                  // headers: {
                  //   'x-api-key': API_KEY,
                  //   'Content-Type': 'multipart/form-data',
                  // },
                }}
                resizeMode="contain"
                style={[
                  styless.imageThumbnail,
                  {width: 70, height: 70, borderRadius: 40},
                ]}
                isUserImage={true}
                borderRadius={40}
                placeholderColor="gray"
              />
            ) : (
              <Image
                source={require('../../../assets/ic_profile.png')}
                resizeMode="contain"
                style={[styless.imageThumbnail, {width: 70, height: 70,borderRadius: 35}]}
              />
            )}
          </View>

          <View style={{flex: 1, marginLeft: 5}}>
            <Text
              style={[
                theme.header,
                {
                  textAlign: 'left',
                  color: theme.primaryColor,
                },
              ]}
              numberOfLines={1}>
              {this.props.userName}
            </Text>
            <Text
              style={[
                theme.detail,
                {
                  textAlign: 'left',
                  color: theme.disableButtonColor,
                  fontSize: 18,
                },
              ]}
              numberOfLines={1}>
              {translate(status)}
            </Text>
          </View>

          <View style={{flexDirection: 'column'}}>
            <Text
              style={[
                theme.detail,
                {
                  textAlign: 'left',
                  color: theme.primaryColor,
                  fontWeight: 'bold',
                },
              ]}
              numberOfLines={1}>
              {translate('total')}
            </Text>
            <Text
              style={[
                theme.header,
                {
                  textAlign: 'left',
                  color: theme.primaryColor,
                  fontWeight: '100',
                },
              ]}
              numberOfLines={1}>
              {this.props.totalHours}
            </Text>
            <Text
              style={[
                theme.detail,
                {
                  textAlign: 'left',
                  color: theme.primaryColor,
                  fontWeight: 'bold',
                },
              ]}
              numberOfLines={1}>
              {translate('hours')}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default withTheme(EmployeeInfoCell);
