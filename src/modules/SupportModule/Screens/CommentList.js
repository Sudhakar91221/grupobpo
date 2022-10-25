import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Text,
  RefreshControl,
} from 'react-native';
import {StackActions, ScrollView} from 'react-navigation';
import {connect} from 'react-redux';
import {detailSupport, getSupportComment} from '../Actions/SupportActions';
import {PROJECT_KEY} from '../../../network/config';
import styless from '../../../components/common/Styles';
import LinearGradient from 'react-native-linear-gradient';

import {
  isLoadingSelector,
  supportListSelector,
  apiSelector,
  errorSelector,
  supportCommentListSelector,
  supportDetailSelector,
} from '../Actions/selectors';
import {BottomButton} from '../../../components/views/Button';
import ImageCell from './ImageCell';
import CommentCell from './CommentCell';

import {SUPPORT_REMOVE_IMAGES, SUPPORT_COMMENT_GET} from '../Actions/type';
import {flatListItemSeparator} from '../../../components/utility/common';

class CommentList extends React.PureComponent {
  // state = { selected: new Map() }
  static navigationOptions = {
    //To hide the NavigationBar from current Screen
    title: 'Comments',
    // headerBackground: (
    //   <LinearGradient
    //     colors={['#383C55', '#8699AB']}
    //     style={{flex: 1}}
    //     start={{x: 0, y: 0}}
    //     end={{x: 1, y: 0}}
    //   />
    // ),
    headerBackground: '#383C55',
    headerTintColor: 'white',
    headerTitleStyle: {
      textAlign: 'center',
      alignSelf: 'center',
      flex: 1,
      paddingRight: 30,
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
      longPressImageId: '',
      selected: new Map(),
      retryItem: new Map(),
      ticketNo: this.props.navigation.state.params.ticketNo,
      page: this.props.navigation.state.params.timestamp,
      refreshing: false,
      originalPage: this.props.navigation.state.params.timestamp,
      commentList: [],
    };
    this.onImagePickedHandler = this.onImagePickedHandler.bind(this);
    this.updateServerImage = this.updateServerImage.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onLongPressItem = this.onLongPressItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    // const {supportId} =  this.props.navigation.state.params
    // this.setState({ticketNo:supportId})

    // this.callGetCommentList()

    this.setState({commentList: []}, () => this.fetchData());

    // this.getSupportImages(supportId)
  }

