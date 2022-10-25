/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, Alert, LayoutAnimation, Text, ScrollView, RefreshControl} from 'react-native';
import {View} from 'react-native-animatable';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {flatListItemSeparator} from '../../../components/utility/common';
import NotificationListCell from './NotificationListCell';
import {BackButton} from '../../../components/views/NavBar';
import {CustomLayoutSpring} from 'react-native-animation-layout';
import {
  isLoadingSelector,
  notificationListSelector,
  apiSelector,
  errorSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getNotification} from '../Actions/NotificationActions';
import {NOTIFICATION_GET} from '../Actions/type';
import {connect} from 'react-redux';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';

class NotificationList extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };

    this.loadMore = this.loadMore.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  //MARK: - View Lifecycle

  componentWillMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == NOTIFICATION_GET) {
      if (this.props.error !== prevProps.error) {
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

    //get notifications
    if (this.props.api === NOTIFICATION_GET) {
      if (this.props.error !== null && this.props.api === NOTIFICATION_GET) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  console.log('OK Pressed');
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === NOTIFICATION_GET) {
        if (this.props.notifications !== prevProps.notifications) {
          this.setState({
            notifications: this.props.notifications,
            refreshing: false,
          });
        }
      }
    }
  }

  //MARK: - Main Render

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
        <View style={{flex: 1}}>
          {this.state.notifications === undefined ? (
            <ActivityIndicatorCustom />
          ) : this.state.notifications.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1, padding: 2}}>
              <FlatList
                data={this.state.notifications}
                renderItem={this.renderItem}
                numColumns={1}
                extraData={this.props}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={this.loadMore}
                onMomentumScrollBegin={() => {
                  this.onEndReachedCalledDuringMomentum = false;
                }}
                onEndReachedThreshold={0.5}
                onRefresh={this.onRefresh}
                refreshing={
                  this.state.refreshing !== undefined
                    ? this.state.refreshing
                    : false
                }
                ItemSeparatorComponent={flatListItemSeparator}
              />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  renderNoRecords() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
          }}>
          No Records Available
        </Text>
      </View>
    );
  }

  renderItem = ({item}) => {
    return (
      <NotificationListCell item={item} navigation={this.props.navigation} />
    );
  };

  //MARK : - Event Handlers

  fetchData() {
    this.callGetNotifications();
  }

  onRefresh = () => {
    this.setState(
      {
        dataSource: [],
        isLoading: false,
        refreshing: true,
        seed: 1,
        page: 1,
      },
      () => this.fetchData(),
    );
  };

  loadMore = () => {
    if (this.onEndReachedCalledDuringMomentum === undefined) {
    } else {
      if (!this.onEndReachedCalledDuringMomentum) {
        this.setState(
          {
            lastPage: this.state.page,
            isLoading: false,
            page: this.state.page + 1,
            refreshing: false,
          },
          () => {
            this.fetchData();
            this.onEndReachedCalledDuringMomentum = true;
          },
        );
      }
    }
  };

  onSegmentValueChange = index => {
    console.log('Selected Segment Index', index);
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    // Save the content height in state
    this.setState({screenHeight: contentHeight});
  };

  //MARK: - API CALL
  callGetNotifications() {
    var input = {
      userId: this.props.user.userId,
      page: this.state.page,
      request: NOTIFICATION_GET,
    };
    this.props.getNotification(input);
  }
}
//MARK: - Data Management
function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    notifications: notificationListSelector(state.NotificationReducer),
    isLoading: isLoadingSelector(state.NotificationReducer),
    api: apiSelector(state.NotificationReducer),
    error: errorSelector(state.NotificationReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getNotification: input => dispatch(getNotification(input)),
  };
}

//MARK: - Navigation Header

const NotificationListNew = withTheme(NotificationList);

NotificationListNew.navigationOptions = ({navigation, screenProps, params}) => {
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
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationListNew);
