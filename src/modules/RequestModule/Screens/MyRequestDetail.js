/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert, TouchableOpacity, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import HeaderDetailComponent from '../../../components/views/HeaderDetailComponent';
import {translate} from '../../../../App';
import moment from 'moment';
import {DOWNLOAD_FILE} from '../../FileModule/Actions/type';
import {downloadFile} from '../../FileModule/Actions/FileActions';
import {downloadFileSelector} from '../../FileModule/Actions/selectors';
import {connect} from 'react-redux';
import {GET_MY_REQUESTS} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myRequestSelector,
} from '../Actions/selector';
import {getMyRequests} from '../Actions/RequestActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';

class MyRequestDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.navigation.state.params.item,
    };
    this.callDownloadFile = this.callDownloadFile.bind(this);
    this.callDownloadHrFile = this.callDownloadHrFile.bind(this);
  }

  componentWillMount() {
    if (this.state.item === undefined) {
      var input = {
        userId: this.props.user.userId,
        companyId: this.props.user.userCompany,
        requestId: this.props.navigation.state.params.requestId,
        page: 1,
        request: GET_MY_REQUESTS,
      };
      this.props.getMyRequests(input);
    }
    this.callDownloadFile();
    this.callDownloadHrFile();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == DOWNLOAD_FILE ||
        this.props.error.request == GET_MY_REQUESTS)
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

    //get my request details
    if (this.props.api === GET_MY_REQUESTS) {
      if (this.props.error !== null && this.props.api === GET_MY_REQUESTS) {
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

      if (!this.props.error && this.props.api === GET_MY_REQUESTS) {
        if (this.props.requestDetail !== prevProps.requestDetail) {
          this.setState({item: this.props.requestDetail[0]});
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

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{width: '40%', color: 'black'}}
              numberOfLines={1}
              ellipsizeMode="clip">
              --------------------------------------------
            </Text>
            <Text
              style={[
                theme.header,
                {
                  color: theme.black,
                  fontWeight: 'bold',
                  fontSize: 18,
                  paddingLeft: 5,
                  paddingRight: 5,
                },
              ]}>
              Response
            </Text>
            <Text
              style={{width: '40%', color: 'black'}}
              numberOfLines={1}
              ellipsizeMode="clip">
              --------------------------------------
            </Text>
          </View>

          {this.renderResponseDetails()}
        </View>
      </ScrollView>
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
}
const MyRequestDetailNew = withTheme(MyRequestDetail);
MyRequestDetailNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    isLoading: isLoadingSelector(state.RequestReducer),
    api: apiSelector(state.RequestReducer),
    error: errorSelector(state.RequestReducer),
    downloadAPI: apiSelector(state.FileReducer),
    downloadHrAPI: apiSelector(state.FileReducer),
    downloadUrl: downloadFileSelector(state.FileReducer),
    downloadHrUrl: downloadFileSelector(state.FileReducer),
    requestDetail: myRequestSelector(state.RequestReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    downloadFile: input => dispatch(downloadFile(input)),
    downloadHrFile: input => dispatch(downloadFile(input)),
    getMyRequests: input => dispatch(getMyRequests(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRequestDetailNew);
