/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {ADD_ANNOUNCEMENT} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  addAnnouncementSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {addAnnouncement} from '../Actions/AnnouncementActions';
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

class AddAnnouncement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.inputForm = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == ADD_ANNOUNCEMENT) {
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

    //add announcement
    if (this.props.api === ADD_ANNOUNCEMENT) {
      if (this.props.error !== null && this.props.api === ADD_ANNOUNCEMENT) {
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

      if (!this.props.error && this.props.api === ADD_ANNOUNCEMENT) {
        if (this.props.announcementId !== prevProps.announcementId) {
          this.setState({submitLoader: false});
          Alert.alert(
            'Announcement added successfully',
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
                this.inputForm['announcement'] = ref;
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
    this.inputForm.announcement.validationMethod()

    

    let details = this.inputForm.announcement.currentFieldsRef

      var startDate = details.date.state.date;
      let momentObj = moment(startDate, 'DD/MM/YYYY');
      let formattedStartDate = moment(momentObj).format('YYYY-MM-DD');
  
    var title = details.title.state
      .title;
    var detailss = details.description
      .state.description;
    var type = details.type.state
      .type;


    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      title: title,
      details: detailss,
      type: type,
      date: formattedStartDate,
      request: ADD_ANNOUNCEMENT,
    };

    let attachmentRef = this.inputForm.announcement.currentFieldsRef.attachment[1]
    if(attachmentRef) {
      let attachment = attachmentRef.state.attachment[1].imageToUpload
      input['attachment'] = this.state.attachment === undefined
      ? attachment
      : this.state.attachment

    }

    if(type && title && details) {
      this.setState({submitLoader: true});
      this.props.addAnnouncement(input);
    }
   
  }
}
const AddAnnouncementNew = withTheme(AddAnnouncement);
AddAnnouncementNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    announcementId: addAnnouncementSelector(state.AnnouncementReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addAnnouncement: input => dispatch(addAnnouncement(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAnnouncementNew);
let formData = {
  fields: [
    {
      name: 'type',
      type: '1',
      lable: 'Type of announcement',
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
      type: '7',
      lable: 'Date',
      rules: 'required',
    },
    {
      name: 'description',
      type: '1',
      lable: 'Description',
      rules: 'required',
    },
    {
      "name": "attachment",
      "type": "3",
      "lable": "Attachment",
    }
  ],
};
