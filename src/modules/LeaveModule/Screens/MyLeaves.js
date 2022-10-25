/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Button,
  Image,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  flatListItemSeparator,
  NoRecordAvailableView
} from '../../../components/utility/common';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {
  DrawerIcon,
  AddButton,
  NotificationButton,
} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {GET_MY_LEAVES} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myLeavesListSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getMyLeaves} from '../Actions/LeaveActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import MyLeaveCell from './MyLeaveCell';
import moment from 'moment';
import CardView from 'react-native-cardview';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import {isPermissionAllowed} from '../../../network/APICall';
import BaseClass from '../../Base/BaseClass';
import SearchComponent from '../../../components/views/SearchComponent';

class MyLeaves extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myLeaves: undefined,
      selectedStatusName: 'All',
      selectedStatus: '0,1,2,3',
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  componentWillMount() {
    this.myLeaves();
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
    if (this.props.error && this.props.error.request == GET_MY_LEAVES) {
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

    //get my dashboard
    if (this.props.api === GET_MY_LEAVES) {
      if (this.props.error !== null && this.props.api === GET_MY_LEAVES) {
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
        this.hideSpinner();
      }

      if (!this.props.error && this.props.api === GET_MY_LEAVES) {
        if (this.props.myLeaves !== this.state.myLeaves) {
          this.setState({
            myLeaves: this.props.myLeaves,
            refreshing: false,
            arrayholder: this.props.myLeaves,
          });
          this.state.submitLoader = false;
          this.hideSpinner();
        }
      }
    }
  }

  render() {
   
    return (
      <BaseClass title={translate('Leaves')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        {/* <SearchComponent
          onChangeText={text => this.searchFilterFunction(text)}
        /> */}
        {this.state.myLeaves !== undefined &&

          this.renderFilterView()
         }
         <View style={{flex:1}}>
          
       
          {this.renderLeaves()}
          </View>
      </BaseClass>
    );
  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({myLeaves: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.myLeaves(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          myLeaves: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }
  renderLeaves() {
    if (this.state.myLeaves !== undefined && this.state.myLeaves.length === 0) {
      return <NoRecordAvailableView />;
    }
    if (this.state.myLeaves !== undefined) {
      return (
        <View style={{flex: 1, padding: 2}}>
          <FlatList
            data={this.state.myLeaves}
            renderItem={this.renderLeaveItem}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
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
  renderFilterView() {
    const {theme} = this.props;
    return (
      <View style={{padding: 10, height: 80}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{flex: 1,flexDirection: 'row'}}>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  marginTop: 10,
                  width:'95%',
                }}>
                <Text>
                <Text
                  style={[
                    theme.detail,
                    {color: theme.disableButtonColor, marginLeft: 5},
                  ]}>
                  {translate('displaying')} 
                </Text>
                <Text
                  style={[
                    theme.header,
                    {color: theme.primaryColor, fontWeight: 'bold'},
                  ]}>
                  {this.state.selectedStatusName}
                </Text>
                <Text
                  style={[
                    theme.detail,
                    {
                      color: theme.disableButtonColor,
                      textTransform: 'lowercase',
                    },
                  ]}>
                  {translate('leaves')}
                </Text>
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
              }}
              onPress={() =>
                this.props.navigation.navigate('MyLeavesFilter', {
                  getSelectedValues: this.getSelectedValues.bind(this),
                })
              }>
              <Image
                source={require('../../../assets/filter.png')}
                resizeMode="stretch"
                style={[
                  styless.imageThumbnail,
                  {width: 30, height: 30, marginRight: 10, marginTop: 15},
                ]}
              />
            </TouchableOpacity>
          </View>
        </CardView>
      </View>
    );
  }

  getSelectedValues(status) {
    var selectedStatusName = this.getStatusName(status);
    this.setState(
      {
        selectedStatus: status.length === 1 ? '0,1,2,3' : status.toString(),
        selectedStatusName: status.length === 1 ? 'All' : selectedStatusName,
      },
      () => {
        this.myLeaves();
      },
    );
  }

  getStatusName(status) {
    let statusName = '';
    status.map(item => {
      if (item === '0') {
        statusName = 'Pending,';
      } else if (item === '1') {
        statusName = statusName + 'Approved,';
      } else if (item === '2') {
        statusName = statusName + 'Rejected,';
      } else if (item === '3') {
        statusName = statusName + 'Cancelled';
      }
    });

    return statusName;
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

    this.myLeaves();
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
      () => this.myLeaves(),
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
          this.myLeaves(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };
  // renderFooter = () => {
  //   const {theme} = this.props;
  //   //it will show indicator at the bottom of the list when data is loading otherwise it returns null
  //   if (this.props.isLoading && this.state.page !== 1) {
  //     return (
  //       <ActivityIndicatorCustom
  //         isSpinner={true}
  //       />
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  myLeaves(text) {
    var input = {
      userId: this.props.user.userId,
      status: this.state.selectedStatus,
      search: text ? text : '',
      leaveId: '',
      page: this.state.page.toString(),
      type: '1,2,3',
      request: GET_MY_LEAVES,
    };
    this.props.getMyLeaves(input);
  }

  renderLeaveItem = ({item}) => {
    return <MyLeaveCell item={item} navigation={this.props.navigation} />;
  };

  renderNoRecords() {
   
      return <NoRecordAvailableView/>
  }
}
const MyLeavesNew = withTheme(MyLeaves);
MyLeavesNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    headerRight: isPermissionAllowed('Leave/apply') ? (
      <AddButton
        navigation={navigation}
        action={() => navigation.navigate('ApplyLeave')}
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
    isLoading: isLoadingSelector(state.LeaveReducer),
    api: apiSelector(state.LeaveReducer),
    error: errorSelector(state.LeaveReducer),
    myLeaves: myLeavesListSelector(state.LeaveReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMyLeaves: input => dispatch(getMyLeaves(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLeavesNew);
