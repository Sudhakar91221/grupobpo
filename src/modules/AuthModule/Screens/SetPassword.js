/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { StyleSheet, Image, Text, View, Alert, Keyboard } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { ScreenWidth, ScreenHeight } from '../../../components/utility/Settings';
import { BottomButton } from '../../../components/views/Button';
import { styless } from '../../../components/common/Styles';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';
import { validateField } from '../../../components/utility/validation';
import { passwordRule, mobileRule } from '../../../components/utility/validation';
import SyncStorage from 'sync-storage';
var md5 = require('md5');
import Icons from '../../../components/common/Icons';

import {
  isLoadingSelector,
  userLoginSelector,
  apiSelector,
  errorSelector,
  countrySelector,
  registerStepSelector,
} from '../../FormsComponent/Actions/selectors';
import { PASSWORD_SET } from '../../FormsComponent/Actions/type';

import { setPassword } from '../../FormsComponent/Actions/FormActions';

class SetPassword extends Component {
  static navigationOptions = ({ navigation }) => {
    return null;
  };

  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {
      isUserPasswordSet: false,
      isFromForgot:
        props.navigation.state.params !== undefined &&
          props.navigation.state.params != null
          ? props.navigation.state.params.isFromForgot
          : this.props.user != null
            ? this.props.user.isFromForgot
            : undefined,
      submitGray: true,
      submitLoader: false,
      secureTextEntry: true,
      confirmSecureTextEntry: true,
    };

