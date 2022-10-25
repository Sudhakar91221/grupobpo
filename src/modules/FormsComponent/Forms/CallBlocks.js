//simmilar to preview/summary page
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {connect} from 'react-redux';
import {
  isLoadingSelector,
  blockListSelector,
  fieldsListSelector,
  apiSelector,
  errorSelector,
  applicationSubmitSelector,
} from '../Actions/selectors';
import Divider from '../../../components/views/Divider';
import {styless} from '../../../components/common/Styles';
import InputForm from './InputForm';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import BaseClass from '../../Base/BaseClass';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {getBlocks, getFields} from '../Actions/FormActions';
import {BLOCKS_GET, APPLICATION_SUBMIT, FIELDS_GET} from '../Actions/type';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import BlocksForm from './BlocksForm';

class CallBlocks extends React.PureComponent {
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

    // this.renderScreens = this.renderScreens.bind(this)
  }

  //MARK: - View LIfecycle

  componentDidMount() {
    this.callGetBlock();
  }
  componentDidUpdate(prevProps) {
    if (!this.props.error && this.props.api === BLOCKS_GET) {
      if (this.props.blocks !== this.state.blocks) {
        console.log('didUpdae getting called for blocks .............');

        if(this.props.blocks[0] !== undefined && this.props.formId === this.props.blocks[0].formId) {

          this.state.blocks = this.props.blocks;
          this.callGetFields();
        }

      }
    }

    if (
      !this.props.error &&
      this.props.api === FIELDS_GET &&
      this.props.blockModel !== this.state.blockModel
    ) {
      console.log('didUpdae getting called for fields .............');

      const lastRecivedBlockId =
        this.props.blocks[this.state.startBlockIndex] !== undefined
          ? this.props.blocks[this.state.startBlockIndex].fbId
          : undefined;
      const lastOriginalBlockId =
        this.props.blocks[this.props.blocks.length - 1] !== undefined
          ? this.props.blocks[this.props.blocks.length - 1].fbId
          : undefined;
      if (lastOriginalBlockId === lastRecivedBlockId) {
        this.setState(
          {
            blockModel: this.props.blockModel,
            startBlockIndex: this.state.startBlockIndex + 1,
          },
          () => {
            // this.callGetFields();
          },
        );
      } else {
        const comingBlockId =
          this.props.blockModel !== undefined
            ? this.props.blockModel.fbId
            : undefined;

        const currentPageBlockId =
          this.props.blocks[this.state.startBlockIndex] !== undefined
            ? this.props.blocks[this.state.startBlockIndex].fbId
            : undefined;

        if (comingBlockId === currentPageBlockId) {
          this.state.blockModel = this.props.blockModel;
          this.state.startBlockIndex = this.state.startBlockIndex + 1;
          this.callGetFields();
        }
      }
    }
  }



  render() {
    const {theme} = this.props;
    if (this.props.blocks !== undefined) {
      const lastRecivedBlockId =
        this.props.blockModel !== undefined
          ? this.props.blockModel.fbId
          : undefined;
      const lastOriginalBlockId =
        this.props.blocks[this.props.blocks.length - 1] !== undefined
          ? this.props.blocks[this.props.blocks.length - 1].fbId
          : undefined;

      if (
        this.state.blocks === undefined ||
        lastRecivedBlockId !== lastOriginalBlockId
      ) {
        return <ActivityIndicatorCustom />;
      }

      if (this.state.blockModel !== undefined && this.state.blockModel.fbId !== lastRecivedBlockId ) {
        return <ActivityIndicatorCustom />;
      }
    }

    if (this.state.blocks === undefined || this.props.blocks === undefined) {
      return <ActivityIndicatorCustom />;
    }



    return (
        <View style={{flex:1}}>
     <BlocksForm navigation={this.props.navigation} formId={this.props.formId} submitApiName={this.props.submitApiName} ></BlocksForm>
     </View>
    );
  }

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
    if (this.props.blocks[this.state.startBlockIndex] !== undefined) {
      var input = {
        userId: this.props.user.userId,
        token: this.props.user.token,
        formId: this.props.formId,
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
  };
}

const CallBlocksNew = withTheme(CallBlocks);

CallBlocksNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
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

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(CallBlocksNew));
