/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Button,
  Image,
  View,
  Text,
  Alert,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {DrawerIcon, NotificationButton} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {GET_MY_TIMESHEETS} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myTimesheetListSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getMyTimesheets} from '../Actions/TimesheetActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {translate} from '../../../../App';
import {
  flatListItemSpaceSeparator,
  NoRecordAvailableView,
} from '../../../components/utility/common';
import MyTimesheetListCell from '../Components/MyTimesheetListCell';
import BaseClass from '../../Base/BaseClass';
import SearchComponent from '../../../components/views/SearchComponent';

class MyTimesheetList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timesheets: undefined,
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  componentWillMount() {
    this.myTimesheet();
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
    if (this.props.error && this.props.error.request == GET_MY_TIMESHEETS) {
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
      this.hideSpinner();
    }

    //get my dashboard
    if (this.props.api === GET_MY_TIMESHEETS) {
      if (this.props.error !== null && this.props.api === GET_MY_TIMESHEETS) {
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

      if (!this.props.error && this.props.api === GET_MY_TIMESHEETS) {
        if (this.props.timesheets !== this.state.timesheets) {
          this.setState({
            timesheets: this.props.timesheets,
            refreshing: false,
            arrayholder: this.props.timesheets,
          });
          this.hideSpinner();
        }
      }
    }
  }

  render() {
    return (
      <BaseClass title={translate('timesheets')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
         {/* <SearchComponent
            onChangeText={text => this.SearchFilterFunction(text)}
        /> */}
        {this.renderMyTimesheet()}
      </BaseClass>
    )
  }
  
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({timesheets: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.myTimesheet(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          timesheets: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }
  renderMyTimesheet() {
    if (
      this.state.timesheets !== undefined &&
      this.state.timesheets.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    if (this.state.timesheets !== undefined) {
      return (
        <View style={{flex: 1, padding: 2}}>
          <FlatList
            data={this.state.timesheets}
            renderItem={this.renderTimesheetItem}
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

  myTimesheet(text) {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      request: GET_MY_TIMESHEETS,
      search: text ? text : '',
      page: this.state.page.toString(),
    };
    this.props.getMyTimesheets(input);
  }

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

    this.myTimesheet();
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
      () => this.myTimesheet(),
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
          this.myTimesheet(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };
  renderFooter = () => {

    const {theme} = this.props
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (this.props.isLoading && this.state.page !== 1) {
          return <ActivityIndicatorCustom isSpinner={true} style={{paddingTop:20,height:80}}/>
        }else {
          return null;
        }
   
  };
  renderTimesheetItem = ({item}) => {
    return (
      <MyTimesheetListCell item={item} navigation={this.props.navigation} />
    );
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
}
const MyTimesheetListNew = withTheme(MyTimesheetList);
MyTimesheetListNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    headerRight: (
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
    isLoading: isLoadingSelector(state.TimesheetReducer),
    api: apiSelector(state.TimesheetReducer),
    error: errorSelector(state.TimesheetReducer),
    timesheets: myTimesheetListSelector(state.TimesheetReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMyTimesheets: input => dispatch(getMyTimesheets(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTimesheetListNew);
