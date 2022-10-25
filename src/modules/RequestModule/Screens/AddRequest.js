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
import {ImageComponent} from '../../FormsComponent/Component/Image/ImageComponent';
import {addRequest} from '../Actions/RequestActions';
import {
  addRequestSelector,
  isLoadingSelector,
  apiSelector,
  errorSelector,
} from '../Actions/selector';
import moment from 'moment';
import {ADD_REQUEST} from '../Actions/type';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';

class AddRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balanceLeaves: undefined,
      leaveBalance: 'Unlimited',
      value: translate('gmbc'),
      sessionValue: 0,
      categoryType: '1',
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
    if (this.props.error && this.props.error.request == ADD_REQUEST) {
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

    //add request
    if (this.props.api === ADD_REQUEST) {
      if (this.props.error !== null && this.props.api === ADD_REQUEST) {
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
      if (!this.props.error && this.props.api === ADD_REQUEST) {
        if (this.props.requestId !== prevProps.requestId) {
          this.setState({submitLoader: false});
          Alert.alert(
            'Request added successfully',
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
              item={this.state.categoryType === '5' ? formData2 : formData1}
              blockModel={
                this.state.categoryType === '5' ? formData2 : formData1
              }
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
          </Text> */}
          <View style={{padding: 5, flex: 1}}>
            {/* <UploadSingleImage
              isAddImage={true}
              navigation={this.props.navigation}
              getUploadedFileName={this.getUploadedFileName}
              isUploadImage={false}
            /> */}
          </View>
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
      request: ADD_REQUEST,
    };

    let attachmentRef = this.currentPageRef.request.currentFieldsRef.attachment[1]
    if(attachmentRef) {
      let attachment = attachmentRef.state.attachment[1].imageToUpload
      input['attachment'] =  attachment
    }
    this.props.addRequest(input);
  }

  renderCategoryDropdown() {
    const {theme} = this.props;
    var value = '';
    if (this.state.value !== undefined) {
      value = this.state.value;
    } else {
      value = this.state.categoryList[0].value;
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
      </View>
    );
  }

  changeText = text => {
    var index = this.state.categoryList.findIndex(obj => obj.value === text);
    var categoryModel = this.state.categoryList[index];

    this.setState({
      categoryType: categoryModel.key,
      value: text,
    });
  };
}
const AddRequestNew = withTheme(AddRequest);
AddRequestNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    isLoading: isLoadingSelector(state.RequestReducer),
    api: apiSelector(state.RequestReducer),
    error: errorSelector(state.RequestReducer),
    requestId: addRequestSelector(state.RequestReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addRequest: input => dispatch(addRequest(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRequestNew);
let formData1 = {
  fields: [
    {
      name: 'purpose',
      type: '1',
      lable: 'Purpose',
      rules: 'required',
    },
    {
      name: 'date',
      type: '7',
      lable: 'Required Date',
      rules: 'required',
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
    },
    {
      name: 'purpose',
      type: '1',
      lable: 'Purpose',
      rules: 'required',
    },
    {
      name: 'date',
      type: '7',
      lable: 'Required Date',
      rules: 'required',
    },
  ],
};
