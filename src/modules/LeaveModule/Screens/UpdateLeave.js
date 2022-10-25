/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {GET_MY_BALANCE, UPDATE_LEAVE} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myBalanceLeavesSelector,
  updateLeaveSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getMyBalance, updateLeave} from '../Actions/LeaveActions';
import {connect} from 'react-redux';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {Dropdown} from 'react-native-material-dropdown';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import moment from 'moment';
import {ImageComponent} from '../../FormsComponent/Component/Image/ImageComponent';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';
import {AttachmentTypes} from '../../FileModule/Actions/FileIntegers';

class UpdateLeave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balanceLeaves: undefined,
      leaveBalance: 'Unlimited',
      value: 'Unpaid',
      sessionValue: this.props.navigation.state.params.leaveDetail.leaveSession,
    };
    this.currentPageRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
  }

  componentWillMount() {
    this.callGetMyBalanceAPI();
    let list = [];
    var lastYearObj = {index: 0, value: translate('full_day')};
    var currentYearObj = {index: 1, value: translate('am')};
    var nextYearObj = {index: 2, value: translate('pm')};
    list.push(lastYearObj);
    list.push(currentYearObj);
    list.push(nextYearObj);
    this.state.typeList = list;
    let leaveDetail = this.props.navigation.state.params.leaveDetail;

       
    let formattedStartDate = moment(leaveDetail.startDate).format('DD/MM/YYYY');
    let formattedEndDate = moment(leaveDetail.endDate).format('DD/MM/YYYY');

    let momentTime = moment(leaveDetail.startTime, 'hh:mm:ss');
    let formattedStartTime = moment(momentTime).format('hh:mm');

    let momentTime1 = moment(leaveDetail.endTime, 'hh:mm:ss');
    let formattedEndTime = moment(momentTime1).format('hh:mm');

    let formData = {
      fields: [
        {
          name: 'title',
          type: '1',
          lable: 'Title',
          rules: 'required',
          value: leaveDetail.leaveTitle,
        },
        {
          name: 'date',
          mode:'date',
          type: '26',
          lable: 'Date',
          rules: 'required',
          controller: 'TwoFields',
          childFields : [
            {
              name: 'fromDate',
              type: '7',
              lable: 'From',
              rules: 'required',
              value : formattedStartDate,
            },
            {
              name: 'toDate',
              type: '7',
              lable: 'To',
              rules: 'required',
              value: formattedEndDate,
            },
          ],
        },
        {
          name: 'description',
          type: '1',
          lable: 'Description',
          rules: 'required',
          value: leaveDetail.leaveReason,
        },
        {
          "name": "attachment",
          "type": "3",
          "lable": "Attachment",
        },
      ],
    };
    this.state.formData = formData;
    this.state.attachment = leaveDetail.attachment;
    this.state.startDate = leaveDetail.leaveStart;
    this.state.endDate = leaveDetail.leaveEnd;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_MY_BALANCE ||
        this.props.error.request == UPDATE_LEAVE)
    ) {
      if (this.props.error !== prevProps.error) {
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

    //get my balance
    if (this.props.api === GET_MY_BALANCE) {
      if (this.props.error !== null && this.props.api === GET_MY_BALANCE) {
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

      if (!this.props.error && this.props.api === GET_MY_BALANCE) {
        if (this.props.balanceLeaves !== this.state.balanceLeavesData) {
          let list = [];
          Object.keys(this.props.balanceLeaves).map(key => {
            list = [
              ...list,
              {
                index: key,
                value: this.props.balanceLeaves[key].leaveTypeName,
              },
            ];
          });
          this.setState({
            balanceLeavesList: list,
            balanceLeavesData: this.props.balanceLeaves,
            leaveType: this.props.balanceLeaves[0].leaveType,
          });
        }
      }
    }

    //update leave
    if (this.props.api === UPDATE_LEAVE) {
      if (this.props.error !== null && this.props.api === UPDATE_LEAVE) {
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

      if (!this.props.error && this.props.api === UPDATE_LEAVE) {
        if (this.props.updatedLeaveId !== this.state.updatedLeaveId) {
          this.setState({submitLoader: false});
          Alert.alert(
            'Leave updated successfully',
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
    if (this.state.balanceLeavesList === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.renderLeaveTypeView()}
          <View style={{height: 250}}>
            <InputForm
              onRef={ref => {
                this.currentPageRef['leave'] = ref;
              }}
              item={this.state.formData}
              blockModel={this.state.formData}
              formId={'0'}
              navigation={this.props.navigation}
              editable={true}
              fromDetail={true}
              hideBottomButton={true}
              isRequireHeader={false}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
            />
          </View>
          {this.renderSessionView()}
          <Text
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
                type: AttachmentTypes.UPLOAD_ATTACHMENT_LEAVE,
                typeId: this.props.navigation.state.params.leaveDetail.leaveId,
                title: '',
              }}
            />
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

  renderAttachmentsItem = ({item, index}) => {
    return (
      <View style={{flex: 1, padding: 5}}>
        <ImageComponent
          url={require('../../../asset/upload.png')}
          height={90}
          width={90}
          navigation={this.props.navigation}
          id={this.state.reportDetail.reportId}
          name={item}
          isActualImage={true}
          onImageTapped={this.onImageTapped}
          isRectangular={true}
          borderRadius={5}
          module={'report'}
        />
      </View>
    );
  };

  uploadedImages = (images, toUplaod) => {
    if (images[1].fileName !== undefined) {
      let input = {};
      input = images[1].fileName;

      if (this.state.fileName !== undefined) {
        let newFileList = this.state.fileName + ',' + input;
        this.state.fileName = newFileList;
      } else {
        this.state.fileName = input;
      }
    }
  };

  getUploadedFileName = (imageToUpload, tempImageName) => {
    this.state.imageToUpload = imageToUpload;
  };

  onSubmitTapped() {
    this.setState({submitLoader: true});
    var title = this.currentPageRef.leave.currentFieldsRef.title.state.title;
    var description = this.currentPageRef.leave.currentFieldsRef.description
      .state.description;

      let details = this.currentPageRef.leave.currentFieldsRef

      var startDate = details.date.fromDate.state.date;
      let momentObj = moment(startDate, 'DD/MM/YYYY');
      let formattedStartDate = moment(momentObj).format('YYYY-MM-DD');
  
      var endDate = details.date.toDate.state.date;
      let momentObj1 = moment(endDate, 'DD/MM/YYYY');
      let formattedEndDate = moment(momentObj1).format('YYYY-MM-DD');


    var input = {
      company: this.props.user.userCompany,
      user: this.props.user.userId,
      title: title,
      reason: description,
      start: formattedStartDate,
      end: formattedEndDate,
      session: this.state.sessionValue,
      leaveType: this.state.leaveType,

      leaveId: this.props.navigation.state.params.leaveDetail.leaveId,
      request: UPDATE_LEAVE,
    };

    let attachmentRef = details.attachment[1]
    if(attachmentRef) {
      let attachment = attachmentRef.state.attachment[1].imageToUpload
      input['attachment'] = this.state.attachment === undefined
      ? attachment
      : this.state.attachment

    }

    this.props.updateLeave(input);
  }

  renderLeaveTypeView() {
    const {theme} = this.props;
    var value = '';
    if (this.state.value !== undefined) {
      value = this.state.value;
    } else {
      value = this.state.balanceLeavesList[0].value;
    }
    return (
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            padding: 5,
            paddingLeft: '5%',
            flex: 1,
          }}>
          <View
            style={{
              paddingLeft: '5%',
              paddingRight: '5%',
            }}>
            <Dropdown
              data={this.state.balanceLeavesList}
              value={value}
              label={translate('leave_type')}
              textColor={theme.headerColor}
              baseColor={'gray'}
              fontSize={16}
              tintColor={theme.centerColor}
              onChangeText={this.changeText}
              animationDuration={0}
            />
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text
            style={[
              theme.detail,
              {
                color: 'gray',
                paddingTop: 15,
                fontWeight: 'bold',
                paddingLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('leave_balance')}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                paddingTop: 10,
                paddingLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {this.state.leaveBalance}
          </Text>
        </View>
      </View>
    );
  }

  renderSessionView() {
    var sessionValue = '';
    if (this.state.sessionName !== undefined) {
      sessionValue = this.state.sessionName;
    } else {
      sessionValue = this.state.typeList[0].value;
    }
    const {theme} = this.props;
    return (
      <View
        style={{
          padding: 5,
          paddingLeft: '5%',
          paddingRight: '5%',
          flex: 1,
        }}>
        <View>
          <Dropdown
            data={this.state.typeList}
            value={sessionValue}
            label={translate('session')}
            textColor={theme.headerColor}
            baseColor={'gray'}
            fontSize={16}
            tintColor={theme.centerColor}
            onChangeText={this.changeSessionText}
            animationDuration={0}
          />
        </View>
      </View>
    );
  }

  changeText = text => {
    var index = this.props.balanceLeaves.findIndex(
      obj => obj.leaveTypeName === text,
    );
    var leaveModel = this.props.balanceLeaves[index];
    if (leaveModel.unlimted === 1) {
      this.setState({
        leaveBalance: 'Unlimited',
        value: text,
        leavetype: leaveModel.leaveType,
      });
    } else {
      this.setState({
        leaveBalance: leaveModel.leaveBalance,
        value: text,
        leavetype: leaveModel.leaveType,
      });
    }
  };

  changeSessionText = text => {
    var index = this.state.typeList.findIndex(obj => obj.value === text);
    var sessionModel = this.state.typeList[index];
    this.setState({
      sessionName: sessionModel.value,
      sessionValue: sessionModel.index,
    });
  };

  callGetMyBalanceAPI() {
    var input = {
      userId: this.props.user.userId,
      request: GET_MY_BALANCE,
    };
    this.props.getMyBalance(input);
  }
}
const UpdateLeaveNew = withTheme(UpdateLeave);
UpdateLeaveNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    isLoading: isLoadingSelector(state.LeaveReducer),
    api: apiSelector(state.LeaveReducer),
    error: errorSelector(state.LeaveReducer),
    balanceLeaves: myBalanceLeavesSelector(state.LeaveReducer),
    updatedLeaveId: updateLeaveSelector(state.LeaveReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMyBalance: input => dispatch(getMyBalance(input)),
    updateLeave: input => dispatch(updateLeave(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateLeaveNew);
