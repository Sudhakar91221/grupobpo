/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert} from 'react-native';

import {connect} from 'react-redux';
import {COMMON_FILE_UPLOAD} from '../../../AuthModule/Actions/type';
import * as Progress from 'react-native-progress';
var housecall = require('../../../../network/queue');
var queue = housecall({concurrency: 1, cooldown: 1000});

import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  commonFileUploadedSelector,
} from '../../../AuthModule/Actions/selectors';
import {commonUploadFile} from '../../../AuthModule/Actions/UserActions';
import { userLoginSelector } from '../../Actions/selectors';

class ImageUploader extends React.PureComponent {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      indeterminate: true,
      hideCircle: false,
      imageUpdated: false,
      imageRetry: false,
      imageUploading: false,
      submitEnable: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.animate();
    if (this.props.uploadImmidiate && this.props.image != '' && this.props.image != undefined) {
      this.callUploadImage();
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    // this.state.progress = this.state.progress + 0.01
    //change this item from actual list so that no repetative action will be there
    if (this.props.error && this.props.error.code == -1) {
      if (this.state.imageRetry == false) {
        let serverNewImage = {
          imageId: this.props.imageId,
          image: this.props.localImage,
          imageToUpload: this.props.image,
          retryItem: true,
        };

        this.props.updateServerImage(serverNewImage, this.props.imageId); //oldLocalId
        this.state.imageRetry = true;
      }
    } else if (
      !this.props.error &&
      this.props.api == COMMON_FILE_UPLOAD &&
      this.state.imageUpdated == false
    ) {
      if (
        this.props.fileUploaded !== prevState.fileUploaded &&
        this.props.fileUploaded != prevProps.fileUploaded
      ) {
        let serverNewImage = Object.assign(
          {},
          {
            imageId: this.props.fileUploaded,
            image: this.props.image,
            fileName: this.props.fileUploaded,
            imageUploading: false,
          },
        );

        let files = '';
        if (
          global.uploadedImageName != '' &&
          global.uploadedImageName != undefined
        ) {
          files = global.uploadedImageName + ',';
        }


        // if (global.uploadedImageName.includes(this.props.fileUploaded)) {
          //if that file already exist in record dont update just show uploading
          // if (this.state.imageUploading == false) {
          //   serverNewImage =  Object.assign({
          //     imageId: this.props.imageId,
          //     image: this.props.localImage,
          //     imageToUpload: this.props.image,
          //     imageUploading: false,
          //     fileName: this.props.fileUploaded,

          //   });
          //   this.props.updateServerImage(serverNewImage, this.props.imageId); //oldLocalId
          //   this.state.imageUploading = false;
          // }
        // } else {
                const uplaodedImages = files + this.props.fileUploaded;
                global.uploadedImageName = files + this.props.fileUploaded;
                this.state.imageUpdated = true;
                this.setState({hideCircle: true, progress: 1});

                this.props.updateServerImage(
                  serverNewImage,
                  this.props.imageId,
                  uplaodedImages,
                ); //oldLocalId , filename get from server
        // }
      } else {
        if (this.state.imageUploading == false) {
          let serverNewImage = Object.assign(
            {},
            {
              imageId: this.props.imageId,
              image: this.props.localImage,
              imageToUpload: this.props.image,
              imageUploading: true,
            },
          );
          this.props.updateServerImage(serverNewImage, this.props.imageId); //oldLocalId
          this.state.imageUploading = true;
        }
      }
    }
  }
  UNSAFE_componentWillReceiveProps() {
    //fileName
  }

  static getDerivedStateFromProps(props, state) {
    if (props.fileId !== state.fileId || props.error !== state.error) {
      return state;
    }
  }

  animate() {
    let progress = 0;
    this.setState({progress: progress});
    this.setState({indeterminate: false});

    setTimeout(() => {
      setInterval(() => {
        progress += Math.random() / 5;
        if (progress > 1) {
          progress = 1;
          // this.setState({ hideCircle:true,progress:progress });
          // this.props.imageId = this.props.fileId
          // this.props.imageToUpload =
          return;
        }
        this.setState({hideCircle: false, progress: progress});
      }, 300);
    }, 3000);
  }

  render() {
    //TODO:  retry option
    /*
      if(this.props.retryItem == true ) {
          return (
            <View style={this.props.style}>
                <Button
                  title="Retry"
                  onPress={() => this.callUploadImage()}
               />
            </View>
          )
      }*/
    return (
      <View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 1,
            flex: 1,
            width: '100%',
          },
        ]}>
        {this.props.hideCircle == false && (
          <Progress.Circle
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
            width={null}
            // borderWidth={3}
            // style={{alignSelf:'center'}}
          />
        )}
      </View>
    );
  }
  callUploadImage() {
    var input = {
      photo: this.props.image,
      userId:global.user.userId
    };

    queue.push(() => this.props.commonUploadFile(input));
  }
}

//MARK: - Data Management

//MARK: - Data Management

function mapStateToProps(state) {
  // if (state.UserReducer.error && state.UserReducer.error.message != '') {
  //   Alert.alert(state.UserReducer.error.message);
  // }

  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.UserReducer),
    api: apiSelector(state.UserReducer),
    error: errorSelector(state.UserReducer),
    fileUploaded: commonFileUploadedSelector(state.UserReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    commonUploadFile: (input, cancelToken) =>
      dispatch(commonUploadFile(input, cancelToken)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageUploader);

const styles = {
  progress: {
    margin: 10,
    alignSelf: 'center',
    // width:ScreenWidth,
    // height:1
  },
};
