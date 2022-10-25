/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Image, Alert} from 'react-native';
import {StackActions} from 'react-navigation';
import PickImage from '../../../components/views/PickImage';
import {connect} from 'react-redux';

import {requestHeader} from '../../../network/APICall';
import ImageUploader from './ImageUploader';
import AsyncImage from '../../../components/views/AsyncImage';
import {
  SUPPORT_REPLY_IMAGE_DOWNLOAD_URL,
  SUPPORT_TEMP_IMAGE_DOWNLOAD_URL,
  SUPPORT_TICKET_IMAGE_DOWNLOAD_URL,
  API_KEY,
} from '../../../network/config';
import VideoPlayer from '../../../components/external/VideoPlayer';
import Icons from '../../../components/common/Icons';
import {removeWord} from '../../../components/utility/common';
import axios from 'axios';
const IMAGE_HEIGHT = 40;
const IMAGE_WIDTH = 40;
const IMAGE_WIDTH_HEIGHT = 40;

global.uploadedImageName = '';

import {imageUploadSelector} from '../Actions/selectors';
import { styless } from '../../../components/common/Styles';

class ImageCell extends React.PureComponent {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      longPressImageId: [],
      items: null,
    };
    this.imagePicked = this.imagePicked.bind(this);
    this.updateServerImage = this.updateServerImage.bind(this);
    this.onDeleteImages = this.onDeleteImages.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.renderDeleteImageButton = this.renderDeleteImageButton.bind(this);
    this.onDeleteImageButtonTapped = this.onDeleteImageButtonTapped.bind(this);
    this.renderCloseUploadRequestButton = this.renderCloseUploadRequestButton.bind(
      this,
    );
    this.onCloseUploadRequestButtonTapped = this.onCloseUploadRequestButtonTapped.bind(
      this,
    );
    this.showDetailActual = this.showDetailActual.bind(this);
    this.showDetailTemp = this.showDetailTemp.bind(this);
    this.showDetailUploader = this.showDetailUploader.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }
  renderAddImage(item) {
    console.log('---------------1 local image');
    return (
      <TouchableOpacity style={{flex: 1, flexDirection: 'column', margin: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <PickImage
              placeholderImage={require('../../../assets/add.png')}
              onImagePicked={this.imagePicked}
              ref={ref => (this.imagePicker = ref)}
              style={styles.imageThumbnail}
            />
          </View>
        </View>
        <Text
          style={{
            color: 'black',
            justifyContent: 'center',
            paddingTop: 10,
            paddingBottom: 10,
          }}>
          Add Attachment
        </Text>
      </TouchableOpacity>
    );
  }

  renderImageUploader(item) {
    console.log('---------------1 Uploading');

    return (
      <TouchableOpacity
        style={{flex: 1, flexDirection: 'row', margin: 1}}
        onPress={this.showDetailUploader}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            {this.checkForSelectedMediaISVideo(item.imageToUpload.name) ==
            true ? (
              <AsyncImage
                source={require('../../../assets/video.png')}
                resizeMode="stretch"
                style={[
                  styles.imageThumbnail,
                  {
                    width: 40,
                    height: 40,
                    tintColor: 'gray',
                  },
                ]}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ImageUploader
                    image={item.imageToUpload}
                    id={this.props.id}
                    imageId={item.imageId}
                    localImage={item.image}
                    title="test title"
                    updateServerImage={this.updateServerImage}
                    retryItem={this.props.retryItem}
                    axiosCancelSource={this.props.axiosCancelSource}
                  />
                </View>
              </AsyncImage>
            ) : (
              <AsyncImage
                source={{uri: item.image}}
                resizeMode="stretch"
                style={[styles.imageThumbnail, {width: 40, height: 40}]}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ImageUploader
                    image={item.imageToUpload}
                    id={this.props.id}
                    imageId={item.imageId}
                    localImage={item.image}
                    title="test title"
                    updateServerImage={this.updateServerImage}
                    retryItem={this.props.retryItem}
                    axiosCancelSource={this.props.axiosCancelSource}
                  />
                </View>
              </AsyncImage>
            )}

            {this.props.retryItem == true ? (
              <Text
                style={[
                  styless.detail,
                  {color: 'red', justifyContent: 'center', alignSelf: 'center'},
                ]}>
                Uploading Failed Retry...
              </Text>
            ) : (
              <Text
                style={[
                  styless.detail,
                  {justifyContent: 'center', alignSelf: 'center'},
                ]}>
                Uploading....
              </Text>
            )}
          </View>
          {this.renderCloseUploadRequestButton(item)}
        </View>
      </TouchableOpacity>
    );
  }

  renderActualImage(item, isReply) {
    console.log('---------------1 actual image');
    let uri = isReply
      ? `${SUPPORT_REPLY_IMAGE_DOWNLOAD_URL}/${this.props.id}/${item}`
      : `${SUPPORT_TICKET_IMAGE_DOWNLOAD_URL}/${this.props.id}/${item}`;

    console.log(uri);
    return (
      // <View>
      <TouchableOpacity
        style={{flex: 1, flexDirection: 'row', margin: 1}}
        onPress={this.showDetailActual}
        onLongPress={this.onLongPress(item)}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            {this.checkForSelectedMediaISVideo(item) == true ? (
              <Image
                source={require('../../../assets/video.png')}
                style={[
                  styles.imageThumbnail,
                  {
                    width: 40,
                    height: 40,
                    tintColor: 'gray',
                  },
                ]}
                blurRadius={this.props.selected ? 3 : 0}
                tintColor="gray"
              />
            ) : (
              <AsyncImage
                source={{
                  uri: uri,
                  method: 'GET',
                  // headers: requestHeader
                }}
                resizeMode="stretch"
                style={[styles.imageThumbnail, {width: 40, height: 40}]}
                blurRadius={this.props.selected ? 3 : 0}>
                {this.props.selected == true &&
                  {
                    /* <View style={{position: 'absolute',  top:0, right: 0, bottom: 0, left:0, justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent'}}>
                 <Image source ={require('../../../assets/ic_check_circle.png')}
                   tintColor='green'
                   style={[{width:40,height:40,justifyContent:'flex-end',bottom:0,tintColor:'green'}]}>
                 </Image> 
          </View>  */
                  }}
              </AsyncImage>
            )}
            <Text
              style={{
                color: 'blue',
                justifyContent: 'center',
                alignSelf: 'center',
                paddingLeft: 10,
              }}>
              {item}
            </Text>
          </View>
          {/* {this.renderDeleteImageButton()} */}
        </View>
      </TouchableOpacity>
      // </View>
    );
  }

  getFileExtension(filename) {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : ext[1];
  }
  checkForSelectedMediaISVideo(filename) {
    let extension = this.getFileExtension(filename);
    if (
      extension == 'mp4' ||
      extension == 'wmv' ||
      extension == 'flv' ||
      extension == 'ogg' ||
      extension == 'AVI' ||
      extension == 'WAV' ||
      extension == 'MOV' ||
      extension == 'mov'
    ) {
      return true;
    }
    return false;
  }

  renderTempImage(item) {
    console.log('---------------1 temp image');

    return (
      // <View>
      <TouchableOpacity
        style={{flex: 1, flexDirection: 'row', margin: 1}}
        onPress={this.showDetailTemp}
        onLongPress={this.onLongPress(item)}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            {this.checkForSelectedMediaISVideo(item.fileName) == true ? (
              <Image
                source={require('../../../assets/video.png')}
                style={[
                  styles.imageThumbnail,
                  {
                    width: 40,
                    height: 40,
                    tintColor: 'gray',
                  },
                ]}
                blurRadius={this.props.selected ? 3 : 0}
                tintColor="gray"
              />
            ) : (
              <AsyncImage
                source={{
                  uri: `${SUPPORT_TEMP_IMAGE_DOWNLOAD_URL}/${item.fileName}`,
                  // method: 'GET',
                  // headers: requestHeader
                }}
                resizeMode="stretch"
                style={[styles.imageThumbnail, {width: 40, height: 40}]}
                blurRadius={this.props.selected ? 3 : 0}>
                {this.props.selected == true &&
                  {
                    /* <View style={{position: 'absolute',  top:0, right: 0, bottom: 0, left:0, justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent'}}>
                <Image source ={require('../../../assets/ic_check_circle.png')}
                   tintColor='green'
                   style={[{width:40,height:40,justifyContent:'flex-end',bottom:0,tintColor:'green'}]}>
                 </Image>
          </View>  */
                  }}
              </AsyncImage>
            )}
            <Text
              style={{
                color: 'blue',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              {item.fileName}
            </Text>
          </View>
          {this.renderDeleteImageButton(item)}
        </View>
      </TouchableOpacity>
      //
    );
  }

  renderDeleteImageButton(item) {
    return (
      <TouchableOpacity
        onPress={this.onDeleteImageButtonTapped(item)}
        style={{
          justifyContent: 'center',
          alignSelf: 'flex-end',
          paddingRight: 10,
          paddingBottom: 10,
        }}>
        <Icons.MaterialIcons name="delete-forever" size={35} color="gray" />
      </TouchableOpacity>
    );
  }
  onDeleteImageButtonTapped = item => e => {
    if (
      global.uploadedImageName !== undefined ||
      global.uploadedImageName != ''
    ) {
      if (global.uploadedImageName.includes(',')) {
        let search = item.fileName + ',';
        global.uploadedImageName = removeWord(search, global.uploadedImageName);
      } else {
        global.uploadedImageName = removeWord(
          item.fileName,
          global.uploadedImageName,
        );
      }
    }
    this.onDeleteImages(item);
    // this.setState({
    // })
  };

  onDeleteImages(item) {
    this.props.onDeleteImages(item);
  }

  renderCloseUploadRequestButton(item) {
    // TODO:
    // return (
    //       <TouchableOpacity onPress={this.onCloseUploadRequestButtonTapped(item)} style={{justifyContent:'flex-end',alignSelf:'flex-end'}}>
    //             <Icons.MaterialIcons name='close' size={35} color='gray'/>
    //       </TouchableOpacity>
    // )
  }
  onCloseUploadRequestButtonTapped = item => {
    // this.setState({
    // })

    axios.cancel(this.props.axiosCancelSource);
  };

  render() {
    let height = IMAGE_WIDTH_HEIGHT;
    const {item} = this.props;

    if (this.props.isActual !== undefined && this.props.isActual == true) {
      image = this.renderActualImage(item, this.props.isReply);
      return image;
    }

    let image = <View style={{width: 0, height: 0}}> </View>;

    if (item.imageId == '-1') {
      image = this.renderAddImage(item);
    } else if (item.imageToUpload !== undefined) {
      image = this.renderImageUploader(item);
    } else {
      image = this.renderTempImage(item);
    }

    // else {
    //   image = this.renderActualImage(item)
    // }

    return image;
  }

  imagePicked = image => {
    this.props.onImagePickedHandler(image);
  };

  onLongPress = item => e => {
    this.props.onLongPressItem(item);
  };

  updateServerImage = (serverImage, oldId) => {
    this.props.updateServerImage(serverImage, oldId);
  };

  showDetailActual = () => {
    let uri = '';

    let screenName = 'VideoPlayer';
    let param = undefined;
    const {item} = this.props;

    if (this.checkForSelectedMediaISVideo(item)) {
      screenName = 'VideoPlayer';
      uri = item;
    } else {
      screenName = 'ImageViewer';
      uri = item;
    }

    let imageUrl = this.props.isReply
      ? `${SUPPORT_REPLY_IMAGE_DOWNLOAD_URL}/${this.props.id}/${uri}`
      : `${SUPPORT_TICKET_IMAGE_DOWNLOAD_URL}/${this.props.id}/${uri}`;

    const pushAction = StackActions.push({
      routeName: screenName,
      params: {
        imageUrl,
      },
    });
    this.props.navigation.dispatch(pushAction);
  };

  showDetailUploader = () => {
    let screenName = 'VideoPlayer';
    let param = undefined;
    const {item} = this.props;
    let uri = '';
    if (this.checkForSelectedMediaISVideo(item.imageToUpload.name)) {
      screenName = 'VideoPlayer';
      uri = item.image;
    } else {
      screenName = 'ImageViewer';
      uri = item.imageToUpload.uri; //TODO:
    }
    let imageUrl = uri;

    const pushAction = StackActions.push({
      routeName: screenName,
      params: {
        imageUrl,
      },
    });
    this.props.navigation.dispatch(pushAction);
  };

  showDetailTemp = () => {
    let screenName = 'VideoPlayer';
    let param = undefined;
    const {item} = this.props;
    let uri = '';
    if (this.checkForSelectedMediaISVideo(item.fileName)) {
      screenName = 'VideoPlayer';
      uri = item.fileName;
    } else {
      screenName = 'ImageViewer';
      uri = item.fileName;
    }
    let imageUrl = `${SUPPORT_TEMP_IMAGE_DOWNLOAD_URL}/${uri}`;

    const pushAction = StackActions.push({
      routeName: screenName,
      params: {
        imageUrl,
      },
    });
    this.props.navigation.dispatch(pushAction);
  };
}

//MARK: - Data Management

function mapStateToProps(state) {
  if (state.SupportReducer.error && state.SupportReducer.error.message != '') {
    Alert.alert(state.SupportReducer.error.message);
  }

  if (state.FileReducer.error && state.FileReducer.error.message != '') {
    Alert.alert(state.FileReducer.error.message);
  }

  let files = '';
  if (state.fileName != '' && state.fileName != undefined) {
    files = state.fileName + ',';
  }
  return {
    // user      : state.UserReducer.user,
    // supportList : supportListSelector(state.SupportReducer),
    // supportModel : supportDetailSelector(state.SupportReducer),
    // commentList:  supportCommentListSelector(state.SupportReducer),
    // isLoading : isLoadingSelector(state.SupportReducer),
    // api       : apiSelector(state.SupportReducer),
    // error     : errorSelector(state.SupportReducer),
    uploadedImageName: files + imageUploadSelector(state.SupportReducer),
  };
}
//TODO: need to remove this
export default connect(mapStateToProps)(ImageCell);

const styles = {
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: IMAGE_WIDTH_HEIGHT,
    width: IMAGE_WIDTH_HEIGHT,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // width:300,
    // height:300
  },
};
