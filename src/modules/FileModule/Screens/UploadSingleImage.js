/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert, Platform, TouchableOpacity} from 'react-native';
import {withTheme} from 'react-native-paper';
import PickImage from '../../../components/views/PickImage';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {connect} from 'react-redux';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  fileAddSelector,
  deleteFileSelector,
} from '../Actions/selectors';
import {addFile, deleteFile} from '../Actions/FileActions';
import {FILE_ADD, FILE_DELETE} from '../Actions/type';
import moment from 'moment';
import AsyncImage from '../../../components/views/AsyncImage';
import Icons from '../../../components/common/Icons';

class UploadSingleImage extends React.Component {
  constructor(props) {
    super(props);
    let imageStyle = {
      justifyContent: 'center',
      tintColor: 'black',
      width: 100,
      height: 100,
      overflow: 'hidden',
      backgroundcolor: 'pink',
    };
    this.state = {
      imageStyle: imageStyle,
      showFilename: false,
      fileName: undefined,
      isAttachmentRemoved: false,
    };
    this.currentPageRef = {};
    this.imagePicked = this.imagePicked.bind(this);
    this.renderAddImageView = this.renderAddImageView.bind(this);
    this.renderEditImageView = this.renderEditImageView.bind(this);
    this.callRemoveAttachmentAPI = this.callRemoveAttachmentAPI.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == FILE_ADD ||
        this.props.error.request == FILE_DELETE)
    ) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                this.setState({showFilename: false, fileName: undefined});
              },
            },
          ],

          {cancelable: false},
        );
      }
    }

    //add file
    if (this.props.api === FILE_ADD) {
      if (this.props.error !== null && this.props.api === FILE_ADD) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.setState({showFilename: false, fileName: undefined});
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === FILE_ADD) {
        if (this.props.fileId !== prevProps.fileId) {
          this.setState({showFilename: true, fileName: moment.now() + '.png'});
          this.props.getUploadedFileName(this.state.image, this.props.fileId);
        }
      }
    }

    //delete file
    if (this.props.api === FILE_DELETE) {
      if (this.props.error !== null && this.props.api === FILE_DELETE) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.setState({showFilename: false, fileName: undefined});
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === FILE_DELETE) {
        if (this.props.fileDeleteSucces !== prevProps.fileDeleteSucces) {
          this.setState({
            showFilename: false,
            fileName: '',
            isAttachmentRemoved: true,
          });
          this.props.getUploadedFileName(this.state.image, '');
        }
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.props.isAddImage === true
          ? this.renderAddImageView()
          : this.renderEditImageView()}
      </View>
    );
  }

  renderAddImageView() {
    let uploadingText = 'Uploading file ....';
    const {theme} = this.props;

    return this.props.isAlbumImage === true &&
      this.props.isUploadImage === true &&
      this.state.image !== undefined ? (
      <AsyncImage
        source={{uri: this.state.image.uri}}
        resizeMode="cover"
        style={{
          justifyContent: 'center',
          tintColor: 'white',
          width: 150,
          height: 150,
          borderRadius: 10,
        }}
        tintColor={theme.primaryColor}
        borderRadius={10}
      />
    ) : this.state.showFilename === false ? (
      <PickImage
        isCustomView={true}
        onImagePicked={this.imagePicked}
        ref={onRef => (this.imagePicker = onRef)}
        onRef={image => {
          this.currentPageRef.image = image;
        }}
        style={this.state.imageStyle}
        isBannerImage={false}
      />
    ) : (
      <Text
        style={[
          theme.detail,
          {
            color: this.state.fileName === undefined ? 'black' : 'blue',
            paddingTop: 15,
            fontWeight: '600',
            paddingLeft: 20,
            fontSize: 16,
          },
        ]}>
        {this.state.fileName === undefined
          ? {uploadingText}
          : this.state.fileName}
      </Text>
    );
  }

  renderEditImageView() {
    let uploadingText = 'Uploading file ....';
    const {theme} = this.props;

    return this.state.isAttachmentRemoved === false ? (
      <View style={{flexDirection: 'row'}}>
        <Text
          style={[
            theme.detail,
            {
              color: 'blue',
              paddingTop: 15,
              fontWeight: '600',
              paddingLeft: 20,
              fontSize: 16,
            },
          ]}>
          {this.props.attachment}
        </Text>
        <TouchableOpacity onPress={() => this.callRemoveAttachmentAPI()}>
          <Icons.MaterialCommunityIcons
            name={'close'}
            size={20}
            tintColor="black"
            color={'black'}
            style={{tintColor: 'black', paddingLeft: 5, paddingBottom: 5}}
          />
        </TouchableOpacity>
      </View>
    ) : this.state.showFilename === false ? (
      <PickImage
        isCustomView={true}
        onImagePicked={this.imagePicked}
        ref={onRef => (this.imagePicker = onRef)}
        onRef={image => {
          this.currentPageRef.image = image;
        }}
        style={this.state.imageStyle}
        isBannerImage={false}
      />
    ) : (
      <Text
        style={[
          theme.detail,
          {
            color: this.state.fileName === undefined ? 'black' : 'blue',
            paddingTop: 15,
            fontWeight: '600',
            paddingLeft: 20,
            fontSize: 16,
          },
        ]}>
        {this.state.fileName === undefined
          ? {uploadingText}
          : this.state.fileName}
      </Text>
    );
  }

  imagePicked = image => {
    if (this.props.isUploadImage === true) {
      this.setState({showFilename: true, image: image});
      let input = {
        userId: this.props.user.userId,
        file: image.imageToUpload,
        type: this.props.input.type,
        typeId: this.props.input.typeId,
        title: this.props.input.title,
        request: FILE_ADD,
      };
      this.props.addFile(input);
    } else {
      let tempImageName = moment.now() + '.png';
      this.setState({showFilename: true, fileName: tempImageName});
      this.props.getUploadedFileName(image.imageToUpload, tempImageName);
    }
  };

  callRemoveAttachmentAPI() {
    var input = {
      type: this.props.input.type,
      typeId: this.props.input.typeId,
      userId: this.props.user.userId,
      request: FILE_DELETE,
    };
    this.props.deleteFile(input);
  }
}

const UploadSingleImageNew = withTheme(UploadSingleImage);

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FileReducer),
    api: apiSelector(state.FileReducer),
    error: errorSelector(state.FileReducer),
    fileId: fileAddSelector(state.FileReducer),
    fileDeleteSucces: deleteFileSelector(state.FileReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addFile: input => dispatch(addFile(input)),
    deleteFile: input => dispatch(deleteFile(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadSingleImageNew);
