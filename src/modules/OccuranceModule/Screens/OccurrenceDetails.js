/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {
  OCCURRENCE_DETAIL,
  DELETE_OCCURRENCE,
  REJECT_OCCURRENCE,
  APPROVE_OCCURRENCE,
} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  occurrenceDetailSelector,
  deleteOccurrenceSelector,
  rejectOccurrenceSelector,
  approveOccurrenceSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  occurrenceDetail,
  deleteOccurrence,
  rejectOccurrence,
} from '../Actions/OccuranceActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import moment from 'moment';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {isPermissionAllowed} from '../../../network/APICall';
import HeaderDetailComponent from '../../../components/views/HeaderDetailComponent';
import {downloadFile} from '../../FileModule/Actions/FileActions';
import {downloadFileSelector} from '../../FileModule/Actions/selectors';
import {DOWNLOAD_FILE} from '../../FileModule/Actions/type';
import DialogInput from '../../../components/views/DialogueInput';

class OccurrenceDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      occurrenceModel:
        this.props.navigation.state.params.item !== undefined
          ? this.props.navigation.state.params.item
          : undefined,
    };
    this.renderOccurrenceDetailView = this.renderOccurrenceDetailView.bind(
      this,
    );
  }

  componentWillMount() {
    if (this.props.navigation.state.params.occId !== undefined) {
      this.fetchData();
    } else {
      this.callDownloadFile();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == OCCURRENCE_DETAIL ||
        this.props.error.request == DOWNLOAD_FILE ||
        this.props.error.request == REJECT_OCCURRENCE ||
        this.props.error.request == APPROVE_OCCURRENCE)
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

    //get occurrence details
    if (this.props.api === OCCURRENCE_DETAIL) {
      if (this.props.error !== null && this.props.api === OCCURRENCE_DETAIL) {
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
        this.state.submitLoader = false;
      }

      if (!this.props.error && this.props.api === OCCURRENCE_DETAIL) {
        if (this.props.occurrenceModel !== this.state.occurrenceModel) {
          this.setState({occurrenceModel: this.props.occurrenceModel}, () =>
            this.callDownloadFile(),
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

    //delete occurrence
    if (this.props.api === DELETE_OCCURRENCE) {
      if (this.props.error !== null && this.props.api === DELETE_OCCURRENCE) {
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

      if (!this.props.error && this.props.api === DELETE_OCCURRENCE) {
        if (this.props.message !== prevProps.message) {
          Alert.alert(
            '',
            this.props.message,
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

    //reject occurrence
    if (this.props.api === REJECT_OCCURRENCE) {
      if (this.props.error !== null && this.props.api === REJECT_OCCURRENCE) {
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

      if (!this.props.error && this.props.api === REJECT_OCCURRENCE) {
        if (this.props.occRejectSuccess !== prevProps.occRejectSuccess) {
          Alert.alert(
            '',
            'Occurrence rejected successfully ',
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

    //approve occurrence
    if (this.props.api === APPROVE_OCCURRENCE) {
      if (this.props.error !== null && this.props.api === APPROVE_OCCURRENCE) {
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

      if (!this.props.error && this.props.api === APPROVE_OCCURRENCE) {
        if (this.props.occApproveSuccess !== prevProps.occApproveSuccess) {
          Alert.alert(
            '',
            'Occurrence approved successfully ',
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
    if (this.state.occurrenceModel === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.renderOccurrenceDetailView()}

          {/* render delete button */}
          {isPermissionAllowed('OccuranceReport/delete') &&
          this.state.occurrenceModel.userId === this.props.user.userId &&
          this.state.occurrenceModel.status === '0' ? (
            <View
              style={{
                paddingLeft: '25%',
                paddingRight: '25%',
                paddingBottom: 10,
                paddingTop: 100,
                flex: 1,
              }}>
              <BottomButton
                style={styless.bottomButton}
                title={translate('cancel')}
                action={() => this.callDeleteOccurrenceAPI()}
                isLoader={this.state.submitLoader}
                isGray={this.state.submitGray}
              />
            </View>
          ) : null}

          {this.state.occurrenceModel.status === '0' &&
          this.state.occurrenceModel.userId !== this.props.user.userId &&
          isPermissionAllowed('OccuranceReport/approve') ? (
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  paddingLeft: '5%',
                  paddingRight: '5%',
                  paddingBottom: 10,
                  paddingTop: 10,
                  flex: 1,
                }}>
                <BottomButton
                  style={styless.bottomButton}
                  title={translate('approve')}
                  action={() =>
                    this.setState({isApprove: true, isRemarkViewVisible: true})
                  }
                  isLoader={this.state.submitLoader}
                  isGray={this.state.submitGray}
                />
              </View>

              <View
                style={{
                  paddingLeft: '5%',
                  paddingRight: '5%',
                  paddingBottom: 10,
                  paddingTop: 10,
                  flex: 1,
                }}>
                <BottomButton
                  style={styless.bottomButton}
                  title={translate('reject')}
                  action={() => this.setState({isRemarkViewVisible: true})}
                  isLoader={this.state.submitLoader}
                  isGray={this.state.submitGray}
                />
              </View>
            </View>
          ) : null}

          {this.state.isRemarkViewVisible === true ? (
            this.state.isApprove === true ? (
              <DialogInput
                isDialogVisible={this.state.isRemarkViewVisible}
                title="Remark"
                message="Approve remark"
                hintInput="Enter remark here"
                submitInput={inputText => {
                  this.sendRemark(inputText);
                }}
                closeDialog={this.onCancelReasonTapped}
                // onEndEditing={this.onEndEditingDialgueInput}
                onChangeText={this.onStartTypingReason}
                error={this.state.dialogueError}
              />
            ) : (
              <DialogInput
                isDialogVisible={this.state.isRemarkViewVisible}
                title="Remark"
                message="Reject remark"
                hintInput="Enter remark here"
                submitInput={inputText => {
                  this.sendRemark(inputText);
                }}
                closeDialog={this.onCancelReasonTapped}
                // onEndEditing={this.onEndEditingDialgueInput}
                onChangeText={this.onStartTypingReason}
                error={this.state.dialogueError}
              />
            )
          ) : null}
        </View>
      </ScrollView>
    );
  }

  onCancelReasonTapped = () => {
    this.setState({remark: null, isRemarkViewVisible: false, isApprove: false});
  };

  onStartTypingReason = input => {
    if (input.length > 0) {
      if (this.state.dialogueError) {
        this.setState({dialogueError: null});
      }
    }
  };

  sendRemark(inputText) {
    if (inputText) {
      if (this.state.isApprove === true) {
        this.setState(
          {
            dialogueError: null,
            remark: inputText,
            isRemarkViewVisible: false,
            isApprove: false,
          },
          () => {
            Alert.alert(
              translate('confirmation'),
              translate('occ_approve_hint'),
              [
                {text: 'No', onPress: () => {}},
                {
                  text: 'Yes',
                  onPress: () => {
                    this.setState({isLoading: true}, () => {
                      this.approveOccReport();
                    });
                  },
                },
              ],
              // {cancelable: false},
            );
          },
        );
      } else {
        this.setState(
          {dialogueError: null, remark: inputText, isRemarkViewVisible: false},
          () => {
            Alert.alert(
              translate('confirmation'),
              translate('occ_reject_hint'),
              [
                {text: 'No', onPress: () => {}},
                {
                  text: 'Yes',
                  onPress: () => {
                    this.setState({isLoading: true}, () => {
                      this.rejectOccReport();
                    });
                  },
                },
              ],
              // {cancelable: false},
            );
          },
        );
      }
    } else {
      this.setState({dialogueError: 'Mandatory'});
    }
  }

  rejectOccReport() {
    var input = {
      adminId: this.props.user.userId,
      occId:
        this.props.navigation.state.params.occId === undefined
          ? this.state.occurrenceModel.occId
          : this.props.navigation.state.params.occId,
      remarks: this.state.remark,
      type: this.state.occurrenceModel.type,
      userName: this.state.occurrenceModel.userName,
      request: REJECT_OCCURRENCE,
    };
    this.props.rejectOccurrence(input);
  }

  approveOccReport() {
    var input = {
      adminId: this.props.user.userId,
      occId:
        this.props.navigation.state.params.occId === undefined
          ? this.state.occurrenceModel.occId
          : this.props.navigation.state.params.occId,
      remarks: this.state.remark,
      type: this.state.occurrenceModel.type,
      userName: this.state.occurrenceModel.userName,
      request: APPROVE_OCCURRENCE,
    };
    this.props.approveOccurrence(input);
  }

  renderOccurrenceDetailView() {
    const {theme} = this.props;
    const item = this.state.occurrenceModel;
    var status = '';
    switch (item.status) {
      case '0':
        status = translate('pending');
        break;
      case '1':
        status = translate('approved');
        break;
      case '2':
        status = translate('rejected');
        break;
    }

    var type = '';
    switch (item.type) {
      case '1':
        type = 'change_in_marital_status';
        break;
      case '2':
        type = 'request_for_maternity_leave';
        break;
      case '3':
        type = 'request_for_extended_maternity_leave';
        break;
      case '4':
        type = 'request_for_paternity_leave';
        break;
      case '5':
        type = 'request_for_solo_parent';
        break;
      case '6':
        type = 'request_for_resign';
        break;
      case '7':
        type = 'request_for_victims';
        break;
    }

    if (item.option !== '') {
      var options = item.option.split('|');
      var oldOption = this.getOptionText(options[0]);
      var newOption = this.getOptionText(options[1]);
    }

    var appliedBy =
      item.userId === this.props.user.userId ? translate('you') : item.userName;
    return (
      <View style={{flex: 1, padding: 15}}>
        <HeaderDetailComponent
          header={translate('type')}
          image={'ic_leave_description'}
          description={translate(type)}
        />
        {item.option !== '' ? (
          <View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{uri: 'ic_leave_description'}}
                style={{height: 20, width: 20, marginTop: 7, marginLeft: 10}}
              />
              <Text
                style={[
                  theme.detail,
                  {
                    color: 'gray',
                    paddingTop: 5,
                    fontWeight: '600',
                    paddingLeft: 10,
                  },
                ]}>
                Change Status to
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  theme.detail,
                  {
                    color: theme.primaryColor,
                    paddingLeft: 20,
                    fontWeight: '600',
                    fontSize: 16,
                  },
                ]}>
                {oldOption}
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontWeight: 'bold',
                  paddingLeft: 10,
                }}>
                ->
              </Text>
              <Text
                style={[
                  theme.detail,
                  {
                    color: 'green',
                    paddingLeft: 10,
                    fontWeight: '600',
                    fontSize: 16,
                  },
                ]}>
                {newOption}
              </Text>
            </View>
          </View>
        ) : null}
        <HeaderDetailComponent
          header={translate('description')}
          image={'ic_leave_description'}
          description={item.detail}
        />
        <HeaderDetailComponent
          header={translate('status')}
          image={'ic_leave_leave_status'}
          description={status}
        />
        <HeaderDetailComponent
          header={translate('applied_on')}
          image={'ic_leave_calendar'}
          description={item.addedOn}
        />
        <HeaderDetailComponent
          header={translate('applied_by')}
          image={'ic_leave_approving_officer'}
          description={appliedBy}
        />
        {item.attachment === null ? null : (
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
              header={translate('attachment')}
              image={'ic_leave_attachment'}
              description={item.attachment}
              isAttachment={true}
            />
          </TouchableOpacity>
        )}
        {item.remarks !== null ? (
          <HeaderDetailComponent
            header={translate('remarks')}
            image={'ic_leave_approving_officer'}
            description={item.remarks}
          />
        ) : null}
      </View>
    );
  }

  getOptionText(status) {
    let statusName = '';
    if (status === '0') {
      statusName = 'Single';
    } else if (status === '1') {
      statusName = 'Married';
    } else if (status === '2') {
      statusName = 'Divorce';
    } else if (status === '3') {
      statusName = 'Widowed';
    }

    return statusName;
  }

  isDateValid() {
    var last = this.state.occurrenceModel.leaveStart;
    var startDate = moment(last).format('YYYY-MM-DD');
    var today = moment().format('YYYY-MM-DD');
    // if today is before last date then hide submit button
    var d1 = Date.parse(today);
    var d2 = Date.parse(startDate);
    if (d2 > d1) {
      return true;
    }
    return false;
  }

  fetchData() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.navigation.state.params.userId,
      //userId: this.props.user.userId,
      occId: this.props.navigation.state.params.occId,
      page: 1,
      request: OCCURRENCE_DETAIL,
    };
    this.props.occurrenceDetail(input);
  }

  callDownloadFile() {
    var input = {
      fileName: this.state.occurrenceModel.attachment,
      request: DOWNLOAD_FILE,
    };
    this.props.downloadFile(input);
  }

  callDeleteOccurrenceAPI() {
    this.setState({submitLoader: true});
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      occId:
        this.props.navigation.state.params.occId === undefined
          ? this.state.occurrenceModel.occId
          : this.props.navigation.state.params.occId,
      request: DELETE_OCCURRENCE,
    };
    this.props.deleteOccurrence(input);
  }
}
const OccurrenceDetailNew = withTheme(OccurrenceDetail);
OccurrenceDetailNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    occurrenceModel: occurrenceDetailSelector(state.OccurrenceReducer),
    downloadAPI: apiSelector(state.FileReducer),
    downloadUrl: downloadFileSelector(state.FileReducer),
    message: deleteOccurrenceSelector(state.OccurrenceReducer),
    occRejectSuccess: rejectOccurrenceSelector(state.OccurrenceReducer),
    occApproveSuccess: approveOccurrenceSelector(state.OccurrenceReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    occurrenceDetail: input => dispatch(occurrenceDetail(input)),
    downloadFile: input => dispatch(downloadFile(input)),
    deleteOccurrence: input => dispatch(deleteOccurrence(input)),
    rejectOccurrence: input => dispatch(rejectOccurrence(input)),
    approveOccurrence: input => dispatch(approveOccurrenceSelector(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OccurrenceDetailNew);