    // this.onNextButtonTapped = this.onNextButtonTapped.bind(this)
    this.passwordRef = this.updateRef.bind(this, 'password');
    this.confirmPasswordRef = this.updateRef.bind(this, 'confirmPassword');
    this.onRegisterButtonTapped = this.onRegisterButtonTapped.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onConfirmAccessoryPress = this.onConfirmAccessoryPress.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);
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

    if (id == 'confirmPassword') {
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

    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  keyboardDidHide = () => {
    if (this.validateAllDetails() == false) {
      return;
    } else {
      this.setState({ submitGray: false });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.error.request == PASSWORD_SET) {
      if (this.props.error !== prevProps.error) {
        // this.setState({submitLoader: false}, () => {
        //   Alert.alert(this.props.error.message);
        // });
        this.state.submitLoader = false;
        Alert.alert(this.props.error.message);
      }
    }

    if (this.props.error !== null && this.props.api == PASSWORD_SET) {
      if (this.props.error !== prevProps.error) {
        this.state.submitLoader = false;
        Alert.alert(this.props.error.message);
      }
    }
    if (this.props.isLoading == true && this.props.api == PASSWORD_SET) {
      this.state.submitLoader = true;
    }

    if (!this.props.isLoading && this.props.api == PASSWORD_SET) {
      if (this.props.user.status !== prevProps.user.status) {
        this.state.submitLoader = false;
        SyncStorage.set('user', JSON.stringify(this.props.user));

        if (this.state.isFromForgot == true) {
          this.props.navigation.navigate('AppStack');
        } else {
          this.props.navigation.navigate('AppStack');
        }
      }
    }
  }

  onRegisterButtonTapped = () => {
    this.callSetPassword();
  };

  //MARK-
  callSetPassword() {
    if (this.validateAllDetails() == false) {
      return;
    }
    this.setState({ submitLoader: true });

    if (this.props.user.email === undefined) {
      var input = {
        userId: this.props.user.userId,
        mobile: this.props.user.mobile,
        country: this.props.user.country,
        password: md5(this.state.password),
        token: this.props.user.token,
        request: PASSWORD_SET,
      };

      this.props.setPassword(input);
    } else {
      var input = {
        userId: this.props.user.userId,
        email: this.props.user.email,
        password: md5(this.state.password),
        token: this.props.user.token,
        request: PASSWORD_SET,
      };

      this.props.setPassword(input);
    }
  }

  renderPasswordField() {
    let {
      errors = {},
      secureTextEntry,
      confirmSecureTextEntry,
      ...data
    } = this.state;

    const { theme } = this.props;
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
          onChange={event => this.setState({ password: event.nativeEvent.text })}
          textColor={theme.headerColor} //input color
          baseColor={theme.detailPlaceholderColor} //normal color
          fontSize={18}
          tintColor={theme.centerColor} //typing color
          secureTextEntry={secureTextEntry}
          characterRestriction={12}
          textContentType={'password'}
          password={true}
          suffix={this.renderPasswordAccessory()}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={() => {
            this.focusTheField('confirmPassword');
          }}
          onEndEditing={() => {
            this.validateTheField('password');
          }}
          blurOnSubmit={false}
        />

        <TextField
          ref={this.confirmPasswordRef}
          label="Confirm Password"
          value={this.state.confirmPassword}
          onChangeText={this.onChangeText}
          maxLength={150}
          multiline={false}
          onFocus={this.onFocus}
          error={errors.confirmPassword}
          autoCapitalize="none"
          onChange={event =>
            this.setState({ confirmPassword: event.nativeEvent.text })
          }
          textColor={theme.headerColor} //input color
          baseColor={theme.detailPlaceholderColor} //normal color
          fontSize={18}
          tintColor={theme.centerColor} //typing color
          secureTextEntry={confirmSecureTextEntry}
          characterRestriction={20}
          textContentType={'password'}
          password={true}
          suffix={this.renderConfirmPasswordAccessory()}
          enablesReturnKeyAutomatically={true}
          onEndEditing={() => {
            this.validateTheField('confirmPassword');
          }}
          blurOnSubmit={true}
        />
      </View>
    );
  }

  onAccessoryPress() {
    this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
  }
  renderPasswordAccessory() {
    let { secureTextEntry } = this.state;

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

  onConfirmAccessoryPress() {
    this.setState(({ confirmSecureTextEntry }) => ({
      confirmSecureTextEntry: !confirmSecureTextEntry,
    }));
  }
  renderConfirmPasswordAccessory() {
    let { secureTextEntry } = this.state;

    let name = secureTextEntry ? 'visibility' : 'visibility-off';

    return (
      <Icons.MaterialIcons
        size={24}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={this.onConfirmAccessoryPress}
        suppressHighlighting={true}
      />
    );
  }

  render() {
    const { theme } = this.props;
    return (
      <View style={styless.newContainer}>
        {/* {this.state.isFromForgot == true && (
          <Text style={[theme.H1, {paddingTop: 20, alignSelf: 'flex-start'}]}>
            {' '}
            Set Password{' '}
          </Text>
        )} */}
        {this.renderPasswordField()}

        <BottomButton
          style={{
            borderRadius: 30,
            height: 45,
            marginTop: 50,
            width: '80%',
            // position: 'absolute',
            // bottom: 10,
          }}
          title="Submit"
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
  onNextButtonTapped = () => {
    this.props.navigation.navigate('Login');
  };

  onChangeText(text, id, data) {
    var self = this;

    ['password', 'confirmPassword']
      .map(name => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text, errors: '' });
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

  validateSingleField(name) {
    let errors = {};
    let errorCount = 0;

    let value = this[name].value();

    if (!value) {
      errors[name] = 'this field is required';
      errorCount = errorCount + 1;
    } else {
      let result = true;
      let warning = '';
      switch (name) {
        case 'mobile':
        case 'confirmPassword':
          result = validateField(
            value,
            passwordRule.validationRules,
            this.state.password,
          );
          warning = 'Password and confirm password must be similar';
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
    this.setState({ errors });

    if (errorCount > 0) {
      return false;
    }
  }
  validateAllDetails() {
    let errors = {};
    let errorCount = 0;

    let validates = ['password', 'confirmPassword'];

    validates.forEach(name => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'this field is required';
        errorCount = errorCount + 1;
      } else {
        let result = true;
        let warning = '';
        switch (name) {
          case 'mobile':
          case 'confirmPassword':
            result = validateField(
              value,
              passwordRule.validationRules,
              this.state.password,
            );
            warning = 'Password and confirm password must be similar';
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
    });

    this.setState({ errors });

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
    registerStep: registerStepSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setPassword: input => dispatch(setPassword(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(SetPassword));

const styles = StyleSheet.create({
  fullImage: {
    width: ScreenWidth,
    height: ScreenHeight,
  },
  container: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
});

//MARK:- Initializations
//MARK: - LIfeCycle Methods
//MARK: - Event Handlers
//MARK: - UI Render
//MARK: - Cell Creation
//MARK: - Data Management
