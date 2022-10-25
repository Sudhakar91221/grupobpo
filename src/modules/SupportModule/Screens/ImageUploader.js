import React from 'react';
import {View, Image, Button} from 'react-native';

import {connect} from 'react-redux';
import {SUPPORT_UPLOAD} from '../Actions/type';
import {uploadSupportFile} from '../Actions/SupportActions';
import * as Progress from 'react-native-progress';
var housecall = require('../../../network/queue.js');
var queue = housecall({concurrency: 1, cooldown: 1000});
import axios from 'axios';

import {
  isLoadingSelector,
  supportListSelector,
  apiSelector,
  errorSelector,
  supportCommentListSelector,
  supportDetailSelector,
  imageUploadSelector,
} from '../Actions/selectors';
import {ScreenWidth} from '../../../components/utility/Settings';

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
    if (this.props.image != '') {
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
        let serverImage = {
          imageId: this.props.imageId,
          image: this.props.localImage,
          imageToUpload: this.props.image,
          retryItem: true,
        };

        this.props.updateServerImage(serverImage, this.props.imageId); //oldLocalId
        this.state.imageRetry = true;
      }
    } else if (
      !this.props.error &&
      this.props.api == SUPPORT_UPLOAD &&
      this.state.imageUpdated == false
    ) {
      if (
        this.props.fileName !== prevState.fileName &&
        this.props.fileName != prevProps.fileName
      ) {
        let serverImage = {
          imageId: this.props.fileName,
          image: this.props.image,
          fileName: this.props.fileName,
        };

        let files = '';
        if (
          global.uploadedImageName != '' &&
          global.uploadedImageName != undefined
        ) {
          files = global.uploadedImageName + ',';
        }

        if (global.uploadedImageName.includes(this.props.fileName)) {
          //if that file already exist in record dont update just show uploading
          if (this.state.imageUploading == false) {
            serverImage = {
              imageId: this.props.imageId,
              image: this.props.localImage,
              imageToUpload: this.props.image,
              imageUploading: true,
            };
            this.props.updateServerImage(serverImage, this.props.imageId); //oldLocalId
            this.state.imageUploading = true;
          }
        } else {
          global.uploadedImageName = files + this.props.fileName;
          this.state.imageUpdated = true;
          this.setState({hideCircle: true, progress: 1});

          this.props.updateServerImage(serverImage, this.props.imageId); //oldLocalId , filename get from server
        }
      }
    } else {
      if (this.state.imageUploading == false) {
        let serverImage = {
          imageId: this.props.imageId,
          image: this.props.localImage,
          imageToUpload: this.props.image,
          imageUploading: true,
        };
        this.props.updateServerImage(serverImage, this.props.imageId); //oldLocalId
        this.state.imageUploading = true;
      }
    }
  }
  componentWillReceiveProps() {
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
    var that = this;

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
          this.props.style,
          {width: ScreenWidth, paddingHorizontal: 10, paddingBottom: 1},
        ]}>
        {this.state.hideCircle == false && (
          <Progress.Circle
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
            width={ScreenWidth - 20}
          />
        )}
      </View>
    );
  }
  callUploadImage() {
    var input = {
      file: this.props.image,
    };

    queue.push(() =>
      this.props.uploadSupportFile(input, this.props.axiosCancelSource),
    );
  }
}

//MARK: - Data Management

//MARK: - Data Management

function mapStateToProps(state) {
  if (state.SupportReducer.error && state.SupportReducer.error.message != '') {
    Alert.alert(state.SupportReducer.error.message);
  }

  if (state.FileReducer.error && state.FileReducer.error.message != '') {
    Alert.alert(state.FileReducer.error.message);
  }

  return {
    user: state.UserReducer.user,
    supportList: supportListSelector(state.SupportReducer),
    supportModel: supportDetailSelector(state.SupportReducer),
    isLoading: isLoadingSelector(state.SupportReducer),
    api: apiSelector(state.SupportReducer),
    error: errorSelector(state.SupportReducer),
    fileName: imageUploadSelector(state.SupportReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    uploadSupportFile: (input, cancelToken) =>
      dispatch(uploadSupportFile(input, cancelToken)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageUploader);

const styles = {
  progress: {
    margin: 10,
    // width:ScreenWidth,
    // height:1
  },
};
