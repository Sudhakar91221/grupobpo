import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
} from 'react-native';

import {withTheme} from '../../../../components/common/Theme/themeProvider';
import {styless} from '../../../../components/common/Styles';
import ImageCell from './ImageCell';
import { ScreenHeight } from '../../../../components/utility/Settings';
import { flatListItemSpaceSeparator } from '../../../../components/utility/common';

const mainColor = 'white';

class MultipleImageHandler extends React.Component {
  constructor(props) {
    super(props);
    let initialAddAttachment = {imageId: '-1', image: ''};

    this.state = {
      attachment:
        this.props.attachment !== undefined
          ? [initialAddAttachment, ...this.props.attachment]
          : [initialAddAttachment],
      selected: new Map(),
      retryItem: new Map(),
    };
    this.onImagePickedHandler = this.onImagePickedHandler.bind(this);
    this.updateServerImage = this.updateServerImage.bind(this);
    this.onLongPressItem = this.onLongPressItem.bind(this);
    this.renderUploadLogo = this.renderUploadLogo.bind(this);
  }
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }
  componentDidUpdate(prevProps, prevState) {}

  render() {
    const {theme} = this.props;
    return (
      <View style={{flex: 1}}>
        {this.state.attachment.length >= 1 ? (
          <FlatList
            style={{backgroundColor: 'transparent'}}
            ref={ref => (this.attachmentFlatList = ref)}
            data={this.state.attachment}
            renderItem={this.renderUploadLogo}
            keyExtractor={(item, index) => item.imageId}
            // onContentSizeChange={() =>
            //   this.attachmentFlatList.scrollToEnd({animated: true})
            // }
            // onLayout={() =>
            //   this.attachmentFlatList.scrollToEnd({animated: true})
            // }
            extraData={this.state.attachment}
            horizontal={this.props.isSendReportView === true ? false : true}
            ItemSeparatorComponent={flatListItemSpaceSeparator}
            
            numColumns={this.props.isSendReportView === true ? 3 : 0}
          />
        ) : (
          <View style={{flex:1}}>
          {this.rendderAddUploadImage(this.state.attachment)}
          </View>
        )}
      </View>
    );
  }

  rendderAddUploadImage(attachment) {
    // renderUploadLogo(attachment) {
    // const { selected } = this.state;

    // const attachment = getAttachment.item
    const imageStyle =  {width: ScreenHeight * 0.35, height: ScreenHeight * 0.35};
    const defaultStyle = {width: ScreenHeight * 0.35, height: ScreenHeight * 0.35, backgroundColor: 'red'};

    return (
      <ImageCell
        placeholderImage={
          'banner'
        }
        borderRadius={this.props.borderRadius}
        style={{width: ScreenHeight * 0.35, height: ScreenHeight * 0.35, backgroundColor: 'red'}}
        style={imageStyle}
        addImageViewCustom={'document'}

        // placeholderStyle={this.props.placeholderStyle}
        // addImageViewCustom={this.props.addImageViewCustom}
        imageId={attachment.imageId}
        item={this.state.isActual == true ? this.props.item : attachment}
        showDetail={this.showDetail}
        updateServerImage={this.updateServerImage}
        onImagePickedHandler={this.onImagePickedHandler}
        selected={!!this.state.selected.get(attachment.imageId)}
        retryItem={!!this.state.retryItem.get(attachment.imageId)}
        navigation={this.props.navigation}
        onDeleteImages={this.onDeleteImages}
        showBorder={this.props.showBorder}
        isCircular={
          this.props.isCircular !== undefined ? this.props.isCircular : false
        }
        borderColor={this.props.borderColor}
        isRectangular={
          this.props.isRectangular !== undefined
            ? this.props.isRectangular
            : false
        }
        // addImageLabel={this.props.addImageLabel}
        cacheImage={this.props.cacheImage}
        isBannerImage={true}
        onLongPressItem={this.onLongPressItem}
        // isActual={this.props.isActual}
        // id={this.props.id}
        editable={this.props.editable}
        imageOnly={this.props.imageOnly}
        module={this.props.module}
        height={ScreenHeight * 0.35}
        isSendReportView={this.props.isSendReportView}
        width={ScreenWidth - 40} 
      />
    );
    // }
  }

  renderUploadLogo(getAttachment) {
    // const { selected } = this.state;

    const attachment = getAttachment.item;
    const imageStyle = this.props.imageStyle;
    const defaultStyle = {
      width: this.props.width,
      height: this.props.height,
      backgroundColor: 'red',
    };
    // const defaultStyle = {width:this.props.style.width,height:this.props.style.height,backgroundColor:'red'}

    return (
      <ImageCell
        //   style={{width:this.props.width,height:this.props.height,backgroundColor:'red'}}
        style={imageStyle !== undefined ? imageStyle : defaultStyle}
        // addImageViewCustom={this.props.addImageViewCustom}
        id={this.props.id} //this s required for downloading - ex. productId
        placeholderImage={
          this.props.placeholderImage !== undefined
            ? this.props.placeholderImage
            : null
        }
        borderRadius={this.props.borderRadius}
        //   style={{width:this.props.width,height:this.props.height,backgroundColor:'red'}}
        placeholderStyle={this.props.placeholderStyle}
        imageId={attachment.imageId}
        item={this.state.isActual == true ? this.props.item : attachment}
        showDetail={this.showDetail}
        updateServerImage={this.updateServerImage}
        onImagePickedHandler={this.onImagePickedHandler}
        selected={!!this.state.selected.get(attachment.imageId)}
        retryItem={!!this.state.retryItem.get(attachment.imageId)}
        navigation={this.props.navigation}
        onDeleteImages={this.onDeleteImages}
        showBorder={this.props.showBorder}
        isCircular={
          this.props.isCircular !== undefined ? this.props.isCircular : false
        }
        borderColor={this.props.borderColor}
        isRectangular={
          this.props.isRectangular !== undefined
            ? this.props.isRectangular
            : false
        }
        // addImageLabel={this.props.addImageLabel}
        // cacheImage={this.props.cacheImage}
        isBannerImage={this.props.isBannerImage}
        onLongPressItem={this.onLongPressItem}
        isActual={this.props.isActual}
        editable={this.props.editable}
        imageOnly={this.props.imageOnly}
        module={this.props.module}
        isSendReportView={this.props.isSendReportView}
      />
    );
  }

  onLongPressItem() {
    let initialAddAttachment = [{imageId: '-1', image: ''}];

    this.state.attachment = initialAddAttachment;
  }
  onImagePickedHandler = image => {
    global.uploadingCount =
      (global.uploadingCount !== undefined ? global.uploadingCount : 0) + 1;

    this.setState({submitEnable: false}, () => {
      //TODO:
      // if(image.imageToUpload.type === undefined) {
      //   if(this.state.videos === undefined) {
      //     this.setState({ videos: [image.uri] })

      //   }else {
      //     this.setState({ videos: [...this.state.videos, image.uri] })
      //   }
      //   return
      // }

      if (this.state.attachment !== undefined) {
        console.log(image);
        let newImageObj = {
          imageId: (
            this.state.attachment[this.state.attachment.length - 1].imageId + 1
          ).toString(),
          image: image.uri,
          imageToUpload: image.imageToUpload,
        };

        if (newImageObj.imageId == '-11') {
          newImageObj.imageId = '2';
        }
        //  const newItems = this.state.attachment.push(newImageObj)

        // this.setState({
        //   attachment: this.state.attachment,
        //   reloadImages:true
        // })

        let addAttachment = {imageId: '-1', image: ''};

        var index = this.state.attachment
          .map(function(image) {
            return image.imageId;
          })
          .indexOf('-1');

        this.state.attachment.splice(index, 1);

        const newArray = [addAttachment, newImageObj, ...this.state.attachment];

        this.setState({attachment: newArray, submitEnable: false});

        // this.render()
      }
    });
  };

  onDeleteImages = item => {
    var index = this.state.attachment
      .map(function(image) {
        return image.fileName;
      })
      .indexOf(item.fileName);

    this.state.attachment.splice(index, 1);
    this.setState({attachment: [...this.state.attachment]});
  };

  updateServerImage = (serverImage, oldLocalId, uploadedImages) => {
    if (serverImage.imageUploading == true) {
      this.setState({
        attachment: [...this.state.attachment],
        uploadedImages: uploadedImages,
        finalImageToUpload: {
          [this.props.name]: this.state.attachment[1].fileName,
        },
      });
    } else if (serverImage.retryItem == true) {
      // updater functions are preferred for transactional updates
      this.setState(state => {
        // copy the map rather than modifying state.
        const retryItem = new Map(state.retryItem);
        retryItem.set(serverImage.imageId, !retryItem.get(serverImage.imageId)); // toggle
        return {retryItem};
      });
      this.setState({
        attachment: [...this.state.attachment],
        uploadedImages: uploadedImages,
        finalImageToUpload: {
          [this.props.name]: this.state.attachment[1].fileName,
        },
      });

      this.props.uploadedImages(this.state.attachment, this.props.name);
    } else {
      var index = this.state.attachment
        .map(function(item) {
          return item.imageId;
        })
        .indexOf(oldLocalId);

      if (index > 0) {
        var newIndex = this.state.attachment
          .map(function(item) {
            return item.imageId;
          })
          .indexOf(serverImage.imageId);

        if (newIndex == -1) {
          //if the severSide file id not exist already in array then only replace else delete it
          this.state.attachment[index] = serverImage;
          global.uploadingCount =
            global.uploadingCount !== undefined ? global.uploadingCount - 1 : 0;
        } else {
          this.state.attachment.splice(index, 1);
        }

        const newImagees = this.state.attachment;

        // this.setState({attachment :newImagees,reloadImages:true })

        // this.setState({ attachment :newImagees,reloadImages:true,bottomSheetHeight : this.state.attachment.length * 80 + 100 + 50})
        this.setState({
          attachment: [...this.state.attachment],
          uploadedImages: uploadedImages,
          finalImageToUpload: {
            [this.props.name]: this.state.attachment[1].fileName,
          },
        });

        this.props.uploadedImages(this.state.attachment, this.props.name);

        //   this.props.imageUploaded(this.state.attachment[1].imageToUpload)
      }
    }
  };

  _keyExtractor = (item, index) => item.imageId;
}

export default withTheme(MultipleImageHandler);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: mainColor,
  },
  textInput: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    padding: 3,
  },
  tag: {
    backgroundColor: '#fff',
  },
  tagText: {
    color: mainColor,
  },
});