  fetchData() {
    this.callGetSupportComments();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.error && this.props.api == SUPPORT_COMMENT_GET) {
      if (this.props.commentList !== prevState.commentList) {
        this.setState({commentList: this.props.commentList});
      }
    }
  }

  onRefresh() {
    this.setState(
      {
        supportList: [],
        isLoading: false,
        refreshing: true,
        page: this.state.originalPage,
      },
      () => {
        this.fetchData();
      },
    );
  }

  loadMore = () => {
    if (this.state.commentList !== undefined) {
      if (this.state.commentList.length > 0) {
        this.setState(
          {
            // refreshing: true,
            lastPage: this.state.page,
            page: this.state.commentList[this.state.commentList.length - 1]
              .postedOn,
          },
          () => {
            this.fetchData();
          },
        );
      }
    }
  };

  // static getDerivedStateFromProps(props, state) {
  //   if (props.supportList !== state.supportList) {
  //           return {
  //             supportList: props.supportList,
  //           };
  //   }
  // }

  getSupportImages(supportId) {
    let items = [{imageId: '-1', image: ''}];

    var index = this.props.supportList
      .map(function(item) {
        return item.supportId;
      })
      .indexOf(supportId);
    let supportModel = this.props.supportList[index];

    // this.state.longPressImageId = ''

    this.setState({
      items: supportModel.images ? items.concat(supportModel.images) : [],
      supportModel: supportModel,
      longPressImageId: '',
    });
  }

  renderItem({item}) {
    // const { selected } = this.state;

    return (
      <CommentCell
        item={item}
        navigation={this.props.navigation}
        editSupportTapped={this.editSupportTapped}
        deleteSupportTapped={this.deleteSupportTapped}
      />
    );
  }

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
        <View style={styles.MainContainer}>
          {this.props.isLoading == true && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {this.state.commentList !== undefined &&
            this.state.commentList.length > 0 && (
              <FlatList
                ref={ref => (this.flatList = ref)}
                data={this.state.commentList}
                renderItem={this.renderItem}
                keyExtractor={this._keyExtractor}
                extraData={this.props}
                onEndReached={() => this.loadMore()}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.refreshing}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => {
                  this.onEndReachedCalledDuringMomentum = false;
                }}
                ItemSeparatorComponent={flatListItemSeparator}
              />
            )}
          {this.state.selected !== undefined &&
            this.state.selected.size > 0 && (
              <BottomButton
                style={{flex: 1}}
                title="Delete"
                action={this.onDeleteButtonTapped.bind(this)}
                isLoading={this.props.isLoading}
              />
            )}
        </View>
      </ScrollView>
    );
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.props.user !== undefined && this.props.user.userId !== undefined && this.state.isAnotherApiCalled == false) {
  //     this.callGetSupports()
  //     this.state.isAnotherApiCalled = true
  //   }
  // }

  // static getDerivedStateFromProps(props, state) {

  //   if (props.user !== state.user) {
  //           return {
  //             user: props.user,
  //           };

  //   }
  //   return null;
  // }

  onDeleteButtonTapped = () => {
    this.callDeleteImages();
  };

  showDetail = () => {
    const pushAction = StackActions.push({
      routeName: 'CommentList',
      params: {
        // myUserId: 9,
      },
    });
    // this.props.navigation.dispatch(pushAction)
  };

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

  onImagePickedHandler(image) {
    console.log(image);
    let newImageObj = {
      imageId: (
        this.state.items[this.state.items.length - 1].imageId + 1
      ).toString(),
      image: image.uri,
      imageToUpload: image.imageToUpload,
    };

    const newItems = this.state.items.push(newImageObj);

    this.setState({
      items: newItems,
      longPressImageId: '',
    });
  }

  updateServerImage(serverImage, oldLocalId) {
    if (serverImage.retryItem == true) {
      // updater functions are preferred for transactional updates
      this.setState(state => {
        // copy the map rather than modifying state.
        const retryItem = new Map(state.retryItem);
        retryItem.set(serverImage.imageId, !retryItem.get(serverImage.imageId)); // toggle
        return {retryItem};
      });
    } else {
      var index = this.state.items
        .map(function(item) {
          return item.imageId;
        })
        .indexOf(oldLocalId);

      if (index > 0) {
        var newIndex = this.state.items
          .map(function(item) {
            return item.imageId;
          })
          .indexOf(serverImage.imageId);

        if (newIndex == -1) {
          //if the severSide file id not exist already in array then only replace else delete it
          this.state.items[index] = serverImage;
        } else {
          this.state.items.splice(index, 1);
        }
      }
    }

    /*
     */
  }

  callGetCommentList() {
    var input = {
      userId: this.props.user.userId,
      projectKey: PROJECT_KEY, //
      ticketNo: this.state.ticketNo, // this.props.user.userId,
    };
    this.props.detailSupport(input);
  }

  callGetSupportComments() {
    if (this.state.page != this.state.lastPage) {
      var input = {
        userId: this.props.user.userId,
        projectKey: PROJECT_KEY, //
        ticketNo: this.state.ticketNo, // this.props.user.userId,
        page: this.state.page,
      };
      this.props.getSupportComment(input);
    }
  }

  callDeleteImages(imageId) {
    var input = {
      // type      : '7',
      supportId: this.state.ticketNo,
      userId: this.props.user.userId,
      imageId: this.state.longPressImageId,
    };
    this.props.deleteSupportImages(input);
  }
}

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
    commentList: supportCommentListSelector(state.SupportReducer),
    isLoading: isLoadingSelector(state.SupportReducer),
    api: apiSelector(state.SupportReducer),
    error: errorSelector(state.SupportReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    detailSupport: input => dispatch(detailSupport(input)),
    getSupportComment: input => dispatch(getSupportComment(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 30,
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
});
