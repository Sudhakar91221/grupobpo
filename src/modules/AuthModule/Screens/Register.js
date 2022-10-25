/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert} from 'react-native';
import {styless} from '../../../components/common/Styles';
import InputForm from '../../FormsComponent/Forms/InputForm';

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
  registerBlockListSelector,
  apiSelector,
  errorSelector,
  fieldsListSelector,
  blockListSelector,
} from '../../FormsComponent/Actions/selectors';
import {ScreenWidth} from '../../../components/utility/Settings';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import BaseClass from '../../Base/BaseClass';
import {userLoginSelector, userApiSelector} from '../Actions/selectors';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import MoreListCell from '../../MoreModule/Screens/MoreListCell';

class Register extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      blocksFetchedAlready: false,
      startBlockIndex: 0,
      blocks: undefined,
    };

    this.currentPageRef = {};
    this.onNextButtonTapped = this.onNextButtonTapped.bind(this);
    // this.updatePage = this.updatePage.bind(this);
  }

  //MARK: - View LIfecycle

  componentDidMount() {
    this.callGetBlock();
  }
  componentDidUpdate(prevProps, prevState) {
    if (!this.props.error && this.props.api === BLOCKS_GET) {
      if (this.props.blocks !== this.state.blocks) {
        this.state.blocks = this.props.blocks;
        this.callGetFields();
      }
    }

    if (
      !this.props.error &&
      this.props.api === FIELDS_GET &&
      this.props.blockModel !== this.state.blockModel
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
    if (
      this.state.blockModel === undefined ||
      this.props.blockModel === undefined
    ) {
      return <ActivityIndicatorCustom />;
    }

    return (
      <BaseClass title={translate('register')}>
        <View style={{flex: 1}}>
          {this.state.blocks !== undefined && (
            <InputForm
              formId={'2'}
              isSinglePage={true}
              item={this.state.blockModel}
              navigation={this.props.navigation}
              innerPage={true}
              // hideBottomButton={true}
              isRequireHeader={false} //as we dont want header
              onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
              editable={true}
            />
          )}
        </View>
      </BaseClass>
    );
  }

  //MARK: - Render UI

  renderBottomButton() {
    return (
      <View>
        <BottomButton
          style={styless.bottomButton}
          title={translate('Register')}
          action={
            !this.state.submitLoader && !this.state.submitGray
              ? this.onRegisterTapped
              : null
          }
          isLoader={this.state.submitLoader}
          isGray={this.state.submitGray}
        />
      </View>
    );
  }

  //MARk: - Event Handlers
  onRegisterTapped = () => {
    // this.props.navigation.navigate('OTPScreenNew');
  };

  onNextButtonTapped = () => {
    this.props.navigation.navigate('OTPScreen');
    // this.props.navigation.goBack();
  };

  //MARK: - API CALL
  callGetBlock() {
    var input = {
      // userId: this.props.user.userId,
      // token: this.props.user.token,
      formId: '2',
    };
    this.props.getBlocks(input);
  }

  callGetFields() {
    if (this.props.blocks[this.state.startBlockIndex] !== undefined) {
      var input = {
        // userId: this.props.user.userId,
        // token: this.props.user.token,
        formId: '2',
        blockId: this.props.blocks[this.state.startBlockIndex].fbId,
      };

      this.props.getFields(input);
    }
  }
}

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    // blocks: registerBlockListSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),

    blocks: blockListSelector(state.FormReducer),
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

const RegisterNew = withTheme(Register);

RegisterNew.navigationOptions = ({screenProps}) => {
  // const {state, setParams, navigate} = navigation;

  const {theme} = screenProps;
  return {
    title: translate('Register'),
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      paddingTop: 5,
      fontSize: 30,
      color: 'black',
    },

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(RegisterNew));
