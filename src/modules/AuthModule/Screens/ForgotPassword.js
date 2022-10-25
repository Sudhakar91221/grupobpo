/* eslint-disable no-fallthrough */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
  Linking,
  Animated,
  ScrollView,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { styless } from '../../../components/common/Styles';
import { connect } from 'react-redux';
import { forgetPassword } from '../../FormsComponent/Actions/FormActions';
import { PASSWORD_FORGOT } from '../../FormsComponent/Actions/type';
import { BottomButton } from '../../../components/views/Button';
import * as Keychain from 'react-native-keychain';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import { NavigationActions } from 'react-navigation';
import SyncStorage from 'sync-storage';
import { validateField, emailRule } from '../../../components/utility/validation';
import { mobileRule } from '../../../components/utility/validation';
import { emailField } from '../Actions/APIIntegers';
import {
  isLoadingSelector,
  userLoginSelector,
  apiSelector,
  errorSelector,
  countrySelector,
} from '../Actions/selectors';
import PhoneInputField from '../../FormsComponent/Component/Phone/PhoneInputField';
import { translate } from '../../../../App';
import InputForm from '../../FormsComponent/Forms/InputForm';

class ForgotPassword extends React.PureComponent {
  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {
      isLoading: false,
      isForgotPasswordDone: false,
      username: '',
      password: '',
      status: '',
      biometryType: null,
      accessControl: null,
      success: false,
      progress: new Animated.Value(0),
      submitGray: true,
      submitLoader: false,
      isFirst: false,
      phoneError: undefined,
      mandatoryFields: ['email'],
      properValueField: {},
      errors: {},
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.validateAllDetails = this.validateAllDetails.bind(this);
    this.callForgotPassword = this.callForgotPassword.bind(this);
    this.renderPhoneTextField = this.renderPhoneTextField.bind(this);
    this.emptiesTheError = this.emptiesTheError.bind(this);

    this.mobileRef = this.updateRef.bind(this, 'mobile');
    this.countryMobileRef = this.updateRef.bind(this, 'countryMobile');
    this.emailRef = this.updateRef.bind(this, 'email');
    this.phoneRef = this.updateRef.bind(this, 'phone');
    this.allFieldsAreNotOk = this.allFieldsAreNotOk.bind(this);
    this.currentPageRef = {};
    this.moveToLogin = this.moveToLogin.bind(this);
  }
  updateRef(name, ref) {
    this[name] = ref;
  }
  focusTheField = id => {
    let ref = this[id];
    ref.focus();
  };
  validateTheField = id => {
    if (this.validateSingleField(id) == false) {
      return;
    }

    if (id == 'phone' || id == 'email') {
      this.setState({ submitGray: false });
    }
  };
  buttonStatusOntyping() {
    if (
      Object.keys(this.state.errors).length == 0 &&
      Object.keys(this.state.properValueField).length ==
      this.state.mandatoryFields.length
    ) {
      this.setState({ submitGray: false });
    } else {
      this.setState({ submitGray: true });
    }
  }

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );

    Keychain.getSupportedBiometryType().then(biometryType => {
      this.setState({ biometryType });
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
      this.setState({ submitGray: false });
    } else {
      this.setState({ submitGray: true });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.api == PASSWORD_FORGOT) {
      if (this.props.error !== prevProps.error) {
        this.setState(
          { submitLoader: false },
          Alert.alert(this.props.error.message),
        );
      }
    }

    if (
      this.props.error !== null &&
      this.props.error.request == PASSWORD_FORGOT
    ) {
      if (this.props.error !== prevProps.error) {
        this.setState(
          { submitLoader: false },
          Alert.alert(this.props.error.message),
        );
      }
    }

    if (this.props.isLoading == true && this.props.api == PASSWORD_FORGOT) {
      this.state.submitLoader = true;
    }

    if (!this.props.error && this.props.api == PASSWORD_FORGOT) {
      if (this.props.user !== prevState.user) {
        this.props.user.isFromForgot = true;
        //this.setState({submitLoader: false});
        this.state.submitLoader = false;
        SyncStorage.set('user', JSON.stringify(this.props.user));
        Alert.alert(
          translate('forgot_password_success'),
          '',
          [
            {
              text: 'OK',
              onPress: this.moveToLogin,
            },
          ],
          { cancelable: false },
        );
      }
    }
  }

  moveToLogin() {
    this.props.navigation.navigate('Login', { isFromForgot: true });
  }

  loadDrawer() {
    this.props.navigation.navigate('AppStack');
    // this.animation = undefined
  }
  render() {
    const { theme } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            {
              flexGrow: 1,
              justifyContent: 'space-evenly',
              padding: 50,
              paddingHorizontal: 30,
            },
          ]}
          keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingTop: 40 }}>
              {/* {this.state.isLoginWithMobile == true
                ? this.renderTextFields()
                : this.renderEmailTextField()} */}
              {/* {this.state.isLoginWithMobile == true
                ? this.renderPhoneTextField()
                : this.renderEmailTextField()} */}
              <View style={{ paddingTop: 20 }}>
                <Text
                  style={[
                    theme.header,
                    {
                      textAlign: 'center',
                      alignSelf: 'center',
                      paddingBottom: 20,
                    },
                  ]}>
                  {translate('reset_password')}
                </Text>
                <Text
                  style={[
                    theme.detail,
                    { textAlign: 'center', alignSelf: 'center' },
                  ]}>
                  {translate('reset_password_hint')}
                </Text>
              </View>
              {this.state.isLoginWithMobile == true
                ? this.renderMobileInputFields()
                : this.renderEmailInputFields()}

              <View style={{ flex: 1.5 }}>{this.renderBottomButton()}</View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  renderEmailInputFields() {
    return (
      <InputForm
        blockModel={emailField}
        item={emailField}
        hideBottomButton={true}
        editable={true}
        navigation={this.props.navigation}
        allFieldsAreNotOk={flag => this.allFieldsAreNotOk(flag)}
        onRef={ref => {
          this.currentPageRef['login'] = ref;
        }}
      />
    );
  }

  allFieldsAreNotOk(flag) {
    if (flag === undefined) {
      this.setState({ submitGray: true });
    } else {
      this.setState({ submitGray: flag });
    }
  }

  renderMobileInputFields() {
    return (
      <InputForm
        blockModel={loginWithMobileFields}
        item={loginWithMobileFields}
        hideBottomButton={true}
        editable={true}
        navigation={this.props.navigation}
        allFieldsAreNotOk={this.allFieldsAreNotOk}
        onRef={ref => {
          this.currentPageRef['login'] = ref;
        }}
      />
    );
  }

  renderPhoneTextField() {
    // item.value = this.state[item.name];
    let item = { value: this.state.mobile, ref: this.state.phoneRef };

    return (
      <PhoneInputField
        onRef={this.phoneRef}
        value={this.state.mobile}
        onChangeText={this.onChangeText}
        error={this.state.phoneError}
        focus={this.focus}
        validateTheField={() => {
          this.validateTheField('phone');
        }}
        // focusTheField={() => {
        //   this.focusTheField('password');
        // }}
        item={item}
        navigation={this.props.navigation}
        editable={true}
        emptiesTheError={this.emptiesTheError}
        focusTheField={() => {
          this.validateTheField('phone');
        }}
      />
    );
  }

  renderEmailTextField() {
    let { errors = {}, secureTextEntry, ...data } = this.state;

    const { theme } = this.props;

    return (
      <TextField
        ref={this.emailRef}
        label="Email/Mobile Number"
        value={this.state.email}
        onChangeText={this.onChangeText}
        maxLength={150}
        multiline={true}
        autoCapitalize="none"
        error={errors.email}
        onChange={event => this.setState({ email: event.nativeEvent.text })}
        textColor={theme.headerColor}
        baseColor={theme.detailPlaceholderColor}
        fontSize={18}
        tintColor={theme.centerColor}
        keyboardType="email-address"
        onEndEditing={() => {
          this.validateTheField('email');
        }}
        blurOnSubmit={true}
      />
    );
  }

  renderTextFields() {
    let { errors = {}, secureTextEntry, ...data } = this.state;

    const { theme } = this.props;

    const mobileDetails = this.state.username.split(',');

    return (
      <View style={styless.stretchEqual}>
        <View style={{ flex: 0.45, paddingRight: 10 }}>
          <TextField
            ref={this.countryMobileRef}
            label="Country"
            value={this.state.countryMobile}
            onChangeText={this.onChangeText}
            maxLength={4}
            multiline={false}
            autoCapitalize="none"
            onFocus={this.onFocus}
            error={errors.countryMobile}
            onChange={event =>
              this.setState({ countryMobile: event.nativeEvent.text })
            }
            textColor={theme.headerColor}
            baseColor={theme.detailPlaceholderColor}
            fontSize={18}
            tintColor={theme.centerColor}
            keyboardType="phone-pad"
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
        <View style={{ flex: 1 }}>
          <TextField
            ref={this.mobileRef}
            label="Mobile Number"
            value={this.state.mobile}
            onChangeText={this.onChangeText}
            maxLength={150}
            multiline={false}
            autoCapitalize="none"
            error={errors.mobile}
            onChange={event => this.setState({ mobile: event.nativeEvent.text })}
            textColor={theme.headerColor}
            baseColor={theme.detailPlaceholderColor}
            fontSize={18}
            tintColor={theme.centerColor}
            keyboardType="phone-pad"
            onEndEditing={() => {
              this.validateTheField('mobile');
            }}
            blurOnSubmit={true}
          />
        </View>
      </View>
    );
  }

  renderBottomButton() {
    const { theme } = this.props;

    return (
      <View>
        <BottomButton
          style={{
            width: '60%',
            height: 50,
            borderRadius: 30,
            backgroundColor: theme.centerColor,
          }}
          title={translate('reset')}
          action={
            !this.state.submitLoader && !this.state.submitGray
              ? this.onSubmitTapped
              : null
          }
          isLoader={this.state.submitLoader}
          isGray={this.state.submitGray}
        />
      </View>
    );
  }

  onSubmitTapped = () => {
    if (this.validateAllDetails() == false) {
      return;
    }
    this.callForgotPassword();
  };

  onChangeText(text, id, data) {
    var self = this;

    let fieldsArray = ['email', 'phone', 'countryMobile'];

    if (this.state.isLoginWithMobile === true) {
      fieldsArray = ['phone'];
    } else {
      fieldsArray = ['email'];
    }
    this.state.mandatoryFields = fieldsArray;

    fieldsArray
      .map(name => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          if (name == 'email') {
            const isMobile = !isNaN(parseInt(text.charAt(0), 10));
            if (isMobile == true) {
              this.setState(
                { isLoginWithMobile: true, mobile: text, errors: '' },
                () => {
                  // this.setState({['mobile']: text});
                  // return;
                },
              );
            }
          } else {
            this.setState({ [name]: text });
          }
          this.buttonStatusOntyping();
        }
      });
  }

  onFocus() {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  }

  callForgotPassword() {
    this.setState({ submitLoader: true });
    if (this.state.isLoginWithMobile == true) {
      const country = this.phone.currentPageRef.phone.state.countryCode;
      const mobile = this.phone.currentPageRef.phone.state.inputValue;

      var input = {
        mobile: mobile,
        country: country,
        request: PASSWORD_FORGOT,
      };

      this.props.forgetPassword(input, PASSWORD_FORGOT);
    } else {
      var input = {
        email: this.currentPageRef.login.currentFieldsRef.email.state.email,
        request: PASSWORD_FORGOT,
      };

      this.props.forgetPassword(input, PASSWORD_FORGOT);
    }
  }

  validateSingleField(name) {
    let errors = {};
    let errorCount = 0;

    let value;
    if (name === 'phone') {
      value = this.phone.currentPageRef.phone.state.inputValue;

      if (!value) {
        // if (this.currentFieldsRef[name][name].props.label.includes('*')) {
        errors[name] = 'this field is required';
        errorCount = errorCount + 1;
        this.setState({ phoneError: 'this field is required' });
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
        this.state.properValueField[name] = value;
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
        } else {
          delete this.state.errors[name];
        }
      }
    }
    this.setState({ errors }, () => {
      if (errorCount > 0) {
        return false;
      }

      return true;
    });
  }

  emptiesTheError = name => e => {
    delete this.state.errors[name];

    this.validateTheField(name);
    // this.setState({errors: {...this.state.errors}});
    // if (
    //   Object.keys(this.state.errors).length == 0 &&
    //   this.checkIfAllMandaotyFieldsHaveProperValues() == true
    // ) {
    //   this.setState({submitGray: false,errors:this.state.errors});
    // } else {
    //   this.setState({submitGray: true,errors:this.state.errors});
    // }
  };

  validateAllDetails() {
    let errors = {};
    let errorCount = 0;

    //let fieldsArray = ['email', 'mobile', 'countryMobile'];
    let fieldsArray = [];

    if (this.state.isLoginWithMobile === true) {
      fieldsArray = ['phone'];
    } else {
      fieldsArray = ['email'];
    }

    fieldsArray.forEach(name => {
      if (name === 'phone') {
        let value = this.phone.currentPageRef.phone.state.inputValue;

        if (!value || value == '') {
          // if (this.currentFieldsRef[name][name].props.label.includes('*')) {
          errors[name] = 'this field is required';
          errorCount = errorCount + 1;
          this.setState({ phoneError: 'this field is required' });
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

    this.setState({ errors }, () => {
      if (errorCount > 0) {
        return false;
      }
      return true;
    });
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
  };
}
function mapDispatchToProps(dispatch) {
  return {
    forgetPassword: (input, PASSWORD_FORGOT) =>
      dispatch(forgetPassword(input, PASSWORD_FORGOT)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(ForgotPassword));
