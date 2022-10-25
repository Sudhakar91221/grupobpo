/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Button,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import { BottomButton } from '../../../components/views/Button';
import { styless } from '../../../components/common/Styles';
import SyncStorage from 'sync-storage';
import CountDown from '../../../components/external/CountDownTimer';
import { numberOnlyRule } from '../../../components/utility/validation';

import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  userNewRegisterSelector,
} from '../../FormsComponent/Actions/selectors';
import {
  userRegisterSelector,
  userLoginSelector,
} from '../../FormsComponent/Actions/selectors';
import {
  OTP_VERIFY,
  OTP_RESEND,
  MOBILE_UPDATE,
} from '../../FormsComponent/Actions/type';
import {
  verifyOtp,
  updateMobile,
  resendOtp,
} from '../../FormsComponent/Actions/FormActions';
import { validateField } from '../../../components/utility/validation';
import OTPInputView from '../../../components/external/OTPInputView';
import { ImageComponent } from '../../FormsComponent/Component/Image/ImageComponent';

class OTPScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {
      success: false,
      progress: new Animated.Value(0),
      isUserVerified: false,
      isFromForgot:
        props.navigation.state.params !== undefined &&
          props.navigation.state.params != null
          ? props.navigation.state.params.isFromForgot
          : this.props.user != null
            ? this.props.user.isFromForgot
            : undefined,
      submitGray: true,
      submitLoader: false,
      timerStart: true,
    };
    this.resendOtp = this.resendOtp.bind(this);
    this.otpRef = React.createRef();
    this.onRegisterButtonTapped = this.onRegisterButtonTapped.bind(this);
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }

  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null) {
      if (
        this.props.error.request == OTP_RESEND ||
        this.props.error.request == OTP_VERIFY ||
        this.props.error.request == MOBILE_UPDATE
      ) {
        if (this.props.error !== prevProps.error) {
          // this.setState({submitLoader: false}, () => {
          //   Alert.alert(this.props.error.message);
          // });
          this.state.submitLoader = false;
          Alert.alert(this.props.error.message);
        }
      }
    }

    if (
      this.props.error !== null &&
      (this.props.api == OTP_VERIFY || this.props.api == OTP_RESEND)
    ) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }

    if (this.props.isLoading == true && this.props.api == OTP_VERIFY) {
      this.state.submitLoader = true;
    }

    if (!this.props.isLoading && this.props.api == OTP_RESEND) {
      if (this.props.user.otp !== prevProps.user.otp) {
        //this.setState({otp: this.props.user.otp});
        this.state.otp = this.props.user.otp;
      }
    }
    if (!this.props.isLoading && this.props.api == OTP_VERIFY) {
      if (this.props.user === undefined && this.state.user !== undefined) {
        SyncStorage.set('user', JSON.stringify(this.state.user));

        if (this.state.isFromForgot == true) {
          this.props.navigation.navigate('SetPassword', {
            isFromForgot: true,
          });
        } else {
          this.props.navigation.navigate('AppStack');
        }
      } else {
        if (this.props.user.status !== prevProps.user.status) {
          SyncStorage.set('user', JSON.stringify(this.props.user));

          if (this.state.isFromForgot == true) {
            this.props.navigation.navigate('SetPassword', {
              isFromForgot: true,
            });
          } else {
            this.props.navigation.navigate('AppStack');
          }
        }
      }
    }
  }
  render() {
    const { theme } = this.props;
    let { user } = this.props;

    if (user == undefined) {
      user = this.state.user;
    }
    return (
      <View style={{ flex: 1, marginBottom: 20 }}>
        <ScrollView
          contentContainerStyle={[
            {
              flexGrow: 1,
              justifyContent: 'flex-start',
              paddingHorizontal: 30,
              bottom: 30,
            },
          ]}
          keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 40,
              }}>
              <ImageComponent
                url={require('../../../asset/mobile_phone.png')}
                height={80}
                width={80}
                name="default"
              />
            </View>
            <Text
              style={[
                theme.H1,
                { paddingTop: 15, alignSelf: 'center', textAlign: 'center' },
              ]}>
              Verify Mobile Number
            </Text>

            {user != null &&
              user !== undefined &&
              user.otp != null &&
              user.otp !== undefined && (
                <Text
                  style={[theme.detail, { alignSelf: 'center', paddingTop: 5 }]}>
                  {' '}
                  {user.otp}{' '}
                </Text>
              )}

            <View style={[styless.textVertical, { paddingTop: 5 }]}>
              <Text
                style={[
                  theme.detailPlaceholder,
                  {
                    textAlign: 'center',
                    alignSelf: 'center',
                    textTransform: 'none',
                  },
                ]}>
                {' '}
                An 4 digit code has been sent to.
              </Text>
            </View>
            <TouchableOpacity
              style={{ paddingTop: 10 }}
              onPress={this.changeMobileNumber}>
              <Text style={{ textAlign: 'center' }}>
                {user != null && user !== undefined && (
                  <Text style={(theme.detail, { fontSize: 20 })}>
                    {' '}
                    + {user.country !== undefined ? user.country : 'NA'}{' '}
                    {user.mobile !== undefined ? user.mobile : 'NA'}{' '}
                  </Text>
                )}

                {/* <Text style={theme.themeText}> Change </Text>//TODO: */}
              </Text>
            </TouchableOpacity>
            <View />

            <View style={{ backgroundColor: 'transparent' }}>
              {/* <OtpInputs
          ref={this.otpRef}
          value={this.state.otp}
          onChangeText={code => validateField(code,numberOnlyRule.validationRules)}
          handleChange={code => this.handleChangeInOtpField(code)}
          numberOfInputs={4}
          keyboardType = 'numeric'
          focusedBorderColor={theme.centerColor}
          unfocusedBorderColor={theme.centerColor}
          selectTextOnFocus={true}
          autoFocus={true}
          style={{paddingTop:10}}
          blurOnSubmit={true}

        /> */}

              <OTPInputView
                style={{ width: '100%', height: 120 }}
                pinCount={4}
                // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                onCodeChanged={code => this.handleChangeInOtpField(code)}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={{
                  borderColor: theme.primaryColor,
                  fontSize: 25,
                  fontWeight: '800',
                }}
                onCodeFilled={code => {
                  console.log(`Code is ${code}, you are good to go!`);
                }}
              />
            </View>

            <View style={{ flex: 1 }}>
              {this.state.timerStart == true
                ? this.renderOTPTimer()
                : this.renderResendButton()}
              {this.renderLogin()}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        {this.renderBottomButton()}
      </View>
    );
  }

  getOtp(otp) {
    console.log(otp);
    if (otp.length == 4) {
      this.setState({ otp: otp, submitGray: false });
    } else {
      this.setState({ otp: otp });
    }
  }

  handleChangeInOtpField = code => {
    // /^\d+$/.test(e.toString())
    if (code.length == 4) {
      this.setState({ otp: code, submitGray: false });
    } else {
      this.setState({ otp: code });
    }
  };

  renderResendButton() {
    const { theme } = this.props;
    return (
      <TouchableOpacity style={{ alignSelf: 'center' }} onPress={this.resendOtp}>
        <Text>
          <Text style={[theme.detailPlaceholder, { textTransform: 'none' }]}>
            {' '}
            Didn’t received the code?{' '}
          </Text>
          <Text style={theme.blueText}> Resend </Text>
        </Text>
      </TouchableOpacity>
    );
  }

  renderOTPTimer() {
    const { theme } = this.props;
    return (
      <View style={[styless.nextToEach, { alignSelf: 'center', padding: 10 }]}>
        <View style={{ alignSelf: 'center' }}>
          <CountDown
            size={15}
            until={300}
            onFinish={() => this.setState({ timerStart: false })}
            digitStyle={{
              backgroundColor: '#FFF',
              borderWidth: 0,
              borderColor: 'transparent',
            }}
            digitTxtStyle={theme.header}
            timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
            separatorStyle={theme.header}
            timeToShow={['M', 'S']}
            timeLabels={{ m: null, s: null }}
            showSeparator
          />
        </View>
        <Text
          style={[
            theme.detailPlaceholder,
            {
              paddingRight: -10,
              textTransform: 'none',
              alignSelf: 'center',
            },
          ]}>
          {' '}
          left{' '}
        </Text>
      </View>
    );
  }

  renderBottomButton() {
    const { theme } = this.props;

    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          bottom: 10,
          width: '100%',
          alignSelf: 'center',
        }}>
        <BottomButton
          style={{ height: 45, borderRadius: 30, width: '80%' }}
          title="Verify OTP"
          action={
            !this.state.submitLoader && !this.state.submitGray
              ? this.onRegisterButtonTapped
              : null
          }
          isLoader={this.state.submitLoader}
          isGray={this.state.submitGray}
        />
      </View>
    );
  }

  renderLogin() {
    const { theme } = this.props;

    return (
      <TouchableOpacity
        onPress={this.onLoginButtonTapped}
        style={{
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={[
            theme.blueText,
            { alignSelf: 'center', justifyContent: 'center' },
          ]}>
          {' '}
          Login{' '}
        </Text>
      </TouchableOpacity>
    );
  }
  onLoginButtonTapped = () => {
    this.props.navigation.navigate('Login');
  };

  changeMobileNumber = () => {
    this.callUpdateMobile();
  };

  resendOtp = () => {
    this.setState(
      {
        otp: undefined,
      },
      () => {
        this.callResendOtp();
      },
    );
  };

  onRegisterButtonTapped = () => {
    this.callVerifyOtp();
  };

  callResendOtp() {
    let { user } = this.props;
    if (user == undefined) {
      user = this.state.user;
    }
    var input = {
      userId: user.userId,
      phone: user.mobile,
      // otpType  : '2',
      token: user.token,
      request: OTP_RESEND,
    };
    this.props.resendOtp(input);
  }
  callVerifyOtp() {
    // if (this.validateAllDetails() == false) {
    //     return
    // }
    this.setState({ submitLoader: true });
    let { user } = this.props;

    if (user == undefined) {
      user = this.state.user;
    }

    var input = {
      userId: user.userId,
      otp: this.state.otp,
      otpType: user.email === undefined ? '2' : '1',
      token: user.token,
      request: OTP_VERIFY,
    };
    this.props.verifyOtp(input);
  }

  callUpdateMobile() {
    // if (this.validateAllDetails() == false) {
    //     return
    // }
    let { user } = this.props;
    if (user == undefined) {
      user = this.state.user;
    }

    var input = {
      userId: user.userId,
      otp: this.state.otp,
      otpType: '2',
      token: user.token,
      request: MOBILE_UPDATE,
    };
    this.props.updateMobile(input);
  }
}

//MARK: - Data Management

function mapStateToProps(state) {

  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    verifyOtp: input => dispatch(verifyOtp(input)),
    resendOtp: input => dispatch(resendOtp(input)),
    updateMobile: input => dispatch(updateMobile(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(OTPScreen));

const styles = {
  borderStyleBase: {
    width: 40,
    height: 45,
  },

  borderStyleHighLighted: {
    // borderColor: theme.primaryColor,
  },

  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 2,
    fontSize: 40,
    fontWeight: '800',
  },

  underlineStyleHighLighted: {
    // borderColor: theme.primaryColor,
  },
};
