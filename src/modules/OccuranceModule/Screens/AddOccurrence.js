/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {connect} from 'react-redux';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {Dropdown} from 'react-native-material-dropdown';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {addOccurrence} from '../Actions/OccuranceActions';
import {
  addOccurrenceSelector,
  isLoadingSelector,
  apiSelector,
  errorSelector,
} from '../Actions/selectors';
import {ADD_OCCURRENCE} from '../Actions/type';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';

class AddOccurrence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balanceLeaves: undefined,
      leaveBalance: 'Unlimited',
      type: '1',
      typeValue: 'Select',
      option: '0',
      optionValue: 'Single',
      showOption: false,
    };
    this.currentPageRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
    this.changeTypeText = this.changeTypeText.bind(this);
    this.changeOptionText = this.changeOptionText.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
    this.renderTypeDropdown = this.renderTypeDropdown.bind(this);
    this.renderOptionDropdown = this.renderOptionDropdown.bind(this);
  }

  componentWillMount() {
    let optionList = [];
    optionList.push({key: '0', value: 'Single'});
    optionList.push({key: '1', value: 'Married'});
    optionList.push({key: '2', value: 'Divorcee'});
    optionList.push({key: '3', value: 'Widowed'});

    let typeList = [];
    if (this.props.user.gender === '1') {
      typeList.push({key: '1', value: translate('change_marital_status')});
      typeList.push({
        key: '4',
        value: translate('request_for_paternity_leave'),
      });
      typeList.push({key: '5', value: translate('request_for_solo_parent')});
      typeList.push({key: '6', value: translate('request_for_resign')});

      this.setState({typeList: typeList, optionList: optionList});
    } else if (this.props.user.gender === '2') {
      typeList.push({key: '1', value: translate('change_marital_status')});
      typeList.push({
        key: '2',
        value: translate('request_for_maternity_leave'),
      });
      typeList.push({
        key: '3',
        value: translate('request_for_extended_maternity_leave'),
      });

      typeList.push({key: '5', value: translate('request_for_solo_parent')});
      typeList.push({key: '6', value: translate('request_for_resign')});
      typeList.push({
        key: '7',
        value: translate('request_for_victims'),
      });

      this.setState({typeList: typeList, optionList: optionList});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == ADD_OCCURRENCE) {
      if (this.props.error !== prevProps.error) {
        this.setState({submitLoader: false});
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                //this.props.navigation.navigate('Login');
                console.log('OK Pressed');
              },
            },
          ],
          {cancelable: false},
        );
      }
    }

    //add occurrence
    if (this.props.api === ADD_OCCURRENCE) {
      if (this.props.error !== null && this.props.api === ADD_OCCURRENCE) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (this.props.error.message === 'Invalid Token') {
                    this.props.navigation.navigate('Login');
                  }
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
      if (!this.props.error && this.props.api === ADD_OCCURRENCE) {
        if (this.props.occId !== prevProps.occId) {
          this.setState({submitLoader: false});
          Alert.alert(
            'Occurrence added successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.renderTypeDropdown()}
          {this.state.showOption === true ? this.renderOptionDropdown() : null}

          <View style={{}}>
            <InputForm
              onRef={ref => {
                this.currentPageRef['occurrence'] = ref;
              }}
              item={formData}
              blockModel={formData}
              formId={'0'}
              navigation={this.props.navigation}
              editable={true}
              fromDetail={true}
              hideBottomButton={true}
              isRequireHeader={false}
            />
          </View>

          {/* <Text
            style={[
              theme.detail,
              {
                color: 'gray',
                paddingTop: 15,
                fontWeight: '600',
                paddingLeft: 10,
                fontSize: 16,
              },
            ]}
            numberOfLines={1}>
            {translate('attachment')}
          </Text>
          <View style={{padding: 5, flex: 1}}>
            <UploadSingleImage
              isAddImage={true}
              navigation={this.props.navigation}
              getUploadedFileName={this.getUploadedFileName}
              isUploadImage={false}
            />
          </View> */}
          <View
            style={{
              paddingLeft: '25%',
              paddingRight: '25%',
              paddingTop: 20,
              paddingBottom: 30,
            }}>
            <BottomButton
              style={styless.bottomButton}
              title={translate('submit')}
              action={
                !this.state.submitLoader && !this.state.submitGray
                  ? this.onSubmitTapped
                  : null
              }
              isLoader={this.state.submitLoader}
              isGray={this.state.submitGray}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  getUploadedFileName = (imageToUpload, tempImageName) => {
    this.state.imageToUpload = imageToUpload;
  };

  onSubmitTapped() {
    this.setState({submitLoader: true});
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      type: this.state.type,
      option: this.state.option,
      detail: this.currentPageRef.occurrence.currentFieldsRef.description.state
        .description,
      request: ADD_OCCURRENCE,
    };

    let attachmentRef = this.currentPageRef.occurrence.currentFieldsRef.attachment[1]
    if(attachmentRef) {
      let attachment = attachmentRef.state.attachment[1].imageToUpload
      input['attachment'] = attachment
    }
    this.props.addOccurrence(input);
  }

  renderTypeDropdown() {
    const {theme} = this.props;
    var typeValue = '';
    if (this.state.typeValue !== undefined) {
      typeValue = this.state.typeValue;
    } else {
      typeValue = this.state.typeList[0].value;
    }
    return (
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
          }}>
          <Dropdown
            data={this.state.typeList}
            value={typeValue}
            label={translate('type')}
            textColor={theme.headerColor}
            baseColor={'gray'}
            fontSize={16}
            tintColor={theme.centerColor}
            onChangeText={this.changeTypeText}
            animationDuration={0}
          />
        </View>
      </View>
    );
  }

  renderOptionDropdown() {
    const {theme} = this.props;
    var optionValue = '';
    if (this.state.optionValue !== undefined) {
      optionValue = this.state.optionValue;
    } else {
      optionValue = this.state.optionList[0].value;
    }
    return (
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
          }}>
          <Dropdown
            data={this.state.optionList}
            value={optionValue}
            label={'Marital Status'}
            textColor={theme.headerColor}
            baseColor={'gray'}
            fontSize={16}
            tintColor={theme.centerColor}
            onChangeText={this.changeOptionText}
            animationDuration={0}
          />
        </View>
      </View>
    );
  }

  changeTypeText = text => {
    var index = this.state.typeList.findIndex(obj => obj.value === text);
    var typeModel = this.state.typeList[index];

    if (typeModel.key === '1') {
      this.setState({
        type: typeModel.key,
        typeValue: text,
        showOption: true,
      });
    } else {
      this.setState({
        type: typeModel.key,
        typeValue: text,
      });
    }
  };

  changeOptionText = text => {
    var index = this.state.optionList.findIndex(obj => obj.value === text);
    var optionModel = this.state.optionList[index];

    this.setState({
      option: optionModel.key,
      optionValue: text,
    });
  };

  getTypeStatus = type => {
    switch (type) {
    }
  };
}
const AddOccurrenceNew = withTheme(AddOccurrence);
AddOccurrenceNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.OccurrenceReducer),
    api: apiSelector(state.OccurrenceReducer),
    error: errorSelector(state.OccurrenceReducer),
    occId: addOccurrenceSelector(state.OccurrenceReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addOccurrence: input => dispatch(addOccurrence(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddOccurrenceNew);
let formData = {
  fields: [
    {
      name: 'description',
      type: '1',
      lable: 'Description/Note',
    },
    {
      "name": "attachment",
      "type": "3",
      "lable": "Attachment",
    },
  ],
};
