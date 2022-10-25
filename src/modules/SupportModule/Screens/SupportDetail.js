/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  ScrollView,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {SUPPORT_DETAIL, SUPPORT_REPLY} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  supportDetailSelector,
  cancelLeaveSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  detailSupport,
  cancelLeave,
  replySupport,
} from '../Actions/SupportActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import moment from 'moment';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {isPermissionAllowed} from '../../../network/APICall';
import DialogInput from '../../../components/views/DialogueInput';
import HeaderDetailComponent from '../../../components/views/HeaderDetailComponent';
import {downloadFile} from '../../FileModule/Actions/FileActions';
import {downloadFileSelector} from '../../FileModule/Actions/selectors';
import {DOWNLOAD_FILE} from '../../FileModule/Actions/type';
import {
  PROJECT_KEY,
  MAIN_BASE_RUL,
  LAST_UPDATED,
  apiVersion,
  NOTIFICATION_KEY,
} from '../../../network/config';
import {
  getTicketStatusText,
  getTicketStatusColor,
  TicketStatus,
  ModuleList,
} from '../Actions/APIIntegers';
import Moment from 'moment';
import ImageCell from './ImageCell';
import CommentCell from './CommentCell';
import DeviceInfo from 'react-native-device-info';
import {isSimulator} from '../../../components/utility/common';
import CustomBottomSheet from '../../../components/external/BottomSheet';
import {TextField} from 'react-native-material-textfield';
import {ScreenWidth} from '../../../components/utility/Settings';
import {StackActions} from 'react-navigation';
var housecall = require('../../../network/queue.js');
var queue = housecall({concurrency: 1, cooldown: 1000});

