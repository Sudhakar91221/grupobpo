/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {translate} from '../../../../App';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import moment from 'moment';
import {Dropdown} from 'react-native-material-dropdown';
import {UPDATE_REQUEST} from '../Actions/type';
import {updateRequest} from '../Actions/RequestActions';
import {
  updateRequestSelector,
  errorSelector,
  apiSelector,
  isLoadingSelector,
} from '../Actions/selector';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';
import {AttachmentTypes} from '../../FileModule/Actions/FileIntegers';

class UpdateRequest extends React.Component {
  constructor(props) {
    super(props);
    let item = this.props.navigation.getParam('item');
    let date = moment(item.addedon).format('DD MMM YYYY');
    let formData1 = {
      fields: [
        {
          name: 'purpose',
          type: '1',
          lable: 'Purpose',
          rules: 'required',
          value: item.purpose,
        },
        {
          name: 'date',
          type: '7',
          lable: 'Required Date',
          rules: 'required',
          value: date,
        },
        {
          "name": "attachment",
          "type": "3",
          "lable": "Attachment",
        },
      ],
    };
    let formData2 = {
      fields: [
        {
          name: 'other',
          type: '1',
          lable: 'Specify other category',
          rules: 'required',
          value: item.categorySpecified,
        },
        {
          name: 'purpose',
          type: '1',
          lable: 'Purpose',
          rules: 'required',
          value: item.purpose,
        },
        {
          name: 'date',
          type: '7',
          lable: 'Required Date',
          rules: 'required',
          value: date,
        },
        {
          "name": "attachment",
          "type": "3",
          "lable": "Attachment",
        },
      ],
    };

    this.state = {
      item: item,
      formData: item.categoryType === '5' ? formData2 : formData1,
      categoryType: item.categoryType,
      attachment: item.requestAttachment,
    };
    this.currentPageRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
    this.changeText = this.changeText.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
  }

  componentWillMount() {
    let categoryList = [];
    categoryList.push({key: '1', value: translate('gmbc')});
    categoryList.push({key: '2', value: translate('bir')});
    categoryList.push({key: '3', value: translate('coe')});
    categoryList.push({key: '4', value: translate('reimbursement')});
    categoryList.push({key: '5', value: translate('others')});
    this.setState({categoryList: categoryList});
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == UPDATE_REQUEST) {
      if (
        this.props.error !== prevProps.error &&
        this.props.error.message !== ''
      ) {
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

    //update request
    if (this.props.api === UPDATE_REQUEST) {
      if (this.props.error !== null && this.props.api === UPDATE_REQUEST) {
        if (
          this.props.error !== prevProps.error &&
          this.props.error.message !== ''
        ) {
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
      if (!this.props.error && this.props.api === UPDATE_REQUEST) {
        if (this.props.success !== prevProps.success) {
          this.setState({submitLoader: false});
          Alert.alert(
            'Request updated successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
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
          {this.renderCategoryDropdown()}
          <View style={{}}>
            <InputForm
              onRef={ref => {
                this.currentPageRef['request'] = ref;
              }}
              item={this.state.formData}
              blockModel={this.state.formData}
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
              isAddImage={this.state.attachment === null ? true : false}
              navigation={this.props.navigation}
              getUploadedFileName={this.getUploadedFileName}
              isUploadImage={false}
              attachment={this.state.attachment}
              input={{
                type: AttachmentTypes.UPLOAD_ATTACHMENT_REQUEST,
                typeId: this.state.item.userId,
                title: '',
              }}
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

  renderCategoryDropdown() {
    const {theme} = this.props;
    var value = '';
    if (this.state.categoryType !== undefined) {
      value = this.state.categoryList[this.state.categoryType - 1].value;
    } else {
      value = this.state.categoryList[0].value;
    }
    return (
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <Dropdown
          data={this.state.categoryList}
          value={value}
          label={translate('category')}
          textColor={theme.headerColor}
          baseColor={'gray'}
          fontSize={16}
          tintColor={theme.centerColor}
          onChangeText={this.changeText}
          animationDuration={0}
        />
      </View>
    );
  }

  onSubmitTapped() {
    var date = this.currentPageRef.request.currentFieldsRef.date.date.state
      .text;
    var momentObj = moment(date, 'DD/MM/YYYY');
    let requiredDate = moment(momentObj).format('DD MMM YYYY');
    let categorySpecified =
      this.currentPageRef.request.currentFieldsRef.other === undefined
        ? ''
        : this.currentPageRef.request.currentFieldsRef.other.state.other;

    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      categoryType: this.state.categoryType,
      categorySpecified: categorySpecified,
      purpose: this.currentPageRef.request.currentFieldsRef.purpose.state
        .purpose,
      requiredDate: requiredDate,
      requestId: this.state.item.requestId,
      request: UPDATE_REQUEST,
    };

    let attachmentRef = this.currentPageRef.request.currentFieldsRef.attachment[1]
    if(attachmentRef) {
      let attachment = attachmentRef.state.attachment[1].imageToUpload
      input['attachment'] = this.state.attachment === undefined
      ? attachment
      : this.state.attachment

    }
    this.setState({submitLoader: true});
    this.props.updateRequest(input);
  }

  changeText = text => {
    var index = this.state.categoryList.findIndex(obj => obj.value === text);
    var categoryModel = this.state.categoryList[index];
    let item = this.props.navigation.getParam('item');
    let date = moment(item.addedon).format('DD MMM YYYY');
    let formData1 = {
      fields: [
        {
          name: 'purpose',
          type: '1',
          lable: 'Purpose',
          rules: 'required',
          value: item.purpose,
        },
        {
          name: 'date',
          type: '7',
          lable: 'Required Date',
          rules: 'required',
          value: date,
        },
        {
          "name": "attachment",
          "type": "3",
          "lable": "Attachment",
        },
      ],
    };
    let formData2 = {
      fields: [
        {
          name: 'other',
          type: '1',
          lable: 'Specify other category',
          rules: 'required',
          value: item.categorySpecified,
        },
        {
          name: 'purpose',
          type: '1',
          lable: 'Purpose',
          rules: 'required',
          value: item.purpose,
        },
        {
          name: 'date',
          type: '7',
          lable: 'Required Date',
          rules: 'required',
          value: date,
        },
        {
          "name": "attachment",
          "type": "3",
          "lable": "Attachment",
        },
      ],
    };
    this.setState({
      categoryType: categoryModel.key,
      value: text,
      formData: categoryModel.key === '5' ? formData2 : formData1,
    });
  };
}
const UpdateRequestNew = withTheme(UpdateRequest);
UpdateRequestNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    isLoading: isLoadingSelector(state.HolidayReducer),
    api: apiSelector(state.HolidayReducer),
    error: errorSelector(state.HolidayReducer),
    success: updateRequestSelector(state.HolidayReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateRequest: input => dispatch(updateRequest(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateRequestNew);
