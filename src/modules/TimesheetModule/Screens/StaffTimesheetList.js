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
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {DrawerIcon, NotificationButton} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {GET_STAFF_TIMESHEETS} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  staffTimesheetListSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getStaffTimesheets} from '../Actions/TimesheetActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {
  flatListItemSpaceSeparator,
  NoRecordAvailableView,
} from '../../../components/utility/common';
import StaffTimesheetListCell from '../Components/StaffTimesheetListCell';
import CardView from 'react-native-cardview';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import BaseClass from '../../Base/BaseClass';
import SearchComponent from '../../../components/views/SearchComponent';

class StaffTimesheetList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //timesheets: undefined,
      selectedStatusName: 'All',
      empName: 'All Members',
      periodName: '',
      selectedStatus: '',
      empId: '',
      periodId: '',
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData(text) {
    if (this.state.page == 1 && this.state.refreshing === false) {
      this.showSpinner();
    }
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      search: text ? text : '',
      page: this.state.page.toString(),
      status: this.state.selectedStatus,
      employeeId: this.state.empId,
      periodId: this.state.periodId,
      request: GET_STAFF_TIMESHEETS,
    };
    this.props.getStaffTimesheets(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_STAFF_TIMESHEETS) {
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
    if (this.props.api === GET_STAFF_TIMESHEETS) {
      if (
        this.props.error !== null &&
        this.props.api === GET_STAFF_TIMESHEETS
      ) {
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

      if (!this.props.error && this.props.api === GET_STAFF_TIMESHEETS) {
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
          onChangeText = {text => this.searchFilterFunction(text)}
        /> */}
        {this.state.timesheets !== undefined && this.renderFilterView()}
        {this.renderStaffTimesheet()}
      </BaseClass>
    );
  }

  searchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1;
    if (text == '') {
      this.setState({timesheets: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.staffTimesheet(text);
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
  renderStaffTimesheet() {
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

  renderFooter = () => {
    const {theme} = this.props;
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (this.props.isLoading && this.state.page !== 1) {
      return (
        <ActivityIndicatorCustom
          isSpinner={true}
          style={{paddingTop: 20, height: 80}}
        />
      );
    } else {
      return null;
    }
  };
  renderTimesheetItem = ({item, index}) => {
    if (index === 0) {
      var periodName = item.startPeriod + '-' + item.endPeriod;
      this.setState({periodName: periodName});
    }
    return (
      <StaffTimesheetListCell item={item} navigation={this.props.navigation} />
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

  renderFilterView() {
    const {theme} = this.props;
    return (
      <View style={{padding: 10, minHeight: 110}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor: 'white',
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, minHeight: 100}}>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  marginTop: 10,
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
                    {translate('timesheets')}
                  </Text>
                  <Text
                    style={[
                      theme.detail,
                      {
                        color: theme.disableButtonColor,
                        textTransform: 'lowercase',
                      },
                    ]}>
                    {translate('of')}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  flex: 1,
                }}>
                <Text numberOfLines={0}>
                  <Text
                    style={[
                      theme.header,
                      {color: theme.primaryColor, fontWeight: 'bold'},
                    ]}
                    numberOfLines={0}>
                    {this.state.empName}  
                  </Text>
                  <Text
                    style={[
                      theme.detail,
                      {
                        color: theme.disableButtonColor,
                        textTransform: 'lowercase',
                      },
                    ]}>
                    {translate('of')}
                  </Text>
                  <Text
                    style={[
                      theme.header,
                      {
                        color: theme.primaryColor,
                        fontWeight: 'bold',
                      },
                    ]}>
                    {this.state.periodName}
                  </Text>
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                // alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() =>
                this.props.navigation.navigate('TimesheetFilter', {
                  getSelectedValues: this.getSelectedValues.bind(this),
                })
              }>
              <Image
                source={require('../../../assets/filter.png')}
                resizeMode="stretch"
                style={[
                  styless.imageThumbnail,
                  {width: 30, height: 30, marginRight: 5, marginTop: 0},
                ]}
              />
            </TouchableOpacity>
          </View>
        </CardView>
      </View>
    );
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
        page: 1,
      },
      () => this.fetchData(),
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
          this.fetchData(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };
  getSelectedValues(employee, period, status) {
    var selectedStatusName = this.getStatusName(status);
    this.setState(
      {
        empId: typeof employee == 'object' ? employee.employeeId : '',
        empName:
          typeof employee == 'object' ? employee.empName : 'All Members',
        periodId: period.periodId,
        periodName: period.periodName,
        selectedStatus: status.toString(),
        selectedStatusName: selectedStatusName,
        page:1
      },
      () => {
        this.fetchData();
      },
    );
  }
  getStatusName(status) {
    let statusName = '';
    status.map(item => {
      if (item === '0') {
        statusName = 'Open,';
      } else if (item === '1') {
        statusName = statusName + 'Submitted/Reconsideration,';
      } else if (item === '2') {
        statusName = statusName + 'Approved,';
      } else if (item === '3') {
        statusName = statusName + 'Rejected';
      }
    });

    return statusName;
  }
}
const StaffTimesheetListNew = withTheme(StaffTimesheetList);
StaffTimesheetListNew.navigationOptions = ({
  navigation,
  screenProps,
  params,
}) => {
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
    timesheets: staffTimesheetListSelector(state.TimesheetReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getStaffTimesheets: input => dispatch(getStaffTimesheets(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StaffTimesheetListNew);
