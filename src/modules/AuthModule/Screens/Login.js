/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Keyboard,
  FlatList,
  Linking,
  Animated,
  Easing,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import Dropdown from '../../../components/external/Dropdown/dropdown/index';
import {styless} from '../../../components/common/Styles';

import {connect} from 'react-redux';
// import {loginUser} from '../Actions/UserActions';
// import {USER_LOGIN} from '../Actions/type';
import {BottomButton} from '../../../components/views/Button';
var md5 = require('md5');
import {StackActions} from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
var housecall = require('../../../network/queue.js');
var queue = housecall({concurrency: 1, cooldown: 1000});
import * as Keychain from 'react-native-keychain';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {NavigationActions} from 'react-navigation';
import SyncStorage from 'sync-storage';
import Icons from '../../../components/common/Icons';
import LinearGradient from 'react-native-linear-gradient';

const kHeightMultiplierForLogo = 3.7;
const ACCESS_CONTROL_OPTIONS = ['None', 'Passcode', 'Password'];
const ACCESS_CONTROL_MAP = [
  null,
  Keychain.ACCESS_CONTROL.DEVICE_PASSCODE,
  Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD,
  Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
];
import LottieView from 'lottie-react-native';
import {validateField, emailRule} from '../../../components/utility/validation';
import {mobileRule} from '../../../components/utility/validation';
import {
  loginWithEmailFields,
  loginWithMobileFields,
} from '../Actions/APIIntegers';

import {
  isLoadingSelector,
  // userLoginSelector,
  apiSelector,
  errorSelector,
  countrySelector,
} from '../Actions/selectors';
import {BUILD_VERSION} from '../../../network/config';
import Logo from '../../Base/Logo';
import {ScreenHeight, ScreenWidth} from '../../../components/utility/Settings';
import OfflineNotice from '../../../components/views/OfflineNotice';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';
import {isNumeric, removeObject} from '../../../components/utility/common';
import {
  userLoginSelector,
  permissionListSelector,
} from '../../FormsComponent/Actions/selectors';
import {loginUser} from '../../FormsComponent/Actions/FormActions';
import {USER_LOGIN} from '../../FormsComponent/Actions/type';
import PhoneInputField from '../../FormsComponent/Component/Phone/PhoneInputField';
import InputForm from '../../FormsComponent/Forms/InputForm';

class Login extends React.PureComponent {
  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {
      isLoading: false,
      userLoggedIn: false,
      username: '',
      password: '',
      status: '',
      biometryType: null,
      accessControl: null,
      success: false,
      progress: new Animated.Value(0),
      secureTextEntry: true,
      submitGray: false, //should be true default
      submitLoader: false,
      errors: {},
      isFirst: false,
      phoneError: undefined,
      isLoginWithMobile: false,
      mandatoryFields: ['email', 'password'],
      properValueField: {},
    };

    this.currentPageRef = {};
    this.onChangeText = this.onChangeText.bind(this);
    this.onFocus = this.onFocus.bind(this);

