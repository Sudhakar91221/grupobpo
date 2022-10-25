/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert} from 'react-native';
import {styless} from '../../../components/common/Styles';
import InputForm from './InputForm';

import {getBlocks, getFields} from '../Actions/FormActions';
import {BLOCKS_GET, APPLICATION_SUBMIT, FIELDS_GET} from '../Actions/type';
import {connect} from 'react-redux';
import {withTheme} from '../../../components/common/Theme/themeProvider';

import {
  isLoadingSelector,
  SingleFormBlockListSelector,
  apiSelector,
  errorSelector,
  fieldsListSelector,
  blockListSelector,
} from '../../FormsComponent/Actions/selectors';
import {ScreenWidth} from '../../../components/utility/Settings';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import BaseClass from '../../Base/BaseClass';
import {
  userLoginSelector,
  userApiSelector,
} from '../../FormsComponent/Actions/selectors';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';

class SingleForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      blocksFetchedAlready: false,
      startBlockIndex: 0,
      blocks: undefined,
      blockModel: undefined,
      editable: this.props.navigation.state.params.editable,
    };

    this.currentPageRef = {};
    this.onNextButtonTapped = this.onNextButtonTapped.bind(this);
    // this.updatePage = this.updatePage.bind(this);
  }

  //MARK: - View LIfecycle

  componentDidMount() {
    this.callGetFields();
  }
  componentDidUpdate(prevProps, prevState) {
    // if (!this.props.error && this.props.api === BLOCKS_GET) {
    //   if (this.props.blocks !== this.state.blocks) {
    //     this.state.blocks = this.props.blocks;
    //     this.callGetFields();
    //   }
    // }

    if (
      !this.props.error &&
      this.props.api === FIELDS_GET &&
      this.props.blockModel !== this.state.blockModel
    ) {
      if (
        this.props.navigation.state.params.blockId ===
        this.props.blockModel.fbId
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
  }

  render() {
    if (
      this.state.blockModel === undefined ||
      this.props.blockModel === undefined
    ) {
      return <ActivityIndicatorCustom />;
    }

    return (
      <BaseClass title={translate('SingleForm')}>
        <View style={{flex: 1}}>
          {this.state.blockModel !== undefined && (
            <InputForm
              isSinglePage={true}
              blockModel={this.state.blockModel}
              item={this.state.blockModel}
              navigation={this.props.navigation}
              applicationId={this.props.navigation.state.params.applicationId}
              formId={this.props.navigation.state.params.formId}
              isRequireHeader={true} 
              onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
              editable={this.state.editable}
              goBackOnSuccess={true}
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
          title={translate('SingleForm')}
          action={
            !this.state.submitLoader && !this.state.submitGray
              ? this.onSingleFormTapped
              : null
          }
          isLoader={this.state.submitLoader}
          isGray={this.state.submitGray}
        />
      </View>
    );
  }

  //MARk: - Event Handlers
  onSingleFormTapped = () => {
    // this.props.navigation.navigate('OTPScreenNew');
  };

  onNextButtonTapped = () => {
    this.props.navigation.goBack();
  };

  //MARK: - API CALL
  callGetBlock() {
    var input = {
      userId: this.props.user.userId,
      token: this.props.user.token,
      formId: this.props.formId,
    };
    this.props.getBlocks(input);
  }

  callGetFields() {
    // if (this.props.blocks !== undefined) {
    var input = {
      userId: this.props.user.userId,
      token: this.props.user.token,
      formId: this.props.navigation.state.params.formId,
      blockId: this.props.navigation.state.params.blockId,
    };

    if (this.props.navigation.state.params.applicationId !== undefined) {
      input.applicationId = this.props.navigation.state.params.applicationId;
    }
    this.props.getFields(input);
    // }
  }
}

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    // blocks: SingleFormBlockListSelector(state.FormReducer),
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

const SingleFormNew = withTheme(SingleForm);

SingleFormNew.navigationOptions = ({screenProps}) => {
  // const {state, setParams, navigate} = navigation;

  const {theme} = screenProps;
  return {
    title: translate('SingleForm'),
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
)(withTheme(SingleFormNew));
