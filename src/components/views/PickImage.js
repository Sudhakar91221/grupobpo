/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
// import ImagePicker from 'react-native-image-picker';
import {isIOS} from '../utility/Settings';
import CardView from '../views/CardView';
import {styless} from '../common/Styles';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import ActionSheet from 'react-native-action-sheet';

import ImagePicker from 'react-native-image-crop-picker';
import {translate} from '../../../App';

class PickImage extends Component {
  state = {
    pickedImage: null,
  };

  reset = () => {
    this.setState({
      pickedImage: null,
    });
  };

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  pickImageHandler = () => {
    this.showActionSheet();
  };

  showActionSheet() {
    if (this.props.imageOnly === true) {
      var BUTTONSiOS = ['Camera', 'Gallery', 'Cancel'];

      var BUTTONSandroid = ['Camera', 'Gallery'];
    } else {
      var BUTTONSiOS = [
        'Camera',
        'Gallery',
        'Document',
        'Video',
        'Video Gallery',
        // 'Delete',
        'Cancel',
      ];

      var BUTTONSandroid = [
        'Camera',
        'Gallery',
        'Document',
        'Video',
        'Video Gallery',
      ];
    }
    var DESTRUCTIVE_INDEX = 6;
    var CANCEL_INDEX = 6;
    if (this.props.imageOnly === true) {
      var DESTRUCTIVE_INDEX = 3;
      var CANCEL_INDEX = 3;
    }

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
              this.openCamera();
            }
            break;
          case 1:
            {
              this.openGallery();
            }
            break;
          case 2:
            {
              this.openDocument();
            }
            break;
          case 3:
            {
              this.openVideoCamera();
            }
            break;
          case 4:
            {
              this.openVideoGallery();
            }
            break;
        }
        console.log('button clicked :', buttonIndex);
      },
    );
  }

  openCropper() {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      multiple: this.props.multiple !== undefined ? this.props.multiple : false,
    }).then(image => {
      console.log(image);
      var getFilename = image.path.split('/');
      var imgName = getFilename[getFilename.length - 1];
      let newImageObj = {uri: image.path, name: imgName, type: image.mime};
      this.props.onImagePicked({
        uri: image.path,
        //base64: res.data,
        imageToUpload: newImageObj,
      });
    });
  }

  openCamera() {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      mediaType: 'any',
      multiple: this.props.multiple !== undefined ? this.props.multiple : false,
    }).then(image => {
      console.log(image);
      var getFilename = image.path.split('/');
      var imgName = getFilename[getFilename.length - 1];
      let newImageObj = {uri: image.path, name: imgName, type: image.mime};
      this.props.onImagePicked({
        uri: image.path,
        //base64: res.data,
        imageToUpload: newImageObj,
      });
    });
  }

  openVideoCamera() {
    ImagePicker.openCamera({
      // width: 500,
      // height: 500,
      mediaType: 'video',
      // multiple: this.props.multiple !== undefined ? this.props.multiple : false,
    }).then(image => {
      console.log(image);
      var getFilename = image.path.split('/');
      var imgName = getFilename[getFilename.length - 1];
      let newImageObj = {uri: image.path, name: imgName, type: image.mime};

      // if (image.data == undefined) {
      //   newImageObj = {uri: image.path, name: imgName, type: 'video/mp4'};
      // }

      this.props.onImagePicked({
        uri: image.path,
        //base64: res.data,
        imageToUpload: newImageObj,
      });
    });
  }

  openVideoGallery() {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      // cropping: true,
      mediaType: 'video',
      multiple: this.props.multiple !== undefined ? this.props.multiple : false,
    }).then(image => {
      console.log(image);
      var getFilename = image.path.split('/');
      var imgName = getFilename[getFilename.length - 1];

      let newImageObj = {uri: image.path, name: imgName, type: image.mime};

      // if (image.data == undefined) {
      //   newImageObj = {uri: image.path, name: imgName, type: 'video/mp4'};
      // }

      this.props.onImagePicked({
        uri: image.path,
        //base64: res.data,
        imageToUpload: newImageObj,
      });
    });
  }

  openGallery() {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      mediaType: 'any',
      multiple: this.props.multiple !== undefined ? this.props.multiple : false,
    }).then(image => {
      console.log(image);
      var getFilename = image.path.split('/');
      var imgName = getFilename[getFilename.length - 1];
      let newImageObj = {uri: image.path, name: imgName, type: image.mime};

      this.props.onImagePicked({
        uri: image.path,
        //base64: res.data,
        imageToUpload: newImageObj,
      });
    });
  }

  openDocument() {
    if (this.props.multiple === true) {
      this.selectMultipleFile();
    } else {
      this.selectOneFile();
    }
  }

  async selectOneFile() {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      //Printing the log realted to the file
      console.log('--------------------------------');
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      console.log(
        'new path is ........',
        isIOS === true ? res.uri : 'file://' + res.uri,
      );

      let uri =
        isIOS === true ? res.uri.replace('file:///private', '') : res.uri;

      //   console.log("updated path-----------",uri)
      var file;
      RNFetchBlob.fs
        .stat(uri)
        .then(stats => {
          console.log('FILE DATA => ' + JSON.stringify(file));

          file = {
            uri: 'file://' + stats.path,
            type: res.type,
            name: res.name,
          };
          console.log('FILE DATA => ' + JSON.stringify(file));

          this.props.onImagePicked({
            uri: file.uri,
            //base64: res.data,
            imageToUpload: file,
          });
        })
        .catch(err => {
          console.log('err: ', err);
        });
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        console.log('Canceled from single doc picker');
      } else {
        //For Unknown Error
        console.log('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  async selectMultipleFile() {
    //Opening Document Picker for selection of multiple file
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well find above
      });
      for (const res of results) {
        //Printing the log realted to the file
        console.log('---------------------------');
        console.log('res : ' + JSON.stringify(res));
        console.log('URI : ' + res.uri);
        console.log('Type : ' + res.type);
        console.log('File Name : ' + res.name);
        console.log('File Size : ' + res.size);
      }
      //Setting the state to show multiple file attributes
      this.setState({multipleFile: results});
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from multiple doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  /*openGallery() {
    const options = {
      title: 'Select Image',
      mediaType: 'mixed',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },

      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
    };



    ImagePicker.showImagePicker(options, res => {
      if (res.didCancel) {
        console.log('User cancelled!');
      } else if (res.error) {
        console.log('Error', res.error);
      } else {
        let source = {uri: 'data:image/jpeg;base64,' + res.data};

        if (isIOS == false) {
          source = {uri: res.uri};
        }
        let newImageObj = {uri: source.uri, name: res.fileName, type: res.type};

        if (res.data == undefined) {
          newImageObj = {uri: res.uri, name: res.fileName, type: 'video/mp4'};
        }
        console.log(res.fileName);

        let imgName = newImageObj.fileName;

        if (newImageObj.fileName === undefined) {
          var getFilename = res.uri.split('/');
          imgName = getFilename[getFilename.length - 1];
          newImageObj.name = imgName;
        }
        console.log(imgName);

        this.setState({
          pickedImage: {uri: res.uri},
        });
        this.props.onImagePicked({
          uri: res.uri,
          base64: res.data,
          imageToUpload: newImageObj,
        });
      }
    });

    //this.selectOneFile();
  };*/

  render() {
    const margin = this.props.showBorder !== undefined ? 2 : 0;
    const marginBottom = this.props.showBorder !== undefined ? 5 : 0;

    if (this.props.isCustomView === true) {
      return <View style={{flex: 1}}>{this.renderCustomView()}</View>;
    }

    if (this.props.isBannerImage === true) {
      return <View style={{flex: 1}}>{this.renderBannerImageView()}</View>;
    }

    if (this.props.isHiddenView === true) {
      return (
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={this.pickImageHandler}
            style={this.props.style}
          />
        </View>
      );
    }

    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={this.pickImageHandler}
          style={this.props.style}>
          <CardView
            cardElevation={this.props.showBorder !== undefined ? 2 : 0}
            cardMaxElevation={2}
            cornerRadius={this.props.borderRadius}
            style={[
              {
                backgroundColor: 'transparent',
                // margin: margin,
                // marginBottom: marginBottom,
                justifyContent: 'center',
                alignItems: 'center',
                width: this.props.style.width,
                height: this.props.style.height,
                borderWidth: 1.5,
                borderColor: this.props.borderColor,
                borderRadius: this.props.borderRadius,
              },
            ]}>
            <Image
              source={{
                uri:
                  this.props.placeholderImage !== undefined
                    ? this.props.placeholderImage
                    : 'upload',
              }}
              style={{
                // borderRadius: this.props.borderRadius,
                width: this.props.style.width - 50,
                height: this.props.style.height - 50,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                tintColor: 'black',
              }}
              tintColor={'black'}
              resizeMode="contain"
              // borderRadius={this.props.borderRadius}
            />
          </CardView>
          {/* <Button title='Add Images' style={styles.Button}/> */}
        </TouchableOpacity>
      </View>
    );
  }

  renderBannerImageView() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={this.pickImageHandler}
          style={this.props.style}>
          <CardView
            cardElevation={this.props.showBorder !== undefined ? 2 : 0}
            cardMaxElevation={2}
            cornerRadius={this.props.borderRadius}
            style={[
              {
                // backgroundColor: 'white',
                // margin: margin,
                // marginBottom: marginBottom,
                justifyContent: 'center',
                alignItems: 'center',
                width: this.props.style.width,
                height: this.props.style.height,
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 10,
              },
            ]}>
            <Image
              source={{
                uri:
                  this.props.placeholderImage !== undefined
                    ? this.props.placeholderImage
                    : 'upload',
              }}
              style={{
                // borderRadius: this.props.borderRadius,
                width: this.props.style.width - 200,
                height: this.props.style.height - 200,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                tintColor: 'black',
              }}
              tintColor={'black'}
              resizeMode="contain"
              // borderRadius={this.props.borderRadius}
            />
            <Text
              style={{
                color: this.props.borderColor,
                justifyContent: 'center',
                alignSelf: 'center',
                paddingTop: 30,
                textAlign: 'center',
              }}>
              {' '}
              {this.props.addImageLabel != undefined
                ? this.props.addImageLabel
                : 'ADD IMAGES'}{' '}
            </Text>
          </CardView>
          {/* <Button title='Add Images' style={styles.Button}/> */}
        </TouchableOpacity>
      </View>
    );
  }

  renderCustomView() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={this.pickImageHandler}
          style={{flex: 1, paddingTop: 10, paddingBottom: 15}}>
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
            <View style={styless.nextToEach}>
              <Image
                source={{uri: 'upload'}}
                style={{
                  borderRadius: this.props.borderRadius,
                  width: '30%',
                  height: 60,
                  marginTop: 5,
                  tintColor: 'black',
                }}
                resizeMode="contain"
                tintColor={'black'}
                borderRadius={this.props.borderRadius}
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
                <Text style={styless.headerSmall}> {'Upload File'} </Text>
                <Text style={styless.detailSmall}>
                  {translate('upload_hint')}
                </Text>
              </View>
            </View>
          </CardView>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    // alignItems: "center",
    backgroundColor: '#eee',
    flex: 1,
  },
  placeholder: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#eee',
    width: '80%',
    height: 150,
  },
  button: {
    margin: 8,
  },
  previewImage: {
    width: 100,
    height: 100,
  },
});

