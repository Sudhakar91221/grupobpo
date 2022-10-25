import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';

import {SizeButton} from '../../../components/views/Button';
import {connect} from 'react-redux';
import {USER_LOGOUT} from '../Actions/type';
import {loginUser} from '../Actions/UserActions';
import {PROJECT_KEY} from '../../../network/config';
import ReactNativeModal from '../../../components/external/Modal/index';
import CardView from '../../../components/views/CardView';
import * as Keychain from 'react-native-keychain';

import {
  isLoadingSelector,
  supportListSelector,
  apiSelector,
  errorSelector,
} from '../Actions/selectors';

class Logout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.onCancelButtonTapped = this.onCancelButtonTapped.bind(this);
    this.onLogoutButtonTapped = this.onLogoutButtonTapped.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }
  }

  componentDidMount() {
    var that = this;
  }

  render() {
    return (
      // <View style={{paddingTop:50}}>

      <ReactNativeModal
        isVisible={this.props.visible}
        backdropColor="gray"
        backdropOpacity={0.3}
        // height={250}
      >
        <View style={{backgroundColor: 'gray', height: 180}}>
          <CardView
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}
            style={[
              {padding: 10, backgroundColor: 'white', padding: 1, height: 180},
            ]}>
            <Text> Do you really want to logout ? </Text>
            {this.renderBottomButton()}
          </CardView>
        </View>
        {/* */}
      </ReactNativeModal>
      // </View>
    );
  }

  //  onSelectionChange(selected) {

  //   console.log(selected)
  //  }
  renderBottomButton() {
    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingTop: 20,
          alignItems: 'center',
        }}>
        <SizeButton
          style={{flex: 1, width: 80, height: 30}}
          title="Apply"
          action={this.onLogoutButtonTapped}
        />
        <Text style={{flex: 0.1, color: 'white'}}> test </Text>
        <SizeButton
          style={{flex: 1, width: 80, height: 30}}
          title="Clear"
          action={this.onCancelButtonTapped}
        />
      </View>
    );
  }

  onLogoutButtonTapped = () => {
    this.props.user = null;
    this.reset();
  };

  onCancelButtonTapped = () => {};

  async reset() {
    try {
      await Keychain.resetGenericPassword();
      this.setState({
        status: 'Credentials Reset!',
        username: '',
        password: '',
      });
    } catch (err) {
      this.setState({status: 'Could not reset credentials, ' + err});
    }
  }
  callGetSupports() {
    var input = {
      userId: this.props.user.userId,
      projectKey: PROJECT_KEY,
      page: this.state.page ? this.state.page : '1',
      flag: '0',
      platform: '2',
      email: this.props.user.email,
      // status: statusToSubmit ? statusToSubmit : '',
    };
    this.props.getSupports(input);
  }
}

//MARK: - Data Management

function mapStateToProps(state) {
  if (state.UserReducer.error && state.UserReducer.error.message != '') {
    Alert.alert(state.UserReducer.error.message);
  }
  return {
    user: state.UserReducer.user,
    isLoading: isLoadingSelector(state.UserReducer),
    api: apiSelector(state.UserReducer),
    error: errorSelector(state.UserReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    // logout: (input) => dispatch(logoutUser(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logout);
