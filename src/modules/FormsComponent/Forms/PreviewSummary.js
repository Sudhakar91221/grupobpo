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

class PreviewSummary extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    this.state = {
      submitGray: false,
      submitLoader: false,
      applicationId:
        props.applicationModel !== undefined
          ? props.applicationModel.applicationId
          : undefined,
    };
  }

  updatePageDetailsIfNeeded() {}
  render() {
    const {theme} = this.props;

    return (
      <BaseClass title={'Review of your details'}>
        <View style={{flex: 1}}>
          <Text style={[theme.detailMediumGray, {paddingLeft: 5}]}>
            Please confirm all of your details
          </Text>
          <ScrollView
            style={{bottom: 0}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-between',
            }}
            keyboardDismissMode="on-drag">
            {this.renderScreens()}
            {this.renderBottomButton()}
          </ScrollView>
        </View>
      </BaseClass>
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
    return this.props.blocks.map(item => (
      <View style={{flex: 1}}>
        <InputForm
          item={item}
          formId={'1'}
          navigation={this.props.navigation}
          updatePage={this.updatePage}
          innerPage={true}
          hideBottomButton={true}
          applicationId={applicationId}
          editable={false}
        />
        <View style={{paddingVertical: 30}}>
          <Divider dashed={true} />
        </View>
      </View>
    ));
  }

  renderBottomButton() {
    const {theme} = this.props;

    return (
      <View style={{backgroundColor: 'transparent', height: 55}}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 5,
            backgroundColor: theme.primaryColor,
            position: 'absolute',
            bottom: 20,
            width: '80%',
          }}
          title={translate('next')}
          action={this.onNextButtonTapped}
          activeState={true}
        />
      </View>
    );
  }
  onNextButtonTapped = () => {
    this.props.navigation.navigate('SuccessForm');
  };
}

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    blocks: blockListSelector(state.FormReducer),
    blockModel: fieldsListSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    applicationModel: applicationSubmitSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}

const PreviewSummaryNew = withTheme(PreviewSummary);

PreviewSummaryNew.navigationOptions = ({navigation, screenProps, params}) => {
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
)(withTheme(PreviewSummaryNew));
