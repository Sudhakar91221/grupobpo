/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Platform, Alert, FlatList, ScrollView} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import {TextField} from 'react-native-material-textfield';
import {connect} from 'react-redux';
import {
  addSupport,
  detailSupport,
  getSupportComment,
} from '../Actions/SupportActions';
import {SUPPORT_ADD} from '../Actions/type';
import {SupportApiList} from '../Actions/SupportAPI';
import {BottomButton} from '../../../components/views/Button';
import ImageCell from './ImageCell';
import {
  PROJECT_KEY,
  MAIN_BASE_RUL,
  LAST_UPDATED,
  apiVersion,
  NOTIFICATION_KEY,
} from '../../../network/config';
import DeviceInfo from 'react-native-device-info';
import {ModuleList} from '../Actions/APIIntegers';
var housecall = require('../../../network/queue.js');
var queue = housecall({concurrency: 1, cooldown: 1000});
import {isSimulator} from '../../../components/utility/common';
import {
  isLoadingSelector,
  supportListSelector,
  apiSelector,
  errorSelector,
  supportDetailSelector,
  imageUploadSelector,
} from '../Actions/selectors';
import VideoPlayer from '../../../components/external/VideoPlayer';
import axios from 'axios';
import {BackButton} from '../../../components/views/NavBar';
import {withTheme} from '../../../components/common/Theme/themeProvider';

class SupportAdd extends React.Component {
  constructor(props) {
    let initialAddAttachment = [{imageId: '-1', image: ''}];
    let moduleData = [];
    ModuleList.map(
      (item, index) =>
        (moduleData = [...moduleData, {value: item, index: index}]),
    );

    super(props);

    this.state = {
      isLoading: false,
      selected: new Map(),
      retryItem: new Map(),
      attachment: initialAddAttachment,
      supportAdded: true,
      moduleData: moduleData,
      submitEnable: true,
    };
    global.uploadingCount = 0;
    // global.uploadedImageName = ''
    this.onChangeText = this.onChangeText.bind(this);
    this.onFocus = this.onFocus.bind(this);

    this.subjectRef = this.updateRef.bind(this, 'subject');
    this.detailRef = this.updateRef.bind(this, 'details');
    this.moduleDropdownRef = this.updateRef.bind(this, 'module');

    this.onImagePickedHandler = this.onImagePickedHandler.bind(this);
    this.updateServerImage = this.updateServerImage.bind(this);
    // this.onLongPressItem = this.onLongPressItem.bind(this)
    this.renderAttachmentCell = this.renderAttachmentCell.bind(this);
    this.onDeleteImages = this.onDeleteImages.bind(this);
  }
  updateRef(name, ref) {
    this[name] = ref;
  }

  componentDidMount() {
    queue.on('idle', function(noTasksCompleted, noTasksWithError) {
      // Do something
      console.log('all requests ended................');
      //  this.setState({submitEnable:true})
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.error &&
      this.props.api == SUPPORT_ADD &&
      this.state.supportAdded == false
    ) {
      if (this.props.supportModel !== prevState.supportModel) {
        this.setState({supportAdded: true});
        this.props.navigation.goBack();

        // this.state.postCommentSelected = false
        // global.uploadedImageName = ''
      }
    }

    // if(this.props.error !== undefined && this.props.api == SUPPORT_UPLOAD && this.state.submitEnable == false && this.props.isLoading == false) {

    //   if (this.props.fileName !== prevState.fileName) {

    //     this.setState({submitEnable:true})

    //   }

    // }

    // if(queue.allDone() == true && this.state.submitEnable == false ) {
    //   this.setState({submitEnable:true})

    // }
  }

  render() {
    let {errors = {}, secureTextEntry, ...data} = this.state;

    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1, padding: 10}}>
          {this.renderModuleDropDown()}
          <TextField
            ref={this.subjectRef}
            label="Subject"
            value={this.state.subject}
            onChangeText={this.onChangeText}
            maxLength={150}
            multiline={true}
            onFocus={this.onFocus}
            error={errors.subject}
          />

