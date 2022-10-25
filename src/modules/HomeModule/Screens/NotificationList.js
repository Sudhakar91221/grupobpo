/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  FlatList,
  ScrollView,
  Alert,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { View } from 'react-native-animatable';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import { flatListItemSeparator } from '../../../components/utility/common';
import NotificationListCell from './NotificationListCell';
import { styless } from '../../../components/common/Styles';
import { NavSearchBar, DrawerIcon } from '../../../components/views/NavBar';
import SearchBar from 'react-native-dynamic-search-bar';
import { CustomLayoutSpring } from 'react-native-animation-layout';

import {
  isLoadingSelector,
  notificationListSelector,
  apiSelector,
  errorSelector,
  successSelector,
} from '../Actions/selectors';
import { userLoginSelector } from '../../AuthModule/Actions/selectors';

import { getHome } from '../Actions/HomeActions';

import {
  PRODUCT_ADD,
  PRODUCT_UPDATE,
  REPORT_GET,
  HOME_GET,
} from '../Actions/type';

import { connect } from 'react-redux';

import BaseClass from '../../Base/BaseClass';
import { translate } from '../../../../App';
import Toast from '../../../components/views/Toast';
import { DrawerActions } from 'react-navigation-drawer';

class NotificationList extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {
      screenHeight: 0,
      toastMessageUpdated: false,
      notifications: [],
    };
    this.renderNotificationFlatlist = this.renderNotificationFlatlist.bind(
      this,
    );
  }

  //MARK: - View Lifecycle

  componentWillMount() {
    this.fetchData();
  }
  componentDidMount() { }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.api === REPORT_GET) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }

    if (!this.props.error && this.props.api === HOME_GET) {
      if (this.props.notifications !== prevProps.notifications) {
        this.setState({
          notifications: this.props.notifications,
          refreshing: false,
        });
      }
    }

    if (
      !this.props.isLoading &&
      (this.props.api === PRODUCT_ADD ||
        (this.props.api === PRODUCT_UPDATE &&
          this.state.toastMessageUpdated === false))
    ) {
      if (this.props.successMessage !== prevProps.successMessage) {
        this.setState(
          {
            showToastMessage: this.props.successMessage,
            toastMessageUpdated: true,
          },
          () => {
            setTimeout(() => {
              // this.props.successMessage = false
              this.setState({
                showToastMessage: undefined,
                toastMessageUpdated: true,
              });
            }, 1500);
          },
        );
      }
    }
  }

  //MARK: - Main Render

  render() {
    const { theme } = this.props;

    return (
      <BaseClass title={translate('notifications')}>
        {/* <Toast message={'Contents are static'} backColor={'red'} /> */}
        {/* <SearchBar
          onPressToFocus
          autoFocus={false}
          fontColor="#c6c6c6"
          iconColor="#c6c6c6"
          shadowColor="#c6c6c6"
          cancelIconColor="#353d5e"
          backgroundColor="#8E8E931F"
          placeholder="Search here"
          onChangeText={text => {
            this.filterList(text);
          }}
          onPressCancel={() => {
            this.filterList('');
          }}
          onPress={() => alert('onPress')}
        /> */}

        <View
          style={
            (styless.container,
            {
              paddingTop: this.state.showToastMessage !== undefined ? 30 : 0,
              flex: 1,
            })
          }>
          {/* <View style={{height: 50}}>
            <Divider height={2.0} />
            {this.renderNotificationListHeader()}
          </View> */}

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
            }}
            onContentSizeChange={this.onContentSizeChange}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
              }}>
              {this.renderNotificationFlatlist()}
            </View>
          </ScrollView>
        </View>
      </BaseClass>
    );
  }

  //MARK : - Event Handlers

  fetchData() {
    this.callGetNotifications();
  }
  filterList = text => {
    var newData = this.state.dataBackup;
    newData = this.state.dataBackup.filter(item => {
      const itemData = item.name.toLowerCase();
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    LayoutAnimation.configureNext(CustomLayoutSpring(null, null, 'scaleXY'));
    this.setState({
      query: text,
      dataSource: newData,
    });
  };

  onRefresh = () => {
    this.setState({
      dataSource: [],
      isLoading: false,
      refreshing: true,
      seed: 1,
      page: 1,
    });
    this.fetchData();
  };

  loadMore = () => {
    this.setState({
      // refreshing: true,
      page: this.state.page + 1,
    });
    // this.fetchData();
  };
  onSegmentValueChange = index => {
    console.log('Selected Segment Index', index);
  };
  onContentSizeChange = (contentWidth, contentHeight) => {
    // Save the content height in state
    this.setState({ screenHeight: contentHeight });
  };
  //MARK: - Render UI

  renderNotificationFlatlist() {
    if (this.state.notifications.length === 0) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 24,
            }}>
            No Records Available
          </Text>
        </View>
      );
    }
    if (this.state.notifications !== undefined) {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.notifications}
            renderItem={this.renderNotificationItem}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.props}
            onEndReached={this.loadMore.bind(this)}
            onRefresh={this.onRefresh.bind(this)}
            refreshing={
              this.state.refreshing !== undefined
                ? this.state.refreshing
                : false
            }
            // onEndReachedThreshold={0.9}
            // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            ItemSeparatorComponent={flatListItemSeparator}
            onEndReachedThreshold={0.4}
          />
        </View>
      );
    }
  }

  renderNotificationItem = ({ item }) => {
    return (
      <NotificationListCell item={item} navigation={this.props.navigation} />
    );
  };

  renderNotificationListHeader() {
    const { theme } = this.props;
    return (
      <View
        style={[
          styless.leftRight,
          {
            paddingLeft: 10,
            paddingRight: 10,
            height: 40,
            backgroundColor: 'white',
            alignItems: 'center',
          },
        ]}>
        <Text style={[theme.H2, { color: theme.detailColor }]}>
          {' '}
          {translate('Latest_Job_Offers')}{' '}
        </Text>
        <TouchableOpacity onPress={this.onViewMoreButtonTapped}>
          <Text style={[theme.themeText, { fontSize: 20 }]}>
            {' '}
            {translate('Advertise')}{' '}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  //MARK: - API CALL

  callGetNotifications() {
    var input = {
      userId: this.props.user.userId,
      token: this.props.user.token,
      page: '1',
    };
    this.props.getHome(input);
  }
}
//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    home: notificationListSelector(state.HomeReducer),
    isLoading: isLoadingSelector(state.NotificationReducer),
    api: apiSelector(state.NotificationReducer),
    error: errorSelector(state.NotificationReducer),
    successMessage: successSelector(state.NotificationReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getHome: input => dispatch(getHome(input)),
  };
}

//MARK: - Navigation Header

const NotificationListNew = withTheme(NotificationList);

NotificationListNew.navigationOptions = ({ navigation, screenProps, params }) => {
  const { theme } = screenProps;
  return {
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      fontSize: 30,
      color: 'black',
    },

    headerStyle: { shadowColor: 'transparent', borderBottomWidth: 0 },
    headerTintColor: theme.primaryColor,
    headerLeft: <DrawerIcon navigation={navigation} action={() => navigation.dispatch(DrawerActions.toggleDrawer())} />,

  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationListNew);
