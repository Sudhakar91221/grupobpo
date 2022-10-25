/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import moment from 'moment';
import {translate} from '../../../../App';
import {connect} from 'react-redux';
import {downloadFile} from '../../FileModule/Actions/FileActions';
import {downloadFileSelector} from '../../FileModule/Actions/selectors';
import {DOWNLOAD_FILE} from '../../FileModule/Actions/type';
import {
  apiSelector,
  errorSelector,
  isLoadingSelector,
  updateEventSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {updateEvent} from '../Actions/CalenderActions';
import {UPDATE_EVENT} from '../Actions/type';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';
import {AttachmentTypes} from '../../FileModule/Actions/FileIntegers';
import {BASE_URL,API_KEY} from '../../../network/config'
import {getAttachmentUrl} from '../../../components/utility/common'
class EventUpdate extends React.Component {
    constructor(props) {
    super(props);
    var item = this.props.navigation.state.params.item;
  
   
    this.state = {
      item: item,
      formData: undefined,
      members: item.list,
      selectCount: item.list.length - 1,
    };

    this.currentScreenRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
  }
   
  async setData() {
    var item = this.props.navigation.state.params.item;
    let attachment = await getAttachmentUrl(item.attachment);
      
    let formattedStartDate = moment(item.startDate).format('DD/MM/YYYY');

    let formattedEndDate = moment(item.endDate).format('DD/MM/YYYY');

    let momentTime = moment(item.startTime, 'hh:mm:ss');
    let formattedStartTime = moment(momentTime).format('hh:mm');

    let momentTime1 = moment(item.endTime, 'hh:mm:ss');
    let formattedEndTime = moment(momentTime1).format('hh:mm');

    let formData = {
      fields: [
        {
          name: 'type',
          type: '1',
          lable: 'Event Type',
          rules: 'required',
          value: item.type,
        },
        {
          name: 'title',
          type: '1',
          lable: 'Title',
          rules: 'required',
          value: item.title,
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
          name: 'time',
          mode:'time',
          type: '26',
          lable: 'Date',
          rules: 'required',
          controller: 'TwoFields',
          childFields : [
            {
              name: 'fromTime',
              type: '8',
              lable: 'From',
              rules: 'required',
              value: formattedStartTime,

            },
            {
              name: 'toTime',
              type: '8',
              lable: 'To',
              rules: 'required',
              value: formattedEndTime,

            },
          ],
        },
        {
          name: 'remark',
          type: '1',
          lable: 'Note/Remark',
          rules: 'required',
          value: item.details ? item.details : '',
        },
        {
          "name": "attachment",
          "type": "3",
          "lable": "Attachment",
          value: attachment,

        },
      ],
    };

    this.setState({formData:formData});
  }

  async componentDidMount() {
  }
  async componentWillMount() {
    this.setData()

  }

  
  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == UPDATE_EVENT) {
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

    //update event
    if (this.props.api === UPDATE_EVENT) {
      if (this.props.error !== null && this.props.api === UPDATE_EVENT) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  console.log('OK Pressed');
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === UPDATE_EVENT) {
        if (this.props.eventUpdateSuccess !== prevProps.eventUpdateSuccess) {
          this.setState({submitLoader: false});
          Alert.alert(
            '',
            'Event updated successfully',
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
  }
  }

  render() {
    const {theme} = this.props;

    const item = this.state.item;
    let momentObj = moment(item.startTime, 'HH:mm:ss');
    let startTime = moment(momentObj).format('HH:mm a');
    let momentObj1 = moment(item.endTime, 'HH:mm:ss');
    let endTime = moment(momentObj1).format('HH:mm a');

    var startDate = moment(item.startDate).format('DD MMM YYYY');

    var endDate = moment(item.endDate).format('DD MMM YYYY');

    return (
      <ScrollView style={{flex: 1}}>
          <InputForm
            onRef={ref => {
              this.currentScreenRef['event'] = ref;
            }}
            item={this.state.formData}
            // blockModel={this.state.formData}
            formId={'0'}
            navigation={this.props.navigation}
            editable={true}
            fromDetail={true}
            hideBottomButton={true}
            isRequireHeader={false}
            // startDate={startDate}
            // endDate={endDate}
            // startTime={startTime}
            // endTime={endTime}
          />
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('SelectMembers', {
              getSelectedMembers: this.getSelectedMembers.bind(this),
            })
          }>
          <View style={{flexDirection: 'row'}}>
            <Text style={[theme.header, {color: 'gray', paddingLeft: 10}]}>
              {translate('attendees')}
            </Text>
            <Image
              source={require('../../../assets/ic_add_circle.png')}
              style={{width: 30, height: 30}}
            />
          </View>
        </TouchableOpacity>

        {this.state.members === undefined
          ? this.renderMemberName({userName: 'All Members', isSelect: true})
          : this.renderMemberName({
              userName:
                this.state.members[0].userName +
                ' and ' +
                this.state.selectCount +
                ' others',
              isSelect: true,
            })}


        <View
          style={{
            paddingLeft: '20%',
            paddingRight: '20%',
            paddingBottom: 20,
            paddingTop: 20,
          }}>
          <BottomButton
            style={styless.bottomButton}
            title={'Submit'}
            action={
              !this.state.submitLoader && !this.state.submitGray
                ? this.onSubmitTapped
                : null
            }
            isLoader={this.state.submitLoader}
            isGray={this.state.submitGray}
          />
        </View>
      </ScrollView>
    );
  }

  renderMemberName(item) {
    return item.isSelect === true ? (
      <View
        style={{
          backgroundColor: '#EEE',
          borderRadius: 20,
          alignItems: 'center',
          alignSelf: 'center',
          margin: 5,
          padding: 10,
        }}>
        <Text style={{fontSize: 14, color: 'black'}}>{item.userName}</Text>
      </View>
    ) : null;
  }

  callDownloadFile() {
    var input = {
      fileName: this.state.item.attachment,
      request: DOWNLOAD_FILE,
    };
    this.props.downloadFile(input);
  }
  getSelectedMembers(data, selectAll, selectCount) {
    console.log('selected members are ');
    this.setState({
      members: data,
      selectAll: selectAll,
      selectCount: selectCount,
    });
  }

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
    

    let list = [];
    for (let i = 0; i < this.state.members.length; i++) {
      if (this.state.members[i].isSelect)
        list.push(this.state.members[i].userId);
    }

    
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      attendee: list.join(','),
      eventId: this.state.item.eventId,
      request: UPDATE_EVENT,
    };

    let details = this.currentScreenRef.event.currentFieldsRef
    if(details.title) {
      var title = details.title.state.title;
      input['title'] = title
    }
    if(details.type) {
      var type = details.type.state.type;
      input['type'] = type
    }

    if(details.remark) {
      var remark = details.remark.state.remark;
      input['remark'] = remark
    }

    if(details.date.fromDate) {
      var date = details.date.fromDate.state.date;
      let formattedStartDate = moment(date).format('DD/MM/YYYY');
      input['startDate'] = formattedStartDate
    }

    if(details.date.toDate) {
      var endDate = details.date.toDate.state.date;
      let formattedEndDate = moment(endDate).format('DD/MM/YYYY');
      input['endDate'] = formattedEndDate;

    }

    if(details.date.fromTime) {
      var startTime = details.time.fromTime.state.date;
      input['startTime'] = startTime;

    }   
    if(details.date.toTime) {
      var endTime = details.time.toTime.state.date;
      input['endTime'] = endTime;
    }    
     
    
    let attachmentRef = this.currentScreenRef.event.currentFieldsRef.attachment[1]
    if(attachmentRef) {
      let attachment = attachmentRef.state.attachment[1].imageToUpload
      input['attachment'] = this.state.attachment === undefined
      ? attachment
      : this.state.attachment

    }
    this.props.updateEvent(input);
  }
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.CalenderReducer),
    api: apiSelector(state.CalenderReducer),
    error: errorSelector(state.CalenderReducer),
    eventUpdateSuccess: updateEventSelector(state.CalenderReducer),
    downloadAPI: apiSelector(state.FileReducer),
    downloadUrl: downloadFileSelector(state.FileReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateEvent: input => dispatch(updateEvent(input)),
    
  };
}

const EventUpdateNew = withTheme(EventUpdate);
export default connect(mapStateToProps, mapDispatchToProps)(EventUpdateNew);
