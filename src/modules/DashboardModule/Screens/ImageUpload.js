/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View, Image, Alert, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import { styless } from '../../../components/common/Styles';
import { ImageComponent } from '../../FormsComponent/Component/Image/ImageComponent';
import { userLoginSelector } from '../../FormsComponent/Actions/selectors';
import InputForm from '../../FormsComponent/Forms/InputForm';

import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  updateProfileSelector,
} from '../Actions/selector';
import { updateProfile } from '../Actions/DashboardActions';
import { UPDATE_PROFILE } from '../Actions/type';
import SyncStorage from 'sync-storage';

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

    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', padding: 30 }}>

          <View style={{ flex: 0.5, marginBottom: 50 }}>
            <ImageComponent
              url={'ic_profile.png'}
              height={200}
              width={200}
              type="profile"
              editable={true}
              navigation={this.props.navigation}
              name={user.photo}
              value={user.photo}
              // isActualImage={false}
              onImageTapped={this.onImageTapped}
              isRectangular={false}
              borderRadius={100}
              module={'profile'}
              props={this.props}
              theme={theme}
              uploader="Editable"
              uploadedImages={this.uploadedImages}
              item={user.photo}
              imageOnly={true}
              isCircular={true}
              onRef={ref => {
                this.currentFieldsRef['profile'] = ref;
              }}
              // addImageViewCustom={true}
              placeholderImage={require('../../../assets/ic_profile.png')}
            />
          </View>
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