export default PickImage;

export const pickImageHandler = async () => {
  showActionSheet();
};

function showActionSheet() {
  var BUTTONSiOS = ['Camera', 'Gallery', 'Document', 'Cancel'];

  var BUTTONSandroid = ['Camera', 'Gallery', 'Document'];

  var DESTRUCTIVE_INDEX = 3;
  var CANCEL_INDEX = 4;

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
            openCamera();
          }
          break;
        case 1:
          {
            openGallery();
          }
          break;
        case 2:
          {
            openDocument();
          }
          break;
      }
      console.log('button clicked :', buttonIndex);
    },
  );
}

function openCropper() {
  ImagePicker.openPicker({
    width: 500,
    height: 500,
    cropping: true,
    multiple: this.props.multiple !== undefined ? this.props.multiple : false,
  }).then(image => {
    console.log(image);
    var getFilename = image.path.split('/');
    var imgName = getFilename[getFilename.length - 1];
    let newImageObj = {uri: image.path, name: imgName, type: image.mime};
    this.props.onImagePicked({
      uri: image.path,
      //base64: res.data,
      imageToUpload: newImageObj,
    });
  });
}

function openCamera() {
  ImagePicker.openCamera({
    width: 500,
    height: 500,
    cropping: true,
    multiple: this.props.multiple !== undefined ? this.props.multiple : false,
  }).then(image => {
    console.log(image);
    var getFilename = image.path.split('/');
    var imgName = getFilename[getFilename.length - 1];
    let newImageObj = {uri: image.path, name: imgName, type: image.mime};
    this.props.onImagePicked({
      uri: image.path,
      //base64: res.data,
      imageToUpload: newImageObj,
    });
  });
}

