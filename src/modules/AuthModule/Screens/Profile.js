/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text, TouchableOpacity, ScrollView} from 'react-native';
import {styless} from '../../../components/common/Styles';
import InputForm from '../../FormsComponent/Forms/InputForm';
import Divider from '../../../components/views/Divider';
import CardView from '../../../components/views/CardView';
import Icons from '../../../components/common/Icons';

import {getBlocks, getFields} from '../../FormsComponent/Actions/FormActions';
import {
  BLOCKS_GET,
  APPLICATION_SUBMIT,
  FIELDS_GET,
} from '../../FormsComponent/Actions/type';
import {connect} from 'react-redux';
import {withTheme} from '../../../components/common/Theme/themeProvider';

import {
  isLoadingSelector,
  blockListSelector,
  apiSelector,
  errorSelector,
  profileBlockListSelector,
  fieldsListSelector,
} from '../../FormsComponent/Actions/selectors';
import {ScreenWidth} from '../../../components/utility/Settings';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import BaseClass from '../../Base/BaseClass';
import {userLoginSelector, userApiSelector} from '../Actions/selectors';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import MoreListCell from '../../MoreModule/Screens/MoreListCell';

class Profile extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      blocksFetchedAlready: false,
      startBlockIndex: 0,
      blocks: undefined,
      blockModel: undefined,
    };

    this.currentPageRef = {};
    this.onNextButtonTapped = this.onNextButtonTapped.bind(this);
    this.renderChangePasswordView = this.renderChangePasswordView.bind(this);
    // this.updatePage = this.updatePage.bind(this);
  }

  //MARK: - View LIfecycle

  componentDidMount() {
    this.callGetBlock();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.error &&
      (this.props.api === BLOCKS_GET || this.props.api === FIELDS_GET)
    ) {
      if (this.props.blocks !== this.state.blocks) {
        if (
          '2' === this.props.blocks[0].formId &&
          '5' === this.props.blocks[0].fbId
        ) {
          this.state.blocks = this.props.blocks;
          this.callGetFields();
        }
      }
    }

    if (
      !this.props.error &&
      this.props.api === FIELDS_GET &&
      this.props.blockModel !== this.state.blockModel &&
      this.state.blocks !== undefined
    ) {
      this.setState(
        {
          blockModel: this.props.blockModel,
        },
        () => {
          // this.callGetFields();
        },
      );
    }
  }

  render() {
    const {theme} = this.props;

    const changePassword = {
      id: 1,
      title: 'Change Password',
    };

    if (this.state.blocks === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <BaseClass title={translate('profile')}>
        <ScrollView style={{flex: 1}}>
          <Text style={[theme.H3, {paddingVertical: 5}]}>
            {translate('my_profile')}
          </Text>
          <Text
            style={{
              color: '#cdcdcd',
              fontWeight: 'bold',
              fontSize: 14,
            }}>
            {translate('profile_hint')}
          </Text>
          <Divider borderColor="gray" height={1} dashed={true} />

          {this.state.blocks !== undefined && (
            <InputForm
              formId={'2'}
              // blockModel={this.state.blocks[0]}
              item={this.state.blockModel}
              navigation={this.props.navigation}
              innerPage={true}
              isSinglePage={true}
              applicationId={this.props.user.userId}
              // hideBottomButton={true}
              isRequireHeader={false} //as we dont want header
              onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
              editable={true}
            />
          )}
          {/* {this.renderBottomButton()} */}

          {this.renderChangePasswordView()}
        </ScrollView>
      </BaseClass>
    );
  }

  //MARK: - Render UI

  renderBottomButton() {
    return (
      <View>
        <BottomButton
          style={styless.bottomButton}
          title={translate('Profile')}
          action={
            !this.state.submitLoader && !this.state.submitGray
              ? this.onProfileTapped
              : null
          }
          isLoader={this.state.submitLoader}
          isGray={this.state.submitGray}
        />
      </View>
    );
  }

  renderChangePasswordView() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        style={{flexDirection: 'row', padding: 10}}
        onPress={() => this.props.navigation.navigate('ChangePassword')}>
        <Text style={[theme.detailLarge, {textTransform: 'none', flex: 0.9}]}>
          Change Password
        </Text>
        <View style={{flex: 0.1}}>
          <Icons.MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color="gray"
          />
        </View>
      </TouchableOpacity>
    );
  }

  //MARk: - Event Handlers
  onProfileTapped = () => {
    // this.props.navigation.navigate('OTPScreenNew');
  };

  onNextButtonTapped = () => {
    //this.callSubmitFields();
    // const {item} = this.props.navigation.state.params;
    // if (
    //   this.currentPageRef['InputForm:' + item.name] !== undefined &&
    //   this.currentPageRef['InputForm:' + item.name].state !== undefined
    // ) {
    //   const data = this.currentPageRef['InputForm:' + item.name].state
    //     .inputDict;
    //   this.props.navigation.state.params.getAnotherScreenData(item.name, data);
    // }
    // this.props.navigation.navigate('OTPScreen');
    this.props.navigation.goBack();
  };

  //MARK: - API CALL
  callGetBlock() {
    var input = {
      userId: this.props.user.userId,
      token: this.props.user.token,
      formId: '2',
    };
    this.props.getBlocks(input);
  }

  callGetFields() {
    if (this.props.blocks[this.state.startBlockIndex] !== undefined) {
      var input = {
        userId: this.props.user.userId,
        token: this.props.user.token,
        formId: '2',
        blockId: this.props.blocks[this.state.startBlockIndex].fbId,
      };
      if (this.props.user.userId !== undefined) {
        input.applicationId = this.props.user.userId;
      }
      this.props.getFields(input);
    }
  }
}

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    blocks: profileBlockListSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),

    // blocks: blockListSelector(state.FormReducer),
    // api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    blockModel: fieldsListSelector(state.FormReducer),
    api:
      apiSelector(state.FormReducer) !== undefined
        ? apiSelector(state.FormReducer)
        : userApiSelector(state.UserReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getBlocks: input => dispatch(getBlocks(input)),
    getFields: input => dispatch(getFields(input)),
  };
}

const ProfileNew = withTheme(Profile);

ProfileNew.navigationOptions = ({screenProps}) => {
  // const {state, setParams, navigate} = navigation;

  const {theme} = screenProps;
  return {
    title: translate('Profile'),
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingTop: 13,
      fontSize: 22,
      color: 'black',
      fontWeight: 'bold',
    },

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(ProfileNew));
