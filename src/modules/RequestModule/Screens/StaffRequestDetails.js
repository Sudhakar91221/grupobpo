/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert, TouchableOpacity, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import HeaderDetailComponent from '../../../components/views/HeaderDetailComponent';
import {translate} from '../../../../App';
import moment from 'moment';
import {BottomButton} from '../../../components/views/Button';
import {
  ACCEPT_REQUEST,
  DECLINE_REQUEST,
  REPLY_REQUEST,
  OUTGOING_REQUESTS,
} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  acceptRequestSelector,
  declineRequestSelector,
  replyRequestSelector,
  outgoingRequestSelector,
} from '../Actions/selector';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  acceptRequest,
  declineRequest,
  replyRequest,
  getOutgoingRequests,
} from '../Actions/RequestActions';
import {connect} from 'react-redux';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {ImageComponent} from '../../FormsComponent/Component/Image/ImageComponent';
import {styless} from '../../../components/common/Styles';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';
import {DOWNLOAD_FILE} from '../../FileModule/Actions/type';
import {downloadFile} from '../../FileModule/Actions/FileActions';
import {downloadFileSelector} from '../../FileModule/Actions/selectors';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';

class StaffRequestDetail extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.navigation.state.params.item !== undefined) {
      var formData = {
        fields: [
          {
            name: 'notes',
            type: '1',
            lable:
              'Notes from HR : ' +
              this.props.navigation.state.params.item.hrName,
            rules: 'required',
          },
        ],
      };
    }
    this.state = {
      item: this.props.navigation.state.params.item,
      formData: formData,
    };
    this.currentFieldsRef = {};
    this.currentPageRef = {};
    this.showAcceptAlert = this.showAcceptAlert.bind(this);
    this.onAcceptButtonTapped = this.onAcceptButtonTapped.bind(this);
    this.showDeclineAlert = this.showDeclineAlert.bind(this);
    this.onDeclineButtonTapped = this.onDeclineButtonTapped.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
    this.callDownloadFile = this.callDownloadFile.bind(this);
    this.callDownloadHrFile = this.callDownloadHrFile.bind(this);
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
  }

  componentWillMount() {
    if (this.state.item === undefined) {
      var input = {
        userId: this.props.user.userId,
        companyId: this.props.user.userCompany,
        requestId: this.props.navigation.state.params.requestId,
        page: 1,
        request: OUTGOING_REQUESTS,
      };
      this.props.getOutgoingRequests(input);
    } else {
      this.callDownloadFile();
      this.callDownloadHrFile();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == ACCEPT_REQUEST ||
        this.props.error.request == DECLINE_REQUEST ||
        this.props.error.request == REPLY_REQUEST ||
        this.props.error.request == DOWNLOAD_FILE ||
        this.props.error.request == OUTGOING_REQUESTS)
    ) {
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

    //accept request
    if (this.props.api === ACCEPT_REQUEST) {
      if (this.props.error !== null && this.props.api === ACCEPT_REQUEST) {
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

      if (!this.props.error && this.props.api === ACCEPT_REQUEST) {
        if (this.props.acceptSuccess !== prevProps.acceptSuccess) {
          this.setState({submitLoader: false});
          Alert.alert(
            'Request accepted successfully',
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

    //decline request
    if (this.props.api === DECLINE_REQUEST) {
      if (this.props.error !== null && this.props.api === DECLINE_REQUEST) {
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

      if (!this.props.error && this.props.api === DECLINE_REQUEST) {
        if (this.props.declineSuccess !== prevProps.declineSuccess) {
          this.setState({submitLoader: false});
          Alert.alert(
            'Request declined successfully',
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

    //reply request
    if (this.props.api === REPLY_REQUEST) {
      if (this.props.error !== null && this.props.api === REPLY_REQUEST) {
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

      if (!this.props.error && this.props.api === REPLY_REQUEST) {
        if (this.props.reply !== prevProps.reply) {
          this.setState({submitLoader: false});
          Alert.alert(
            'Reply sent successfully',
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

    //download file
    if (this.props.downloadAPI === DOWNLOAD_FILE) {
      if (
        this.props.error !== null &&
        this.props.downloadAPI === DOWNLOAD_FILE
      ) {
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

      if (!this.props.error && this.props.downloadAPI === DOWNLOAD_FILE) {
        if (this.props.downloadUrl !== prevProps.downloadUrl) {
          this.setState({downloadUrl: this.props.downloadUrl});
        }
      }
    }

    //download hr file
    if (this.props.downloadHrAPI === DOWNLOAD_FILE) {
      if (
        this.props.error !== null &&
        this.props.downloadHrAPI === DOWNLOAD_FILE
      ) {
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

      if (!this.props.error && this.props.downloadHrAPI === DOWNLOAD_FILE) {
        if (this.props.downloadHrUrl !== prevProps.downloadHrUrl) {
          this.setState({downloadHrUrl: this.props.downloadHrUrl});
        }
      }
    }

    //get staff request details
    if (this.props.api === OUTGOING_REQUESTS) {
      if (this.props.error !== null && this.props.api === OUTGOING_REQUESTS) {
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

      if (!this.props.error && this.props.api === OUTGOING_REQUESTS) {
        if (this.props.outgoingRequests !== prevProps.outgoingRequests) {
          var formData = {
            fields: [
              {
                name: 'notes',
                type: '1',
                lable:
                  'Notes from HR : ' + this.props.outgoingRequests[0].hrName,
                rules: 'required',
              },
              {
                "name": "attachment",
                "type": "3",
                "lable": "Attachment",
              },
            ],
          };
          this.setState({
            item: this.props.outgoingRequests[0],
            formData: formData,
          });
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    if (this.state.item === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1, padding: 15}}>
          {this.renderRequestDetails()}
          {this.state.item.status !== '1' ? (
            <View style={{flex: 1}}>
              <View style={{height: 80}}>
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
                  isAddImage={true}
                  navigation={this.props.navigation}
                  getUploadedFileName={this.getUploadedFileName}
                  isUploadImage={false}
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
                  title={translate('send')}
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
          ) : (
            this.renderButtons()
          )}
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
      requestId: this.state.item.requestId,
      hrId: this.state.item.hrId,
      comment: this.currentPageRef.request.currentFieldsRef.notes.state.notes,
      categoryType: this.state.item.categoryType,
      requiredDate: this.state.item.addedon,
      request: REPLY_REQUEST,
    };

    let attachmentRef = this.currentPageRef.request.currentFieldsRef.attachment
    if(attachmentRef) {
      let attachment = attachmentRef.state.attachment[1].imageToUpload
      input['attachment'] = this.state.attachment === undefined
      ? attachment
      : this.state.attachment

    }
    this.props.replyRequest(input);
  }

  renderButtons() {
    return (
      <View style={{flexDirection: 'row', padding: 10, marginTop: 50}}>
        <BottomButton
          style={{flex: 1, borderRadius: 50, margin: 10}}
          title={translate('accept')}
          action={() => this.showAcceptAlert()}
        />
        <BottomButton
          style={{flex: 1, borderRadius: 50, margin: 10}}
          title={translate('decline')}
          action={() => this.showDeclineAlert()}
        />
      </View>
    );
  }

  renderRequestDetails() {
    var title = '';
    switch (this.state.item.categoryType) {
      case '1':
        title = translate('gmbc');
        break;
      case '2':
        title = translate('bir');
        break;
      case '3':
        title = translate('coe');
        break;
      case '4':
        title = translate('reimbursement');
        break;
      case '5':
        title = 'Other : ' + this.state.item.categorySpecified;
    }
    return (
      <View>
        <HeaderDetailComponent
          header={translate('category')}
          description={title}
        />
        <HeaderDetailComponent
          header={translate('purpose')}
          description={this.state.item.purpose}
        />
        <HeaderDetailComponent
          header={translate('required_date')}
          description={moment(this.state.item.addedon).format('DD MMM YYYY')}
        />
        <TouchableOpacity
          onPress={() =>
            this.state.downloadUrl === undefined
              ? null
              : this.props.navigation.navigate('ImageViewer', {
                  imageUrl: this.state.downloadUrl,
                  downloadImage: false,
                })
          }>
          <HeaderDetailComponent
            header={translate('employee_attachment')}
            description={
              this.state.item.requestAttachment === null
                ? translate('not_available')
                : this.state.item.requestAttachment
            }
            isAttachment={
              this.state.item.requestAttachment === null ? false : true
            }
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderResponseDetails() {
    return (
      <View style={{flex: 1}}>
        {this.state.item.replyAttachment === null ? null : (
          <TouchableOpacity
            onPress={() =>
              this.state.downloadUrl === undefined
                ? null
                : this.props.navigation.navigate('ImageViewer', {
                    imageUrl: this.state.downloadHrUrl,
                    downloadImage: false,
                  })
            }>
            <HeaderDetailComponent
              header={translate('hr_attachment')}
              description={
                this.state.item.replyAttachment === null
                  ? translate('not_available')
                  : this.state.item.replyAttachment
              }
              isAttachment={
                this.state.item.replyAttachment === null ? false : true
              }
            />
          </TouchableOpacity>
        )}

        {this.state.item.comments === '' ||
        this.state.item.comments === null ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 16,
              }}>
              No Staff Response Found !!!
            </Text>
          </View>
        ) : (
          <View>
            <HeaderDetailComponent
              header={translate('replied_by')}
              description={this.state.item.hrName}
            />
            <HeaderDetailComponent
              header={translate('comment')}
              description={this.state.item.comments}
            />
          </View>
        )}
      </View>
    );
  }

  callDownloadFile() {
    var input = {
      fileName: this.state.item.requestAttachment,
      request: DOWNLOAD_FILE,
    };
    this.props.downloadFile(input);
  }

  callDownloadHrFile() {
    var input = {
      fileName: this.state.item.replyAttachment,
      request: DOWNLOAD_FILE,
    };
    this.props.downloadHrFile(input);
  }

  showAcceptAlert() {
    Alert.alert(
      '',
      translate('proceed_warning'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this.onAcceptButtonTapped},
      ],
      {cancelable: false},
    );
  }

  onAcceptButtonTapped() {
    var input = {
      requestId: this.state.item.requestId,
      hrId: this.props.user.userId,
      status: 2,
      request: ACCEPT_REQUEST,
    };
    this.props.acceptRequest(input);
  }

  showDeclineAlert() {
    Alert.alert(
      '',
      translate('proceed_warning'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this.onDeclineButtonTapped},
      ],
      {cancelable: false},
    );
  }

  onDeclineButtonTapped() {
    var input = {
      requestId: this.state.item.requestId,
      hrId: this.props.user.userId,
      status: 3,
      request: DECLINE_REQUEST,
    };
    this.props.declineRequest(input);
  }
}
const StaffRequestDetailNew = withTheme(StaffRequestDetail);
StaffRequestDetailNew.navigationOptions = ({
  navigation,
  screenProps,
  params,
}) => {
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
    acceptSuccess: acceptRequestSelector(state.RequestReducer),
    declineSuccess: declineRequestSelector(state.RequestReducer),
    reply: replyRequestSelector(state.RequestReducer),
    downloadAPI: apiSelector(state.FileReducer),
    downloadHrAPI: apiSelector(state.FileReducer),
    downloadUrl: downloadFileSelector(state.FileReducer),
    downloadHrUrl: downloadFileSelector(state.FileReducer),
    outgoingRequests: outgoingRequestSelector(state.RequestReducer),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    acceptRequest: input => dispatch(acceptRequest(input)),
    declineRequest: input => dispatch(declineRequest(input)),
    replyRequest: input => dispatch(replyRequest(input)),
    downloadFile: input => dispatch(downloadFile(input)),
    downloadHrFile: input => dispatch(downloadFile(input)),
    getOutgoingRequests: input => dispatch(getOutgoingRequests(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StaffRequestDetailNew);