function openGallery() {
  ImagePicker.openPicker({
    width: 500,
    height: 500,
    cropping: true,
    // multiple: this.props.multiple !== undefined ? this.props.multiple : false
  }).then(image => {
    console.log(image);
    var getFilename = image.path.split('/');
    var imgName = getFilename[getFilename.length - 1];
    let newImageObj = {uri: image.path, name: imgName, type: image.mime};
    return {
      uri: image.path,
      //base64: res.data,
      imageToUpload: newImageObj,
    };
  });
}

function openDocument() {
  if (this.props.multiple === true) {
    selectMultipleFile();
  } else {
    selectOneFile();
  }
}

async function selectOneFile() {
  //Opening Document Picker for selection of one file
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    //Printing the log realted to the file
    console.log('--------------------------------');
    console.log('res : ' + JSON.stringify(res));
    console.log('URI : ' + res.uri);
    console.log('Type : ' + res.type);
    console.log('File Name : ' + res.name);
    console.log('File Size : ' + res.size);

    var file;
    RNFetchBlob.fs
      .stat(res.uri)
      .then(stats => {
        file = {
          uri: 'file://' + stats.path,
          type: res.type,
          name: res.name,
        };
        console.log('FILE DATA => ' + JSON.stringify(file));

        this.props.onImagePicked({
          uri: file.uri,
          //base64: res.data,
          imageToUpload: file,
        });
      })
      .catch(err => {
        console.log('err: ', err);
      });
  } catch (err) {
    //Handling any exception (If any)
    if (DocumentPicker.isCancel(err)) {
      //If user canceled the document selection
      console.log('Canceled from single doc picker');
    } else {
      //For Unknown Error
      console.log('Unknown Error: ' + JSON.stringify(err));
      throw err;
    }
  }
}

async function selectMultipleFile() {
  //Opening Document Picker for selection of multiple file
  try {
    const results = await DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.allFiles],
      //There can me more options as well find above
    });
    for (const res of results) {
      //Printing the log realted to the file
      console.log('---------------------------');
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
    }
    //Setting the state to show multiple file attributes
    this.setState({multipleFile: results});
  } catch (err) {
    //Handling any exception (If any)
    if (DocumentPicker.isCancel(err)) {
      //If user canceled the document selection
      alert('Canceled from multiple doc picker');
    } else {
      //For Unknown Error
      alert('Unknown Error: ' + JSON.stringify(err));
      throw err;
    }
  }
}
