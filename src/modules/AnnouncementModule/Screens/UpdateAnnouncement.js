/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {UPDATE_HOLIDAY, UPDATE_ANNOUNCEMENT} from '../Actions/type';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  updateAnnouncementSelector,
} from '../Actions/selectors';
import {updateAnnouncement} from '../Actions/AnnouncementActions';
import {translate} from '../../../../App';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import moment from 'moment';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';
import {AttachmentTypes} from '../../FileModule/Actions/FileIntegers';

class UpdateAnnouncement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: undefined,
      formData: undefined,
      fileName: undefined,

    };
    let item = props.navigation.state.params.item;
    let formData = {
      fields: [
        {
          name: 'type',
          type: '1',
          lable: 'Type of announcement',
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
          type: '7',
          lable: 'Date',
          rules: 'required',
          value: item.date,
        },
        {
          name: 'description',
          type: '1',
          lable: 'Description',
          rules: 'required|multiline',
          value: item.details,
        },
        {
          "name": "attachment",
          "type": "3",
          "lable": "Attachment",
        },
      ],
    };
    this.state.item = item;
    this.state.formData = formData;
    this.state.fileName = item.attachment;

    this.currentPageRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == UPDATE_HOLIDAY) {
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

    //update announcement
    if (this.props.api === UPDATE_HOLIDAY) {
      if (this.props.error !== null && this.props.api === UPDATE_HOLIDAY) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
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

      if (!this.props.error && this.props.api === UPDATE_HOLIDAY) {
        if (this.props.success !== prevProps.success) {
          this.setState({submitLoader: false});
          Alert.alert(
            'Holiday updated successfully',
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
            <InputForm
              onRef={ref => {
                this.currentPageRef['announcement'] = ref;
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
    this.currentPageRef.announcement.validationMethod()

    let details = this.currentPageRef.announcement.currentFieldsRef
    var title =
    details.title.state.title === ''
        ? this.state.item.title
        : details.title.state.title;

        if(title) {
          input['title'] = title
        }
    var date =
    details.date.state.date === ''
        ? this.state.item.date
        : details.date.state.date;
    let momentObj = moment(date, 'DD-MM-YYYY');
    let formattedDate = moment(momentObj).format('YYYY-MM-DD');
    var desc =
    details.description.state
        .description === ''
        ? this.state.item.details
        : details.description.state
            .description;

            if(desc) {
              input['details'] = desc
            }
    var type =
    details.type.state.type === ''
        ? this.state.item.type
        : details.type.state.type;

        if(type) {
          input['type'] = type
        }

        
    var input = {
      title: title,
      date: formattedDate,
      details: desc,
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      type: type,
      announcementId: this.state.item.announcementId,
      // // attachment:
      //   this.state.attachment === undefined
      //     ? this.state.imageToUpload
      //     : this.state.attachment,
      request: UPDATE_ANNOUNCEMENT,
    };

    let attachmentRef = details.attachment[1]
    if(attachmentRef) {
      let attachment = attachmentRef.state.attachment[1].imageToUpload
      input['attachment'] = this.state.attachment === undefined
      ? attachment
      : this.state.attachment

    }
    this.setState({submitLoader: true});

    this.props.updateAnnouncement(input);
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
}
const UpdateAnnouncementNew = withTheme(UpdateAnnouncement);
UpdateAnnouncementNew.navigationOptions = ({
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
    isLoading: isLoadingSelector(state.AnnouncementReducer),
    api: apiSelector(state.AnnouncementReducer),
    error: errorSelector(state.AnnouncementReducer),
    success: updateAnnouncementSelector(state.AnnouncementReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateAnnouncement: input => dispatch(updateAnnouncement(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateAnnouncementNew);
