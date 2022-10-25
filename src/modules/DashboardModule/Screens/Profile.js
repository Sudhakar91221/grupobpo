/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View, Image, ImageBackground, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import { styless } from '../../../components/common/Styles';
import { ImageComponent } from '../../FormsComponent/Component/Image/ImageComponent';
import { userLoginSelector } from '../../FormsComponent/Actions/selectors';
import InputForm from '../../FormsComponent/Forms/InputForm';
import { API_KEY, IMAGE_DOWNLOAD_URL, USER_IMAGE_DOWNLOAD_URL } from '../../../network/config';
import PickImage from '../../../components/views/PickImage'
import PhotoUpload from './PhotoUpload';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';

import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  updateProfileSelector,
} from '../Actions/selector';
import { updateProfile } from '../Actions/DashboardActions';
import { UPDATE_PROFILE } from '../Actions/type';
import SyncStorage from 'sync-storage';
import { BASE_URL } from '../../../network/config';

const createFormData = (photo, body) => {
  const data = new FormData();

  data.append("photo", {
    name: photo.name,
    type: photo.type,
    uri:
      Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.currentFieldsRef = {};
    this.currentPageRef = {};

    var formData = {
      fields: [
        {
          "name": "profile",
          "type": "22",
          "lable": "Attachment",
          "value": global.user.photo
        },
      ],
    };
    this.state = {
      formData: formData,
      isSpinner: false
    };

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == UPDATE_PROFILE) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                //this.props.navigation.navigate('Login');
                console.log('OK Pressed');
              },
            },
          ],

          { cancelable: false },
        );
      }
    }

    //update profile
    if (this.props.api === UPDATE_PROFILE) {
      if (this.props.error !== null && this.props.api === UPDATE_PROFILE) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  console.log('OK Pressed');
                },
              },
            ],
            { cancelable: false },
          );
        }
      }

      if (!this.props.error && this.props.api === UPDATE_PROFILE) {
        if (this.props.photo !== prevProps.photo) {
          this.setState({ submitLoader: false });
          SyncStorage.get('user').then(value => {
            let user = JSON.parse(value);
            user = global.user;
            SyncStorage.set('user', JSON.stringify(user));
          });
        }
      }
    }
  }

  render() {
    const { theme } = this.props;
    const user = global.user;
    const requestHeader = {
      'x-api-key': API_KEY,
    };
    let url = `${USER_IMAGE_DOWNLOAD_URL}/${global.user.photo}/400`
    //  Alert.alert(url)
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', padding: 30 }}>


          <PhotoUpload
            onPhotoSelect={avatar => {
              this.showSpinner()

              if (avatar) {
                console.log('Image base64 string: ', avatar)
              }

              this.handleUploadPhoto(avatar)
            }}
          >

            <ImageBackground
              style={{
                paddingVertical: 40,
                width: 150,
                height: 150,
                borderRadius: 75,
                //  alignItems:'center'
              }}
              imageStyle={{ borderRadius: 75 }}

              resizeMode='cover'
              source={{
                uri: url,
                method: 'GET',
                headers: requestHeader
              }}
            >
              <ActivityIndicatorCustom
                isSpinner={this.state.isSpinner}
                style={{ height: 80, alignSelf: 'center' }}
              />
            </ImageBackground>
          </PhotoUpload>


          <Text
            style={[
              theme.header,
              { textTransform: 'none', color: theme.primaryColor, fontSize: 22 },
            ]}>
            {user.firstName} {user.lastName}
          </Text>
          <Text
            style={[
              theme.detail,
              { textTransform: 'none', color: 'gray', fontSize: 16 },
            ]}>
            {user.userDesignation}
          </Text>
          <View
            style={{ height: 1.5, width: '100%', backgroundColor: 'black' }}
          />

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Image
              source={require('../../../assets/ic_mobile.png')}
              style={{ height: 30, width: 30, margin: 5 }}
              resizeMode="center"
            />

            <Text
              style={[
                theme.detail,
                {
                  color: 'gray',
                  paddingTop: 5,
                  fontWeight: '600',
                  paddingLeft: 10,
                  flex: 1,
                },
              ]}>
              {user.phone}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Image
              source={require('../../../assets/ic_menu_email.png')}
              style={{ height: 30, width: 30, margin: 5 }}
              resizeMode="center"
            />

            <Text
              style={[
                theme.detail,
                {
                  color: 'gray',
                  paddingTop: 5,
                  fontWeight: '600',
                  paddingLeft: 10,
                  flex: 1,
                },
              ]}>
              {user.email}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Image
              source={require('../../../assets/ic_company.png')}
              style={{ height: 30, width: 30, margin: 5 }}
              resizeMode="center"
            />

            <Text
              style={[
                theme.detail,
                {
                  color: 'gray',
                  paddingTop: 5,
                  fontWeight: '600',
                  paddingLeft: 10,
                  flex: 1,
                },
              ]}>
              {user.companyName}
            </Text>
          </View>

          {user.supervisor === null ? null : (
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <Image
                source={require('../../../assets/ic_company.png')}
                style={{ height: 30, width: 30, margin: 5 }}
                resizeMode="center"
              />

              <Text
                style={[
                  theme.detail,
                  {
                    color: 'gray',
                    paddingTop: 5,
                    fontWeight: '600',
                    paddingLeft: 10,
                    flex: 1,
                  },
                ]}>
                {user.supervisor}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  imagePicked = () => {

  }

  uploadedImages = (images, toUplaod) => {
    console.log('after image uploading');

    // if (images[1].fileName !== undefined) {
    //   let input = {};
    //   input[toUplaod] = images[1].fileName;

    //   if (this.state.newInputDict !== undefined) {
    //     this.state.newInputDict = {...this.state.newInputDict, ...input};
    //   } else {
    //     this.state.newInputDict = input;
    //   }
    // }
    if (images[1].image !== undefined) {
      this.setState({ imageToUpload: images[1].imageToUpload });
    }
    var input = {
      userId: this.props.user.userId,
      firstName: this.props.user.firstName,
      middleName: this.props.user.middleName,
      lastName: this.props.user.lastName,
      phone: this.props.user.phone,
      photo: images[1].imageToUpload,
      request: UPDATE_PROFILE,
    };
    this.props.updateProfile(input);
  };


  renderLogoImageView(item) {
    let module = 'user';

    let cacheImage;
    let itemValue = '';


    if (itemValue !== '' && itemValue !== 'undefined') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.9,
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginTop: 20,
            }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.lable}</Text>
            <Text style={{ fontSize: 16, color: 'lightgray' }}>
              Please fill all input fields
            </Text>
          </View>

          <View style={{ padding: 5 }}>
            {error ? (
              <Icons.MaterialIcons
                style={{
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                  flex: 0.1,
                }}
                name="error"
                size={30}
                color="red"
                backgroundColor="white"
              />
            ) : null}
            {/* <ImageComponent
              theme={this.props.theme}
              name={item.name}
              value={itemValue}
              id={imageId}
              item={item}
              module={module}
              type='profile'
              height={ScreenHeight * 0.12}
              width={ScreenHeight * 0.12}
              onRef={ref => {
                this.currentFieldsRef[item.name] = ref;
              }}
              navigation={this.props.navigation}
              cacheImage={cacheImage}
              isCircular={true}
              borderRadius={(ScreenHeight * 0.12) / 2.0}
              uploader="Editable"
              uploadedImages={this.uploadedImages}
              props={this.props}
              url={'banner'}
              imageOnly={true}
            /> */}
            <ImageComponent
              name={item.name}
              type='profile'
              imageOnly={true}
              value={itemValue}
              id={imageId}
              item={item}
              module={module}
              isCircular={true}
              isRectangular={false}
              isUserImage={true}
              type={'profile'}
              url={'ic_profile'}
              height={ScreenHeight * 0.30}
              width={ScreenHeight * 0.30}
              uploader="Editable"
              uploadedImages={this.uploadedImages}
              props={this.props}
              onRef={ref => {
                this.currentFieldsRef[item.name] = ref;
              }}
              navigation={this.props.navigation}
              theme={this.props.theme}
              borderRadius={10}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            flex: 0.9,
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginTop: 20,
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.lable}</Text>
          <Text style={{ fontSize: 16, color: 'lightgray' }}>
            Please fill all input fields
          </Text>
        </View>

        <View style={{ padding: 5 }}>
          {error ? (
            <Icons.MaterialIcons
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                flex: 0.1,
              }}
              name="error"
              size={30}
              color="red"
              backgroundColor="white"
            />
          ) : null}
          <ImageComponent
            name={item.name}
            type={'profile'}
            url={'banner'}
            height={ScreenHeight * 0.12}
            width={ScreenHeight * 0.12}
            uploader="Single"
            uploadedImages={this.uploadedImages}
            props={this.props}
            onRef={ref => {
              this.currentFieldsRef[item.name] = ref;
            }}
            navigation={this.props.navigation}
            theme={this.props.theme}
            isCircular={true}
            borderRadius={(ScreenHeight * 0.12) / 2.0}
            // imageOnly={item.name === 'profilePhoto' ? true : false}
            imageOnly={true}
          />
        </View>
      </View>
    );
  }

  showSpinner() {
    this.setState({ isSpinner: true });
  }

  hideSpinner() {
    if (this.state.isSpinner == true) {
      this.setState({ isSpinner: false });
    }
  }
  handleUploadPhoto = (avatar) => {


    let requestHeaderNew = {
      'x-api-key': '986d5a25052402ebb86fcbc8de7209e2',
      'Content-Type':
        'multipart/form-data; charset=utf-8; boundary="another cool boundary"',
      'Accept': "application/json",
    };

    fetch(BASE_URL + '/User/userUpdate', {
      method: "POST",
      headers: requestHeaderNew,
      body: createFormData(avatar, { userId: this.props.user.userId })
    })
      .then(response => response.json())
      .then(response => {
        console.log("upload succes", response);
        alert("Upload success!");
        // let  url =  `${USER_IMAGE_DOWNLOAD_URL}/${response.photo}/400`

        global.user.photo = response.photo


        this.hideSpinner()
        this.setState({ photo: response.photo });
      })
      .catch(error => {
        console.log("upload error", error);
        alert("Upload failed!");
        this.hideSpinner()

      });
  };


}



//MARK: - Data Management

function mapStateToProps(state) {
  return {
    isLoading: isLoadingSelector(state.DashboardReducer),
    api: apiSelector(state.DashboardReducer),
    error: errorSelector(state.DashboardReducer),
    user: userLoginSelector(state.FormReducer),
    photo: updateProfileSelector(state.DashboardReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateProfile: input => dispatch(updateProfile(input)),
  };
}

const ProfileNew = withTheme(Profile);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileNew);

