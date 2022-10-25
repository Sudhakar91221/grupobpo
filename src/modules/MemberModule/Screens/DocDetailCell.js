/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import moment from 'moment';
import Icons from '../../../components/common/Icons';
import {DOWNLOAD_FILE, DELETE_DOCUMENT} from '../../FileModule/Actions/type';
import {
  downloadFile,
  deleteDocument,
} from '../../FileModule/Actions/FileActions';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  downloadFileSelector,
  deleteDocumentSelector,
} from '../../FileModule/Actions/selectors';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';

class DocDetailCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
    this.callDownloadUrl = this.callDownloadUrl.bind(this);
    this.showDeleteAlert = this.showDeleteAlert.bind(this);
    this.callDeleteFile = this.callDeleteFile.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == LEAVE_DETAIL ||
        this.props.error.request == CANCEL_LEAVE ||
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

    //download file
    if (this.props.api === DOWNLOAD_FILE) {
      if (this.props.error !== null && this.props.api === DOWNLOAD_FILE) {
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

      if (!this.props.error && this.props.api === DOWNLOAD_FILE) {
        if (this.props.downloadUrl !== prevProps.downloadUrl) {
          this.props.navigation.navigate('ImageViewer', {
            imageUrl: this.props.downloadUrl,
          });
        }
      }
    }

    //delete file
    if (this.props.api === DELETE_DOCUMENT) {
      if (this.props.error !== null && this.props.api === DELETE_DOCUMENT) {
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

      if (!this.props.error && this.props.api === DELETE_DOCUMENT) {
        if (
          this.props.deleteDocumentSuccess !== prevProps.deleteDocumentSuccess
        ) {
          this.setState({isLoading: false});
        }
      }
    }
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;

    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          flexDirection: 'row',
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={[theme.detail, {color: 'gray'}]}>File Name : </Text>
            <Text
              style={[theme.detail, {color: 'black', width: 80}]}
              numberOfLines={1}>
              {item.fName}
            </Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={[theme.detail, {color: 'gray'}]}>Date : </Text>
            <Text style={[theme.detail, {color: 'black'}]} numberOfLines={1}>
              {moment(item.datetime).format('DD MMM YYYY')}
            </Text>
          </View>
        </View>
        <View style={{flex: 0.1, flexDirection: 'row', paddingRight: 5}}>
          <TouchableOpacity onPress={() => this.callDownloadUrl()}>
            <Icons.MaterialCommunityIcons
              name={'download'}
              size={20}
              tintColor="black"
              color={'black'}
              style={{tintColor: 'black', paddingRight: 5}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.showDeleteAlert()}>
            <Icons.MaterialCommunityIcons
              name={'delete'}
              size={20}
              tintColor="black"
              color={'black'}
              style={{tintColor: 'black', paddingRight: 5}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  callDownloadUrl() {
    var input = {
      fileName: this.props.item.downloadFile,
      request: DOWNLOAD_FILE,
    };
    this.props.downloadFile(input);
  }

  showDeleteAlert() {
    Alert.alert(
      '',
      'Do you really want to delete this file ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this.callDeleteFile},
      ],
      {cancelable: false},
    );
  }

  callDeleteFile() {
    var input = {
      fileId: this.props.item.fId,
      userId: this.props.user.userId,
      employeeId: this.props.employeeId,
      type: this.props.type,
      request: DELETE_DOCUMENT,
    };
    this.props.deleteFile(input);
  }
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FileReducer),
    api: apiSelector(state.FileReducer),
    error: errorSelector(state.FileReducer),
    downloadUrl: downloadFileSelector(state.FileReducer),
    deleteDocumentSuccess: deleteDocumentSelector(state.FileReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    downloadFile: input => dispatch(downloadFile(input)),
    deleteFile: input => dispatch(deleteDocument(input)),
  };
}
const DocDetailCellNew = withTheme(DocDetailCell);
export default connect(mapStateToProps, mapDispatchToProps)(DocDetailCellNew);
