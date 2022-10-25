/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import {USER_IMAGE_DOWNLOAD_URL, API_KEY} from '../../../network/config';
import AsyncImage from '../../../components/views/AsyncImage';

class DirectoryCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
    this.callPhone = this.callPhone.bind(this);
    this.callMessage = this.callMessage.bind(this);
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    let height = 80;
    let uri = `${this.props.item.photo}`;

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('EmployeeDetail', {
            item: this.props.item,
          })
        }>
        {this.props.item.isHeader === true ? (
          <View
            style={[
              styless.textVertical,
              {
                width: '100%',
                height: '100%',
                backgroundColor: '#EFEFF4',
              },
            ]}>
            <View style={{flex: 1}}>
              <Text
                style={[
                  theme.header,
                  {
                    textAlign: 'left',
                    color: theme.black,
                    fontSize: 22,
                    marginLeft: 10,
                  },
                ]}
                numberOfLines={1}>
                {this.props.item.name}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={[
              styless.textVertical,
              {
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                padding: 5,
                backgroundColor: 'white',
              },
            ]}>
            <View style={{flexDirection: 'row'}}>
              {this.props.item.photo !== undefined &&
              this.props.item.photo !== null ? (
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
                    {width: 50, height: 50, borderRadius: 25},
                  ]}
                  borderRadius={25}
                  placeholderColor="gray"
                  isUserImage={true}
                />
              ) : (
                <Image
                  source={require('../../../assets/ic_profile.png')}
                  resizeMode="contain"
                  style={[styless.imageThumbnail, {width: 50, height: 50,borderRadius: 25}]}
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
                ]}>
                {this.props.item.name}
              </Text>
              <Text
                style={[
                  theme.detail,
                  {
                    textAlign: 'left',
                    color: theme.disableButtonColor,
                    fontSize: 14,
                  },
                ]}
                numberOfLines={1}>
                {this.props.item.designation === ''
                  ? 'Not Available'
                  : this.props.item.designation}
              </Text>
            </View>
            <View style={{flexDirection: 'row', flex: 0.4}}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={this.callPhone}>
                <Image
                  source={require('../../../assets/ic_call.png')}
                  style={{height: 40, width: 40}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={this.callMessage}>
                <Image
                  source={require('../../../assets/ic_message.png')}
                  style={{height: 40, width: 40}}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }
  callPhone() {
    let mobile = this.props.item.phone;
    Linking.openURL(`tel:${mobile}`);
  }
  callMessage() {
    let url = `sms:${this.props.item.phone}${
      Platform.OS === 'ios' ? '&' : '?'
    }body=${''}`;

    Linking.openURL(url);
  }
}

export default withTheme(DirectoryCell);