    this.passwordRef = this.updateRef.bind(this, 'password');
    this.mobileRef = this.updateRef.bind(this, 'mobile');
    this.countryMobileRef = this.updateRef.bind(this, 'countryMobile');
    this.emailRef = this.updateRef.bind(this, 'email');
    this.phoneRef = this.updateRef.bind(this, 'phone');
    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);
    this.validateAllDetails = this.validateAllDetails.bind(this);
    this.callLogin = this.callLogin.bind(this);
    this.renderPhoneTextField = this.renderPhoneTextField.bind(this);
    this.validateTheField = this.validateTheField.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.allFieldsAreNotOk = this.allFieldsAreNotOk.bind(this);
  }
  updateRef(name, ref) {
    this[name] = ref;
  }

  focusTheField = id => {
    let ref = this[id];

    if (ref !== undefined) {
      ref.focus();
    }
  };

  validateTheField = id => {
    if (this.validateSingleField(id) == false) {
      return;
    }
    // if (id == 'password') {
    //   //last field with with we want submit button enables
    //   this.setState({submitGray: false});
    // }

    // let countForErrorFields = 0;
    // this.state.mandatoryFields.map(
    //   function(name) {
    //     if (this[id] !== undefined) {
    //       let value = this[id].state.text;
    //       if (value === '' || value === undefined) {
    //         countForErrorFields = countForErrorFields + 1;
    //       } else {
    //         this.state.properValueField = [
    //           ...this.state.properValueField,
    //           name,
    //         ];
    //       }
    //     }
    //   }.bind(this),
    // );

    if (
      Object.keys(this.state.errors).length == 0 &&
      Object.keys(this.state.properValueField).length ==
        this.state.mandatoryFields.length
    ) {
      this.setState({submitGray: false});
    } else {
      this.setState({submitGray: true});
    }
  };
  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );

    this.load();

    // this.callGetCountry();

    Keychain.getSupportedBiometryType().then(biometryType => {
      this.setState({biometryType});
    });
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  keyboardDidHide = () => {
    if (
      Object.keys(this.state.errors).length == 0 &&
      Object.keys(this.state.properValueField).length ==
        this.state.mandatoryFields.length
    ) {
      this.setState({submitGray: false});
    } else {
      this.setState({submitGray: true});
    }
  };

  async save(accessControl) {
    try {
      // Keychain.setGenericPassword('password', this.state.password);

      const userName = this.state.countryMobile + ',' + this.state.mobile;

      await Keychain.setGenericPassword(userName, this.state.password, {
        accessControl: this.state.accessControl,
      });
      this.setState({status: 'Credentials saved!'});
    } catch (err) {
      this.setState({status: 'Could not save credentials, ' + err});
    }
  }

  async load() {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        this.state.username = credentials.username;
        const mobileDetails = this.state.username.split(',');

        this.setState({
          ...credentials,
          status: 'Credentials loaded!',
          mobile: mobileDetails[1],
          countryMobile: mobileDetails[0],
          submitGray: true,
        });
      } else {
        this.setState({status: 'No credentials stored.'});
      }
    } catch (err) {
      this.setState({status: 'Could not load credentials. ' + err});
    }
  }

  async reset() {
    try {
      await Keychain.resetGenericPassword();
      global.isLoggedIn = false;

      this.setState({
        status: 'Credentials Reset!',
        username: '',
        password: '',
      });
    } catch (err) {
      this.setState({status: 'Could not reset credentials, ' + err});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.user && nextProps.user == this.props.user) {
      return false;
    } else {
      // return true;

      if (this.props.error && nextProps.error == this.props.error) {
        return false;
      } else {
        return true;
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.state.submitLoader = false;
    // if (
    //   this.props.error &&
    //   this.props.error.request !== undefined &&
    //   this.props.error.request == USER_LOGIN
    // ) {
    //   if (this.props.error !== prevProps.error) {
    //     if (typeof this.props.error.message === 'string') {
    //       Alert.alert(
    //         this.props.error.message,
    //         '',
    //         [
    //           {
    //             text: 'OK',
    //             onPress: this.moveToLogin,
    //           },
    //         ],
    //         {cancelable: false},
    //       );
    //     }
    //   }
    // }

    if (
      this.props.error &&
      this.props.error.request !== undefined &&
      this.props.error.request == USER_LOGIN
    ) {
      if (this.props.error !== prevProps.error) {
        if (typeof this.props.error.message === 'string') {
          this.setState({submitLoader: false}, () => {
            Alert.alert(this.props.error.message);
          });
        }
      }
    }
    // if (this.props.error && this.props.error.request == USER_LOGIN) {
    //   if (this.props.error !== prevProps.error) {
    //     this.setState({submitLoader: false},() => {
    //       Alert.alert(this.props.error.message);

    //     });
    //   }
    // }

    // if (this.props.error !== null && this.props.api == USER_LOGIN) {
    //   if (this.props.error !== prevProps.error) {
    //     this.setState({submitLoader: false},() => {
    //       Alert.alert(this.props.error.message);

    //     });
    //   }
    // }
    if (this.props.isLoading == true && this.props.api == USER_LOGIN) {
      this.state.submitLoader = true;
    }

    if (
      !this.props.error &&
      this.props.api == USER_LOGIN &&
      this.state.userLoggedIn == false
    ) {
      if (this.props.user !== prevState.user) {
        this.setState({userLoggedIn: true}, () => {
          SyncStorage.set('user', JSON.stringify(this.props.user));
          SyncStorage.set(
            'permissions',
            JSON.stringify(this.props.permissions),
          );
          global.loginUserId = this.props.user.userId;
          global.user = this.props.user;
          this.setState({submitLoader: false});
          this.save();
          this.loadDrawer();
        });
        // this.state.postCommentSelected = false
        // global.uploadedImageName = ''
      }
    }
  }

  loadDrawer() {
    this.props.navigation.navigate('AppStack');
    return;
  }
  render() {
    const {theme} = this.props;
    const logoWidth = ScreenWidth - 100;
    return (
      <BaseClass style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={[
            {
              flexGrow: 1,
              justifyContent: 'space-evenly',
              paddingTop: 50,
              paddingHorizontal: 30,
            },
          ]}
          keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView style={{flex: 1}}>
            <View style={{paddingTop: 40, paddingHorizontal: 50}}>
              <Logo
                style={{
                  height: logoWidth / kHeightMultiplierForLogo,
                  width: logoWidth,
                }}
              />
            </View>
            <View style={{paddingTop: 40}}>
              {/* {this.state.isLoginWithMobile == true
                ? this.renderPhoneTextField()
                : this.renderEmailTextField()} */}

              {this.state.isLoginWithMobile == true
                ? this.renderMobileInputFields()
                : this.renderEmailInputFields()}

              {/* {this.renderPasswordField()} */}

              {/* <View style={{flex: 0.3}} /> */}
              {this.renderBottomButton()}
              {this.renderForgotPassword()}

              
            </View>
            {this.renderCopyRightView()}

          </KeyboardAvoidingView>

        </ScrollView>
        {/* <View style={{flex: 1}}>
                {/* {this.renderRegisterBottomButton()} 
              </View> */}
      </BaseClass>
    );
  }

  renderEmailInputFields() {
    return (
      <InputForm
        blockModel={loginWithEmailFields}
        item={loginWithEmailFields}
        hideBottomButton={true}
        editable={true}
        navigation={this.props.navigation}
        allFieldsAreNotOk={this.allFieldsAreNotOk}
        onRef={ref => {
          this.currentPageRef.login = ref;
        }}
        isLoginField={false}
      />
    );
  }

  renderMobileInputFields() {
    return (
      <InputForm
        blockModel={loginWithMobileFields}
        item={loginWithMobileFields}
        hideBottomButton={true}
        editable={true}
        navigation={this.props.navigation}
        allFieldsAreNotOk={flag => this.allFieldsAreNotOk(flag)}
        onRef={ref => {
          this.currentPageRef.login = ref;
        }}
      />
    );
  }
  allFieldsAreNotOk(flag) {
    if (flag === undefined) {
      this.setState({submitGray: true});
    } else {
      this.setState({submitGray: flag});
    }
  }
  renderEmailTextField() {
    let {errors, secureTextEntry, ...data} = this.state;

    const {theme} = this.props;

    return (
      <TextField
        ref={this.emailRef}
        label="Email/Mobile Number"
        value={this.state.email}
        onChangeText={this.onChangeText}
        maxLength={150}
        multiline={false}
        autoCapitalize="none"
        error={errors.email}
        onFocus={this.onFocus}
        onChange={event => this.setState({email: event.nativeEvent.text})}
        textColor={theme.headerColor}
        baseColor={theme.detailPlaceholderColor}
        fontSize={18}
        tintColor={theme.centerColor}
        keyboardType="email-address"
        onEndEditing={() => {
          this.validateTheField('email');
        }}
        onSubmitEditing={() => {
          this.focusTheField('password');
        }}
        blurOnSubmit={false}
      />
    );
  }

  renderPhoneTextField() {
    // item.value = this.state[item.name];
    let item = {value: this.state.mobile, ref: this.state.mobileRef};
    let values = {country: 'PH', mobile: this.state.mobile};

    return (
      <PhoneInputField
        onRef={this.mobileRef}
        values={values}
        onChangeText={this.onChangeText}
        error={this.state.phoneError}
        onFocus={this.onFocus}
        validateTheField={() => {
          this.validateTheField('mobile');
        }}
        focusTheField={() => {
          this.focusTheField('password');
        }}
        item={item}
        navigation={this.props.navigation}
        editable={true}
      />
    );
  }

  renderTextFields() {
    let {errors, secureTextEntry, ...data} = this.state;

    const {theme} = this.props;

    return (
      <View style={styless.stretchEqual}>
        <View style={{flex: 0.45, paddingRight: 10}}>
          <TextField
            ref={this.countryMobileRef}
            label="Country"
            value={this.state.countryMobile}
            onChangeText={this.onChangeText}
            maxLength={4}
            multiline={true}
            autoCapitalize="none"
            onFocus={this.onFocus}
            error={errors.mobile}
            onChange={event =>
              this.setState({countryMobile: event.nativeEvent.text})
            }
            textColor={theme.headerColor}
            baseColor={theme.detailPlaceholderColor}
            fontSize={18}
            tintColor={theme.centerColor}
            keyboardType="phone-pad"
            lineColor={theme.headerColor}
            onSubmitEditing={() => {
              this.focusTheField('mobile');
            }}
            onEndEditing={() => {
              this.validateTheField('countryMobile');
            }}
            blurOnSubmit={false}
            prefix={'+'}
          />
          {/* <Dropdown
                            ref={this.countryMobileRef}
                            onFocus={this.onFocus}
                            value={this.state.countryMobile}
                            onChangeText={this.onChangeText}
                            label='Country'
                            data={this.props.countriesList}
                            error={errors.countryMobile}
                            textColor={'blue'}
                            // autoFocus={true}
                            baseColor={theme.detailPlaceholderColor}
                            fontSize={18}
                            tintColor={theme.centerColor}
                            itemColor={theme.headerColor}
                            width = {200}
                            onSubmitEditing={() => { this.focusTheField('mobile'); }}
                             blurOnSubmit={false}
                             prefix={'+'}

                            // selectedItemColor={'blue'}


                      /> */}
        </View>
        <View style={{flex: 1}}>
          <TextField
            ref={this.mobileRef}
            label="Mobile Number"
            value={this.state.mobile}
            onChangeText={this.onChangeText}
            maxLength={10}
            multiline={false}
            autoCapitalize="none"
            error={errors.mobile}
            onChange={event => this.setState({mobile: event.nativeEvent.text})}
            textColor={theme.headerColor}
            baseColor={theme.detailPlaceholderColor}
            fontSize={18}
            tintColor={theme.centerColor}
            keyboardType="phone-pad"
            onEndEditing={() => {
              this.validateTheField('mobile');
            }}
            onSubmitEditing={() => {
              this.focusTheField('password');
            }}
            blurOnSubmit={false}
          />
        </View>
      </View>
    );
  }

  renderPasswordField() {
    let {errors = {}, secureTextEntry, ...data} = this.state;

    let name = secureTextEntry ? 'visibility' : 'visibility-off';

    const {theme} = this.props;
    return (
      <View>
        <TextField
          ref={this.passwordRef}
          label="Password"
          value={this.state.password}
          onChangeText={this.onChangeText}
          maxLength={12}
          multiline={false}
          onFocus={this.onFocus}
          error={errors.password}
          autoCapitalize="none"
          onChange={event => this.setState({password: event.nativeEvent.text})}
          textColor={theme.headerColor}
          baseColor={theme.detailPlaceholderColor}
          fontSize={18}
          tintColor={theme.centerColor} //typing color
          secureTextEntry={secureTextEntry}
          characterRestriction={12}
          textContentType={'password'}
          password={true}
          suffix={this.renderPasswordAccessory()}
          enablesReturnKeyAutomatically={true}
          onEndEditing={() => {
            this.validateTheField('password');
          }}
          blurOnSubmit={true}
        />
      </View>
    );
  }

  onAccessoryPress() {
    this.setState(({secureTextEntry}) => ({secureTextEntry: !secureTextEntry}));
  }
  renderPasswordAccessory() {
    let {secureTextEntry} = this.state;

    let name = secureTextEntry ? 'visibility' : 'visibility-off';

    return (
      <Icons.MaterialIcons
        size={24}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={this.onAccessoryPress}
        suppressHighlighting={true}
      />
    );
  }

  onRegisterButtonTapped = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Register',
    });
    this.props.navigation.dispatch(navigateAction);
  };

  renderForgotPassword() {
    const {theme} = this.props;

    return (
      <TouchableOpacity
        onPress={this.onForgotPasswordButtonTapped}
        style={{
          paddingTop: 20,
          height: 44,
          // marginBottom: 30,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {/* <Image
            source={require('../../../asset/forgot.png')}
            padding={2}
            color={'cornflowerblue'}
          /> */}
          <Text
            style={[
              theme.blueText,
              {
                alignSelf: 'center',
                justifyContent: 'center',
                fontSize: 16,
              },
            ]}>
            {' '}
            Forgot Password?{' '}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  onForgotPasswordButtonTapped = () => {
    this.props.navigation.navigate('ForgotPassword');
  };

  renderCopyRightView() {
    return (<></>
      // <TouchableOpacity
      //   onPress={this.onPressPoweredBy}
      //   style={[
      //     styless.nextToEach,
      //     {
      //       position: 'absolute',
      //       bottom: 15,
      //       alignSelf: 'center',
      //       justifyContent:'center',
      //       height: 100 / kHeightMultiplierForLogo,
      //     },
      //   ]}>
      //   <Text
      //     style={{
      //       alignSelf: 'center',
      //       justifyContent: 'center',
      //     }}>
      //     {' '}
      //     Powered by{' '}
      //   </Text>
      //   <Image
      //   source={require('../../../assets/LNWLogo.png')}
      //   style={{height: 100 / kHeightMultiplierForLogo, width: 100, alignSelf:'center'}}
      //   resizeMode="contain"
      // />
      // </TouchableOpacity>
    );
  }

  onPressPoweredBy = () => {
    const url = 'http://lognwork.com';
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  };
  renderBottomButton() {
    const {theme} = this.props;

    return (
      <View style={{paddingTop:30}}>
        <BottomButton
          style={styless.bottomButton}
          title={translate('login')}
          action={
            !this.state.submitLoader && !this.state.submitGray
              ? this.onLoginTapped.bind(this)
              : null
          }
          isLoader={this.state.submitLoader}
          isGray={this.state.submitGray}
        />
      </View>
    );
  }

  renderRegisterBottomButton() {
    const {theme} = this.props;

    return (
      <View style={{paddingTop: 10}}>
        <BottomButton
          style={styless.bottomButton}
          backgroundColor={theme.disableButtonColor}
          title="REGISTER"
          action={this.onRegisterButtonTapped}
          isLoader={false}
          isGray={false}
        />
      </View>
    );
  }

  onRegisterButtonTapped = () => {
    // Alert.alert('under development - working on api integration');
    this.props.navigation.navigate('Register');
  };
  onLoginTapped = () => {
    // this.loadDrawer();
    // return

    // if (this.validateAllDetails() == false) {
    //   return;
    // }
    //  this.loadDrawer();

    // Animated.timing(this.state.progress, {
    //   toValue: 1,
    //   duration: 1500,
    //   easing: Easing.linear,
    // }).start();
    this.setState({submitLoader: true});
    this.save();
    this.callLogin();

    // this.setState({success: true});

    // setTimeout(
    //   () =>
    //     this.state.progress.stopAnimation(({value}) => {
    //       //  this.save()
    //       // this.loadDrawer()
    //     }),
    //   1500,
    // );
  };

  onChangeText(text, id, data) {
    var self = this;

    //  if(this.countryMobile != undefined && this.countryMobile.isFocused()) {
    //         this.setState({ countryMobileCode: text ,countryMobile : text,countryId:data[id].actualValue.id})

    //    }else{
    let fieldsArray = ['email', 'mobile', 'password'];

    if (this.state.isLoginWithMobile === true) {
      fieldsArray = ['password']; //'phone',
      this.state.mandatoryFields = fieldsArray;
    } else {
      fieldsArray = ['email', 'password'];
      this.state.mandatoryFields = fieldsArray;
    }

    fieldsArray
      .map(name => ({name, ref: this[name]}))
      .forEach(
        function({name, ref}) {
          if (name === 'mobile' || name === 'password') {
            if (ref.isFocused()) {
              if (text.length > 0) {
                // this.state.errors[name] = '';
                this.setState({[name]: text});
              } else {
                this.setState({[name]: text});
              }
              this.validateTheField(name);
            }
          } else {
            if (ref.isFocused()) {
              // if (name === 'email') {
              const isMobile = !isNaN(parseInt(text.charAt(0), 10));

              if (isMobile === true) {
                if (text.length > 0) {
                  console.log(text);
                  // this.state.errors[name] = '';
                  this.setState({isLoginWithMobile: true, mobile: text}, () => {
                    // this.setState({['mobile']: text});
                    // return;
                  });
                }
                this.validateTheField('mobile');
              } else {
                if (text.length > 0) {
                  // this.state.errors[name] = '';
                  this.setState({[name]: text, isLoginWithMobile: false});
                } else {
                  this.setState({[name]: text, isLoginWithMobile: false});
                }
                this.validateTheField(name);
              }
              // } else {
              //   if (text.length > 0) {
              //     this.state.errors[name] = '';
              //     this.setState({[name]: text, isLoginWithMobile: false});
              //   } else {
              //     this.setState({[name]: text, isLoginWithMobile: false});
              //   }
              // }
            }
          }
        }.bind(this),
      );

    // }
  }

  buttonStatusOntyping(name) {
    if (
      Object.keys(this.state.errors).length == 0 &&
      Object.keys(this.state.properValueField).length ==
        this.state.mandatoryFields.length
    ) {
      this.state.errors[name] = '';
      this.setState({submitGray: false});
    } else {
      this.setState({submitGray: true});
    }
  }

  onFocus() {
    let {errors = {}} = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused) {
        delete errors[name];
      }
    }

    this.setState({errors});
  }

  async callLogin() {
    let fcmToken = await SyncStorage.get('fcmToken');

    if (this.state.isLoginWithMobile == true) {
      const country = this.mobile.currentPageRef.mobile.state.countryCode;
      const mobile = this.mobile.currentPageRef.mobile.state.inputValue;

      // mobileDetails[2] is only for displaying data
      const password = this.state.password;

      var input = {
        password: md5(password),
        mobile: mobile,
        country: country,
        request: USER_LOGIN,
        deviceId: fcmToken,
        versionName: '2.4',
        deviceType: '1',
      };
      SyncStorage.set('loginRequest', input, () => {
        this.props.loginUser(input);
      });
    } else {
      const password = this.state.password;
      var input = {
        password: md5(
          this.currentPageRef.login.currentFieldsRef.password.state.password,
        ),
        email: this.currentPageRef.login.currentFieldsRef.email.state.email,
        request: USER_LOGIN,
        deviceId: fcmToken,
        versionName: '2.4',
        deviceType: '1',
      };
      SyncStorage.set('loginRequest', JSON.stringify(input), () => {
        this.props.loginUser(input);
      });
    }
  }

  callGetCountry() {
    var input = {
      deviceType: '2',
    };
    this.props.getCountry(input);
  }

  validateSingleField(name) {
    let errors = this.state.errors;
    let errorCount = this.state.errors.length;

    let value = '';
    if (name === 'mobile') {
      value = this.mobile.currentPageRef.mobile.state.inputValue;

      if (!value || value == '') {
        // if (this.currentFieldsRef[name][name].props.label.includes('*')) {
        errors[name] = 'this field is required';
        errorCount = errorCount + 1;
        // this.setState({phoneError: 'this field is required'});
        //     this.currentFieldsRef[name][name].state.error = errors[name];
        // this.currentFieldsRef[name].state.error = errors[name];
      }
    } else {
      value = this[name].value();

      if (!value) {
        errors[name] = 'this field is required';
        errorCount = errorCount + 1;
      } else {
        let result = true;
        let warning = '';

        switch (name.toLowerCase()) {
          case 'phone':
          case 'mobile':
            result = validateField(value, mobileRule.validationRules);
            warning = translate('phoneValidation');
            break;
          case 'email':
            result = validateField(value, emailRule.validationRules);
            warning = translate('emailValidation');
            break;
          default:
            result = true;
            break;
        }
        if (result === false) {
          errorCount = errorCount + 1;
          errors[name] = warning;
        } else {
          this.state.properValueField[name] = value;
          delete this.state.errors[name];
        }
      }
    }
    // if (this.state.errors == undefined) {
    //   this.state.errors = {};
    // }

    this[name].state.error = this.state.errors[name];

    this.setState({errors: {...this.state.errors, ...errors}});

    if (errorCount > 0) {
      this.setState({submitGray: true});
      return false;
    } else {
      if (
        Object.keys(this.state.errors).length == 0 &&
        this.checkIfAllMandaotyFieldsHaveProperValues() == true
      ) {
        this.setState({submitGray: false});
      } else {
        this.setState({submitGray: true});
      }
      return true;
    }
  }

  checkIfAllMandaotyFieldsHaveProperValues() {
    let result = false;

    // this.removeServerError()

    if (this.state.mandatoryFields.length == 0) {
      return true;
    }
    if (
      Object.keys(this.state.properValueField).length >=
      this.state.mandatoryFields.length
    ) {
      Object.keys(this.state.properValueField).map(
        function(key) {
          if (this.state.mandatoryFields) {
            if (this.state.mandatoryFields.includes(key) == true) {
              result = true;
            }
          }
        }.bind(this),
      );
    }
    return result;
  }
  validateAllDetails() {
    let errors = {};
    let errorCount = 0;
    let validates = [];
    if (this.state.isLoginWithMobile == true) {
      validates = ['password']; //'phone',
    } else {
      validates = ['email', 'password'];
    }

    validates.forEach(name => {
      if (name === 'mobile') {
        let value = this.mobile.currentPageRef.mobile.state.inputValue;
        console.log('VALUE => ' + value);

        if (!value || value == '') {
          // if (this.currentFieldsRef[name][name].props.label.includes('*')) {
          errors[name] = 'this field is required';
          errorCount = errorCount + 1;
          // this.setState({phoneError: 'this field is required'});
          //     this.currentFieldsRef[name][name].state.error = errors[name];
          // this.currentFieldsRef[name].state.error = errors[name];
        }
      } else {
        if (this[name] !== undefined) {
          let value = this[name].value();

          if (!value) {
            errors[name] = 'this field is required';
            errorCount = errorCount + 1;
          } else {
            let result = true;
            let warning = '';
            switch (name.toLowerCase()) {
              case 'phone':
              case 'mobile':
                result = validateField(value, mobileRule.validationRules);
                warning = translate('phoneValidation');
                break;
              case 'email':
                result = validateField(value, emailRule.validationRules);
                warning = translate('emailValidation');
                break;
              default:
                result = true;
                break;
            }
            if (result == false) {
              errorCount = errorCount + 1;
              errors[name] = warning;
            }
          }
        }
      }
    });

    this.setState({errors});

    if (errorCount > 0) {
      return false;
    }
    console.log('-------------');
  }

   
}

//MARK: - Data Management

function mapStateToProps(state) {
  // if(state.UserReducer.error && state.UserReducer.error.message != "") {
  //      Alert.alert(state.UserReducer.error.message)
  // }

  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    countriesList: countrySelector(state.UserReducer),
    permissions: permissionListSelector(state.FormReducer),
    // blocks: [],
  };
}
function mapDispatchToProps(dispatch) {
  return {
    loginUser: (input, USER_LOGIN) => dispatch(loginUser(input, USER_LOGIN)),
    // getCountry: input => dispatch(getCountry(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(Login));

const styles = {
  picture: {
    flex: 1.5,
    margin: 130,
    marginTop: 150,
    bottom: 0,
    resizeMode: 'center',
    justifyContent: 'center',
  },
  bottom: {
    height: 0.3 * ScreenHeight,
    width: ScreenWidth,
    resizeMode: 'contain',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
    // overflow: 'visible',
  },
};
