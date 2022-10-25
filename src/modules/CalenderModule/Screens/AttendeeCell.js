/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {USER_IMAGE_DOWNLOAD_URL, API_KEY} from '../../../network/config';
import AsyncImage from '../../../components/views/AsyncImage';

class AttendeeCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    let height = 80;
    let uri = `${
      this.props.item.userPhoto
    }`;

    return (
      <View>
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
            {this.props.item.userPhoto !== undefined &&
            this.props.item.userPhoto !== null ? (
              <AsyncImage
                source={{
                  uri: uri,
                  // method: 'GET',
                  // headers: {
                  //   'x-api-key': API_KEY,
                  //   'Content-Type': 'multipart/form-data',
                  // },
                }}
                resizeMode="cover"
                style={[
                  styless.imageThumbnail,
                  {width: 50, height: 50, borderRadius: 30},
                ]}
                borderRadius={30}
                placeholderColor="gray"
              />
            ) : (
              <AsyncImage
                source={require('../../../assets/ic_profile.png')}
                resizeMode="contain"
                style={[styless.imageThumbnail, {width: 50, height: 50}]}
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
              {this.props.item.userName}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default withTheme(AttendeeCell);
