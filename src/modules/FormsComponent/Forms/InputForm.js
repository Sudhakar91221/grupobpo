/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, ScrollView, Alert, Keyboard, Image } from 'react-native';
import { BottomButton } from '../../../components/views/Button';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import { ScreenWidth, ScreenHeight } from '../../../components/utility/Settings';
import { translate } from '../../../../App';
import { SingleSelection } from '../Component/SingleSelection';
import { validateField, emailRule } from '../../../components/utility/validation';
import { mobileRule } from '../../../components/utility/validation';
// import type
import { connect } from 'react-redux';
import {
  isLoadingSelector,
  blockListSelector,
  fieldsListSelector,
  apiSelector,
  errorSelector,
  applicationSubmitSelector,
} from '../Actions/selectors';
import { getBlocks, getFields, submitApplication } from '../Actions/FormActions';
import { APPLICATION_SUBMIT } from '../Actions/type';
import { userLoginSelector } from '../../AuthModule/Actions/selectors';
import Divider from '../../../components/views/Divider';
import { ImageComponent } from '../Component/Image/ImageComponent';
import DetailCell from '../Component/DetailCell';
import InputTextField from '../Component/InputTextField';
import { FieldType } from '../Actions/APIIntegers';
import DropDownField from '../Component/DropDownField';

import CollapsibleList from '../Component/CollapsibleList';
import DateTimePickerComponent from '../Component/DateTimePickerComponent';
import TwoDateFields from '../Component/TwoDateFields';
import MultiAnyFields from '../Component/MultiAnyFields';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';

import PhoneInputField from '../Component/Phone/PhoneInputField';

import { styless } from '../../../components/common/Styles';
import { NavigationActions, StackActions } from 'react-navigation';
import SyncStorage from 'sync-storage';
var md5 = require('md5');
import UrlComponent from '../../../components/views/UrlComponent';
import { API_FAILURE } from '../../AuthModule/Actions/type';

import Icons from '../../../components/common/Icons';

// import { SingleSelection } from './SingleSelection';
//Props required
//1.innerPage = for form for which we dont want pager and also dont want bottomButton
//2.isFromCollapsible = for field in which on collapse we want open another page
//3.height = for each field we can pass from outside
//4.  isFromSummaryPage =  editable fields property   (like in preview summary page we dont require this)
//5. hideBottomButton - is is there if any (like in preview summary page we dont reuire this)