          <TextField
            ref={this.detailRef}
            label="Details"
            value={this.state.details}
            onChangeText={this.onChangeText}
            maxLength={150}
            multiline={true}
            onFocus={this.onFocus}
            error={errors.details}
          />
          <FlatList
            ref={ref => (this.attachmentFlatList = ref)}
            data={this.state.attachment}
            renderItem={this.renderAttachmentCell}
            keyExtractor={(item, index) => item.imageId}
            onContentSizeChange={() =>
              this.attachmentFlatList.scrollToEnd({animated: true})
            }
            onLayout={() =>
              this.attachmentFlatList.scrollToEnd({animated: true})
            }
            // extraData={this.props}
            // horizontal={true}
          />

          {this.state.videos && this.state.videos.length > 0 && (
            <FlatList
              ref={ref => (this.videosFlatList = ref)}
              data={this.state.videos}
              renderItem={this.renderVideosCell}
              keyExtractor={(item, index) => index}
              onContentSizeChange={() =>
                this.videosFlatList.scrollToEnd({animated: true})
              }
              onLayout={() => this.videosFlatList.scrollToEnd({animated: true})}
              // extraData={this.props}
              // horizontal={true}
            />
          )}

          {this.renderBottomButton()}
        </View>
      </ScrollView>
    );
  }

  renderModuleDropDown() {
    let {errors = {}} = this.state;

    return (
      <Dropdown
        ref={this.moduleDropdownRef}
        value={this.state.module ? this.state.module : ''}
        onChangeText={this.onChangeText}
        label="Select Module"
        data={this.state.moduleData}
        baseColor="black"
        textColor="black"
        tintColor="black"
        error={errors.module}
      />
    );
  }
  renderVideosCell({item}) {
    console.log('item is here11111...............', item);
    return <VideoPlayer videoUri={item} />;
  }

  renderAttachmentCell({item}) {
    // const { selected } = this.state;

    return (
      <ImageCell
        imageId={item.imageId}
        item={item}
        showDetail={this.showDetail}
        //     onLongPressItem={this.onLongPressItem}
        updateServerImage={this.updateServerImage}
        onImagePickedHandler={this.onImagePickedHandler}
        //     id={this.state.ticketNo}
        selected={!!this.state.selected.get(item.imageId)}
        retryItem={!!this.state.retryItem.get(item.imageId)}
        navigation={this.props.navigation}
        onDeleteImages={this.onDeleteImages}
        axiosCancelSource={SupportApiList.SUPPORT_UPLOAD + ',' + item.imageId}
      />
    );
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

        this.setState({
          attachment: [...this.state.attachment, newImageObj],
          submitEnable: false,
        });
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

  updateServerImage = (serverImage, oldLocalId) => {
    if (serverImage.imageUploading == true) {
      this.setState({attachment: [...this.state.attachment]});
    } else if (serverImage.retryItem == true) {
      // updater functions are preferred for transactional updates
      global.uploadingCount =
        global.uploadingCount !== undefined ? global.uploadingCount - 1 : 0;

      this.setState(state => {
        // copy the map rather than modifying state.
        const retryItem = new Map(state.retryItem);
        retryItem.set(serverImage.imageId, !retryItem.get(serverImage.imageId)); // toggle
        return {retryItem};
      });
      this.setState({attachment: [...this.state.attachment]});
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
        this.setState({attachment: [...this.state.attachment]});
      }
    }
  };

  _keyExtractor = (item, index) => item.imageId;

  renderBottomButton() {
    //  if(this.state.submitEnable == true) {

    //  }

    let buttonActive =
      global.uploadingCount !== undefined && global.uploadingCount == 0;
    // Alert.alert(global.uploadingCount)
    console.log('--------------queue pending requests', queue.pending.length);
    console.log('--------------queue pending requests', queue);
    console.log(
      ',----------------------------,--------------,',
      global.uploadingCount,
    );

    // if(queue.pending.length > 0 ) {
    //   buttonActive = false
    // }
    if (buttonActive == true && this.props.api == SUPPORT_ADD) {
      buttonActive = !this.props.isLoading;
    }

    return (
      <BottomButton
        style={{flex: 1}}
        title="SUBMIT"
        // action={this.state.submitEnable == true ? this.onPostTicketTapped.bind(this) : null}
        action={
          buttonActive == true ? this.onPostTicketTapped.bind(this) : null
        }
        activeState={buttonActive == true ? true : false}
        isLoading={this.props.isLoading}
      />
    );
  }
  onPostTicketTapped = () => {
    this.callAddSupport();
  };

  onViewAttachment = () => {};
  onDeleteAttachment = () => {};

  onChangeText(text, id, data) {
    ['subject', 'details', 'module']
      .map(name => ({name, ref: this[name]}))
      .forEach(({name, ref}) => {
        if (ref.isFocused()) {
          if (name == 'module') {
            this.setState({[name]: text, selectedModuleId: id});
          } else {
            this.setState({[name]: text});
          }
        }
      });
  }

  onFocus() {
    let {errors = {}} = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({errors});
  }

  callAddSupport() {
    console.log(this.state.attachment);
    const deviceDetails = {
      manufacturer: isSimulator ? 'Simulator' : DeviceInfo.getManufacturer(),
      deviceModel: isSimulator ? 'Simulator' : DeviceInfo.getModel(),
      deviceName: isSimulator ? 'Simulator' : DeviceInfo.getSystemName(),
      deviceOSVersion: isSimulator
        ? 'Simulator'
        : DeviceInfo.getSystemVersion(),
      deviceOS: isSimulator ? 'Simulator' : DeviceInfo.getBaseOS(),
      deviceId: isSimulator ? 'Simulator' : DeviceInfo.getDeviceId(),
    };

    const buildDetails = {
      baseurl: MAIN_BASE_RUL,
      api_version: apiVersion,
      lastUpdated: LAST_UPDATED,
      packageName: isSimulator ? 'Simulator' : DeviceInfo.getBundleId(),
      AppVersion: isSimulator ? 'Simulator' : DeviceInfo.getVersion(),
      BuildNumber: isSimulator ? 'Simulator' : DeviceInfo.getBuildNumber(),
      notificationKey: NOTIFICATION_KEY,
    };

    const buildInfoJSON = JSON.stringify(buildDetails);
    const deviceInfoJSON = JSON.stringify(deviceDetails);

    if (this.validateAllDetails() == false) {
      return;
    }

    var input = {
      userId: this.props.user.userId,
      projectKey: PROJECT_KEY,
      firstName: this.props.user.firstName,
      middleName: this.props.user.middleName ? this.props.user.middleName : '',
      lastName: this.props.user.lastName,
      userEmail: this.props.user.email,
      mobile: this.props.user.phone,
      countryId: this.props.user.countryId,
      platform: Platform.OS === 'ios' ? 2 : 1,
      deviceInfo: deviceInfoJSON,
      buildInfo: buildInfoJSON,
      deviceId: DeviceInfo.getUniqueID(),
      details: this.state.details !== undefined ? this.state.details : '',
      subject: this.state.subject !== undefined ? this.state.subject : '',
      fName: global.uploadedImageName ? global.uploadedImageName : '',
      module:
        this.state.selectedModuleId !== undefined
          ? this.state.selectedModuleId
          : '',
      request: SUPPORT_ADD,
    };

    this.state.supportAdded = false;

    this.props.addSupport(input);
  }

  validateAllDetails() {
    let errors = {};
    let errorCount = 0;

    let validates = ['subject', 'details', 'module'];

    validates.forEach(name => {
      let value = this[name].value();

      if (!value) {
        // if(this.state.type != OccurranceTypeInt.RESIGNATION) {

        // if(this.state.attachment === undefined) {
        errors[name] = 'Should not be empty';
        errorCount = errorCount + 1;
        // }

        // }
      } else {
        if ('password' === name && value.length < 6) {
          errors[name] = 'Too short';
          errorCount = errorCount + 1;
        }
      }
    });

    this.setState({errors});

    if (errorCount > 0) {
      return false;
    }
    console.log('-------------');

    if (this.state.attachment && this.state.attachment.length > 1) {
      return true;
    } else {
      Alert.alert('Attachment is mandatory');
      return false;
    }
  }
}

const SupportAddNew = withTheme(SupportAdd);

SupportAddNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
    headerLeft: (
      <BackButton navigation={navigation} action={() => navigation.goBack()} />
    ),
  };
};

//MARK: - Data Management

function mapStateToProps(state) {
  if (state.SupportReducer.error && state.SupportReducer.error.message != '') {
    Alert.alert(state.SupportReducer.error.message);
  }

  return {
    user: state.UserReducer.user,
    userApi: state.UserReducer.api,
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
    detailSupport: input => dispatch(detailSupport(input)),
    getSupportComment: input => dispatch(getSupportComment(input)),
    addSupport: input => dispatch(addSupport(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportAddNew);
