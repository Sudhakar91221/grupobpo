/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, TouchableOpacity, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {GET_ANNOUNCEMENTS_PUBLISHED} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  publishedAnnouncementsSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getPublishedAnnouncements} from '../Actions/AnnouncementActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {translate} from '../../../../App';
import HeaderDetailComponent from '../../../components/views/HeaderDetailComponent';
import {DOWNLOAD_FILE} from '../../FileModule/Actions/type';
import {downloadFile} from '../../FileModule/Actions/FileActions';
import {downloadFileSelector} from '../../FileModule/Actions/selectors';

class AnnouncementDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      announcementDetail: undefined,
      downloadUrl: undefined,
    };
    this.renderAnnouncementDetailView = this.renderAnnouncementDetailView.bind(
      this,
    );
    this.callDownloadFile = this.callDownloadFile.bind(this);
  }

  componentWillMount() {
    var item = this.props.navigation.state.params.item;
    if (item === undefined) {
      this.fetchData();
    } else {
      this.state.announcementDetail = item;
      this.callDownloadFile();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_ANNOUNCEMENTS_PUBLISHED ||
        this.props.error.request == DOWNLOAD_FILE)
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

    //get leave details
    if (this.props.api === GET_ANNOUNCEMENTS_PUBLISHED) {
      if (
        this.props.error !== null &&
        this.props.api === GET_ANNOUNCEMENTS_PUBLISHED
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

      if (!this.props.error && this.props.api === GET_ANNOUNCEMENTS_PUBLISHED) {
        if (this.props.announcementDetail[0] !== this.state.announcementDetail) {
          this.setState({announcementDetail: this.props.announcementDetail[0]});
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
        if (this.props.downloadUrl !== this.state.downloadUrl) {
          this.setState({downloadUrl: this.props.downloadUrl});
        }
      }
    }
  }

  render() {
    if (this.state.announcementDetail === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        {this.renderAnnouncementDetailView()}
      </ScrollView>
    );
  }

  renderAnnouncementDetailView() {
    const {theme} = this.props;
    const item = this.state.announcementDetail;

    return (
      <View style={{flex: 1}}>
        <HeaderDetailComponent
          header={translate('title')}
          image={'ic_leave_description'}
          description={item.title}
        />
        <HeaderDetailComponent
          header={translate('announcement_type')}
          image={'ic_leave_description'}
          description={item.type}
        />
        <HeaderDetailComponent
          header={translate('leave_period')}
          image={'ic_leave_calendar'}
          description={item.date}
        />
        <HeaderDetailComponent
          header={translate('description')}
          image={'ic_leave_description'}
          description={item.details}
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
      </View>
    );
  }

  callDownloadFile() {
    var input = {
      fileName: this.state.announcementDetail.attachment,
      request: DOWNLOAD_FILE,
    };
    this.props.downloadFile(input);
  }

  fetchData() {
    var input = {
      announcementId: this.props.navigation.state.params.announcementId,
      companyId: this.props.user.userCompany,
      type: 0,
      userType: this.props.user.userType,
      page: 1,
      request: GET_ANNOUNCEMENTS_PUBLISHED,
    };
    this.props.getPublishedAnnouncements(input);
  }
}
const AnnouncementDetailNew = withTheme(AnnouncementDetail);
AnnouncementDetailNew.navigationOptions = ({
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
    announcementDetail: publishedAnnouncementsSelector(
      state.AnnouncementReducer,
    ),
    downloadAPI: apiSelector(state.FileReducer),
    downloadUrl: downloadFileSelector(state.FileReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getPublishedAnnouncements: input =>
      dispatch(getPublishedAnnouncements(input)),
    downloadFile: input => dispatch(downloadFile(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnnouncementDetailNew);
