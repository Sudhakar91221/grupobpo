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
import {ImageComponent} from '../../FormsComponent/Component/Image/ImageComponent';
import {ADD_EVENT} from '../Actions/type';
import {connect} from 'react-redux';
import {
  apiSelector,
  errorSelector,
  isLoadingSelector,
  addEventSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {addEvent} from '../Actions/CalenderActions';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';

class AddEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Public Holiday',
    };
    this.currentPageRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == ADD_EVENT) {
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

    //add event
    if (this.props.api === ADD_EVENT) {
      if (this.props.error !== null && this.props.api === ADD_EVENT) {
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

      if (!this.props.error && this.props.api === ADD_EVENT) {
        if (this.props.eventId !== prevProps.eventId) {
          this.setState({submitLoader: false});
          Alert.alert(
            '',
            'Event added successfully',
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
          <InputForm
            onRef={ref => {
              this.currentPageRef['event'] = ref;
            }}
            item={formData}
            blockModel={formData}
            formId={'0'}
            navigation={this.props.navigation}
            editable={true}
            fromDetail={true}
            hideBottomButton={true}
            isRequireHeader={false}
            // onAnotherScreenSaveButtonTapped={this.onSubmitTapped}
            submitButtonTapped={this.onSubmitTapped}
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

  getUploadedFileName = (imageToUpload, tempImageName) => {
    this.state.imageToUpload = imageToUpload;
  };

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

  getSelectedMembers(data, selectAll, selectCount) {
    console.log('selected members are ');
    this.setState({
      members: data,
      selectAll: selectAll,
      selectCount: selectCount,
    });
  }
  

  onSubmitTapped() {

    this.currentPageRef.event.validationMethod()

    let details = this.currentPageRef.event.currentFieldsRef
    var title = details.title.state.title;
    var type = details.type.state.type;
    var remark = details.remark.state.remark;

    var date = details.date.fromDate.state.date;
    let momentObj = moment(date, 'DD/MM/YYYY');
    let formattedStartDate = moment(momentObj).format('YYYY-MM-DD');

    var endDate = details.date.toDate.state.date;
    let momentObj1 = moment(endDate, 'DD/MM/YYYY');
    let formattedEndDate = moment(momentObj1).format('YYYY-MM-DD');

    var startTime = details.time.fromTime.state.date;
    var endTime = details.time.toTime.state.date;
    // if(startTime !== "" && startTime !== undefined) {
    //   Alert.alert("Time selection mandatory")
    //   return
    // }
    // if(endTime !== "" && endTime !== undefined) {
    //   Alert.alert("Time selection mandatory")
    //   return
    // }

    // if(formattedStartDate !== "" && formattedStartDate !== undefined) {
    //   Alert.alert("Date selection mandatory")
    //   return
    // }
    // if(formattedEndDate !== "" && formattedEndDate !== undefined) {
    //   Alert.alert("Date selection mandatory")
    //   return
    // }

    let list = [];
    if (this.state.members !== undefined) {
      for (let i = 0; i < this.state.members.length; i++) {
        if (this.state.members[i].isSelect)
          list.push(this.state.members[i].userId);
      }
    }

   
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      title: title,
      type: type,
      details: remark,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      startTime: startTime,
      endTime: endTime,
      attendee: list.join(','),
      request: ADD_EVENT,
    };
    let attachmentRef = this.currentPageRef.event.currentFieldsRef.attachment[1]
    if(attachmentRef) {
      let attachment = attachmentRef.state.attachment[1].imageToUpload
      input['attachment'] = attachment

    }


    if(title && type && remark && formattedStartDate && formattedEndDate) {
      this.setState({submitLoader: true});
      this.props.addEvent(input);
    }

  }
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.CalenderReducer),
    api: apiSelector(state.CalenderReducer),
    error: errorSelector(state.CalenderReducer),
    eventId: addEventSelector(state.CalenderReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addEvent: input => dispatch(addEvent(input)),
  };
}
const AddEventNew = withTheme(AddEvent);
export default connect(mapStateToProps, mapDispatchToProps)(AddEventNew);

let formData = {
  fields: [
    {
      name: 'type',
      type: '1',
      lable: 'Event Type',
      rules: 'required',
    },
    {
      name: 'title',
      type: '1',
      lable: 'Title',
      rules: 'required',
    },
    {
      name: 'date',
      mode:'date',
      type: '26',
      lable: 'Date',
      // rules: 'required',
      controller: 'TwoFields',
      childFields : [
        {
          name: 'fromDate',
          type: '7',
          lable: 'From Date',
          // rules: 'required',
        },
        {
          name: 'toDate',
          type: '7',
          lable: 'To Date',
          // rules: 'required',
        },
      ],
    },
    {
      name: 'time',
      mode:'time',
      type: '26',
      lable: 'Date',
      // rules: 'required',
      controller: 'TwoFields',
      childFields : [
        {
          name: 'fromTime',
          type: '8',
          lable: 'Start Time',
          // rules: 'required',
        },
        {
          name: 'toTime',
          type: '8',
          lable: 'End Time',
          // rules: 'required',
        },
      ],
    },
    {
      name: 'remark',
      type: '1',
      lable: 'Note/Remark',
      rules: 'required',
    },
    {
      "name": "attachment",
      "type": "3",
      "lable": "Attachment",
    },
  ],
};
