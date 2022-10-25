/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text, Image, Platform} from 'react-native';
import {StackActions} from 'react-navigation';
import PickImage from '../../../../components/views/PickImage';

import ImageUploader from './ImageUploader';
import AsyncImage from '../../../../components/views/AsyncImage';
import {styless} from '../../../../components/common/Styles';

import Icons from '../../../../components/common/Icons';
import {removeWord} from '../../../../components/utility/common';
import {IMAGE_DOWNLOAD_URL,USER_IMAGE_DOWNLOAD_URL} from '../../../../network/config';
import ActionSheet from 'react-native-action-sheet';
import axios from 'axios';
import {translate} from '../../../../../App';
import CardView from '../../../../components/views/CardView';
import {primaryColor} from '../../../../components/common/Theme/themeProvider';
// const IMAGE_HEIGHT = 40
// const IMAGE_WIDTH = 40
// let IMAGE_WIDTH_HEIGHT = 40
// let CIRCULAR = false
// let RECTANGULAR = false
global.uploadedImageName = '';

class ImageCell extends React.PureComponent {
  _isMounted = false;

  constructor(props) {
    super(props);
    // IMAGE_WIDTH_HEIGHT = props.style.width
    // CIRCULAR = props.isCircular
    // RECTANGULAR = props.isRectangular

    this.state = {
      longPressImageId: [],
      items: null,
      borderRadius:
        props.isCircular === true ? this.props.style.width / 2.0 : null,
      imageStyle: '',
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
    this.currentPageRef = {};

    this.onCloseUploadRequestButtonTapped = this.onCloseUploadRequestButtonTapped.bind(
      this,
    );
    this.showDetailActual = this.showDetailActual.bind(this);
    this.showDetailTemp = this.showDetailTemp.bind(this);
    this.showDetailUploader = this.showDetailUploader.bind(this);
    this.checkForSelectedMediaISVideo = this.checkForSelectedMediaISVideo.bind(
      this,
    );
    this.checkForSelectedMediaIsDoc = this.checkForSelectedMediaIsDoc.bind(
      this,
    );
    this.changeImage = this.changeImage.bind(this);
  }

  componentWillMount() {
    if (this.props.isRectangular == true || this.props.isCircular === false) {
      this.state.imageStyle = {
        justifyContent: 'center',
        tintColor: 'white',
        width: this.props.style.width,
        height: this.props.style.height,
        borderRadius: this.props.borderRadius ? this.props.borderRadius : 0,
        borderTopLeftRadius: this.props.borderRadius
          ? this.props.borderRadius
          : 0,
        borderTopRightRadius: this.props.borderRadius
          ? this.props.borderRadius
          : 0,
        borderBottomLeftRadius: this.props.borderRadius
          ? this.props.borderRadius
          : 0,
        borderBottomRightRadius: this.props.borderRadius
          ? this.props.borderRadius
          : 0,
        overflow: 'hidden',
        // backgroundColor: 'pink',
      };
    } else {
      this.state.imageStyle = {
        justifyContent: 'center',
        tintColor: 'white',
        width: this.props.style.width,
        height: this.props.style.height,
        borderTopLeftRadius: this.props.style.width / 2,
        borderTopRightRadius: this.props.style.width / 2,
        borderBottomLeftRadius: this.props.style.width / 2,
        borderBottomRightRadius: this.props.style.width / 2,
        overflow: 'hidden',
        borderRadius: this.props.style.width / 2,
      };
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
    if (this.props.isRectangular == true || this.props.isCircular === false) {
      this.state.imageStyle = {
        justifyContent: 'center',
        tintColor: 'white',
        width: this.props.style.width,
        height: this.props.style.height,
        borderRadius: this.props.borderRadius ? this.props.borderRadius : 0,
        borderTopLeftRadius: this.props.borderRadius
          ? this.props.borderRadius
          : 0,
        borderTopRightRadius: this.props.borderRadius
          ? this.props.borderRadius
          : 0,
        borderBottomLeftRadius: this.props.borderRadius
          ? this.props.borderRadius
          : 0,
        borderBottomRightRadius: this.props.borderRadius
          ? this.props.borderRadius
          : 0,
        overflow: 'hidden',
        // backgroundColor: 'pink',
      };
    } else {
      this.state.imageStyle = {
        justifyContent: 'center',
        tintColor: 'white',
        width: this.props.style.width,
        height: this.props.style.height,
        borderTopLeftRadius: this.props.style.width / 2,
        borderTopRightRadius: this.props.style.width / 2,
        borderBottomLeftRadius: this.props.style.width / 2,
        borderBottomRightRadius: this.props.style.width / 2,
        overflow: 'hidden',
        borderRadius: this.props.style.width / 2,
      };
    }
  }

  renderAddImage(item) {
    const isPLaceholder =
      this.props.placeholderImage != undefined &&
      this.props.placeholderImage != null;

    return (
      <TouchableOpacity style={styless.textVertical}>
        <PickImage
          placeholderImage={isPLaceholder ? this.props.placeholderImage : 'add'}
          isCustomView={this.props.addImageViewCustom}
          onImagePicked={this.imagePicked}
          ref={onRef => (this.imagePicker = onRef)}
          onRef={image => {
            this.currentPageRef.image = image;
          }}
          style={this.state.imageStyle}
          showBorder={this.props.showBorder != undefined ? true : false}
          borderRadius={
            this.props.borderRadius != undefined
              ? this.props.borderRadius
              : this.state.borderRadius
          }
          borderColor={this.props.borderColor}
          isBannerImage={this.props.isBannerImage}
          addImageLabel={this.props.addImageLabel}
          imageOnly={this.props.imageOnly}
        />
        {this.props.addImageViewCustom == undefined &&
          this.props.isBannerImage === false && (
            <Text
              style={{
                color: 'black',
                justifyContent: 'center',
                alignSelf: 'center',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              {' '}
              {this.props.addImageLabel != undefined
                ? this.props.addImageLabel
                : 'ADD IMAGES'}{' '}
            </Text>
          )}
      </TouchableOpacity>
    );
  }

  renderAddImageCustom(item) {
    const isPLaceholder =
      this.props.placeholderImage != undefined &&
      this.props.placeholderImage != null;

    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={[styless.nextToEach, {flex: 1, backgroundColor: 'lightgray'}]}>
          <PickImage
            ref={ref => (this.imagePicker = ref)}
            placeholderImage={'upload'}
            touchWidth={'100%'}
            touchHeight={'100%'}
            onImagePicked={this.imagePicked}
            style={[this.state.imageStyle, {width: 100, height: 80}]}
            showBorder={this.props.showBorder != undefined ? true : false}
            borderRadius={
              this.props.borderRadius != undefined
                ? this.props.borderRadius
                : this.state.borderRadius
            }
          />
          <View
            style={{
              color: 'black',
              justifyContent: 'flex-start',
              alignSelf: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              width: '80%',
            }}>
            <Text> {'Upload File'} </Text>
            <Text>{translate('upload_hint')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  renderImageAdder(item) {
    console.log('---------------1 Uploading');

    return (
      <TouchableOpacity
        style={[styless.textVertical]}
        onPress={this.showDetailUploader(item,this.props.type)}>
        {item && item.imageToUpload !== undefined &&
        this.checkForSelectedMediaISVideo(item.imageToUpload.name) == true ? (
          this.renderVideoView(item, item.imageToUpload.name)
        ) : item && item.imageToUpload !== undefined &&
          this.checkForSelectedMediaIsDoc(item.imageToUpload.name) == true ? (
          this.renderDocumentView(item, item.imageToUpload.name)
        ) : (
          <AsyncImage
            source={{uri: item && item.image !== undefined  ? item.image : item}}
            resizeMode="cover"
            style={this.state.imageStyle}
            tintColor={primaryColor}
            isUserImage={this.props && this.props.type == 'profile' ?  true : undefined}
            borderRadius={
              this.props.borderRadius != undefined
                ? this.props.borderRadius
                : this.state.borderRadius
            }>
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
              {this.props && this.props.type == 'profile' ?
              (<ImageUploader
                image={item && item.imageToUpload}
                id={this.props.id}
                imageId={item && item.imageId}
                localImage={item && item.image}
                title="test title"
                updateServerImage={this.updateServerImage}
                retryItem={this.props.retryItem}
                axiosCancelSource={this.props.axiosCancelSource}> */}
                <PickImage
                  isHiddenView={true}
                  onImagePicked={this.imagePicked}
                  ref={onRef => (this.imagePicker = onRef)}
                  onRef={image => {
                    this.currentPageRef.image = image;
                  }}
                   style={{height: '100%', width: '100%', backgroundColor: 'pink'}}

                  // style={[this.state.imageStyle,{backgroundColor:'yellow'}]}
                  showBorder={this.props.showBorder != undefined ? true : false}
                  borderRadius={
                    this.props.borderRadius != undefined
                      ? this.props.borderRadius
                      : this.state.borderRadius
                  }
                  borderColor={this.props.borderColor}
                  isBannerImage={this.props.isBannerImage}
                  addImageLabel={this.props.addImageLabel}
                />
              </ImageUploader>
              ) : (
                <PickImage
                  isHiddenView={true}
                  onImagePicked={this.imagePicked}
                  ref={onRef => (this.imagePicker = onRef)}
                  onRef={image => {
                    this.currentPageRef.image = image;
                  }}
                   style={{height: '100%', width: '100%', backgroundColor: 'pink'}}

                  // style={[this.state.imageStyle,{backgroundColor:'yellow'}]}
                  showBorder={this.props.showBorder != undefined ? true : false}
                  borderRadius={
                    this.props.borderRadius != undefined
                      ? this.props.borderRadius
                      : this.state.borderRadius
                  }
                  borderColor={this.props.borderColor}
                  isBannerImage={this.props.isBannerImage}
                  addImageLabel={this.props.addImageLabel}
                />)
              }
            </View>
          </AsyncImage>
        )}

      </TouchableOpacity>
    );
  }
  renderImageUploader(item) {
    console.log('---------------1 Uploading');

    return (
      <TouchableOpacity
        style={[styless.textVertical]}
        onPress={this.showDetailUploader(item)}>
        {item.imageToUpload !== undefined &&
        this.checkForSelectedMediaISVideo(item.imageToUpload.name) == true ? (
          this.renderVideoView(item, item.imageToUpload.name)
        ) : item.imageToUpload !== undefined &&
          this.checkForSelectedMediaIsDoc(item.imageToUpload.name) == true ? (
          this.renderDocumentView(item, item.imageToUpload.name)
        ) : (
          <AsyncImage
            source={{uri: item.image}}
            resizeMode="cover"
            style={this.state.imageStyle}
            tintColor={primaryColor}
            type={this.props && this.props.type}
            borderRadius={
              this.props.borderRadius != undefined
                ? this.props.borderRadius
                : this.state.borderRadius
            }>
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
                uploadImmidiate={this.props && this.props.type == 'profile' ? true : undefined}
                axiosCancelSource={this.props.axiosCancelSource}>
                <PickImage
                  isCustomView={this.props.addImageViewCustom}
                  onImagePicked={this.imagePicked}
                  ref={onRef => (this.imagePicker = onRef)}
                  onRef={image => {
                    this.currentPageRef.image = image;
                  }}
                  style={this.state.imageStyle}
                  showBorder={this.props.showBorder != undefined ? true : false}
                  borderRadius={
                    this.props.borderRadius != undefined
                      ? this.props.borderRadius
                      : this.state.borderRadius
                  }
                  borderColor={this.props.borderColor}
                  isBannerImage={this.props.isBannerImage}
                  addImageLabel={this.props.addImageLabel}
                />
              </ImageUploader>
            </View>
          </AsyncImage>
        )}

        {this.props.retryItem == true ? (
          <Text
            style={[
              styless.detail,
              {color: 'red', justifyContent: 'center', alignSelf: 'center'},
            ]}>
            {' '}
            Uploading Failed Retry...{' '}
          </Text>
        ) : item.fileName === undefined && this.props.type !== "profile" ? (
          <Text
            style={[
              styless.detail,
              {justifyContent: 'center', alignSelf: 'center'},
            ]}>
            {' '}
            Uploading......{' '}
          </Text>
        ) : (
          <Text style={{height: 10}}> ..</Text>
        )}

        {this.renderCloseUploadRequestButton(item)}
      </TouchableOpacity>
    );
  }

  renderActualImage(item, isReply) {
    // console.log('---------------1 actual image');
    let uri = '';
    let module = 'user';
    if (this.props.module === undefined) {
      module = 'user';
    } else {
      module = this.props.module;
    }

    if (this.props.type === 'profile') {
      // uri = `${USER_IMAGE_DOWNLOAD_URL}/${module}/${item}/400`;
      uri = `${item}`;
    } else {
      // uri = `${IMAGE_DOWNLOAD_URL}/${module}/${this.props.id}/${item}/400`;
      uri = `${item}`;
    }
    // console.log(uri);
    return (
      // <View>
      <TouchableOpacity
        style={{flex: 1, flexDirection: 'row', margin: 1}}
        onPress={this.showDetailActual}
        onLongPress={this.onLongPress(item)}>
        {this.checkForSelectedMediaISVideo(item) == true ? (
          this.renderVideoView(item, item)
        ) : this.checkForSelectedMediaIsDoc(item) == true ? (
          this.renderDocumentView(item, item)
        ) : (
          <AsyncImage
            source={{uri: uri}}
            resizeMode="cover"
            style={this.state.imageStyle}
            tintColor={primaryColor}
            isUserImage={this.props.type == 'profile' ?  true : undefined}
            borderRadius={
              this.props.borderRadius != undefined
                ? this.props.borderRadius
                : this.state.borderRadius
            }>
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
                width={this.state.imageStyle.width}
                updateServerImage={this.updateServerImage}
                retryItem={this.props.retryItem}
                imageStyle={this.state.imageStyle}
                onRef={this.props.onRef}
                uploadImmidiate={this.props.type == 'profile' ? true : undefined}
              />
              <PickImage
                // isCustomView={this.props.addImageViewCustom}
                onImagePicked={this.imagePicked}
                ref={onRef => (this.imagePicker = onRef)}
                onRef={image => {
                  this.currentPageRef.image = image;
                }}
                style={{height: 0, width: 0, backgroundColor: 'pink'}}
                showBorder={false}
                borderRadius={
                  this.props.borderRadius != undefined
                    ? this.props.borderRadius
                    : this.state.borderRadius
                }
                borderColor={'transparent'}
                isBannerImage={this.props.isBannerImage}
                addImageLabel={this.props.addImageLabel}
                isActual={this.props.isActual}
              />
            </View>
          </AsyncImage>
        )}

        {/* <Text style={{color:'blue',justifyContent:'center',alignSelf:'center'}}> {item} </Text> */}
      </TouchableOpacity>
      // </View>
    );
  }

  renderVideoView(item, name) {
    if (this.props.isSendReportView) {
      return (
        <CardView
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={5}
          style={[
            {
              paddingVertical: 10,
              // marginHorizontal: 20,
              // marginRight:30,
              backgroundColor: '#E9EAEB',
              // margin: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View style={{height: 80, flex: 1}}>
            <Image
              source={{uri: 'video'}}
              style={{
                width: 100,
                height: 80,
                tintColor: 'cornflowerblue',
              }}
              resizeMode="contain"
              tintColor="cornflowerblue"
            />
            {/* <View
              style={{
                color: 'black',
                justifyContent: 'flex-start',
                alignSelf: 'center',
                paddingTop: 10,
                paddingBottom: 10,
                width: '70%',
              }}>
              <Text style={styless.headerSmall}> {name} </Text>
            </View> */}
          </View>
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
              width={this.state.imageStyle.width}
              updateServerImage={this.updateServerImage}
              retryItem={this.props.retryItem}
              imageStyle={this.state.imageStyle}
              uploadImmidiate={this.props.type == 'profile' ? true : undefined}
              onRef={this.props.onRef}>
              <PickImage
                isCustomView={this.props.addImageViewCustom}
                onImagePicked={this.imagePicked}
                ref={onRef => (this.imagePicker = onRef)}
                onRef={image => {
                  this.currentPageRef.image = image;
                }}
                style={this.state.imageStyle}
                showBorder={this.props.showBorder != undefined ? true : false}
                borderRadius={
                  this.props.borderRadius != undefined
                    ? this.props.borderRadius
                    : this.state.borderRadius
                }
                borderColor={this.props.borderColor}
                isBannerImage={this.props.isBannerImage}
                addImageLabel={this.props.addImageLabel}
                // isActual={this.props.isActual}
              />
            </ImageUploader>
            {/* } */}
          </View>
        </CardView>
      );
    }
    return (
      <CardView
        cardElevation={2}
        cardMaxElevation={2}
        cornerRadius={5}
        style={[
          {
            paddingVertical: 10,
            // marginHorizontal: 20,
            // marginRight:30,
            backgroundColor: '#E9EAEB',
            // margin: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View style={{height: 80, flexDirection: 'row'}}>
          <Image
            source={{uri: 'video'}}
            style={{
              width: '30%',
              height: 60,
              marginTop: 10,
            }}
            resizeMode="contain"
            tintColor="cornflowerblue"
          />
          <View
            style={{
              color: 'black',
              justifyContent: 'flex-start',
              alignSelf: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              width: '70%',
            }}>
            <Text style={styless.headerSmall}> {name} </Text>
          </View>
        </View>
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
            width={this.state.imageStyle.width}
            updateServerImage={this.updateServerImage}
            retryItem={this.props.retryItem}
            uploadImmidiate={this.props.type == 'profile' ? true : undefined}
            imageStyle={this.state.imageStyle}
            onRef={this.props.onRef}>
            <PickImage
              isCustomView={this.props.addImageViewCustom}
              onImagePicked={this.imagePicked}
              ref={onRef => (this.imagePicker = onRef)}
              onRef={image => {
                this.currentPageRef.image = image;
              }}
              style={{height: 0, width: 0, backgroundColor: 'pink'}}
              showBorder={this.props.showBorder != undefined ? true : false}
              borderRadius={
                this.props.borderRadius != undefined
                  ? this.props.borderRadius
                  : this.state.borderRadius
              }
              borderColor={this.props.borderColor}
              isBannerImage={this.props.isBannerImage}
              addImageLabel={this.props.addImageLabel}
              // isActual={this.props.isActual}
            />
          </ImageUploader>
          {/* } */}
        </View>
      </CardView>
    );
  }

  renderDocumentView(item, name) {
    return (
      <CardView
        cardElevation={2}
        cardMaxElevation={2}
        cornerRadius={5}
        style={[
          {
            paddingVertical: 10,
            // marginHorizontal: 20,
            // marginRight:30,
            backgroundColor: '#E9EAEB',
            // margin: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View style={{height: 80, flexDirection: 'row'}}>
          <Image
            source={{uri: 'form'}}
            style={{
              width: '30%',
              height: 60,
              marginTop: 10,
            }}
            resizeMode="contain"
            tintColor="cornflowerblue"
          />
          <View
            style={{
              color: 'black',
              justifyContent: 'flex-start',
              alignSelf: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              width: '70%',
            }}>
            <Text style={styless.headerSmall}> {name} </Text>
          </View>
        </View>
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
            width={this.state.imageStyle.width}
            updateServerImage={this.updateServerImage}
            retryItem={this.props.retryItem}
            imageStyle={this.state.imageStyle}
            onRef={this.props.onRef}
            hideCircle={true}
            uploadImmidiate={this.props.type == 'profile' ? true : undefined}
          />
          <PickImage
            // isCustomView={this.props.addImageViewCustom}
            onImagePicked={this.imagePicked}
            ref={onRef => (this.imagePicker = onRef)}
            onRef={image => {
              this.currentPageRef.image = image;
            }}
            style={{height: 0, width: 0, backgroundColor: 'pink'}}
            showBorder={false}
            borderRadius={
              this.props.borderRadius != undefined
                ? this.props.borderRadius
                : this.state.borderRadius
            }
            borderColor={'transparent'}
            isBannerImage={this.props.isBannerImage}
            addImageLabel={this.props.addImageLabel}
            isActual={this.props.isActual}
          />
        </View>
      </CardView>
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

  checkForSelectedMediaIsDoc(filename) {
    let extension = this.getFileExtension(filename);
    if (
      extension == 'csv' ||
      extension == 'CSV' ||
      extension == 'txt' ||
      extension == 'TXT' ||
      extension == 'pdf' ||
      extension == 'PDF' ||
      extension == 'doc' ||
      extension == 'DOC' ||
      extension == 'xls' ||
      extension == 'XLS' ||
      extension == 'xlsx' ||
      extension == 'XLSX' ||
      extension == 'docx' ||
      extension == 'DOCX'
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
        style={styless.textVertical}
        onPress={this.showDetailTemp}
        onLongPress={this.onLongPress(item)}>
        {this.checkForSelectedMediaISVideo(item.fileName) == true ? (
          this.renderVideoView(item, item.fileName)
        ) : this.checkForSelectedMediaIsDoc(item.fileName) == true ? (
          this.renderDocumentView(item, item.fileName)
        ) : (
          <AsyncImage
            source={{
              uri: item.image.uri,
              method: 'GET',
              // headers: requestHeader
            }}
            tintColor={primaryColor}
            resizeMode="cover"
            style={this.state.imageStyle}
            blurRadius={this.props.selected ? 3 : 0}
            borderRadius={
              this.props.borderRadius != undefined
                ? this.props.borderRadius
                : this.state.borderRadius
            }>
            {this.props.selected == true && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <Image
                  source={{uri: 'ic_check_circle'}}
                  tintColor="green"
                  style={[
                    {
                      width: 40,
                      height: 40,
                      justifyContent: 'flex-end',
                      bottom: 0,
                      tintColor: 'green',
                    },
                  ]}
                />
              </View>
            )}
          </AsyncImage>
        )}
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
      global.uploadedImageName != undefined ||
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
    let height = this.props.style.height;
    // if (this.state.editedImage !== undefined) {
    //   image = this.renderImageUploader(this.state.editedImage);
    //   return image;
    // }
    const {item} = this.props;

    if (
      this.props.isActual != undefined &&
      this.props.isActual == true &&
      (item !== undefined || item !== 'undefined' || item !== '')
    ) {
      if (item === 'undefined' || item === '' || item === undefined 
     ) {
        image = this.renderAddImage(item);
      } else if (this.state.editableNewImage != undefined) {
        // if(item == null) {
        //   image = this.renderAddImage(item);
        // }
        image = this.renderImageAdder(item);
        // image = this.renderImageAdder(item);
      } else if (this.props.editable === true) {
        // item.imageToUpload = {imageId:2453,image:this.props.name,name:this.props.name,name:this.props.name}
         image = this.renderImageAdder(item);
        // image = this.renderActualImage(item, this.props.isReply);
      } else if (item.image != undefined) {
        image = this.renderTempImage(item);
      } else {
        // image = this.renderImageAdder(item);
        image = this.renderActualImage(item, this.props.isReply);
      }
      return image;
    }

    let image = (
      <View style={{width: 150, height: 150, backgroundColor: 'brown'}} />
    );

    if (
      (item && item.imageId === '-1') ||
      item === undefined ||
      item === 'undefined'
    ) {
      // if (this.props.addImageViewCustom === true) {
      //   image = this.renderAddImageCustom(item);
      // } else {
      image = this.renderAddImage(item);
      // }
    } else if (item.imageToUpload != undefined) {
      image = this.renderImageUploader(item);
    } else if (item.image != undefined) {
      image = this.renderTempImage(item);
    } else {
      image = this.renderActualImage(item);
    }

    return image;
  }

  imagePicked = image => {
    if (this.state.editedImage == true) {
      this.state.editableNewImage = image;
    } else {
      this.state.editableNewImage = undefined;
    }
    if (this.props.onImagePickedHandler) {
      this.props.onImagePickedHandler(image);
    }
  };

  onLongPress = item => e => {
    // this.props.onLongPressItem(item);
  };

  updateServerImage = (serverImage, oldId) => {
    if (this.props.updateServerImage) {
      this.props.updateServerImage(serverImage, oldId);
    }
  };

  showDetailActual = () => {
    // this.showImage();

    //var BUTTONSiOS = ['View', 'Change', 'Delete', 'Cancel'];

    if (this.props.editable !== true) {
      this.showImage();
      return;
    }
    var BUTTONSiOS = ['View', 'Change', 'Cancel'];

    //var BUTTONSandroid = ['View', 'Change', 'Remove'];
    var BUTTONSandroid = ['View', 'Change'];

    // var DESTRUCTIVE_INDEX = 2;
    // var CANCEL_INDEX = 3;
    var DESTRUCTIVE_INDEX = 1;
    var CANCEL_INDEX = 2;

    ActionSheet.showActionSheetWithOptions(
      {
        options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        tintColor: 'blue',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            {
              this.showImage();
            }
            break;
          case 1:
            {
              this.changeImage();
            }
            break;
        }
        console.log('button clicked :', buttonIndex);
      },
    );
  };

   changeImage() {
    this.setState({editedImage: true}, () => {
      if (this.currentPageRef.image) {
        this.currentPageRef.image.pickImageHandler();
      }
    });
  }

  showImage() {
    let screenName = 'VideoPlayer';
    let param;
    const {item} = this.props;

    if (this.checkForSelectedMediaISVideo(item)) {
      screenName = 'VideoPlayer';
    } else {
      screenName = 'ImageViewer';
    }

    if (this.props.isReportImage === true) {
      this.props.onImageTapped();
    } else {
      //let imageUrl = `${IMAGE_DOWNLOAD_URL}/${this.props.id}/${item}`;
      let imageUrl = '';
      let module = 'user';
      if (this.props.module === undefined) {
        module = 'user';
      } else {
        module = this.props.module;
      }

      if (this.props.id === undefined) {
        // imageUrl = `${IMAGE_DOWNLOAD_URL}/${module}/${item}`;
        imageUrl = `${item}`;
      } else {
        // imageUrl = `${IMAGE_DOWNLOAD_URL}/${module}/${this.props.id}/${item}`;
        imageUrl = `${item}`;
      }

      if (this.props.actionOnImage === undefined) {
        const pushAction = StackActions.push({
          routeName: screenName,
          params: {
            imageUrl,
          },
        });
        this.props.navigation.navigate(screenName, {imageUrl: imageUrl});
        } else {
        this.props.actionOnImage();
      }
    }
  }

  showDetailUploader = (item,type) => e => {
    var BUTTONSiOS = ['View', 'Change', 'Delete', 'Cancel'];

    //var BUTTONSandroid = ['View', 'Change', 'Remove'];
    var BUTTONSandroid = ['View', 'Change'];

    var DESTRUCTIVE_INDEX = 2;
    var CANCEL_INDEX = 3;

    ActionSheet.showActionSheetWithOptions(
      {
        options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        tintColor: 'blue',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            {
              this.showDetailUploaderImage(item,type);
            }
            break;
          case 1:
        
          {
              this.changeImage();
            }
            break;
        }
        console.log('button clicked :', buttonIndex);
      },
    );
  };

  showDetailUploaderImage(item,type) {
    let screenName = 'VideoPlayer';
    let param;
    // const {item} = this.props;
    let uri = '';

    if (
      item.imageToUpload !== undefined &&
      this.checkForSelectedMediaISVideo(item.imageToUpload.name)
    ) {
      screenName = 'VideoPlayer';
      uri =
        item.imageToUpload !== undefined
          ? item.imageToUpload.uri
          : item.image.uri; //TODO:
    } else {
      screenName = 'ImageViewer';
      uri =
        item.imageToUpload !== undefined
          ? item.imageToUpload.uri
          : (item.image !== undefined ? item.image.uri : item); //TODO:
    }
    let imageUrl = uri;

    const pushAction = StackActions.push({
      routeName: screenName,
      params: {
        imageUrl,
        type
      },
    });
    this.props.navigation.dispatch(pushAction);
  }

  showDetailTemp = () => {
    var BUTTONSiOS = ['View', 'Change', 'Delete', 'Cancel'];

    //var BUTTONSandroid = ['View', 'Change', 'Remove'];
    var BUTTONSandroid = ['View', 'Change'];

    var DESTRUCTIVE_INDEX = 2;
    var CANCEL_INDEX = 3;

    ActionSheet.showActionSheetWithOptions(
      {
        options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        tintColor: 'blue',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            {
              this.showDetailTempImage();
            }
            break;
          case 1:
            {
              this.changeImage();
            }
            break;
        }
        console.log('button clicked :', buttonIndex);
      },
    );
  };

  showDetailTempImage() {
    let screenName = 'VideoPlayer';
    let param;
    const {item, navigation} = this.props;

    let itemNew = item;
    if (itemNew == undefined) {
      itemNew = this.props.name;
    } else {
      itemNew = item.image.name;
    }

    if (this.checkForSelectedMediaISVideo(itemNew)) {
      screenName = 'VideoPlayer';
      // uri = item.image.name;
    } else if (this.checkForSelectedMediaIsDoc(itemNew)) {
      screenName = 'ImageViewer';
    } else {
      screenName = 'ImageViewer';
      // uri = item.image.name;
    }
    let imageUrl = item.image.uri;

    this.props.navigation.navigate(screenName, {imageUrl: imageUrl});
  }
}

//TODO: need to remove this
export default ImageCell;
