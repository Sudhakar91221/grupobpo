/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import {USER_IMAGE_DOWNLOAD_URL, API_KEY} from '../../../network/config';
import AsyncImage from '../../../components/views/AsyncImage';
import {isPermissionAllowed} from '../../../network/APICall';
import CardView from 'react-native-cardview';

class MemberCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {
      modalVisible: false,
    };
  }
  setModalVisible(visible) {
    this.setState({
      modalVisible: visible,
    });
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    let height = 80;
    let uri = `${this.props.item.photo}`;

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
            <View style={{flexDirection: 'row', marginTop: 10}}>
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
                    {width: 60, height: 60, borderRadius: 30},
                  ]}
                  borderRadius={30}
                  placeholderColor="gray"
                  isUserImage = {true}
                />
              ) : (
                <Image
                  source={require('../../../assets/ic_profile.png')}
                  resizeMode="contain"
                  style={[styless.imageThumbnail, {width: 60, height: 60}]}

                />
              )}
            </View>

            <View style={{flex: 1, marginLeft: 5}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    theme.detail,
                    {
                      textAlign: 'left',
                      color: theme.disableButtonColor,
                      fontSize: 14,
                      flex: 1,
                    },
                  ]}
                  numberOfLines={1}>
                  {this.props.item.code}
                </Text>
                {isPermissionAllowed('Employee/edit') ? (
                  <TouchableOpacity
                    onPress={() => this.setState({modalVisible: true})}
                    style={{flex: 0.1}}>
                    <Image
                      source={require('../../../assets/ic_more.png')}
                      tintColor={'#343957'}
                      style={{tintColor: '#343957', width: 20, height: 30}}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              <Text
                style={[
                  theme.header,
                  {
                    textAlign: 'left',
                    color: theme.primaryColor,
                  },
                ]}>
                {this.props.item.firstName} {this.props.item.lastName}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    theme.detail,
                    {
                      textAlign: 'left',
                      color: theme.disableButtonColor,
                      fontSize: 14,
                      flex: 1,
                    },
                  ]}
                  numberOfLines={1}>
                  {this.props.item.designation === ''
                    ? 'Not Available'
                    : this.props.item.designation}
                </Text>
                <Text
                  style={[
                    theme.detail,
                    {
                      textAlign: 'center',
                      backgroundColor: 'lightgray',
                      fontSize: 16,
                      fontWeight: '500',
                      flex: 0.5,
                    },
                  ]}
                  numberOfLines={1}>
                  {this.props.item.userGroup.name}
                </Text>
              </View>
            </View>
          </View>
        </CardView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          presentationStyle={'pageSheet'}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                this.setModalVisible(false);
              }}>
            <View
              style={{
                marginTop: '80%',
                marginRight: '20%',
                marginLeft: '20%',
                backgroundColor: 'white',
                borderColor: 'gray',
                borderRadius: 5,
                borderWidth: 1,
                padding: 30,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({modalVisible: false});
                  this.props.navigation.navigate('EditMember', {
                    item: this.props.item,
                  });
                }}>
                <Text style={[theme.detail, {color: theme.primaryColor}]}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

export default withTheme(MemberCell);