class InputForm extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);

    console.log('testing CurrentScreen----------------');
    console.log(props.item);
    // console.log(props.currentFbId);

    let item = {};
    let isFromDetail;
    if (props.item !== undefined) {
      item = props.item;
    } else if (props.navigation.state.params !== undefined) {
      item = props.navigation.state.params.item;
      isFromDetail = props.navigation.state.params.isFromDetail;
    }

    this.state = {
      fcmToken: undefined,
      blocks: undefined,
      item: item,
      blockModel: props.blockModel,
      currentFbId: item.fbId,
      currentController: item.controller,
      currentScreen: item.lable,
      isBlocksFetchedAlready: false,
      submitGray: true,
      submitLoader: false,
      sequenceOfFields: [],
      typeOfFields: [],
      mandatoryFields: [],
      properValueField: {},
      sequenceOfValues: [],
      errors: {},
      newInputDict: undefined,
      currentPage: props.currentPage,
      visiblePage: 1,
      footerData: undefined,
      applicationId:
        props.navigation.state.params !== undefined
          ? props.navigation.state.params.applicationId
          : undefined,
    };
    this.onNextButtonTapped = this.onNextButtonTapped.bind(this);
    this.renderInputFieldsFromJson = this.renderInputFieldsFromJson.bind(this);
    this.renderPagerOrPlainForm = this.renderPagerOrPlainForm.bind(this);
    this.renderNewTextField = this.renderNewTextField.bind(this);
    this.renderAnotherScreen = this.renderAnotherScreen.bind(this);
    this.focusTheField = this.focusTheField.bind(this);
    this.validateTheField = this.validateTheField.bind(this);
    this.currentFieldsRef = {};
    this.currentPageRef = {};
    this.validateSingleField = this.validateSingleField.bind(this);
    this.inputDictTOSubmit = this.inputDictTOSubmit.bind(this);
    this.handleChangeSwitch = this.handleChangeSwitch.bind(this);
    this.onRadioSelection = this.onRadioSelection.bind(this);
    this.updateMainPage = this.updateMainPage.bind(this);
    this.onSaveButtonTapped = this.onSaveButtonTapped.bind(this);
    this.emptiesTheError = this.emptiesTheError.bind(this);
    this.renderBannerImageUploadView = this.renderBannerImageUploadView.bind(
      this,
    );
    this.validateTheField = this.validateTheField.bind(this);


    this.state.applicationId =
      this.state.applicationId === undefined
        ? this.props.applicationId
        : this.state.applicationId;

    this.state.applicationId =
      this.state.applicationId === undefined
        ? this.props.applicationModel !== undefined
          ? this.props.applicationModel.applicationId
          : this.state.applicationId
        : this.state.applicationId;

    // if (this.props.applicationId !== undefined) {
    //   this.state.submitGray = false;
    // }
    // if (
    //   item.fbId == '4' ||
    //   this.props.applicationId !== undefined ||
    //   (this.props.innerPage === true &&
    //     this.props.isSinglePage !== true &&
    //     this.props.apiOnSamePage == false )
    // ) {
    //   this.state.submitGray = false;
    // }
    if (
      this.props.submitButtonEnable === true ||
      this.props.applicationId !== undefined
    ) {
      this.state.submitGray = false;
    }

    // if(this.props.editable === true) {
    //   this.state.submitGray = false;
    // }
    // if(this.state.item.blockID === "4" || this.props.blockModel.fbId === "4") {
    //   this.state.submitGray = false;
    // }

    // global.currentBlock = this.state.currentBlock;
    console.log(this.state.applicationId);
  }

  //MARK: - View Lifecycle

  componentWillMount() { }
  async componentDidMount() {

    if (this.props.saveTheCurrentData == true) {
      this.onSaveForLaterButtonTapped()
      return
    }
    let fcmToken = await SyncStorage.get('fcmToken');
    this.state.fcmToken = fcmToken;

    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );

    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
    this.updatePageDetailsIfNeeded();
  }

  componentWillUnmount() {
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
    }
  }

  keyboardDidHide = () => {
    if (
      Object.keys(this.state.errors).length == 0 &&
      this.checkIfAllMandaotyFieldsHaveProperValues() == true
    ) {
      if (this.props.allFieldsAreNotOk) {
        this.props.allFieldsAreNotOk(false);
      }
      this.setState({ submitGray: false });
    } else {
      if (this.props.allFieldsAreNotOk) {
        this.props.allFieldsAreNotOk(true);
      }
      this.setState({ submitGray: true });
    }
  };

  //DATA setup for forms

  updatePageDetailsIfNeeded() {
    const { item } = this.props;

    if (item.blockModel !== undefined) {
      this.createReferences(item.blockModel);
      // this.gettingTheValues(item.blockModel);
    } else {
      this.createReferences(item);
      // this.gettingTheValues(item);
    }
  }

  createReferences(item) {
    if (item.fields !== undefined) {
      this.createGroupOfFieldNames(item.fields);
    } else {
      if (item.childFields !== undefined) {
        this.createGroupOfFieldNames(item.childFields);
      }
    }
  }

  gettingTheValues(item) {
    const values = item.values !== undefined ? item.values : item.value;
    if (values !== undefined && values.length > 0) {
      values.map(
        function (valueObject) {
          if (
            valueObject !== undefined &&
            valueObject.childFields !== undefined &&
            valueObject.childFields.length > 0
          ) {
            let input = [];

            valueObject.childFields.map(childItem => {
              //[childItem.name] : childItem.value,
              var Obj = { name: childItem.name, value: childItem.value };
              input = [...input, Obj];
            });

            valueObject.value = input;
            // this.setState({[item.name]: input});

            const itemName =
              valueObject.name !== ''
                ? valueObject.name
                : valueObject.controller;

            this.state.sequenceOfValues = [
              ...this.state.sequenceOfValues,
              { [itemName]: input },
            ];

            this.state[itemName] = input;
          } else {
            this.state.sequenceOfValues = [
              ...this.state.sequenceOfValues,
              { [valueObject.name]: valueObject.value },
            ];

            const itemName =
              valueObject.name !== ''
                ? valueObject.name
                : valueObject.controller;

            this.state[itemName] = valueObject.value;
          }
        }.bind(this),
      );
    }
  }
  createGroupOfFieldNames(fieldArray) {
    fieldArray.map(
      function (item) {
        this.state.sequenceOfFields = [
          ...this.state.sequenceOfFields,
          item.name !== '' ? item.name : item.controller,
        ];

        this.state.typeOfFields = [...this.state.typeOfFields, item.type];

        if (item.name !== '' && item.value) {
          this.state.properValueField[item.name] = item.value;
        }

        if (item.rules) {
          if (item.rules.includes('required')) {
            if (item.childFields !== undefined && item.childFields.length > 0) {
              item.childFields.map(
                function (itemChildField) {
                  if (itemChildField.rules.includes('required') == true) {
                    this.state.mandatoryFields = [
                      ...this.state.mandatoryFields,
                      itemChildField.name !== ''
                        ? itemChildField.name
                        : itemChildField.controller,
                    ];
                  }
                }.bind(this),
              );
            } else {
              this.state.mandatoryFields = [
                ...this.state.mandatoryFields,
                item.name !== '' ? item.name : item.controller,
              ];
            }
          }
        }
      }.bind(this),
    );
  }
  //---------------------------------------

  componentDidUpdate(prevProps, prevState) {
    // if (!this.props.error && this.props.api === APPLICATION_DRAFT) {
    //   if (prevProps.applicationModel !== this.props.applicationModel) {
    //     this.state.errors = {};
    //     // this.setState({submitLoader: false});
    //     this.state.submitLoader = false
    //   }
    // }

    if (this.props.error && this.props.api === API_FAILURE) {
      if (this.props.error !== prevProps.error) {
        if (typeof this.props.error.message === 'string') {
          if (this.props.error.message !== '') {
            Alert.alert(this.props.error.message);
          }
        }
      }
    }

    if (this.props.error !== null && this.props.api === APPLICATION_SUBMIT) {
      this.setState({ submitLoader: false });
      // this.state.submitLoader = false;
      this.state.newPageToChange = this.state.currentPage;
      this.state.visiblePage = this.state.currentPage;
    }

    if (!this.props.error && this.props.api === APPLICATION_SUBMIT) {
      // if (this.props.sendDataBack === true) {
      //   // if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
      //   //   this.props.onAnotherScreenSaveButtonTapped();
      //   // }
      // }else
      if (this.props.innerPage !== undefined) {
        this.state.submitLoader = false;
        this.state.errors = {};
        if (this.props.sendDataBack === true) {
          // if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
          //   this.props.onAnotherScreenSaveButtonTapped();
          // }
        }
      } else {
        if (
          this.props.applicationModel !== this.state.applicationModel &&
          this.state.newPageToChange == this.state.currentPage + 1
        ) {
          if (this.props.updatePage !== undefined) {
            this.state.newPageToChange = undefined;

            this.setState({ submitLoader: false, errors: {} }, () => {
              console.log('get called multiple times........................');
              this.state.applicationModel = this.props.applicationModel;
              this.state.applicationId = this.props.applicationModel.applicationId;
              console.log(this.state.applicationId);

              if (this.state.isFromSaveButton == true) {
                let resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'Dashboard' }),
                  ],
                });

                this.props.navigation.dispatch(resetAction);
              } else if (this.props.goBackOnSuccess == true) {
                this.state.errors = {};
                this.props.navigation.goBack();
              } else {
                this.state.errors = {};
                this.props.updatePage();
              }
            });
          } else {
            if (this.props.goBackOnSuccess == true) {
              this.state.errors = {};
              this.props.navigation.goBack();
            }
          }
        } else {
          if (this.props.goBackOnSuccess == true) {
            this.state.errors = {};
            this.props.navigation.goBack();
          }
          if (
            this.props.blockModel.fbId == '5' &&
            this.props.applicationId === undefined
          ) {
            // this.props.navigation.navigate('OTPScreen');
          }
        }
      }
    }

    if (
      this.props.error !== null &&
      this.props.error.request === APPLICATION_SUBMIT
    ) {
      if (this.props.error !== prevProps.error) {
        if (typeof this.props.error.message === 'string') {
          this.setState({ submitLoader: false });
          // Alert.alert(this.props.error.message);
        } else {
          let errorNew = '';
          Object.keys(this.props.error.message).map(
            function (key) {
              errorNew = errorNew + ' ' + this.props.error.message[key];
              this.state.errors[key] = this.props.error.message[key];
              this.state.submitLoader = false;
              //  this.setState({submitLoader: false});
            }.bind(this),
          );
          //
          // Alert.alert(errorNew)
          this.setState({ submitLoader: false, error: this.state.errors });
          // return
        }
      }
    }
  }

  //MARK: - Render Main

  render() {
    const { theme } = this.props;

    const { item } = this.props;

    if (item === undefined) {
      return (
        <ActivityIndicatorCustom
          isSpinner={true}
          style={{ paddingTop: 20, height: 60 }}
        />
      );
    }

    const itemObj = item.blockModel !== undefined ? item.blockModel : item;
    const itemWithFields =
      itemObj.fields !== undefined ? itemObj.fields : itemObj.childFields;
    if (itemWithFields === undefined) {
      return (
        <ActivityIndicatorCustom
          isSpinner={true}
          style={{ paddingTop: 20, height: 60 }}
        />
      );
    }

    return (
      // <BaseClass
      //   title={
      //     this.props.isFromCollapsible !== undefined
      //       ? undefined
      //       : this.state.currentScreen
      //   }>
      //   {this.props.isFromCollapsible === undefined && (
      //     <Text style={[theme.detailMediumGray, {paddingLeft: 0}]}>
      //       {this.state.currentScreen}
      //     </Text>
      //   )}
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ bottom: 0, flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled">
          {this.props.isRequireHeader !== false && this.renderHeader()}
          <View style={{ flex: 1, marginHorizontal: 15 }}>
            {this.renderPagerOrPlainForm()}
          </View>
          {this.props.hideBottomButton !== true &&
            this.props.item.fbId !== '3' && ( //hardcoded condition for collaspible list
              <View style={{ paddingTop: 30, marginHorizontal: 15 }}>
                {this.props.editable !== false && this.renderBottomButton()}
                {this.props.editable !== false &&
                  this.props.saveForLater === true &&
                  this.props.item.fbId !== '1' &&
                  this.renderSaveForBottomButton()}
              </View>
            )}

        </ScrollView>
      </View>
    );
  }

  renderDropDownField(item) {
    // item.value = this.state[item.name];

    const { theme } = this.props;
    let error =
      // this.inputFormRef[item.type + ':' + item.name] && this.inputFormRef[item.type + ':' + item.name][item.name] 
      //     ? this.inputFormRef[item.type + ':' + item.name][item.name].state.error
      //     : undefined;

      this.currentFieldsRef[item.name] !== undefined
        ? this.currentFieldsRef[item.name].state.error
        : undefined;

    if (error == undefined) {
      if (this.state.errors !== undefined) {
        error = this.state.errors[item.name];
      }
    }

    let applicationModelValue = this.props.applicationModel;
    if (this.props.applicationModel !== undefined) {
      applicationModelValue = this.props.applicationModel[item.name];
    }

    let itemValue = item.value !== '' ? item.value : applicationModelValue;

    //  if(itemValue == undefined) {
    //   itemValue = this.state.newInputDict !== undefined ? this.state.newInputDict[item.name] : ''
    //  }
    //  if(itemValue == undefined) {
    //   itemValue = this.state.inputDict !== undefined ? this.state.inputDict[item.name] : ''
    //  }

    return (
      <View style={{ flexDirection: 'row' }}>
        <DropDownField
          onRef={ref => {
            this.currentFieldsRef[item.name] = ref;
          }}
          values={itemValue}
          error={error}
          focus={this.focus}
          focusTheField={this.focusTheField}
          validateTheField={this.validateTheField}
          item={item}
          editable={this.props.editable}
        />
      </View>
    );
  }

  renderHeader() {
    switch (this.state.currentScreen) {
      case 'Basic Information':
        this.state.hintText = 'Please fill all necessary input fields';
        break;
      case 'Other Information':
        this.state.hintText = 'Please fill all necessary input fields';
        break;
      case 'Business Activity':
        this.state.hintText =
          'Tap on + to add a Business Activity if necessary';
        break;
      case 'Requirements':
        this.state.hintText =
          'Please upload all of the following requirements for this permit';
        break;

      case 'Advertisement Details':
        this.state.hintText = 'Fill up all the details of your add';
        break;

      case 'Ad Description':
        this.state.hintText = 'Fill up all the details of your add';
        break;

      case 'Register Account':
        this.state.hintText = 'View and Edit your basic profile information';
        this.state.currentScreen = 'My Profile';
        break;
    }
    return (
      <View>
        <View style={[styless.nextToEach, { marginHorizontal: 10 }]}>
          {this.props.isHeaderWithNumber === true && this.renderHeaderNumber()}
          <View>
            {/* {this.props.isRequireHeader === undefined && ( */}
            <Text
              numberOfLines={1}
              style={{
                fontWeight: 'bold',
                fontSize: 30,
                paddingLeft: 10,
                paddingRight: 20,
              }}>
              {this.state.currentScreen}
            </Text>
            {/* )}
      {this.props.isRequireHeader === undefined && ( */}
            <Text style={{ paddingLeft: 10 }}>{this.state.hintText}</Text>
            {/* )} */}
          </View>
        </View>
      </View>
    );
  }
  renderHeaderNumber() {
    const { theme, item } = this.props;

    return (
      <View
        style={{
          backgroundColor: theme.primaryColor,
          borderRadius: 40,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          width: 50,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            alignSelf: 'center',
            color: theme.backgroundColor,
            fontWeight: 'bold',
            fontSize: 28,
          }}>
          {this.props.headerNumber}
        </Text>
      </View>
    );
  }

  //MARK: - Event Handler

  onSaveForLaterButtonTapped = () => {
    this.state.submitLoader = true;

    this.removeServerError();
    if (this.state.errors !== undefined) {
      delete this.state.errors.mobile;
    }

    this.setState({ submitLoader: true }, () => {
      const validationResult = this.validateAllDetails();
      if (validationResult.result == false) {
        this.setState({ errors: validationResult.errors, submitLoader: false });
      } else {
        if (
          Object.keys(this.state.properValueField).length == 0 &&
          Object.keys(this.state.newInputDict ? this.state.newInputDict : {})
            .length == 0
        ) {
          let resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
          });
          this.props.navigation.dispatch(resetAction);
        } else {
          this.setState({ errors: {} }, () => {
            this.callSubmitFieldsNew();
          });
          this.state.errors = {};
        }
      }
    });
  };
  validationMethod() {
    this.state.submitLoader = true;
    this.state.saveForLater = false;

    this.removeServerError();
    if (this.state.errors !== undefined) {
      delete this.state.errors.mobile;
    }

    this.setState({ submitLoader: true }, () => {
      const validationResult = this.validateAllDetails();
      if (validationResult.result == false) {
        this.setState({ errors: validationResult.errors, submitLoader: false });
      } else {
        this.setState({ errors: {} }, () => {
          // this.callSubmitFieldsNew();
          // this.props.submitButtonTapped()
        });
        this.state.errors = {};
      }
    });
  }

  onNextButtonTapped = () => {
    //TODO:-
    this.state.submitLoader = true;
    this.state.saveForLater = false;

    this.removeServerError();
    if (this.state.errors !== undefined) {
      delete this.state.errors.mobile;
    }

    this.setState({ submitLoader: true }, () => {
      const validationResult = this.validateAllDetails();
      if (validationResult.result == false) {
        this.setState({ errors: validationResult.errors, submitLoader: false });
      } else {
        this.setState({ errors: {} }, () => {
          // this.callSubmitFieldsNew();
          this.props.submitButtonTapped()
        });
        this.state.errors = {};
      }
    });
  };

  showAnotherScreenDetail = item => {
    this.props.navigation.navigate('AnotherScreen', {
      item: item,
      applicationId: this.state.applicationId,
      getAnotherScreenData: this.getAnotherScreenData.bind(this),
      submitButtonEnable: this.props.submitButtonEnable,
    });
  };
  onAnotherScreenSaveButtonTapped = () => {
    if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
      this.props.onAnotherScreenSaveButtonTapped();
    }
  };
  inputDictTOSubmit = input => {
    // Object.keys(this.state.newInputDict).map(

    //   function(inputKey) {
    //     this.state.properValueField[inputKey] = this.state.newInputDict[inputKey]
    //     this.keyboardDidHide()
    //   }.bind(this),

    // )

    this.setState({ inputDict: input }, () => {
      if (
        Object.keys(this.state.errors).length == 0 &&
        this.checkIfAllMandaotyFieldsHaveProperValues() == true
      ) {
        if (this.props.allFieldsAreNotOk) {
          this.props.allFieldsAreNotOk(false);
        }
        this.setState({ submitGray: false });
      } else {
        if (this.props.allFieldsAreNotOk) {
          this.props.allFieldsAreNotOk(true);
        }
        this.setState({ submitGray: true });
      }

      if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
        this.props.onAnotherScreenSaveButtonTapped();
      } else if (this.props.goBackOnSuccess === true) {
        this.props.navigation.state.params.getAnotherScreenData(input);
        this.props.navigation.goBack();
        // this.state.newInputDict = {...this.state.newInputDict, ...input }
      }
    });
  };

  handleChangeSwitch = (name, value) => {
    // const input = {};
    // input[name] = value;
    // if (this.state.newInputDict !== undefined) {
    //   this.state.newInputDict = {...this.state.newInputDict, ...input};
    // } else {
    //   this.state.newInputDict = input;
    // }
  };
  onRadioSelection = (name, value, label) => {
    const input = {};
    input[name] = value;
    // input[name + '#'] = label
    if (this.state.newInputDict !== undefined) {
      this.state.newInputDict = { ...this.state.newInputDict, ...input };
    } else {
      this.state.newInputDict = input;
    }

    this.state.footerData = label;
  };

  getAnotherScreenData(data, footerData) {
    if (this.state.newInputDict !== undefined) {
      this.state.newInputDict = { ...this.state.newInputDict, ...data };
    } else {
      this.state.newInputDict = data;
    }

    Object.keys(this.state.newInputDict).map(
      function (inputKey) {
        this.state.properValueField[inputKey] = this.state.newInputDict[
          inputKey
        ];
        this.keyboardDidHide();
      }.bind(this),
    );

    this.removeServerError();
    // this.setState({footerData:footerData})

    // this.currentPageRef.businessType.props.selectedValue
  }

  removeServerError() {
    if (this.state.errors === undefined) {
      return;
    }

    Object.keys(this.state.errors).map(
      function (errorKey) {
        if (this.state.newInputDict !== undefined) {
          Object.keys(this.state.newInputDict).map(
            function (inputKey) {
              if (errorKey == inputKey) {
                delete this.state.errors[errorKey];
              }
            }.bind(this),
          );
        }
      }.bind(this),
    );

    Object.keys(this.state.errors).map(
      function (errorKey) {
        if (this.state.mandatoryFields.includes(errorKey) == false) {
          delete this.state.errors[errorKey];
        }
      }.bind(this),
    );
  }

  uploadedImages = (images, toUplaod) => {
    console.log('after image uploading');

    if (images[1].fileName !== undefined) {
      let input = {};
      input[toUplaod] = images[1].fileName;

      if (this.state.newInputDict !== undefined) {
        this.state.newInputDict = { ...this.state.newInputDict, ...input };
      } else {
        this.state.newInputDict = input;
      }
    }
  };

  //MARK: - Render UI

  //this is from collapsible list like business acitvity save button tapped
  updateMainPage = input => {
    if (input.saveForLater === true) {
      this.state.errors = {};
      this.state.newPageToChange = this.state.currentPage + 1;
      this.state.isFromSaveButton = true;
      this.props.submitApplication(input.input, input.controller);
    } else {
      this.state.errors = {};
      this.state.newPageToChange = this.state.currentPage + 1;
      this.props.submitApplication(input.input, input.controller);
    }
  };

  renderPagerOrPlainForm() {
    const { item } = this.props;
    const itemObj = item.blockModel !== undefined ? item.blockModel : item;
    const itemWithFields =
      itemObj.fields !== undefined ? itemObj.fields : itemObj.childFields;
    if (itemWithFields !== undefined) {
      return this.renderInputFieldsFromJson(itemWithFields);
    }
  }

  renderInputFieldsFromJson(fildsArray) {
    let inputs = [];
    const { theme } = this.props;

    fildsArray.map(
      function (item) {
        // let itemName = item.name !== '' ? item.name : item.controller;
        // item.value = this.state[itemName];

        switch (parseInt(item.type)) {


          case FieldType.EMPTYROW:
            inputs.push(
              <View
                style={{ backgroundColor: theme.backgroundColor, height: 50 }}>
                <Divider borderColor="gray" />
              </View>,
            );
            break;

          case FieldType.DROPDOWN:
            inputs.push(
              <View style={{ backgroundColor: theme.backgroundColor }}>
                {this.renderDropDownField(item)}
              </View>,
            );
            break;

          case FieldType.MOBILE_INFO:
            inputs.push(
              <View style={{ backgroundColor: theme.backgroundColor }}>
                {this.renderPhoneTextField(item)}
                {/* <Divider borderColor="gray"  /> */}
              </View>,
            );
            break;

          // case FieldType.DROPDOWN:
          //     inputs.push(
          //       <View style={{backgroundColor: 'blue'}}>
          //         {this.renderDropdonwField(item)}
          //         {/* <Divider borderColor="gray"  /> */}
          //       </View>,
          //     );
          //     break;

          case FieldType.TEXT:
          case FieldType.NUMBER:
          case FieldType.PASSWORD:
          case FieldType.EMAIL:
            if (
              item.type == FieldType.PASSWORD &&
              this.state.applicationId !== undefined
            ) {
            } else {
              inputs.push(
                <View style={{ backgroundColor: theme.backgroundColor }}>
                  {this.renderNewTextField(item)}
                  {/* <Divider borderColor="gray"  /> */}
                </View>,
              );
            }
            break;

          case FieldType.RADIO:
            let selectedValue;

            if (this.state.newInputDict) {
              selectedValue =
                item.childFields !== undefined
                  ? this.state.newInputDict[item.childFields[0].name]
                  : undefined;

              if (item.childFields === undefined) {
                selectedValue = this.state.newInputDict[item.name];
              }
            }

            let applicationModelValue = this.props.applicationModel;
            if (this.props.applicationModel !== undefined) {
              applicationModelValue = this.props.applicationModel[item.name];
            }

            let itemValue =
              applicationModelValue !== undefined
                ? applicationModelValue
                : item.value != ''
                  ? item.value
                  : undefined;

            // if(itemValue === undefined && item.option !== undefined) {
            //   itemValue = CURRENCY +  ' ' + item.option[0].price
            // }
            inputs.push(
              <View style={{ backgroundColor: theme.backgroundColor }}>
                <SingleSelection
                  item={item}
                  selectedValue={itemValue}
                  theme={this.props.theme}
                  onRef={ref => {
                    this.currentPageRef[
                      item.name !== '' ? item.name : item.controller
                    ] = ref;
                  }}
                  onRadioSelection={this.onRadioSelection}
                  onAnotherScreenSaveButtonTapped={this.onNextButtonTapped}
                />
              </View>,
            );
            break;

          case FieldType.COLLAPSIBLE:
            inputs.push(
              <View style={{ backgroundColor: theme.backgroundColor }}>
                <CollapsibleList
                  editable={this.props.editable}
                  item={item}
                  isRequireHeader={false}
                  theme={this.props.theme}
                  onRef={ref => {
                    this.currentPageRef[item.name == "" ? item.controller : item.name] = ref;
                  }}
                  navigation={this.props.navigation}
                  applicationId={this.state.applicationId}
                  updateMainPage={this.updateMainPage}
                  newPageToChange={this.state.newPageToChange}
                  currentPage={this.state.currentPage}
                  saveForLater={
                    this.props.saveForLater !== undefined
                      ? this.props.saveForLater
                      : true
                  }
                />
              </View>,
            );
            break;

          case FieldType.SWITCH:

          case FieldType.CHECKBOX:
          case FieldType.CHILDFIELDS:
            //  let itemName = item.name !== "" ? item.name : item.controller
            //  item.value = this.state[itemName];
            //  item.value = this.state.sequenceOfValues[itemName]
            let newselectedValue;
            let applicationModelValueDetail = this.props.applicationModel;
            let finalSelectedValue = '';

            if (item.childFields !== undefined && item.childFields.length > 0) {
              item.childFields.map(
                function (itemChildField) {
                  let inputDictValue = this.state.newInputDict
                    ? this.state.newInputDict[
                    itemChildField.name !== ''
                      ? itemChildField.name
                      : itemChildField.controller
                    ]
                    : '';
                  if (this.state.newInputDict && inputDictValue !== undefined) {
                    applicationModelValueDetail = inputDictValue;
                    finalSelectedValue = applicationModelValueDetail;
                  } else if (this.props.applicationModel !== undefined) {
                    applicationModelValueDetail = this.props.applicationModel[
                      itemChildField.name
                    ];
                    if (itemChildField.name == 'subscriptionType') {
                      applicationModelValueDetail = itemChildField.option.findIndex(
                        obj =>
                          obj.subId === applicationModelValueDetail
                            ? applicationModelValueDetail
                            : itemChildField.option[0].subId,
                      );
                    }

                    finalSelectedValue =
                      itemChildField.value !== ''
                        ? itemChildField.value
                        : applicationModelValueDetail !== undefined
                          ? applicationModelValueDetail
                          : '';
                  }
                  newselectedValue =
                    (newselectedValue ? newselectedValue : '') +
                    ' ' +
                    finalSelectedValue;
                }.bind(this),
              );
            } else {
              if (this.props.applicationModel !== undefined) {
                applicationModelValueDetail = this.props.applicationModel[
                  item.name
                ];

                newselectedValue =
                  item.value !== '' ? item.value : applicationModelValueDetail;
              } else {
                if (this.state.newInputDict) {
                  if (
                    item.childFields !== undefined &&
                    item.childFields.length > 0
                  ) {
                    item.childFields.map(
                      function (itemChildField) {
                        newselectedValue =
                          (newselectedValue !== undefined
                            ? newselectedValue
                            : '') +
                          ' ' +
                          (this.state.newInputDict[itemChildField.name] !==
                            undefined
                            ? this.state.newInputDict[itemChildField.name]
                            : undefined);
                      }.bind(this),
                    );
                  }
                }
              }

              // newselectedValue =
              //   this.state.newInputDict[item.childFields[0].name] !== undefined
              //     ? this.state.newInputDict[item.childFields[0].name]
              //     : undefined;
            }
            let error;
            if (error === undefined) {
              if (
                this.state.errors !== undefined ||
                Object.keys(this.state.errors).length !== 0
              ) {
                if (
                  item.childFields !== undefined &&
                  item.childFields.length > 0
                ) {
                  item.childFields.map(
                    function (itemChildField) {
                      if (newselectedValue !== undefined) {
                        delete this.state.errors[itemChildField.name];
                      } else {
                        error = this.state.errors[itemChildField.name];
                      }
                    }.bind(this),
                  );
                } else {
                  if (newselectedValue !== undefined) {
                    delete this.state.errors[item.controller];
                  } else {
                    error = this.state.errors[item.controller];
                  }
                }
              }
            }

            if (newselectedValue === undefined) {
              newselectedValue = ' ';
            }

            inputs.push(
              <View style={{ backgroundColor: theme.backgroundColor }}>
                <DetailCell
                  error={error}
                  item={item}
                  selectedValue={
                    item.childFields[0] ? (item.childFields[0].option !== ''
                      ? item.childFields[0].option[
                      parseInt(newselectedValue.toString().trim())
                      ]
                      : newselectedValue.toString().trim()) : ''
                  }
                  navigation={this.props.navigation}
                  onRef={ref => {
                    this.currentPageRef[
                      item.name !== '' ? item.name : item.controller
                    ] = ref;
                  }}
                  showDetail={this.showAnotherScreenDetail}
                  editable={this.props.editable}
                />
                <Divider borderColor="gray" />
              </View>,
            );
            break;

          case FieldType.FILE:
            inputs.push(
              <View style={{ backgroundColor: theme.backgroundColor }}>
                {item.name !== 'profilePhoto' && (
                  <Text style={theme.H3}>{item.lable}</Text>
                )}
                {this.renderImageUploadView(item)}
                <Divider borderColor="gray" />
              </View>,
            );
            break;

          case FieldType.LOGO_IMAGE:
            inputs.push(
              <View style={{ backgroundColor: theme.backgroundColor }}>
                {this.renderLogoImageView(item)}
                <Divider borderColor="gray" />
              </View>,
            );
            break;

          case FieldType.BANNER_IMAGE:
            inputs.push(
              <View style={{ backgroundColor: theme.backgroundColor }}>
                {/* {item.name !== 'profilePhoto' && (
                  <Text style={theme.H3}>{item.lable}</Text>
                )} */}
                {this.renderBannerImageUploadView(item)}
                <Divider borderColor="gray" />
              </View>,
            );
            break;


          case FieldType.TWO_FIELDS:
            {
              let error =
                this.currentFieldsRef[item.name] !== undefined
                  ? this.currentFieldsRef[item.name].state.error
                  : undefined;

              if (error == undefined) {
                if (this.state.errors !== undefined) {
                  error = this.state.errors[item.name];
                }
              }

              let applicationModelValue = this.props.applicationModel;
              if (this.props.applicationModel !== undefined) {
                applicationModelValue = this.props.applicationModel[item.name];
              }

              let itemValue =
                applicationModelValue !== undefined
                  ? applicationModelValue
                  : item.value;

              inputs.push(
                <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
                  <TwoDateFields
                    mode={item.mode}
                    item={item}
                    fromDate={item.childFields[0].value}
                    toDate={item.childFields[1].value}
                    value={itemValue}
                    theme={this.props.theme}
                    onRef={ref => (this.currentFieldsRef[item.name] = ref)}
                  />
                </View>,
              );
            }
            break;

          case FieldType.MULTI_ANY_FIELDS:
            {
              let error =
                this.currentFieldsRef[item.name] !== undefined
                  ? this.currentFieldsRef[item.name].state.error
                  : undefined;

              if (error == undefined) {
                if (this.state.errors !== undefined) {
                  error = this.state.errors[item.name];
                }
              }

              let applicationModelValue = this.props.applicationModel;
              if (this.props.applicationModel !== undefined) {
                applicationModelValue = this.props.applicationModel[item.name];
              }

              let itemValue =
                applicationModelValue !== undefined
                  ? applicationModelValue
                  : item.value;

              inputs.push(
                <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
                  <MultiAnyFields
                    mode={item.mode}
                    item={item}
                    value={itemValue}
                    theme={this.props.theme}
                    onRef={ref => (this.currentFieldsRef[item.name] = ref)}
                    validateTheField={this.validateTheField}
                    focusTheField={this.focusTheField}
                    focus={this.focus}

                  />
                </View>,
              );
            }
            break;
          case FieldType.DATE:
            {
              let error =
                this.currentFieldsRef[item.name] !== undefined
                  ? this.currentFieldsRef[item.name].state.error
                  : undefined;

              if (error == undefined) {
                if (this.state.errors !== undefined) {
                  error = this.state.errors[item.name];
                }
              }

              let applicationModelValue = this.props.applicationModel;
              if (this.props.applicationModel !== undefined) {
                applicationModelValue = this.props.applicationModel[item.name];
              }

              let itemValue =
                applicationModelValue !== undefined
                  ? applicationModelValue
                  : item.value;

              inputs.push(
                <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
                  <DateTimePickerComponent
                    mode={'date'}
                    item={item}
                    value={itemValue}
                    theme={this.props.theme}
                    onRef={ref => (this.currentFieldsRef[item.name] = ref)}
                  />
                </View>,
              );
            }
            break;

          case FieldType.TIME:
            {
              let error =
                this.currentFieldsRef[item.name] !== undefined
                  ? this.currentFieldsRef[item.name].state.error
                  : undefined;

              if (error == undefined) {
                if (this.state.errors !== undefined) {
                  error = this.state.errors[item.name];
                }
              }

              let applicationModelValue = this.props.applicationModel;
              if (this.props.applicationModel !== undefined) {
                applicationModelValue = this.props.applicationModel[item.name];
              }

              let itemValue =
                applicationModelValue !== undefined
                  ? applicationModelValue
                  : item.value;

              inputs.push(
                <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
                  <DateTimePickerComponent
                    mode={'time'}
                    item={item}
                    value={itemValue}
                    theme={this.props.theme}
                    onRef={ref => (this.currentFieldsRef[item.name] = ref)}
                  />
                </View>,
              );
            }
            break;

          case FieldType.URL:
            {
              let error =
                this.currentFieldsRef[item.name] !== undefined
                  ? this.currentFieldsRef[item.name].state.error
                  : undefined;

              if (error == undefined) {
                if (this.state.errors !== undefined) {
                  error = this.state.errors[item.name];
                }
              }

              let applicationModelValue = this.props.applicationModel;
              if (this.props.applicationModel !== undefined) {
                applicationModelValue = this.props.applicationModel[item.name];
              }

              let itemValue =
                item.value !== '' ? item.value : applicationModelValue;

              inputs.push(
                <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
                  <UrlComponent
                    item={item}
                    onRef={ref => (this.currentFieldsRef[item.name] = ref)}
                    value={itemValue}
                    error={error}
                  />
                </View>,
              );
            }
            break;

          // case FieldType.CHILDFIELDS:
          //   return (
          //     <View style={styless.container}>
          //       <InputForm
          //         item={item}
          //         navigation={this.props.navigation}
          //         innerPage={true}
          //       />
          //     </View>
          //   );
        }
      }.bind(this),
    );

    return inputs;
  }

  renderLogoImageView(item) {
    let module = 'user';
    let imageId =
      this.props.user !== undefined ? this.props.user.userId : undefined;

    // let moduleName = this.props.item.controller.toLowerCase();
    // if (moduleName.includes('advertise') == true) {
    //   module = 'advertise';
    //   imageId = undefined;
    // }

    let cacheImage;
    //this.state.submitGray = false;
    if (item.fbId == '4') {
      this.state.submitGray = false;
    }
    let itemValue = item.value;
    let applicationModelValue;

    if (itemValue == '') {
      if (this.props.applicationModel !== undefined) {
        applicationModelValue = this.props.applicationModel[item.name];
        cacheImage = true;
      }
      itemValue =
        applicationModelValue !== undefined ? applicationModelValue : '';
    }

    let error;
    if (error == undefined) {
      if (this.state.errors !== undefined) {
        // error = this.state.errors[item.name];
      }
    }
    // error = "issue"

    if (itemValue !== '' && itemValue !== 'undefined') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.9,
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginTop: 20,
            }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.lable}</Text>
            <Text style={{ fontSize: 16, color: 'lightgray' }}>
              Please fill all input fields
            </Text>
          </View>

          <View style={{ padding: 5 }}>
            {error ? (
              <Icons.MaterialIcons
                style={{
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                  flex: 0.1,
                }}
                name="error"
                size={30}
                color="red"
                backgroundColor="white"
              />
            ) : null}
            {/* <ImageComponent
              theme={this.props.theme}
              name={item.name}
              value={itemValue}
              id={imageId}
              item={item}
              module={module}
              type='profile'
              height={ScreenHeight * 0.12}
              width={ScreenHeight * 0.12}
              onRef={ref => {
                this.currentFieldsRef[item.name] = ref;
              }}
              navigation={this.props.navigation}
              cacheImage={cacheImage}
              isCircular={true}
              borderRadius={(ScreenHeight * 0.12) / 2.0}
              uploader="Editable"
              uploadedImages={this.uploadedImages}
              props={this.props}
              url={'banner'}
              imageOnly={true}
            /> */}
            <ImageComponent
              name={item.name}
              type='profile'
              imageOnly={true}
              value={itemValue}
              id={imageId}
              item={item}
              module={module}
              isCircular={true}
              isRectangular={false}
              isUserImage={true}
              type={'profile'}
              url={'ic_profile'}
              height={ScreenHeight * 0.30}
              width={ScreenHeight * 0.30}
              uploader="Editable"
              uploadedImages={this.uploadedImages}
              props={this.props}
              onRef={ref => {
                this.currentFieldsRef[item.name] = ref;
              }}
              navigation={this.props.navigation}
              theme={this.props.theme}
              borderRadius={10}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            flex: 0.9,
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginTop: 20,
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.lable}</Text>
          <Text style={{ fontSize: 16, color: 'lightgray' }}>
            Please fill all input fields
          </Text>
        </View>

        <View style={{ padding: 5 }}>
          {error ? (
            <Icons.MaterialIcons
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                flex: 0.1,
              }}
              name="error"
              size={30}
              color="red"
              backgroundColor="white"
            />
          ) : null}
          <ImageComponent
            name={item.name}
            type={'profile'}
            url={'banner'}
            height={ScreenHeight * 0.12}
            width={ScreenHeight * 0.12}
            uploader="Single"
            uploadedImages={this.uploadedImages}
            props={this.props}
            onRef={ref => {
              this.currentFieldsRef[item.name] = ref;
            }}
            navigation={this.props.navigation}
            theme={this.props.theme}
            isCircular={true}
            borderRadius={(ScreenHeight * 0.12) / 2.0}
            // imageOnly={item.name === 'profilePhoto' ? true : false}
            imageOnly={true}
          />
        </View>
      </View>
    );
  }

  renderImageUploadView(item) {
    let cacheImage;
    if (item.blockID == '4') {
      this.state.submitGray = false;
    }

    let itemValue = item.value;
    let applicationModelValue;

    if (itemValue == '') {
      if (this.props.applicationModel !== undefined) {
        applicationModelValue = this.props.applicationModel[item.name];
        cacheImage = true;
      }
      itemValue =
        applicationModelValue !== undefined ? applicationModelValue : '';
    }
    let error;
    if (error == undefined) {
      if (this.state.errors !== undefined) {
        error = this.state.errors[item.name];
      }
    }

    if (itemValue !== '' && itemValue !== 'undefined') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ padding: 5 }}>
            {error ? (
              <Icons.MaterialIcons
                style={{
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                  flex: 0.1,
                }}
                name="error"
                size={30}
                color="red"
                backgroundColor="white"
              />
            ) : null}
            <ImageComponent
              // name={itemValue}
              id={this.props.user.userId}
              type={item.name !== 'profilePhoto' ? 'document' : 'profile'}
              height={ScreenHeight * 0.15}
              width={
                item.name == 'profilePhoto'
                  ? ScreenHeight * 0.15
                  : ScreenWidth - 40
              }
              onRef={ref => {
                this.currentFieldsRef[item.name] = ref;
              }}
              navigation={this.props.navigation}
              cacheImage={cacheImage}
              theme={this.props.theme}
              isCircular={false}
              name={item.name}
              value={itemValue}
              uploader={this.props.editable === true ? 'Editable' : undefined}
              uploadedImages={this.uploadedImages}
              props={this.props}
              url={'banner'}
              borderRadius={10}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ padding: 5 }}>
          {error ? (
            <Icons.MaterialIcons
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                flex: 0.1,
              }}
              name="error"
              size={30}
              color="red"
              backgroundColor="white"
            />
          ) : null}
          <ImageComponent
            name={item.name}
            type={item.name !== 'profilePhoto' ? 'document' : 'profile'}
            url={item.name !== 'profilePhoto' ? 'upload' : null}
            height={ScreenHeight * 0.15}
            width={
              item.name == 'profilePhoto'
                ? ScreenHeight * 0.15
                : ScreenWidth - 40
            }
            uploader="Single"
            uploadedImages={this.uploadedImages}
            props={this.props}
            onRef={ref => {
              this.currentFieldsRef[item.name] = ref;
            }}
            navigation={this.props.navigation}
            theme={this.props.theme}
            isCircular={false}
            borderRadius={10}
          />
        </View>
      </View>
    );
  }

  renderBannerImageUploadView(item) {
    let module = 'user';
    let imageId =
      this.props.user !== undefined ? this.props.user.userId : undefined;

    // let moduleName = this.props.item.controller.toLowerCase();
    // if (moduleName.includes('advertise') == true) {
    //   module = 'advertise';
    //   imageId = undefined;
    // }
    if (item.fbId == '4') {
      this.state.submitGray = false;
    }

    let cacheImage;

    let itemValue = item.value;
    let applicationModelValue;

    if (itemValue == '') {
      if (this.props.applicationModel !== undefined) {
        applicationModelValue = this.props.applicationModel[item.name];
        cacheImage = true;
      }
      itemValue =
        applicationModelValue !== undefined ? applicationModelValue : '';
    }

    let error;
    if (error == undefined) {
      if (this.state.errors !== undefined) {
        error = this.state.errors[item.name];
      }
    }
    if (itemValue !== '' && itemValue !== 'undefined') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ padding: 5 }}>
            {error ? (
              <Icons.MaterialIcons
                style={{
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                  flex: 0.1,
                }}
                name="error"
                size={30}
                color="red"
                backgroundColor="white"
              />
            ) : null}
            <ImageComponent
              // name={itemValue}
              id={imageId}
              // module={module}
              type={'document'}
              height={ScreenHeight * 0.35}
              width={ScreenWidth - 40}
              onRef={ref => {
                this.currentFieldsRef[item.name] = ref;
              }}
              navigation={this.props.navigation}
              cacheImage={cacheImage}
              theme={this.props.theme}
              isCircular={false}
              name={item.name}
              value={itemValue}
              uploader={this.props.editable === true ? 'Editable' : undefined}
              uploadedImages={this.uploadedImages}
              props={this.props}
              url={'banner'}
              borderRadius={10}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ padding: 5 }}>
          {error ? (
            <Icons.MaterialIcons
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                flex: 0.1,
              }}
              name="error"
              size={30}
              color="red"
              backgroundColor="white"
            />
          ) : null}
          <ImageComponent
            name={item.name}
            //type={'document'}
            url={'banner'}
            height={ScreenHeight * 0.35}
            width={ScreenWidth - 40}
            uploader="Single"
            uploadedImages={this.uploadedImages}
            props={this.props}
            onRef={ref => {
              this.currentFieldsRef[item.name] = ref;
            }}
            navigation={this.props.navigation}
            addImageLabel={translate('banner_upload_hint')}
            theme={this.props.theme}
            isCircular={false}
            isBannerImage={true}
            borderRadius={10}
          />
        </View>
      </View>
    );
  }

  renderNewTextField(item) {
    // item.value = this.state[item.name];

    const { theme } = this.props;
    let error =
      this.currentFieldsRef[item.name] !== undefined
        ? this.currentFieldsRef[item.name].state.error
        : undefined;

    if (error == undefined) {
      if (this.state.errors !== undefined) {
        error = this.state.errors[item.name];
      }
    }

    let applicationModelValue = this.props.applicationModel;
    if (this.props.applicationModel !== undefined) {
      applicationModelValue = this.props.applicationModel[item.name];
    }

    let itemValue = item.value !== '' ? item.value : applicationModelValue;

    //  if(itemValue == undefined) {
    //   itemValue = this.state.newInputDict !== undefined ? this.state.newInputDict[item.name] : ''
    //  }
    //  if(itemValue == undefined) {
    //   itemValue = this.state.inputDict !== undefined ? this.state.inputDict[item.name] : ''
    //  }

    return (
      <View style={{ flexDirection: 'row' }}>
        {this.props.isLoginField === true ? (
          <View style={{ position: 'absolute', height: 60, top: 43, width: 30 }}>
            <Image
              source={{ uri: item.name === 'email' ? 'user' : 'lock' }}
              // size={20}
              color={'cornflowerblue'}
              style={{
                height: 22,
                width: item.name === 'email' ? 22 : 17,
                bottom: 10,
              }}
            />
            <View
              style={[
                {
                  width: 30,
                  height: 2.0,
                  backgroundColor: theme.detailPlaceholderColor,
                },
              ]}>
              <Text style={{ color: theme.backgroundColor }}>.</Text>
            </View>
          </View>
        ) : null}

        <View
          style={{
            marginLeft: this.props.isLoginField === true ? 25 : 0,
            flex: 1,
          }}>
          <InputTextField
            onRef={ref => {
              this.currentFieldsRef[item.name] = ref;
            }}
            values={itemValue}
            error={error}
            focus={this.focus}
            focusTheField={this.focusTheField}
            validateTheField={this.validateTheField}
            item={item}
            editable={this.props.editable}
          />
        </View>
      </View>
    );
  }

  renderPhoneTextField(item) {
    // item.value = this.state[item.name];

    let error =
      this.currentFieldsRef[item.controller] !== undefined
        ? this.currentFieldsRef[item.controller].state.error
        : undefined;

    if (error == undefined) {
      if (this.state.errors !== undefined) {
        error = this.state.errors.mobile;
      }
    }

    let value = {};

    // let applicationModelValue = this.props.applicationModel;
    // if (this.props.applicationModel !== undefined) {
    //   value = this.props.applicationModel[item.name];
    // }

    item.childFields.map(childItem => {
      value[childItem.name] = childItem.value;
    });

    if (value == '' || value == undefined) {
      value = item.value;
    }

    if (this.state.applicationId == undefined) {
      value = undefined;
    }

    return (
      <PhoneInputField
        onRef={ref => {
          this.currentFieldsRef.mobile = ref;
        }}
        values={value}
        error={error}
        focus={this.focus}
        focusTheField={this.focusTheField}
        validateTheField={this.validateTheField}
        item={item}
        navigation={this.props.navigation}
        editable={this.props.editable}
        emptiesTheError={this.emptiesTheError}
      />
    );
  }

  emptiesTheError = name => e => {
    delete this.state.errors[name];

    this.validateTheField(name, FieldType.MOBILE_INFO);
    // this.setState({errors: {...this.state.errors}});
    // if (
    //   Object.keys(this.state.errors).length == 0 &&
    //   this.checkIfAllMandaotyFieldsHaveProperValues() == true
    // ) {
    //   this.setState({submitGray: false,errors:this.state.errors});
    // } else {
    //   this.setState({submitGray: true,errors:this.state.errors});
    // }
  };

  renderAnotherScreen = item => () => {
    this.props.navigation.navigate('AnotherScreen', { item: item });
  };

  renderBottomButton() {
    const { theme } = this.props;

    return (
      <View style={{ backgroundColor: theme.backgroundColor, height: 55 }}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 5,
            backgroundColor: theme.blueColor,
            position: 'absolute',
            bottom: 10,
            width: '100%',
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

  renderSaveForBottomButton() {
    const { theme } = this.props;

    return (
      <View style={{ backgroundColor: theme.backgroundColor, height: 55 }}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 5,
            // color: theme.blueColor,
            position: 'absolute',
            bottom: 10,
            width: '100%',
            backgroundColor: theme.backgroundColor,
          }}
          textColor={theme.primaryColor}
          title={translate('save_for_later')}
          action={this.onSaveButtonTapped}
          activeState={true}
          backgroundColor={theme.backgroundColor}
        // isLoader={this.state.submitLoader}
        // isGray={this.state.submitGray}
        />
      </View>
    );
  }

  onSaveButtonTapped = () => {
    this.setState({ isFromSaveButton: true }, () => {
      this.onSaveForLaterButtonTapped();
    });
  };

  //MARK: - API CALL

  callSubmitFieldsNew() {
    var input = {};

    const dicLength = Object.keys(input).length;

    if (this.state.applicationId !== undefined) {
      input.applicationId = this.state.applicationId;
    } else if (this.props.applicationModel !== undefined) {
      let id =
        this.props.applicationModel.applicationId !== undefined
          ? this.props.applicationModel.applicationId
          : '';
      if (id !== '') {
        input.applicationId = id;
      }
    }

    if (this.state.newInputDict !== undefined) {
      input = { ...this.state.newInputDict, ...input };
    }
    //this.currentFieldsRef[item.name].state.item
    let allFieldsName = this.state.sequenceOfFields;
    allFieldsName.forEach(
      function (name) {
        if (name == 'country' || name == 'mobile') {
          if (name == 'country') {
            let value = this.currentFieldsRef.mobile.currentPageRef.phone.state
              .countryCode;
            if (value) {
              input[name] = value;
            }
            let mobileValue = this.currentFieldsRef.mobile.currentPageRef.phone
              .state.inputValue;
            if (mobileValue) {
              input.mobile = mobileValue;
              this.state.sequenceOfFields = [
                ...this.state.sequenceOfFields,
                'mobile',
              ];
              this.state.typeOfFields = [
                ...this.state.typeOfFields,
                FieldType.NUMBER.toString(),
              ];
              this.state.mandatoryFields = [
                ...this.state.mandatoryFields,
                'mobile',
              ];
            }
          } else {
          }
        } else {
          if (
            this.currentFieldsRef[name] !== undefined &&
            this.currentFieldsRef[name][name] !== undefined
          ) {
            let value = this.currentFieldsRef[name][name].state.text;
            if (value) {
              if (name.includes('password') === true) {
                input[name] = md5(value);
              } else if (name == 'referenceLink') {
                let protocol = this.currentFieldsRef[name].state.protocol;
                let url = this.currentFieldsRef[name].state.url;
                input[name] = protocol + url.toString().trim();
              } else {
                input[name] = value.toString().trim();
              }
            }
          } else {
          }
        }
      }.bind(this),
    );
    const newDicLength = Object.keys(input).length;

    if (this.props.sendDataBack == true) {
      this.inputDictTOSubmit(input);
      return;
    }

    (input.userId = this.props.user.userId),
      (input.token = this.props.user.token),
      (input.formId = this.props.formId),
      (input.blockId = this.state.currentFbId),
      (input.type = '1'),
      (input.deviceId = this.state.deviceId),
      (input.request = APPLICATION_SUBMIT);

    if (this.props.isFromCollapsible === true) {
      if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
        this.props.onAnotherScreenSaveButtonTapped();
      }
    } else {

      if (newDicLength == dicLength) {


        //if no fields added other than compulsory fields
        if (this.state.isFromSaveButton == true) {
          let resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
          });

          this.props.navigation.dispatch(resetAction);
        } else {
          if (newDicLength == 0) {
            this.state.errors = {};
            this.setState({ submitLoader: false })

            if (this.state.currentFbId == "4") {
              let resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
              });

              this.props.navigation.dispatch(resetAction);
            }
          }

          // this.props.updatePage();
        }
      } else {
        this.state.newPageToChange = this.state.currentPage + 1;
        this.props.submitApplication(input, this.state.currentController);
      }
    }

    /*
    if (
      this.props.sendDataBack == true ||
      (this.props.innerPage === true &&
        (this.props.isFromCollapsible === false ||
          this.props.isFromCollapsible === undefined ||
          this.props.isSinglePage !== true))
    ) {
      if (this.props.sendDataBack == true) {
        this.inputDictTOSubmit(input);

      } else {

          (input.userId = this.props.user.userId),
            (input.token = this.props.user.token),
            (input.formId = this.props.formId),
            (input.blockId = this.state.currentFbId),
            (input.type = '1'),
            (input.deviceId = this.state.deviceId),
            (input.request = APPLICATION_SUBMIT);

          this.state.newPageToChange = this.state.currentPage + 1;
          this.props.submitApplication(input, this.state.currentController);
      }
      // this.inputDictTOSubmit(input); //i guess this is never gets called
    } else {

        (input.userId = this.props.user.userId),
          (input.token = this.props.user.token),
          (input.formId = this.props.formId),
          (input.blockId = this.state.currentFbId),
          (input.type = '1'),
          (input.deviceId = this.state.deviceId),
          (input.request = APPLICATION_SUBMIT);

      if (newDicLength == dicLength) {
        //no condition for register submission

        if (
          this.props.isFromCollapsible === false ||
          this.props.isFromCollapsible === undefined
        ) {
          //temprary Adjustment
          if (this.props.item.fbId == '3') {
            //this is for buisness acivity
            //  this.state.newPageToChange = this.state.currentPage + 1;
            if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
              this.props.onAnotherScreenSaveButtonTapped();
            }
          } else {
            // this.state.newPageToChange = this.state.currentPage + 1;
            this.setState({submitLoader: false, errors: {}});
            this.props.updatePage();
          }
        } else {
          if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
            this.props.onAnotherScreenSaveButtonTapped();
          }
        }
      } else {

          if (this.props.isFromCollapsible === true) {
            if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
              this.props.onAnotherScreenSaveButtonTapped();
            }
          } else {
            this.state.newPageToChange = this.state.currentPage + 1;

            this.props.submitApplication(input, this.state.currentController);
          }
      }
    }*/
  }

  //NEED To REMOVE THIS CODE
  callSubmitFields() {
    var input = {};

    const dicLength = Object.keys(input).length;

    if (this.state.applicationId !== undefined) {
      input.applicationId = this.state.applicationId;
    } else if (this.props.applicationModel !== undefined) {
      let id =
        this.props.applicationModel.applicationId !== undefined
          ? this.props.applicationModel.applicationId
          : '';
      if (id !== '') {
        input.applicationId = id;
      }
    }

    if (this.state.newInputDict !== undefined) {
      input = { ...this.state.newInputDict, ...input };
    }

    let allFieldsName = this.state.sequenceOfFields;
    allFieldsName.forEach(
      function (name) {
        if (name == 'country' || name == 'mobile') {
          if (name == 'country') {
            let value = this.currentFieldsRef.mobile.currentPageRef.phone.state
              .countryCode;
            if (value) {
              input[name] = value;
            }
            let mobileValue = this.currentFieldsRef.mobile.currentPageRef.phone
              .state.inputValue;
            if (mobileValue) {
              input.mobile = mobileValue;
              this.state.sequenceOfFields = [
                ...this.state.sequenceOfFields,
                'mobile',
              ];
              this.state.typeOfFields = [
                ...this.state.typeOfFields,
                FieldType.NUMBER.toString(),
              ];
              this.state.mandatoryFields = [
                ...this.state.mandatoryFields,
                'mobile',
              ];
            }
          } else {
          }
        } else {
          if (
            this.currentFieldsRef[name] !== undefined &&
            this.currentFieldsRef[name][name] !== undefined
          ) {
            let value = this.currentFieldsRef[name][name].state.text;
            if (value) {
              if (name.includes('password') === true) {
                input[name] = md5(value);
              } else if (name == 'referenceLink') {
                let protocol = this.currentFieldsRef[name].state.protocol;
                let url = this.currentFieldsRef[name].state.url;
                input[name] = protocol + url;
              } else {
                input[name] = value;
              }
            }
          } else {
          }
        }
      }.bind(this),
    );
    const newDicLength = Object.keys(input).length;

    if (
      this.props.sendDataBack == true ||
      (this.props.innerPage === true &&
        (this.props.isFromCollapsible === false ||
          this.props.isFromCollapsible === undefined ||
          this.props.isSinglePage !== true))
    ) {
      if (this.props.sendDataBack == true) {
        this.inputDictTOSubmit(input);
        // if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
        //   this.props.onAnotherScreenSaveButtonTapped();
        // }
      } else {
        if (
          this.props.item.formId == '2' &&
          this.state.currentFbId == '5' &&
          this.state.applicationId === undefined
        ) {
          (input.formId = this.props.formId),
            (input.blockId = this.state.currentFbId),
            (input.type = '2'),
            (input.deviceId = this.state.deviceId),
            (input.request = APPLICATION_SUBMIT);
        } else {
          (input.userId = this.props.user.userId),
            (input.token = this.props.user.token),
            (input.formId = this.props.formId),
            (input.blockId = this.state.currentFbId),
            (input.type = '1'),
            (input.deviceId = this.state.deviceId),
            (input.request = APPLICATION_SUBMIT);
        }

        if (this.props.item.formId == '2' && this.state.currentFbId == '5') {
          if (this.state.applicationId !== undefined) {
            this.props.submitApplication(input, 'EditProfile');
          } else {
            this.props.submitApplication(input, this.state.currentController);
          }
          //for edit profile another api called
        } else {
          this.state.newPageToChange = this.state.currentPage + 1;
          this.props.submitApplication(input, this.state.currentController);
        }
      }
      // this.inputDictTOSubmit(input); //i guess this is never gets called
    } else {
      if (
        this.props.item.formId == '2' &&
        this.state.currentFbId == '5' &&
        this.state.applicationId === undefined
      ) {
        (input.formId = this.props.formId),
          (input.blockId = this.state.currentFbId),
          (input.type = '2'),
          (input.deviceId = this.state.deviceId),
          (input.request = APPLICATION_SUBMIT);
      } else {
        (input.userId = this.props.user.userId),
          (input.token = this.props.user.token),
          (input.formId = this.props.formId),
          (input.blockId = this.state.currentFbId),
          (input.type = '1'),
          (input.deviceId = this.state.deviceId),
          (input.request = APPLICATION_SUBMIT);
      }

      if (newDicLength == dicLength) {
        //no condition for register submission

        if (
          this.props.isFromCollapsible === false ||
          this.props.isFromCollapsible === undefined
        ) {
          //temprary Adjustment
          if (this.props.item.fbId == '3') {
            //this is for buisness acivity
            //  this.state.newPageToChange = this.state.currentPage + 1;
            if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
              this.props.onAnotherScreenSaveButtonTapped();
            }
          } else {
            // this.state.newPageToChange = this.state.currentPage + 1;
            this.setState({ submitLoader: false, errors: {} });
            this.props.updatePage();
          }
        } else {
          if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
            this.props.onAnotherScreenSaveButtonTapped();
          }
        }
      } else {
        if (this.props.item.formId == '2' && this.state.currentFbId == '5') {
          if (this.state.applicationId !== undefined) {
            this.props.submitApplication(input, 'EditProfile');
          } else {
            this.props.submitApplication(input, this.state.currentController);
          }
          //for edit profile another api called
        } else {
          if (this.props.isFromCollapsible === true) {
            if (this.props.onAnotherScreenSaveButtonTapped !== undefined) {
              this.props.onAnotherScreenSaveButtonTapped();
            }
          } else {
            this.state.newPageToChange = this.state.currentPage + 1;

            this.props.submitApplication(input, this.state.currentController);
          }
        }
      }
    }
  }

  //MARK: - Textfields Methods
  onFocus() {
    let { errors } = this.state;

    for (let name in errors) {
      let ref = this.currentFieldsRef[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  }
  updateRef(name, ref) {
    this.currentFieldsRef[name] = ref;
  }

  focusTheField = id => {
    var currentField = this.state.sequenceOfFields
      .map(function (item) {
        return item;
      })
      .indexOf(id);
    const nextField = this.state.sequenceOfFields[currentField + 1];

    let ref = this.currentFieldsRef[nextField];

    if (this.currentFieldsRef[nextField] !== undefined) {
      if (ref[nextField] !== undefined) {
        ref[nextField].focus();
      }
    }
  };

  validateTheField = (id, type, isMultiAny) => {
    if (this.validateSingleField(id, type, isMultiAny) == false) {
      return;
    }

    // let countForErrorFields = 0;
    // this.state.mandatoryFields.map(
    //   function(name) {
    //     if (this.currentFieldsRef[name] !== undefined) {
    //       let value = this.currentFieldsRef[name][name].state.text;
    //       if (value === '' || value === undefined) {
    //         countForErrorFields = countForErrorFields + 1;
    //         this.state.properValueField = [
    //           ...this.state.properValueField,
    //           name,
    //         ];
    //       }
    //     }
    //   }.bind(this),
    // );

    // if (countForErrorFields == 0) {
    //   this.setState({submitGray: false});
    // }

    if (
      Object.keys(this.state.errors).length == 0 &&
      this.checkIfAllMandaotyFieldsHaveProperValues() == true
    ) {
      if (this.props.allFieldsAreNotOk) {
        this.props.allFieldsAreNotOk(false);
      }
      this.setState({ submitGray: false });
    } else {
      if (this.props.allFieldsAreNotOk) {
        this.props.allFieldsAreNotOk(true);
      }
      this.setState({ submitGray: true });
    }
  };

  validateSingleField(name, type, isMultiAny) {
    Object.keys(this.state.errors).map(
      function (errorKey) {
        if (this.state.mandatoryFields.includes(errorKey) == false) {
          delete this.state.errors[errorKey];
        }
      }.bind(this),
    );

    const errors = this.state.errors;
    let errorCount = 0;

    let value = '';
    if (type == FieldType.MOBILE_INFO) {
      if (this.currentFieldsRef.mobile.currentPageRef.phone !== undefined) {
        value = this.currentFieldsRef.mobile.currentPageRef.phone.state
          .inputValue;
      }

      if (!value || value == '') {
        errors[name] = 'this field is required';
        errorCount = errorCount + 1;
        this.setState({
          errors: { ...this.state.errors, ...errors, submitGray: true },
        });

        if (this.props.allFieldsAreNotOk) {
          this.props.allFieldsAreNotOk(undefined);
        }
        return false;
      } else {
        // this.setState({submitGray: false});
        // return true
        this.state.properValueField.mobile = value;
        delete this.state.errors.mobile;
      }
    } else {
      if (isMultiAny === true) {

        value = this.currentFieldsRef.multiany['child'].state.text;

        if (!value || value == '') {
          if (this.currentFieldsRef.multiany['child'].props.label && this.currentFieldsRef.multiany['child'].props.label.includes('*')) {
            errors[name] = 'this field is required';
            errorCount = errorCount + 1;
          }
        }
      } else {

        value = this.currentFieldsRef[name][name].state.text;

        if (!value || value == '') {
          if (this.currentFieldsRef[name][name].props.label.includes('*')) {
            errors[name] = 'this field is required';
            errorCount = errorCount + 1;
          }
        }
      }

    }

    if (!value || value == '') {
    } else {
      let result = true;
      let warning = '';
      this.state.properValueField[name] = value;
      switch (parseInt(type)) {
        case FieldType.EMAIL:
          result = validateField(value, emailRule.validationRules);
          warning = translate('emailValidation');
          break;
        default:
          result = true;
          break;
      }
      if (result == false) {
        errorCount = errorCount + 1;
        errors[name] = warning;
      } else {
        switch (name.toLowerCase()) {
          case 'phone':
          case 'mobile':
            result = validateField(value, mobileRule.validationRules);
            warning = translate('phoneValidation');
            break;
          case 'email':
            result = validateField(value, emailRule.validationRules);
            warning = translate('emailValidation');
            break;
          default:
            result = true;
            break;
        }
        if (result == false) {
          errorCount = errorCount + 1;
          errors[name] = warning;
        } else {
          delete this.state.errors[name];
        }
      }
    }
    // this.currentFieldsRef[name].error = errors[name]
    // this.currentFieldsRef[name][name].state.error = errors[name];
    if (type == FieldType.MOBILE_INFO) {
      this.currentFieldsRef.mobile.state.error = errors.mobile;
    } else {
      this.currentFieldsRef[name].state.error = errors[name];
    }

    this.setState({ errors: { ...this.state.errors, ...errors } });

    if (errorCount > 0) {
      if (this.props.allFieldsAreNotOk) {
        this.props.allFieldsAreNotOk(undefined);
      }
      this.setState({ submitGray: true });
      return false;
    } else {
      if (
        Object.keys(this.state.errors).length == 0 &&
        this.checkIfAllMandaotyFieldsHaveProperValues() == true
      ) {
        if (this.props.allFieldsAreNotOk) {
          this.props.allFieldsAreNotOk(false);
        }
        this.setState({ submitGray: false });
      } else {
        if (this.props.allFieldsAreNotOk) {
          this.props.allFieldsAreNotOk(true);
        }
        this.setState({ submitGray: true });
      }
      return true;
    }
  }

  checkIfAllMandaotyFieldsHaveProperValues() {
    let result = false;

    this.removeServerError();

    if (this.state.mandatoryFields.length == 0) {
      return true;
    }
    if (
      Object.keys(this.state.properValueField).length >=
      this.state.mandatoryFields.length
    ) {
      Object.keys(this.state.properValueField).map(
        function (key) {
          if (this.state.mandatoryFields) {
            if (this.state.mandatoryFields.includes(key) == true) {
              result = true;
            }
          }
        }.bind(this),
      );
    }

    if (this.props.submitButtonEnable === true) {
      return true;
    }
    return result;
  }

  validateAllDetails() {
    const errors = this.state.errors;
    let errorCount = 0;

    let validates = this.state.sequenceOfFields;

    validates.forEach(
      function (name, index) {
        if (name == 'mobile') {
          let value = this.currentFieldsRef.mobile.currentPageRef.phone.state
            .inputValue;

          if (!value || value == '') {
            // if (this.currentFieldsRef[name][name].props.label.includes('*')) {

            if (this.state.isFromSaveButton !== true) {
              errors[name] = 'this field is required';
              errorCount = errorCount + 1;
              // this.currentFieldsRef[name][name].state.error = errors[name];
              this.currentFieldsRef[name].state.error = errors[name];
            }

            // }
          } else {
            let result = true;
            let warning = '';
            switch (parseInt(this.state.typeOfFields[index])) {
              case FieldType.EMAIL:
                result = validateField(value, emailRule.validationRules);
                warning = translate('emailValidation');
                break;
              default:
                result = true;
                break;
            }
            if (result == false) {
              errorCount = errorCount + 1;
              errors[name] = warning;
              // this.currentFieldsRef[name][name].state.error = errors[name];
              this.currentFieldsRef[name].state.error = errors[name];
            } else {
              switch (name.toLowerCase()) {
                case 'phone':
                case 'mobile':
                  result = validateField(value, mobileRule.validationRules);
                  warning = translate('phoneValidation');
                  break;
                case 'email':
                  result = validateField(value, emailRule.validationRules);
                  warning = translate('emailValidation');
                  break;
                default:
                  result = true;
                  break;
              }
              if (result == false) {
                errorCount = errorCount + 1;
                errors[name] = warning;
                // this.currentFieldsRef[name][name].state.error = errors[name];
                this.currentFieldsRef[name].state.error = errors[name];
              }
            }
          }
          // this.currentFieldsRef[name].error = errors[name]
          // this.currentFieldsRef[name][name].state.error = errors[name];
          // this.currentFieldsRef[name].state.error = errors[name];
        } else {
          //--------------------------
          if (
            this.currentFieldsRef[name] !== undefined &&
            this.currentFieldsRef[name][name] !== undefined
          ) {
            let value = this.currentFieldsRef[name][name].state.text;

            if (!value || value == '') {
              if (this.currentFieldsRef[name][name].props.label.includes('*')) {
                if (this.state.isFromSaveButton !== true) {
                  errors[name] = 'this field is required';
                  errorCount = errorCount + 1;
                  // this.currentFieldsRef[name][name].state.error = errors[name];
                  this.currentFieldsRef[name].state.error = errors[name];
                }
              }
            } else {
              let result = true;
              let warning = '';
              switch (name) {
                case 'mobile':
                  // case 'otherMobile':
                  //   result = validateField(value, mobileRule.validationRules);
                  //   warning = 'phone number should contain minimum 10 number';

                  break;
                default:
                  result = true;
                  break;
              }
              if (result == false) {
                errorCount = errorCount + 1;
                errors[name] = warning;
                // this.currentFieldsRef[name][name].state.error = errors[name];
                this.currentFieldsRef[name].state.error = errors[name];
              }
            }
            // this.currentFieldsRef[name].error = errors[name]
          }
        }
        //--------------------------
      }.bind(this),
    );

    // this.setState({errors:errors});

    this.removeServerError();

    if (errorCount > 0) {
      let returnResult = { result: false, errors: errors };
      return returnResult;
    }

    let returnResult = { result: true, errors: errors };
    return returnResult;
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
    submitApplication: (input, controller) =>
      dispatch(submitApplication(input, controller)),
  };
}

//MARK: - Navigation Header

const InputFormNew = withTheme(InputForm);

InputFormNew.navigationOptions = ({ screenProps }) => {
  // const {state, setParams, navigate} = navigation;

  const { theme } = screenProps;
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

    headerStyle: { shadowColor: 'transparent', borderBottomWidth: 0 },
    headerTintColor: theme.primaryColor,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InputFormNew);