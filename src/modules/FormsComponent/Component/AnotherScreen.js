/* eslint-disable no-fallthrough */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {SingleSelection} from './SingleSelection';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import {SwitchSelection} from './SwitchSelection';
import {MultipleSelection} from './MultipleSelection';
import {InputTextField} from './InputTextField';
import {FieldType} from '../Actions/APIIntegers';
import Divider from '../../../components/views/Divider';
import Dropdown from '../../../components/external/Dropdown/dropdown/index';
import {connect} from 'react-redux';

import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import InputForm from '../../FormsComponent/Forms/InputForm';
import CollapsibleList from './CollapsibleList';
import {APPLICATION_SUBMIT} from '../Actions/type';

import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  applicationSubmitSelector,
} from '../Actions/selectors';
import {draftApplication} from '../Actions/FormActions';
import {APPLICATION_DRAFT} from '../Actions/type';

class AnotherScreen extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    this.state = {
      submitGray: false,
      submitLoader: false,
      applicationId: props.navigation.state.params.applicationId,
      newInputDict: undefined,
      data: {},
    };
    this.onNextButtonTapped = this.onNextButtonTapped.bind(this);
    this.currentPageRef = {};
    this.handleChangeSwitch = this.handleChangeSwitch.bind(this);
    this.onRadioSelection = this.onRadioSelection.bind(this);
    // this.onCountrySelect = this.onCountrySelect.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.api === APPLICATION_SUBMIT) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }

    // if (!this.props.error && this.props.api === APPLICATION_DRAFT) {
    //   if (prevProps.applicationModel !== this.props.applicationModel) {
    //     console.log(
    //       ' ........................number of times called ........................',
    //     );

    //     // this.state.isPageChanged = true;
    //     this.state.applicationModel = this.props.applicationModel;
    //     // this.props.navigation.state.params.getAnotherScreenData(this.state.data);

    //     //  this.props.navigation.goBack();
    //     // this.props.navigation.goBack();
    //   }
    // }
  }

  handleChangeSwitch = (name, value) => {
    // Alert.alert('selected switch value is');
    // const input = {};
    // input[name] = value;
    // if (this.state.newInputDict !== undefined) {
    //   this.state.newInputDict = {...this.state.newInputDict, ...input};
    // } else {
    //   this.state.newInputDict = input;
    // }
  };
  onRadioSelection = (name, value) => {
    const input = {};
    input[name] = value;
    if (this.state.newInputDict !== undefined) {
      this.state.newInputDict = {...this.state.newInputDict, ...input};
    } else {
      this.state.newInputDict = input;
    }
  };

  render() {
    return (
      <View style={{flex: 1,justifyContent:'flex-start'}}>
        {this.renderFields()}
        {/* {this.renderBottomButton()} */}
      </View>
    );
  }

  renderFields() {
    const {item} = this.props.navigation.state.params;
    let applicationModelValue = this.props.applicationModel;
    // if (this.props.applicationModel !== undefined) {
    //   applicationModelValue = this.props.applicationModel[item.name];
    // }

    // if(item.value == "" || item.value === undefined) {
    //   item.value = applicationModelValue !== undefined ? applicationModelValue : ''
    // }

    switch (parseInt(item.type)) {
      case FieldType.COLLAPSIBLE:
        return (
          <View style={{backgroundColor: 'white'}}>
            <CollapsibleList
              item={item}
              theme={this.props.theme}
              onRef={ref => {
                this.currentPageRef[item.name] = ref;
              }}
              onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
              navigation={this.props.navigation}
              isRequireHeader={false}

            />
          </View>
        );

      case FieldType.EMPTYROW:
        return (
          <View style={{backgroundColor: 'yellow', height: 50}}>
            {/* <Divider borderColor="gray" height={1.5} /> */}
          </View>
        );

      case FieldType.TEXT:
      case FieldType.NUMBER:
      case FieldType.PASSWORD:
      case FieldType.EMAIL:
        return (
          <View style={[styless.container, {paddingTop: 50}]}>
            <InputTextField
              item={item}
              values={this.state[item.name]}
              theme={this.props.theme}
              onRef={ref => {
                this.currentPageRef[item.name] = ref;
              }}
              onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
              editable={this.props.editable}
            />
          </View>
        );

      case FieldType.DROPDOWN:
      // return (
      //   <View style={{backgroundColor: 'white', flex: 1}}>
      //     <CountryPicker
      //       countryCode={this.state.countryCode}
      //       country={this.state.country}
      //       withCountryNameButton={true}
      //       withFilter={true}
      //       withEmoji={true}
      //       onSelect={this.onCountrySelect}
      //     />
      //     <Text>{getAllCountries !== undefined && 'getAllCountries OK'}</Text>
      //     <Text>{getCallingCode !== undefined && 'getCallingCode OK'}</Text>
      //   </View>
      // );

      case FieldType.RADIO:
        return (
          <View style={[styless.container, {paddingTop: 50}]}>
            <SingleSelection
              item={item}
              theme={this.props.theme}
              onRef={ref => {
                this.currentPageRef[item.name] = ref;
              }}
              onRadioSelection={this.onRadioSelection}
              // onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
            />
          </View>
        );

      case FieldType.CHECKBOX:
        return (
          <View style={[styless.container, {paddingTop: 50}]}>
            <MultipleSelection
              options={item.options}
              theme={this.props.theme}
              onRef={ref => {
                this.currentPageRef[item.name] = ref;
              }}
              onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
            />
          </View>
        );

      case FieldType.SWITCH:
        return (
          <View style={[styless.container, {paddingTop: 50}]}>
            <SwitchSelection
              item={item}
              theme={this.props.theme}
              defaultSelection = {item.childFields[0].value !== '' ? true : false}
              handleChangeSwitch={this.handleChangeSwitch}
              onRef={ref => {
                this.currentPageRef[item.name] = ref;
              }}
              applicationId={this.state.applicationId}
              navigation={this.props.navigation}
              onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
            />
            
          </View>
        );

      case FieldType.CHILDFIELDS:
        return (
          <View style={styless.container}>
            <InputForm
              onRef={ref => {
                this.currentPageRef[item.name] = ref;
              }}
              item={item}
              navigation={this.props.navigation}
              innerPage={true}
              submitButtonEnable={true}
              sendDataBack={true}
              blockModel={this.props.currentBlockModel}
              applicationId={this.state.applicationId}
              onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
              editable={this.props.editable}
            />
          </View>
        );

      default:
        return (
          <View style={[styless.container, {paddingTop: 50}]}>
            <Text> {item.type}</Text>
          </View>
        );
    }
  }

  //MARK: - Render UI
  renderDropdown(item) {
    const {theme} = this.props;
    return (
      <View style={styless.leftRight}>
        <Text
          style={[
            theme.themeText,
            {
              marginLeft: -5,
              paddingTop: 20,
              alignSelf: 'flex-start',
              textAlign: 'left',
              textTransform: 'uppercase',
              fontSize: 18,
            },
          ]}>
          {' '}
          {item.label}{' '}
        </Text>

        <Dropdown
          ref={this.blockRef}
          onFocus={this.onFocus}
          value={item.value ? item.value : ''}
          onChangeText={this.onChangeText}
          label="Block Number *"
          data={this.state.blocksData}
          textColor={theme.headerColor}
          baseColor={theme.detailPlaceholderColor}
          fontSize={18}
          tintColor={theme.centerColor}
          // error={errors.block}
          onSubmitEditing={() => {
            this.focusTheField('floor');
          }}
          onEndEditing={() => {
            this.validateTheField('block');
          }}
          blurOnSubmit={false}
        />
      </View>
    );
  }
  renderBottomButton() {
    const {theme} = this.props;

    return (
      <View
        style={{backgroundColor: 'transparent', height: 55, paddingTop: 150}}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 5,
            backgroundColor: theme.blueColor,
            position: 'absolute',
            bottom: 10,
            width: '90%',
          }}
          title={translate('save')}
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

  onNextButtonTapped = () => {
    //this.callSubmitFields();
    const {item} = this.props.navigation.state.params;

    if (item.childFields !== undefined && item.childFields.length > 0) {
      item.childFields.map(
        function(childItem) {
          if (
            this.currentPageRef[item.name] !== undefined &&
            this.currentPageRef[item.name].state !== undefined
          ) {
            this.state.data = this.currentPageRef[item.name].state.inputDict;
            this.props.draftApplication(
              this.state.data,
              this.state.currentController,
            );
            this.props.navigation.state.params.getAnotherScreenData(
              this.state.data,
            );

            this.props.navigation.goBack();
          }
        }.bind(this),
      );
    } else {
      if (
        this.currentPageRef[item.name] !== undefined &&
        this.currentPageRef[item.name].state !== undefined
      ) {
        this.state.data = this.currentPageRef[item.name].state.inputDict;
        this.props.draftApplication(
          this.state.data,
          this.state.currentController,
        );
        this.props.navigation.state.params.getAnotherScreenData(
          this.state.data,
        );

        this.props.navigation.goBack();
      }
    }

    // this.props.navigation.goBack();
  };

  //MARK :- API CALL

  callSubmitFields() {
    var input = {
      userId: this.props.user.userId,
      token: this.props.user.token,
      formId: '1',
      blockId: this.state.currentFbId,
    };

    if (this.state.applicationModel !== undefined) {
      input.applicationId = this.state.applicationId;
    }

    let allFieldsName = this.state.sequenceOfFields;

    allFieldsName.forEach(
      function(name) {
        if (this.currentFieldsRef[name] !== undefined) {
          let value = this.currentFieldsRef[name].state[name];
          if (value !== undefined) {
            input[name] = value;
          }
        }
      }.bind(this),
    );
    // this.props.submitApplication(input, this.state.blockModel.controller);
  }
}

const AnotherScreenNew = withTheme(AnotherScreen);

AnotherScreenNew.navigationOptions = ({screenProps}) => {
  // const {state, setParams, navigate} = navigation;

  const {theme} = screenProps;
  return {
    // title: translate('my_eApplications'),
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      fontSize: 30,
      color: 'black',
    },

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    // blocks: blockListSelector(state.FormReducer),
    // blockModel: fieldsListSelector(state.FormReducer),
    applicationModel: applicationSubmitSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: null,
    error: errorSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    draftApplication: input => dispatch(draftApplication(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnotherScreenNew);
