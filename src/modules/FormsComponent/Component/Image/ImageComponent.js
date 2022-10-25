/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image} from 'react-native';
import MultipleImageHandler from './MultipleImageHandler';
import SingleImageHandler from './SingleImageHandler';
import ImageCell from './ImageCell';
import {styless} from '../../../../components/common/Styles';

// export const PlaceholderCustomView = ({width, height}) => {
//   let imagePicker = {};
//   return (
//     <TouchableOpacity style={styless.nextToEach}>
//       <PickImage
//         placeholderImage={require('../../../../asset/ecity.png')}
//         onImagePicked={this.props.onImagePickedHandler(image)}
//         ref={ref => (imagePicker = ref)}
//         style={{
//           width: width,
//           height: height,
//           borderRadius: 5,
//         }}
//         showBorder={true}
//         borderRadius={5}
//       />
//       <Text
//         style={{
//           color: 'black',
//           justifyContent: 'center',
//           alignSelf: 'center',
//           paddingTop: 10,
//           paddingBottom: 10,
//         }}>
//         {' '}
//         {'ADD IMAGES'}{' '}
//       </Text>
//     </TouchableOpacity>
//   );
// };
export const ImageComponent = ({
  onRef,
  name,
  value,
  id,
  url,
  height,
  width,
  tintColor,
  borderRadius,
  uploader,
  navigation,
  type,
  uploadedImages,
  cacheImage,
  isSendReportView,
  onImageTapped,
  addImageLabel,
  theme,
  isCircular,
  isBannerImage,
  module,
  props,
  imageOnly,
  editable
}) => {
  // console.log(props.onRef);
  if (name == 'default') {
    return (
      <View style={{width: width, height: height, paddingHorizontal: 5}}>
        <Image
          source={url !== undefined ? {uri: url} : {uri: 'logo'}}
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            paddingTop: 0,
            tintColor: tintColor !== undefined ? tintColor : null,
          }}
          tintColor={tintColor !== undefined ? tintColor : null}
        />
      </View>
    );
  }

  if (uploader !== undefined && uploader == 'Single') {
    return (
      <SingleImageHandler
        name={name}
        style={{width: width, height: height}}
        isCircular={isCircular == true ? true : false}
        imageStyle={{
          width: width,
          height: height,
          borderRadius: borderRadius !== undefined ? borderRadius : 5,
        }}
        width={150}
        height={150}
        type={type}
        addImageViewCustom={type == 'document' ? true : undefined}
        // imageUploaded={this.getSelfiImageUploaded}
        navigation={navigation}
        addImageLabel={addImageLabel !== undefined ? addImageLabel : ''}
        placeholderImage={url}
        resizeMode="contain"
        showBorder={true}
        onRef={onRef}
        uploadedImages={uploadedImages}
        borderColor={theme.primaryColor}
        isBannerImage={isBannerImage}
        borderRadius={borderRadius}
        imageOnly={imageOnly}
        editable = {editable}
      />
    );
  }

  if (uploader !== undefined && uploader === 'Multi') {
    return (
      <MultipleImageHandler
        placeholderImage={'logo'}
        placeholderStyle={styless.nextToEach}
        style={{width: width, height: width}}
        isCircular={false}
        addImageViewCustom={type == 'document' ? true : undefined}
        imageStyle={{
          width: width,
          height: height,
          borderRadius: borderRadius !== undefined ? borderRadius : 5,
        }}
        type={type}
        width={150}
        height={150}
        // imageUploaded={this.getSelfiImageUploaded}
        navigation={navigation}
        addImageLabel={addImageLabel !== undefined ? addImageLabel : ''}
        resizeMode="contain"
        isSendReportView={isSendReportView}
        uploadedImages={uploadedImages}
        id={id} //this s required for downloading - ex. NewsId
        item={value}
        // isActual={true}
        module={module}
        onImageTapped={onImageTapped}
        showBorder={true}
        onRef={onRef}
        borderColor={theme.primaryColor}
        isBannerImage={isBannerImage}
        editable={props.editable}
        borderRadius={borderRadius}
      />
    );
  }

  if (uploader !== undefined && uploader == 'Editable') {
    return (
      <SingleImageHandler
        name={name}
        style={{width: width, height: height}}
        isCircular={isCircular == true ? true : false}
        imageStyle={{
          width: width,
          height: height,
          borderRadius: borderRadius !== undefined ? borderRadius : 5,
        }}
        width={150}
        height={150}
        type={type}
        addImageViewCustom={type == 'document' ? true : undefined}
        // imageUploaded={this.getSelfiImageUploaded}
        navigation={navigation}
        addImageLabel={addImageLabel !== undefined ? addImageLabel : ''}
        id={id} //this s required for downloading - ex. NewsId
        item={value}
        isActual={true}
        module={module}
        onImageTapped={onImageTapped}
        resizeMode="contain"
        showBorder={true}
        onRef={onRef}
        uploadedImages={uploadedImages}
        borderColor={theme.primaryColor}
        isBannerImage={isBannerImage}
        editable={props.editable}
        borderRadius={borderRadius}
      />
    );
  }

  return (
    <View style={{width: width, height: height}}>
      <ImageCell
        placeholderImage={'logo'}
        style={{
          width: width,
          height: height,
          backgroundColor: 'green',
          paddingTop: 0,
          tintColor: tintColor !== undefined ? tintColor : null,
        }}
        addImageViewCustom={type == 'document' ? true : undefined}
        id={id} //this s required for downloading - ex. NewsId
        item={value}
        isActual={true}
        isCircular={isCircular == true ? true : false}
        tintColor={tintColor !== undefined ? tintColor : null}
        // children={this.renderMoreButton(item)}
        navigation={navigation}
        // cacheImage={cacheImage}
        module={module}
        type={type}
        onImageTapped={onImageTapped}
        addImageLabel={addImageLabel !== undefined ? addImageLabel : ''}
        onRef={onRef}
        borderRadius={borderRadius}
      />
    </View>
  );
};
