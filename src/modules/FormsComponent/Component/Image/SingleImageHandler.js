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

const mainColor = 'white';

class SingleImageHandler extends React.Component {
  constructor(props) {
    super(props);
    let initialAddAttachment = [{imageId: '-1', image: ''}];

    this.state = {
      attachment: initialAddAttachment,
      selected: new Map(),
      retryItem: new Map(),
      isActual:  props.isActual
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
        <View style={styless.stretchEqualVertical}>
          {this.state.attachment.length == 1
            ? this.renderUploadLogo(this.state.attachment[0])
            : this.renderUploadLogo(this.state.attachment[1])}
          {/* {this.renderBottomButton()} */}
        </View>
      </View>
    );
  }

  renderUploadLogo(attachment) {
    // const { selected } = this.state;

    // const attachment = getAttachment.item
    const imageStyle = this.props.style;
    const defaultStyle = {width: 150, height: 100, backgroundColor: 'red'};

    return (
      <ImageCell
        placeholderImage={
          this.props.placeholderImage !== undefined
            ? this.props.placeholderImage
            : null
        }
        borderRadius={this.props.borderRadius}
        //   style={{width:this.props.width,height:this.props.height,backgroundColor:'red'}}
        style={imageStyle !== undefined ? imageStyle : defaultStyle}
        placeholderStyle={this.props.placeholderStyle}
        addImageViewCustom={this.props.addImageViewCustom}
        imageId={attachment.imageId}
        item={this.state.isActual == true ? this.props.item  : attachment}
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
        borderColor = {this.props.borderColor}
        isRectangular={
          this.props.isRectangular !== undefined
            ? this.props.isRectangular
            : false
        }
        addImageLabel={this.props.addImageLabel}
        cacheImage={this.props.cacheImage}
        isBannerImage={this.props.isBannerImage}
        onLongPressItem={this.onLongPressItem}
        isActual={this.props.isActual}
        id={this.props.id}
        editable={this.props.editable}
        imageOnly={this.props.imageOnly}
        module = {this.props.module}
        type = {this.props.type}
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

        this.setState({attachment: newArray, submitEnable: false,isActual:false});

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
      this.setState(
        {
          attachment: [...this.state.attachment],
          uploadedImages: uploadedImages,
          finalImageToUpload:this.state.attachment[1] !== undefined ? this.state.attachment[1].fileName : ''
        },
        () => {
          // this.props.uploadedImages(this.state.attachment, this.props.name);
        },
      );
    } else if (serverImage.retryItem == true) {
      // updater functions are preferred for transactional updates
      this.setState(state => {
        // copy the map rather than modifying state.
        const retryItem = new Map(state.retryItem);
        retryItem.set(serverImage.imageId, !retryItem.get(serverImage.imageId)); // toggle
        return {retryItem};
      });
      this.setState(
        {
          attachment: [...this.state.attachment],
          uploadedImages: uploadedImages,
          finalImageToUpload:this.state.attachment[1] !== undefined ? this.state.attachment[1].fileName : ''
        },
        () => {
          this.props.uploadedImages(this.state.attachment, this.props.name);
        },
      );
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
        this.setState(
          {
            attachment: [...this.state.attachment],
            uploadedImages: uploadedImages,
            finalImageToUpload:this.state.attachment[1] !== undefined ? this.state.attachment[1].fileName : ''
          },
          () => {
            this.props.uploadedImages(this.state.attachment, this.props.name);
          },
        );
        //   this.props.imageUploaded(this.state.attachment[1].imageToUpload)
        //  this.props.imageUploaded(this.state.attachment[1].imageToUpload)
      }
    }
  };

  _keyExtractor = (item, index) => item.imageId;
}

export default withTheme(SingleImageHandler);

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
