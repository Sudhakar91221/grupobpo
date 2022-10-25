/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, FlatList, Text, ScrollView, RefreshControl} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {
  DrawerIcon,
  AddButton,
  NotificationButton,
} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {GET_MY_REQUESTS} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myRequestSelector,
} from '../Actions/selector';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getMyRequests} from '../Actions/RequestActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {flatListItemSpaceSeparator, NoRecordAvailableView} from '../../../components/utility/common';
import {isPermissionAllowed} from '../../../network/APICall';
import MyRequestCell from './MyRequestCell';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';
import SearchComponent from '../../../components/views/SearchComponent';

class MyRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myRequests: undefined,
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  componentWillMount() {
    this.myRequests();
  }
  refreshData = () => {
    this.fetchData()
  }
  componentDidMount() {

    this.props.navigation.setParams({
      refreshData : this.refreshData,
    });

    this.fetchData();

    const {navigation} = this.props;
    navigation.addListener('willFocus', () => {
          // Alert.alert('Refreshed');
          this.fetchData();
     }
   );
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_MY_REQUESTS) {
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
      this.hideSpinner();
    }

    //get my requests
    if (this.props.api === GET_MY_REQUESTS) {
      if (this.props.error !== null && this.props.api === GET_MY_REQUESTS) {
        if (this.props.error !== prevProps.error) {
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

      if (!this.props.error && this.props.api === GET_MY_REQUESTS) {
        if (this.props.myRequests !== prevProps.myRequests) {
          this.setState({
            myRequests: this.props.myRequests,
            refreshing: false,
            arrayholder: this.props.myRequests,
          });
          this.hideSpinner();
        }
      }
    }
  }

  render() {
    return (
      <BaseClass title={translate('requests')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        <SearchComponent
            onChangeText={text => this.SearchFilterFunction(text)}
        />
        {this.renderMyRequests()}
      </BaseClass>
    );
  }

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({myRequests: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.myRequests(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          myRequests: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }
  renderMyRequests() {
    if (
      this.state.myRequests !== undefined &&
      this.state.myRequests.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    if (this.state.myRequests !== undefined) {
      return (
        <View style={{flex: 1, padding: 2}}>
          <FlatList
            data={this.state.myRequests}
            renderItem={this.renderLeaveItem}
            numColumns={1}
            keyExtractor={this._keyExtractor}
            onEndReached={this.loadMore.bind(this)}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            onEndReachedThreshold={0.5}
            onRefresh={this.onRefresh.bind(this)}
            extraData={this.props}
            refreshing={
              this.state.refreshing !== undefined
                ? this.state.refreshing
                : false
            }
            ItemSeparatorComponent={flatListItemSpaceSeparator}
            onEndReachedThreshold={0.4}
            ListFooterComponent={this.renderFooter.bind(this)}
          />
        </View>
      );
    }
  }
  renderFooter = () => {

    const {theme} = this.props
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (this.props.isLoading && this.state.page !== 1) {
          return <ActivityIndicatorCustom isSpinner={true} style={{paddingTop:20,height:80}}/>
        }else {
          return null;
        }
   
  };

  //MARK : - Event Handlers
  showSpinner() {
    this.setState({isSpinner: true});
  }

  hideSpinner() {
    if (this.state.isSpinner == true) {
      this.setState({isSpinner: false});
    }
  }
  fetchData() {
    //this.checkNetworkStatus()

    if (this.state.page == 1 && this.state.refreshing === false) {
      this.showSpinner();
    }
    // if (this.state.page !== this.state.lastPage) {

    this.myRequests();
    // }
  }
  onRefresh = () => {
    this.setState(
      {
        dataSource: [],
        isLoading: false,
        refreshing: true,
        seed: 1,
        page: 0,
      },
      () => this.myRequests(),
    );
  };

  loadMore = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      this.setState(
        {
          lastPage: this.state.page,
          isLoading: false,
          page: this.state.page + 1,
          refreshing: true,
        },
        () => {
          this.myRequests(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };
  renderLeaveItem = ({item}) => {
    return <MyRequestCell item={item} navigation={this.props.navigation} />;
  };

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

  myRequests(text) {
    var input = {
      userId: this.props.user.userId,
      companyId: this.props.user.userCompany,
      requestId: '',
      page: this.state.page,
      search: text ? text : '',
      request: GET_MY_REQUESTS,
    };
    this.props.getMyRequests(input);
  }
}
const MyRequestsNew = withTheme(MyRequests);
MyRequestsNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
    headerLeft: (
      <DrawerIcon
        navigation={navigation}
        action={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    ),
    headerRight: isPermissionAllowed('Requests/add') ? (
      <AddButton
        navigation={navigation}
        action={() => navigation.navigate('AddRequest')}
        notiaction={() => navigation.navigate('Notification')}
        isBadgeShown={global.isBadgeShown}
      />
    ) : (
      <NotificationButton
        navigation={navigation}
        action={() => navigation.navigate('Notification')}
        isBadgeShown={global.isBadgeShown}
      />
    ),
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.RequestReducer),
    api: apiSelector(state.RequestReducer),
    error: errorSelector(state.RequestReducer),
    myRequests: myRequestSelector(state.RequestReducer),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMyRequests: input => dispatch(getMyRequests(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRequestsNew);
