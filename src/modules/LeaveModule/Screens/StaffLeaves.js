/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ScrollView,
  Image,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {
  DrawerIcon,
  AddButton,
  NotificationButton,
} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {GET_STAFF_LEAVES} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  staffLeavesListSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getStaffLeaves} from '../Actions/LeaveActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {flatListItemSpaceSeparator, flatListItemSeparator, NoRecordAvailableView,} from '../../../components/utility/common';
import StaffLeaveCell from './StaffLeaveCell';
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

    let startOfMonth = '',
      endOfMonth = '';
    if (this.props.navigation.state.params !== undefined) {
      startOfMonth = this.props.navigation.state.params.senddate;
      endOfMonth = moment(startOfMonth, 'DD-MM-YYYY').add(2, 'days');
    } else {
      startOfMonth = moment()
        .startOf('month')
        .format('DD-MM-YYYY');
      endOfMonth = moment()
        .endOf('month')
        .format('DD-MM-YYYY');
    }

    this.state = {
      staffLeaves: undefined,
      selectedStatusName: 'All',
      selectedStatus: '0,1,2,3',
      selectedPeriod: '1,2,3',
      startDate: startOfMonth,
      endDate: endOfMonth,
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
    // this.renderFilterView = this.renderFilterView.bind(this);
    // this.onRefresh = this.onRefresh.bind(this);
  }

  componentWillMount() {
    this.staffLeaves();
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_STAFF_LEAVES) {
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
    if (this.props.api === GET_STAFF_LEAVES) {
      if (this.props.error !== null && this.props.api === GET_STAFF_LEAVES) {
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

      if (!this.props.error && this.props.api === GET_STAFF_LEAVES) {
        if (this.props.staffLeaves !== this.state.staffLeaves) {
          this.setState({
            staffLeaves: this.props.staffLeaves,
            refreshing: false,
            arrayholder: this.props.staffLeaves,
          });
          //this.state.submitLoader = false;
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
          onChangeText={text => this.SearchFilterFunction(text)}
        /> */}
        {this.state.staffLeaves !== undefined &&

          this.renderFilterView()
        }
        <View style={{flex:1}}>
          
       
          {this.renderStaffLeaves()}
          </View>
    </BaseClass>
    )
  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({staffLeaves: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.staffLeaves(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          staffLeaves: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }

  renderStaffLeaves() {
    if (
      this.state.staffLeaves !== undefined &&
      this.state.staffLeaves.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    if (this.state.staffLeaves !== undefined) {
      return (
        <View style={{flex: 1, padding: 2}}>
          <FlatList
            data={this.state.staffLeaves}
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
 
  renderFilterView() {
    const {theme} = this.props;
    return (
      <View style={{padding: 10, height: 100}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
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
              </View>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
              }}
              onPress={() =>
                this.props.navigation.navigate('StaffLeavesFilter', {
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
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                }}>
                <Text
                  style={[
                    theme.detail,
                    {color: theme.disableButtonColor, marginLeft: 5},
                  ]}>
                  {translate('from')}
                </Text>
                <Text
                  style={[
                    theme.header,
                    {color: theme.primaryColor, fontWeight: 'bold'},
                  ]}>
                  {this.state.startDate}
                </Text>
                <Text
                  style={[
                    theme.detail,
                    {
                      color: theme.disableButtonColor,
                      textTransform: 'lowercase',
                    },
                  ]}>
                  {translate('to')}
                </Text>
                <Text
                  style={[
                    theme.header,
                    {color: theme.primaryColor, fontWeight: 'bold'},
                  ]}>
                  {this.state.endDate}
                </Text>
              </View>
            </View>
          </View>
        </CardView>
      </View>
    );
  }

  getSelectedValues(status, period, fromDate, toDate) {
    var momentObj = moment(fromDate, 'DD/MM/YYYY');
    let startDate = moment(momentObj).format('DD-MM-YYYY');
    var momentObj = moment(toDate, 'DD/MM/YYYY');
    let endDate = moment(momentObj).format('DD-MM-YYYY');
    var selectedStatusName = this.getStatusName(status);

    this.setState(
      {
        selectedStatus: status.length === 1 ? '0,1,2,3' : status.toString(),
        selectedStatusName: status.length === 1 ? 'All' : selectedStatusName,
        selectedPeriod: period === undefined ? '1,2,3' : period.toString(),
        startDate:
          startDate === 'Invalid date'
            ? moment()
                .startOf('month')
                .format('DD-MM-YYYY')
            : startDate,
        endDate:
          endDate === 'Invalid date'
            ? moment()
                .endOf('month')
                .format('DD-MM-YYYY')
            : endDate,
      },
      () => {
        this.staffLeaves();
      },
    );
  }

  getStatusName(status) {
    let statusName = '';
    status.map(item => {
      if (item === '0') {
        statusName = 'Pending';
      } else if (item === '1') {
        statusName = statusName + 'Approved';
      } else if (item === '2') {
        statusName = statusName + 'Rejected';
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
 
  onRefresh = () => {
    this.setState(
      {
        dataSource: [],
        isLoading: false,
        refreshing: true,
        seed: 1,
        page: 0,
      },
      () => this.staffLeaves(),
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
          this.staffLeaves(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };

  staffLeaves(text) {
    if (this.state.page == 1 && this.state.refreshing === false) {
      this.showSpinner();
    }
    var input = {
      userId: this.props.user.userId,
      status: this.state.selectedStatus,
      search: text ? text : '',
      leaveId: '',
      page: this.state.page.toString(),
      type: this.state.selectedPeriod,
      company: this.props.user.userCompany,
      fromDate: this.state.startDate,
      toDate: this.state.endDate,
      request: GET_STAFF_LEAVES,
    };
    this.props.getStaffLeaves(input);
  }

  renderLeaveItem = ({item}) => {
    return <StaffLeaveCell item={item} navigation={this.props.navigation} />;
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
    headerRight: isPermissionAllowed('Leave/applyStaffLeave') ? (
      <AddButton
        navigation={navigation}
        action={() => navigation.navigate('ApplyStaffLeave')}
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
    staffLeaves: staffLeavesListSelector(state.LeaveReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getStaffLeaves: input => dispatch(getStaffLeaves(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLeavesNew);
