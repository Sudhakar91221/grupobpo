/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';
import { changePassword } from '../../FormsComponent/Actions/FormActions';
import { PASSWORD_CHANGE } from '../../FormsComponent/Actions/type';
import { withTheme } from '../../../components/common/Theme/themeProvider';
var md5 = require('md5');
import SyncStorage from 'sync-storage';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  changePasswordSelector,
} from '../../FormsComponent/Actions/selectors';
import { BottomButton } from '../../../components/views/Button';
import {
  validateField,
  passwordRule,
} from '../../../components/utility/validation';

class ChangePassword extends React.Component {
  constructor() {
    super();
    this.state = {
      hidePassword: true,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      submitGray: true,
      submitLoader: false,
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.changePasswordAPI = this.changePasswordAPI.bind(this);

    this.oldPasswordRef = this.updateRef.bind(this, 'oldPassword');
    this.newPasswordRef = this.updateRef.bind(this, 'newPassword');
    this.confirmPasswordRef = this.updateRef.bind(this, 'confirmPassword');
  }

  onChangeText(text, id, data) {
    var self = this;

    ['oldPassword', 'newPassword', 'confirmPassword']
      .map(name => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
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

  updateRef(name, ref) {
    this[name] = ref;
  }

  focusTheField = id => {
    let ref = this[id];
    ref.focus();
  };

  validateTheField = id => {
    // if (this.validateSingleField(id) === false) {
    //   return;
    // }
    if (id === 'newPassword') {
      //last field with which we want submit button enables
      this.setState({ submitGray: false });
    }
  };

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
        case 'oldPassword':
          result = validateField(value, passwordRule.validationRules);
          warning = 'Enter valid password';
          break;
        default:
          result = true;
          break;
      }
      if (result === false) {
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

    let validates = ['oldPassword', 'newPassword', 'confirmPassword'];

    validates.forEach(name => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'this field is required';
        errorCount = errorCount + 1;
      } else {
        let result = true;
        let warning = '';
        switch (name) {
          case 'confirmPassword':
            result = validateField(
              value,
              passwordRule.validationRules,
              this.state.newPassword,
            );
            warning = 'New password and confirm password should be same';
            break;
          default:
            result = true;
            break;
        }

        if (result === false) {
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

  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };

  goToLogin() {
    SyncStorage.set('isFromLogout', true.toString());
    SyncStorage.remove('user');
    this.props.navigation.navigate('AuthStack');
  }

  changePasswordAPI = () => {
    if (this.validateAllDetails() === false) {
      return;
    }

    this.setState({ submitLoader: true });

    // SyncStorage.get('user').then(value => {
    const user = JSON.parse(SyncStorage.get('user'));

    const token = user.token;
    const userId = user.userId;
    const oldPassword = this.state.oldPassword;
    const newPassword = this.state.newPassword;
    const status = user.status;

    var input = {
      token: token,
      userId: userId,
      oldPassword: md5(oldPassword),
      password: md5(newPassword),
      otpstatus: status,
    };

    this.props.changePassword(input);
    // });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.api === PASSWORD_CHANGE) {
      if (this.props.error !== prevProps.error) {
        this.state.progress = new Animated.Value(0);
        Alert.alert(this.props.error.message);
      }
    }

    if (this.props.isLoading === true && this.props.api === PASSWORD_CHANGE) {
      this.state.submitLoader = true;
    }

    if (!this.props.error && this.props.api === PASSWORD_CHANGE) {
      console.log('user => ' + this.props.user);
      if (this.props.user !== prevProps.user) {
        SyncStorage.set('user', JSON.stringify(this.props.user));
        console.log('Changed password successfully');
        this.goToLogin();
      }
    }
  }

  render() {
    let { errors = {}, secureTextEntry, ...data } = this.state;
    const { theme } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.linearGradient}>
          <View style={styles.textFieldStyle}>
            <View style={styles.container}>
              <View style={styles.textBoxBtnHolder}>
                <TextField
                  ref={this.oldPasswordRef}
                  secureTextEntry={this.state.hidePassword}
                  label="Old Password"
                  textColor={theme.headerColor}
                  baseColor={theme.detailPlaceholderColor}
                  fontSize={18}
                  tintColor={theme.centerColor}
                  focus={this.onFocus}
                  error={errors.oldPassword}
                  onChangeText={this.onChangeText}
                  onChange={event =>
                    this.setState({ oldPassword: event.nativeEvent.text })
                  }
                  value={this.state.oldPassword}
                  maxLength={12}
                  onEndEditing={() => {
                    this.validateTheField('oldPassword');
                  }}
                  onSubmitEditing={() => {
                    this.focusTheField('newPassword');
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.visibilityBtn}
                  onPress={this.managePasswordVisibility}>
                  <Image
                    source={
                      this.state.hidePassword
                        ? require('../../../assets/hide.png')
                        : require('../../../assets/view.png')
                    }
                    style={[styles.btnImage, { tintColor: 'gray' }]}
                    tintColor="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.textFieldStyle}>
            <View style={styles.container}>
              <View style={styles.textBoxBtnHolder}>
                <TextField
                  ref={this.newPasswordRef}
                  secureTextEntry={this.state.hidePassword}
                  label="New Password"
                  textColor={theme.headerColor}
                  baseColor={theme.detailPlaceholderColor}
                  fontSize={18}
                  tintColor={theme.centerColor}
                  focus={this.onFocus}
                  error={errors.newPassword}
                  onChangeText={this.onChangeText}
                  onChange={event =>
                    this.setState({ newPassword: event.nativeEvent.text })
                  }
                  value={this.state.newPassword}
                  maxLength={12}
                  onEndEditing={() => {
                    this.validateTheField('newPassword');
                  }}
                  onSubmitEditing={() => {
                    this.focusTheField('confirmPassword');
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.visibilityBtn}
                  onPress={this.managePasswordVisibility}>
                  <Image
                    source={
                      this.state.hidePassword
                        ? require('../../../assets/hide.png')
                        : require('../../../assets/view.png')
                    }
                    style={[styles.btnImage, { tintColor: 'gray' }]}
                    tintColor="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.textFieldStyle}>
            <View style={styles.container}>
              <View style={styles.textBoxBtnHolder}>
                <TextField
                  ref={this.confirmPasswordRef}
                  secureTextEntry={this.state.hidePassword}
                  label="Confirm Password"
                  textColor={theme.headerColor}
                  baseColor={theme.detailPlaceholderColor}
                  fontSize={18}
                  tintColor={theme.centerColor}
                  focus={this.onFocus}
                  error={errors.confirmPassword}
                  onChangeText={this.onChangeText}
                  onChange={event =>
                    this.setState({ confirmpassword: event.nativeEvent.text })
                  }
                  value={this.state.confirmPassword}
                  maxLength={12}
                  onEndEditing={() => {
                    this.validateTheField('confirmPassword');
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.visibilityBtn}
                  onPress={this.managePasswordVisibility}>
                  <Image
                    source={
                      this.state.hidePassword
                        ? require('../../../assets/hide.png')
                        : require('../../../assets/view.png')
                    }
                    style={[styles.btnImage, { tintColor: 'gray' }]}
                    tintColor="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <BottomButton
            style={{
              marginTop: 50,
              paddingTop: 10,
              paddingBottom: 10,
              height: 45,
              width: '50%',
              borderRadius: 30,
              backgroundColor: theme.primaryColor,
            }}
            title="Save"
            action={
              !this.state.submitLoader && !this.state.submitGray
                ? this.changePasswordAPI
                : null
            }
            isLoader={this.state.submitLoader}
            isGray={this.state.submitGray}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  textStyle: {
    fontSize: 24,
    textAlign: 'left',
    marginLeft: 30,
    color: '#222',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  textFieldStyle: {
    width: '80%',
    marginLeft: '10%',
    marginRight: '10%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBoxBtnHolder: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  visibilityBtn: {
    position: 'absolute',
    right: 3,
    height: 25,
    width: 35,
    bottom: 15,
  },
  btnImage: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
});

//MARK: - Data Management

function mapStateToProps(state) {
  // if(state.UserReducer.error && state.UserReducer.error.message != "") {
  //      Alert.alert(state.UserReducer.error.message)
  // }

  return {
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    user: changePasswordSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    changePassword: input => dispatch(changePassword(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(ChangePassword));
