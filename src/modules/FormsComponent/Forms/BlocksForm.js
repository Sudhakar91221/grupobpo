//simmilar to preview/summary page
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {
  isLoadingSelector,
  blockListSelector,
  fieldsListSelector,
  apiSelector,
  errorSelector,
  applicationSubmitSelector,
} from '../Actions/selectors';
import Divider from '../../../components/views/Divider';
import { styless } from '../../../components/common/Styles';
import InputForm from './InputForm';
import { BottomButton } from '../../../components/views/Button';
import { translate } from '../../../../App';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import BaseClass from '../../Base/BaseClass';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import { getBlocks, getFields, submitApplication } from '../Actions/FormActions';
import { BLOCKS_GET, APPLICATION_SUBMIT, FIELDS_GET } from '../Actions/type';
import { userLoginSelector } from '../../AuthModule/Actions/selectors';
import SyncStorage from 'sync-storage';
import Icons from '../../../components/common/Icons';

class BlocksForm extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    this.state = {
      submitGray: false,
      submitLoader: false,
      blocks: undefined,
      startBlockIndex: 0,
      blockModel: undefined,
      applicationId:
        props.applicationModel !== undefined
          ? props.applicationModel.applicationId
          : undefined,
    };

    if (this.state.applicationId === undefined) {
      this.state.applicationId = this.props.applicationId;
    }

    this.currentPageRef = {};
    this.renderScreens = this.renderScreens.bind(this);
    this.onNextButtonTapped = this.onNextButtonTapped.bind(this);
  }

  //MARK: - View LIfecycle

  async componentDidMount() {
    // this.callGetBlock();
    let fcmToken = await SyncStorage.get('fcmToken');
    this.state.fcmToken = fcmToken;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.api === APPLICATION_SUBMIT) {
      this.setState({ submitLoader: false });
      // this.state.submitLoader = false;
      this.state.newPageToChange = this.state.currentPage;
      this.state.visiblePage = this.state.currentPage;
    }

    if (
      this.props.error !== null &&
      this.props.error.request === APPLICATION_SUBMIT
    ) {
      if (this.props.error !== prevProps.error) {
        if (typeof this.props.error.message === 'string') {
          Alert.alert(this.props.error.message);
          this.setState({ submitLoader: false });
        } else {
          Object.keys(this.props.error.message).map(
            function (key) {
              this.state.errors[key] = this.props.error.message[key];
              // this.state.

              // this.setState({errors[key]:this.props.error.message[key] })
            }.bind(this),
          );
          this.setState({ submitLoader: false });
        }
      }
    }

    if (!this.props.error && this.props.api === APPLICATION_SUBMIT) {
      if (this.state.submitLoader === true) {
        this.setState({ submitLoader: false, errors: {} }, () => {
          this.state.errors = {};
          this.props.navigation.goBack();
        });
      }
    }
  }

  render() {
    const { theme } = this.props;

    return (
      <BaseClass title={'Review of your details'}>
        <View style={{ flex: 1 }}>
          {/* <Text style={[theme.detailMediumGray, {paddingLeft: 5}]}>
            Please confirm all of your details
          </Text> */}
          <ScrollView
            style={{ bottom: 0, flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-between',
            }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled">
            <View style={{ flex: 1 }}>{this.renderScreens()}</View>
            {this.renderBottomButton()}
            {this.props.submitApiName === 'EditProfile'
              ? this.renderChangePasswordView()
              : null}
          </ScrollView>
        </View>
      </BaseClass>
    );
  }

  renderChangePasswordView() {
    const { theme } = this.props;
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', padding: 10 }}
        onPress={() => this.props.navigation.navigate('ChangePassword')}>
        <Text style={[theme.detailLarge, { textTransform: 'none', flex: 0.9 }]}>
          Change Password
        </Text>
        <View style={{ flex: 0.1 }}>
          <Icons.MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            color="gray"
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderScreens() {
    let applicationId = this.state.applicationId;
    if (this.state.applicationId === undefined) {
      applicationId =
        this.props.applicationModel !== undefined
          ? this.props.applicationModel.applicationId
          : undefined;
    }
    let inputView = [];
    let headerNumber = 0;

    let ref = this.currentPageRef;
    return this.props.blocks.map(
      function (item) {
        headerNumber = headerNumber + 1;
        return (
          <View style={{ flex: 1, paddingTop: 10 }}>
            <InputForm
              onRef={ref => {
                this.currentPageRef[item.fbId] = ref;
              }}
              item={item}
              blockModel={item}
              formId={this.props.formId}
              navigation={this.props.navigation}
              // innerPage={true}
              hideBottomButton={true}
              isHeaderWithNumber={
                this.props.isHeaderWithNumber !== undefined
                  ? this.props.isHeaderWithNumber
                  : true
              }
              headerNumber={headerNumber.toString()}
              applicationId={applicationId}
              editable={true}
            // onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
            />
            <View style={{ paddingVertical: 30 }}>
              <Divider dashed={true} />
            </View>
          </View>
        );
      }.bind(this),
    );

    // return inputView;
  }

  renderBottomButton() {
    const { theme } = this.props;

    return (
      <View style={{ backgroundColor: 'transparent', height: 55 }}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 5,
            backgroundColor: theme.primaryColor,
            position: 'absolute',
            marginBottom: 20,
            bottom: 0,
            width: '80%',
          }}
          title={translate('next')}
          action={
            !this.state.submitLoader && !this.state.submitGray
              ? this.onNextButtonTapped
              : null
          }
          isLoader={this.state.submitLoader}
          isGray={this.state.submitGray}
        />
      </View>
    );
  }

  getTheFieldValues(childItem, item, input) {
    let fieldref = this.currentPageRef[item.fbId].currentFieldsRef[
      childItem.name
    ];


    if (fieldref !== undefined) {

      let fieldValues = fieldref.state[childItem.name];

      if (fieldref.state.finalImageToUpload !== undefined) {
        fieldValues = fieldref.state.finalImageToUpload;

      }

      if (
        fieldValues == '' ||
        fieldValues === undefined ||
        fieldValues === 'undefined'
      ) {
        fieldValues = fieldref.props.values;
      }
      input[childItem.name] = fieldValues;
    }


    return input;
  }
  onNextButtonTapped = () => {
    let input = {};
    this.state.submitLoader = true;

    this.props.blocks.map(
      function (item) {
        item.blockModel.fields.map(
          function (childItem, index) {
            if (childItem.childFields.length > 0) {
              childItem.childFields.map(
                function (innerChildItem, index) {
                  let newInput = this.getTheFieldValues(
                    innerChildItem,
                    item,
                    input,
                  );
                  input = { ...input, ...newInput };
                }.bind(this),
              );
            } else {
              let newInput = this.getTheFieldValues(childItem, item, input);
              input = { ...input, ...newInput };
            }
          }.bind(this),
        );
      }.bind(this),
    );

    (input.userId = this.props.user.userId),
      (input.token = this.props.user.token),
      (input.deviceId = this.state.fcmToken),
      (input.formId = this.props.formId);
    if (this.props.blockId !== undefined) {
      input.blockId = this.props.blockId;
    }

    input.type = '1';

    if (this.state.applicationId !== undefined) {
      input.applicationId = this.state.applicationId;
    } else if (this.props.applicationModel !== undefined) {
      input.applicationId = this.props.applicationModel.applicationId;
    }
    // input.request = this.props.submitApiName

    this.props.submitApplication(input, this.props.submitApiName);
  };
}

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    blocks: blockListSelector(state.FormReducer),
    blockModel: fieldsListSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    applicationModel: applicationSubmitSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getBlocks: input => dispatch(getBlocks(input)),
    getFields: input => dispatch(getFields(input)),
    submitApplication: (input, controller) =>
      dispatch(submitApplication(input, controller)),
  };
}

const BlocksFormNew = withTheme(BlocksForm);

BlocksFormNew.navigationOptions = ({ navigation, screenProps, params }) => {
  const { theme } = screenProps;
  return {
    title: 'Preview Summary',
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      paddingTop: 13,
      fontSize: 22,
      color: 'black',
      fontWeight: 'bold',
    },

    headerStyle: { shadowColor: 'transparent', borderBottomWidth: 0 },
    headerTintColor: theme.primaryColor,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(BlocksFormNew));