class SupportDetail extends React.Component {
  constructor(props) {
    super(props);
    let ticketNo = '';
    if (props.screenProps.ticketNo === undefined) {
      ticketNo = props.navigation.state.params.supportId;
    } else {
      ticketNo = props.screenProps.ticketNo;
    }

    let initialAddAttachment = [{imageId: '-1', image: ''}];

    this.state = {
      supportDetail: undefined,
      ticketNo: ticketNo,
      selected: new Map(),
      retryItem: new Map(),
      commentAttachment: initialAddAttachment,
      postCommentSelected: false,
      reloadImages: false,
      replyAdded: false,
      dataSource: {},
      longPressImageId: '',
    };

    global.uploadingCount = 0;
    global.uploadedImageName = '';
    this.onImagePickedHandler = this.onImagePickedHandler.bind(this);
    this.updateServerImage = this.updateServerImage.bind(this);
    this.onLongPressItem = this.onLongPressItem.bind(this);
    this.renderAttachmentCell = this.renderAttachmentCell.bind(this);
    this.onDeleteImages = this.onDeleteImages.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.commentRef = this.updateRef.bind(this, 'comment');
    this.renderSupportDetailView = this.renderSupportDetailView.bind(this);
    this.renderDetailsAttachmentCell = this.renderDetailsAttachmentCell.bind(
      this,
    );
    this.renderItem = this.renderItem.bind(this);
    this.renderViewMoreButton = this.renderViewMoreButton.bind(this);
    this.renderPostCommentView = this.renderPostCommentView.bind(this);
    this.onAddCommentButtonTapped = this.onAddCommentButtonTapped.bind(this);
    this.renderCloseBottomButton = this.renderCloseBottomButton.bind(this);
    this.onCloseBottomButtonTapped = this.onCloseBottomButtonTapped.bind(this);
    this.renderBottomButton = this.renderBottomButton.bind(this);
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentWillMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == SUPPORT_DETAIL) {
      if (
        this.props.error !== prevProps.error &&
        this.props.error.message !== ''
      ) {
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                //this.props.navigation.navigate('Login');
                console.log('OK Pressed');
              },
            },
          ],

          {cancelable: false},
        );
      }
    }

    //get support details
    if (this.props.api === SUPPORT_DETAIL) {
      if (this.props.error !== null && this.props.api === SUPPORT_DETAIL) {
        if (
          this.props.error !== prevProps.error &&
          this.props.error.message !== ''
        ) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (this.props.error.message === 'Invalid Token') {
                    this.props.navigation.navigate('Login');
                  }
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === SUPPORT_DETAIL) {
        if (this.props.supportDetail !== this.state.supportDetail) {
          this.setState({supportDetail: this.props.supportDetail});
        }
      }
    }
  }

  render() {
    const commentSection =
      this.props.supportDetail &&
      this.props.supportDetail.replies &&
      this.props.supportDetail.replies.length > 0;

    if (this.state.supportDetail === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.renderSupportDetailView()}

          {commentSection !== undefined && commentSection == true && (
            <View>
              <View style={{height: 50}}>{this.renderViewMoreButton()}</View>

              <View style={{margin: 5}}>
                <FlatList
                  ref={ref => (this.flatList = ref)}
                  data={this.state.supportDetail.replies.slice(0, 4)}
                  renderItem={this.renderItem}
                  keyExtractor={this._keyExtractor}
                  onContentSizeChange={() =>
                    this.flatList.scrollToEnd({animated: true})
                  }
                  onLayout={() => this.flatList.scrollToEnd({animated: true})}
                  extraData={this.props}
                  ItemSeparatorComponent={this.flatListItemSeparator}
                />
              </View>
            </View>
          )}

          <View
            style={{
              padding: 10,
              position: 'absolute',
              bottom: 0,
              width: '100%',
            }}>
            <BottomButton
              style={[styless.bottomButton, {borderRadius: 0}]}
              title={translate('post_comment')}
              action={() => this.onAddCommentButtonTapped()}
              isLoader={this.state.submitLoader}
              isGray={this.state.submitGray}
            />
          </View>

          {this.state.postCommentSelected == true &&
            this.renderPostCommentView()}
        </View>
      </ScrollView>
    );
  }

  onAddCommentButtonTapped = () => {
    global.uploadingCount = 0;
    global.uploadedImageName = '';
    //this.props.fileName = undefined;
    this.setState({
      postCommentSelected: true,
      comment: undefined,
      commentAttachment: [{imageId: '-1', image: ''}],
    });
  };

  renderPostCommentView() {
    let {errors = {}, secureTextEntry, ...data} = this.state;

    return (
      <View
        style={{
          padding: 10,
          margin: 10,
        }}>
        <CustomBottomSheet
          visible={this.state.postCommentSelected}
          onVisibilityChange={this.handleVisibility}
          height={300}>
          <ScrollView
            style={{borderRadius: 20, borderColor: 'black', borderWidth: 1}}>
            <View
              style={{
                width: ScreenWidth - 20,
                paddingLeft: 10,
                paddingRight: 10,
              }}>
              {this.renderCloseBottomButton()}
              <TextField
                ref={this.commentRef}
                label="Comment"
                value={this.state.comment}
                onChangeText={this.onChangeText}
                maxLength={150}
                multiline={true}
                onFocus={this.onFocus}
                error={errors.comment}
              />
              <FlatList
                ref={ref => (this.attachmentFlatList = ref)}
                data={this.state.commentAttachment}
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
            </View>
          </ScrollView>
          {this.renderBottomButton()}
        </CustomBottomSheet>
      </View>
    );
  }

  renderBottomButton() {
    //  if(this.state.submitEnable == true) {

    //  }

    let buttonActive =
      global.uploadingCount !== undefined && global.uploadingCount == 0;
    // Alert.alert(global.uploadingCount)
    console.log('--------------queue pending requests', queue.pending.length);
    console.log('--------------queue pending requests', queue);

    if (buttonActive == true && this.props.api == SUPPORT_REPLY) {
      buttonActive = !this.props.isLoading;
    }

    return (
      <BottomButton
        style={{borderRadius: 40, width: 80, marginTop: 10}}
        title={translate('submit')}
        action={
          buttonActive == true ? this.onPostCommentTapped.bind(this) : null
        }
        activeState={buttonActive == true ? true : false}
        isLoading={this.props.isLoading}
      />
    );
  }

  renderAttachmentCell({item}, isActual) {
    // const { selected } = this.state;

    return (
      <ImageCell
        imageId={item.imageId}
        item={item}
        // showDetail={this.showDetail}
        onLongPressItem={this.onLongPressItem}
        updateServerImage={this.updateServerImage}
        onImagePickedHandler={this.onImagePickedHandler}
        id={this.state.ticketNo}
        selected={!!this.state.selected.get(item.imageId)}
        retryItem={!!this.state.retryItem.get(item.imageId)}
        isActual={isActual}
        navigation={this.props.navigation}
        onDeleteImages={this.onDeleteImages}
      />
    );
  }

  renderCloseBottomButton = () => {
    return (
      <TouchableOpacity
        onPress={this.onCloseBottomButtonTapped.bind(this)}
        style={{
          paddingRight: 10,
          paddingTop: 10,
          height: 44,
          width: 80,
          justifyContent: 'flex-end',
          alignSelf: 'flex-end',
        }}>
        <Text style={{color: 'black', fontWeight: 'bold'}}> Close </Text>
      </TouchableOpacity>
    );
  };

  onCloseBottomButtonTapped = () => {
    // this.state.postCommentSelected = false
    //  global.uploadedImageName = ''
    global.uploadingCount = 0;
    //this.props.fileName = undefined;
    this.setState({
      postCommentSelected: false,
      replyAdded: true,
      comment: undefined,
      commentAttachment: [{imageId: '-1', image: ''}],
    });
  };

  onPostCommentTapped = () => {
    this.setState({replyAdded: false}, () => {
      this.callPostReply();
    });
  };

  callPostReply() {
    if (this.validateAllDetails() == false) {
      return;
    }

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

    var input = {
      projectKey: PROJECT_KEY,
      userId: this.props.user.userId,
      platform: '2',
      deviceInfo: deviceInfoJSON,
      buildInfo: buildInfoJSON,
      deviceId: isSimulator ? 'Simulator' : DeviceInfo.getUniqueID(),
      email: this.props.user.email,
      ticketNo: this.state.ticketNo, // this.props.user.userId,
      details: this.state.comment,
      fName: global.uploadedImageName ? global.uploadedImageName : '',
    };
    this.props.replySupport(input);
  }

  renderItem({item}) {
    return (
      <CommentCell
        item={item}
        navigation={this.props.navigation}
        editSupportTapped={this.editSupportTapped}
        deleteSupportTapped={this.deleteSupportTapped}
      />
    );
  }

  renderViewMoreButton = () => {
    return (
      <View
        style={[
          styless.leftRight,
          {
            paddingLeft: 10,
            paddingRight: 10,
            height: 40,
            backgroundColor: '#B0BEC5',
            alignItems: 'center',
          },
        ]}>
        <Text style={[styless.header, {fontSize: 18, alignSelf: 'center'}]}>
          Comment(s)
        </Text>
        {this.props.supportModel !== undefined &&
          this.props.supportModel.recCount !== undefined &&
          this.props.supportModel.recCount > 3 && (
            <TouchableOpacity onPress={this.onViewMoreButtonTapped.bind(this)}>
              <Text
                style={[
                  styless.header,
                  {fontSize: 18, alignSelf: 'center', color: 'blue'},
                ]}>
                View All{' '}
              </Text>
            </TouchableOpacity>
          )}
      </View>
    );
  };

  onViewMoreButtonTapped = () => {
    const initialReplyTimestamp = this.state.supportDetail.replies[
      this.state.supportDetail.replies.length - 1
    ].postedOn;
    const pushAction = StackActions.push({
      routeName: 'CommentList',
      params: {
        ticketNo: this.state.ticketNo,
        timestamp: initialReplyTimestamp,
      },
    });
    this.props.navigation.dispatch(pushAction);
  };

  renderSupportDetailView() {
    const {theme} = this.props;
    const item = this.state.supportDetail;
    var supportStatus = '';
    switch (item.status) {
      case '1':
        supportStatus = translate('open');
        break;
      case '2':
        supportStatus = translate('closed');
        break;
    }

    return (
      <View style={{padding: 10}}>
        <HeaderDetailComponent
          header={translate('module')}
          image={'ic_leave_description'}
          description={ModuleList[parseInt(item.module)]}
        />
        <HeaderDetailComponent
          header={translate('title')}
          image={'ic_leave_description'}
          description={item.subject}
        />
        <HeaderDetailComponent
          header={translate('description')}
          image={'ic_leave_description'}
          description={item.details}
        />
        <HeaderDetailComponent
          header={translate('status')}
          image={'ic_leave_leave_status'}
          description={supportStatus}
        />
        <HeaderDetailComponent
          header={translate('posted_on')}
          image={'ic_leave_calendar'}
          description={Moment.unix(item.postedOn).fromNow()}
        />
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: 'ic_leave_attachment'}}
            style={{height: 20, width: 20, marginTop: 7, marginLeft: 10}}
          />

          <Text
            style={[
              theme.detail,
              {
                color: 'gray',
                paddingTop: 5,
                fontWeight: '600',
                paddingLeft: 10,
              },
            ]}>
            {translate('attachment')}
          </Text>
        </View>

        <FlatList
          ref={ref => (this.detailsAttachmentFlatList = ref)}
          data={this.state.supportDetail.attachment}
          renderItem={this.renderDetailsAttachmentCell}
          keyExtractor={(item, index) => index}
          onContentSizeChange={() =>
            this.detailsAttachmentFlatList.scrollToEnd({animated: true})
          }
          onLayout={() =>
            this.detailsAttachmentFlatList.scrollToEnd({animated: true})
          }
          // extraData={this.props}
          // horizontal={true}
        />
      </View>
    );
  }

  renderDetailsAttachmentCell({item}) {
    return (
      <ImageCell
        imageId={item.imageId}
        item={item}
        // showDetail={this.showDetail}
        onLongPressItem={this.onLongPressItem}
        updateServerImage={this.updateServerImage}
        onImagePickedHandler={this.onImagePickedHandler}
        id={this.state.supportDetail.ticketId}
        selected={!!this.state.selected.get(item.imageId)}
        retryItem={!!this.state.retryItem.get(item.imageId)}
        isActual={true}
        isReply={false}
        navigation={this.props.navigation}
      />
    );
  }

  onImagePickedHandler = image => {
    global.uploadingCount =
      (global.uploadingCount !== undefined ? global.uploadingCount : 0) + 1;

    if (this.state.commentAttachment !== undefined) {
      console.log(image);
      let newImageObj = {
        imageId: (
          this.state.commentAttachment[this.state.commentAttachment.length - 1]
            .imageId + 1
        ).toString(),
        image: image.uri,
        imageToUpload: image.imageToUpload,
      };

      if (newImageObj.imageId == '-11') {
        newImageObj.imageId = '2';
      }
      //  const newItems = this.state.commentAttachment.push(newImageObj)

      // this.setState({
      //   commentAttachment: this.state.commentAttachment,
      //   reloadImages:true
      // })

      this.setState({
        reloadOnlyPostComment: true,
        commentAttachment: [...this.state.commentAttachment, newImageObj],
        bottomSheetHeight: this.state.commentAttachment.length * 80 + 100 + 50,
      });
    }
  };

  onDeleteImages = item => {
    var index = this.state.commentAttachment
      .map(function(image) {
        return image.fileName;
      })
      .indexOf(item.fileName);

    this.state.commentAttachment.splice(index, 1);
    this.setState({commentAttachment: [...this.state.commentAttachment]});
  };

  updateServerImage = (serverImage, oldLocalId) => {
    if (serverImage.imageUploading == true) {
      this.setState({commentAttachment: [...this.state.commentAttachment]});
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
      this.setState({
        commentAttachment: [...this.state.commentAttachment],
        bottomSheetHeight: this.state.commentAttachment.length * 80 + 100 + 50,
      });
    } else {
      var index = this.state.commentAttachment
        .map(function(item) {
          return item.imageId;
        })
        .indexOf(oldLocalId);

      if (index > 0) {
        var newIndex = this.state.commentAttachment
          .map(function(item) {
            return item.imageId;
          })
          .indexOf(serverImage.imageId);

        if (newIndex == -1) {
          //if the severSide file id not exist already in array then only replace else delete it
          this.state.commentAttachment[index] = serverImage;
          global.uploadingCount =
            global.uploadingCount !== undefined ? global.uploadingCount - 1 : 0;
        } else {
          this.state.commentAttachment.splice(index, 1);
        }

        const newImagees = this.state.commentAttachment;

        // this.setState({commentAttachment :newImagees,reloadImages:true })

        // this.setState({ commentAttachment :newImagees,reloadImages:true,bottomSheetHeight : this.state.commentAttachment.length * 80 + 100 + 50})
        this.setState({
          commentAttachment: [...this.state.commentAttachment],
          bottomSheetHeight:
            this.state.commentAttachment.length * 80 + 100 + 50,
        });
      }
    }
  };

  fetchData() {
    var input = {
      projectKey: PROJECT_KEY,
      ticketNo: this.state.ticketNo,
    };
    this.props.detailSupport(input);
  }

  onLongPressItem(item) {
    //  this.state.items.map((item) => {

    //     if(item.selected === undefined || item.selected == false) {
    //       item.selected = true
    //     }else {
    //       item.selected = false
    //     }
    // })

    if (this.state.longPressImageId == '') {
      this.state.longPressImageId = item.imageId;
    } else {
      this.state.longPressImageId =
        this.state.longPressImageId + ',' + item.imageId;
    }

    // updater functions are preferred for transactional updates
    this.setState(state => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(item.imageId, !selected.get(item.imageId)); // toggle
      return {selected};
    });
  }

  //   onImagePickedHandler(image) {
  //     console.log(image);
  //     let newImageObj = {
  //       imageId: (
  //         this.state.commentAttachment[this.state.commentAttachment.length - 1]
  //           .imageId + 1
  //       ).toString(),
  //       image: image.uri,
  //       imageToUpload: image.imageToUpload,
  //     };

  //     // const newItems = this.state.commentAttachment.push(newImageObj)

  //     // this.setState({
  //     //   items: newItems,
  //     //   longPressImageId:''
  //     // })

  //     this.setState({
  //       commentAttachment: [...this.state.commentAttachment, newImageObj],
  //       bottomSheetHeight: this.state.commentAttachment.length * 80 + 100 + 50,
  //     });
  //   }

  onChangeText(text, id, data) {
    ['comment']
      .map(name => ({name, ref: this[name]}))
      .forEach(({name, ref}) => {
        if (ref.isFocused()) {
          this.setState({[name]: text});
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

  validateAllDetails() {
    let errors = {};
    let errorCount = 0;

    let validates = ['comment'];

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
  }
}
const SupportDetailNew = withTheme(SupportDetail);
SupportDetailNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  let ticketNo = '';
  if (screenProps.ticketNo === undefined) {
    ticketNo = navigation.state.params.supportId;
  } else {
    ticketNo = screenProps.ticketNo;
  }
  return {
    title: ticketNo,
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
  };
};

function mapStateToProps(state) {
  if (state.SupportReducer.error && state.SupportReducer.error.message != '') {
    Alert.alert(state.SupportReducer.error.message);
  }

  if (state.FileReducer.error && state.FileReducer.error.message != '') {
    Alert.alert(state.FileReducer.error.message);
  }

  let files = '';
  if (state.fileName != '') {
    files = state.fileName + ',';
  }
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.SupportReducer),
    api: apiSelector(state.SupportReducer),
    error: errorSelector(state.SupportReducer),
    supportDetail: supportDetailSelector(state.SupportReducer),
    commentList: [],
  };
}
function mapDispatchToProps(dispatch) {
  return {
    detailSupport: input => dispatch(detailSupport(input)),
    replySupport: input => dispatch(replySupport(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportDetailNew);
