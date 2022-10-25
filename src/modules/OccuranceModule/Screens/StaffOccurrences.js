/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  FlatList,
  View,
  Alert,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {DrawerIcon, NotificationButton} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {flatListItemSpaceSeparator, NoRecordAvailableView} from '../../../components/utility/common';
import {GET_STAFF_OCCURRENCES} from '../Actions/type';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getStaffOccurrencesSelector,
} from '../Actions/selectors';
import {getStaffOccurrences} from '../Actions/OccuranceActions';
import CardView from 'react-native-cardview';
import {styless} from '../../../components/common/Styles';
import {translate} from '../../../../App';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import BaseClass from '../../Base/BaseClass';
import SearchComponent from '../../../components/views/SearchComponent';

class StaffOccurrences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      selectedStatusName: 'Pending',
      selectedStatus: '0',
      empName: 'All Members',
      typeName: 'All Types',
      type: '0',
      empId: '',
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  componentWillMount() {
    this.callgetStaffOccurrences();
  }

  callgetStaffOccurrences(text) {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      occId: '',
      page: this.state.page,
      status: this.state.selectedStatus,
      type: this.state.type,
      employeeId: this.state.empId,
      search: text ? text : '',
      request: GET_STAFF_OCCURRENCES,
    };
    this.props.getStaffOccurrences(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_STAFF_OCCURRENCES) {
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

    //get staffOccurrences
    if (this.props.api === GET_STAFF_OCCURRENCES) {
      if (
        this.props.error !== null &&
        this.props.api === GET_STAFF_OCCURRENCES
      ) {
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

      if (!this.props.error && this.props.api === GET_STAFF_OCCURRENCES) {
        if (this.props.staffOccurrences !== this.state.staffOccurrences) {
          this.setState({
            staffOccurrences: this.props.staffOccurrences,
            refreshing: false,
            arrayholder: this.props.staffOccurrences,
          });
          this.hideSpinner();
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    return (   
      <BaseClass title={translate('occurrences')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        {/* <SearchComponent
          onChangeText={text => this.SearchFilterFunction(text)}
        /> */}
        {this.state.staffOccurrences !== undefined &&

          this.renderFilterView()
         }
          {this.renderStaffOccurrences()}
      </BaseClass>
    );
  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({staffOccurrences: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.callgetStaffOccurrences(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          staffOccurrences: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }

  renderStaffOccurrences() {
    if (this.state.staffOccurrences !== undefined && this.state.staffOccurrences.length === 0) {
      return <NoRecordAvailableView />;
    }
    if (this.state.staffOccurrences !== undefined) {
    return (
      <View style={{flex: 1, padding: 2}}>
        <FlatList
          data={this.state.staffOccurrences}
          renderItem={this.renderItem}
          numColumns={1}
          extraData={this.props}
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
    const {theme} = this.props;
    var type = '';
    switch (item.type) {
      case '1':
        type = 'change_in_marital_status';
        break;
      case '2':
        type = 'request_for_maternity_leave';
        break;
      case '3':
        type = 'request_for_extended_maternity_leave';
        break;
      case '4':
        type = 'request_for_paternity_leave';
        break;
      case '5':
        type = 'request_for_solo_parent';
        break;
      case '6':
        type = 'request_for_resign';
        break;
      case '7':
        type = 'request_for_victims';
        break;
    }
    var status = '';
    switch (item.status) {
      case '0':
        status = 'pending';
        break;
      case '1':
        status = 'approved';
        break;
      case '2':
        status = 'rejected';
        break;
    }
    return (
      <View style={{margin: 2, flex: 1}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <TouchableOpacity
            style={[
              styless.textVertical,
              {
                width: '100%',
                height: '100%',
                padding: 5,
              },
            ]}
            onPress={() =>
              this.props.navigation.navigate('OccurrenceDetails', {item: item})
            }>
            <Text
              style={[
                theme.header,
                {textAlign: 'left', color: theme.primaryColor},
              ]}>
              {item.userName}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  theme.detail,
                  {textAlign: 'left', color: 'gray', flex: 1},
                ]}>
                {translate(type)}
              </Text>
              <Text
                style={[
                  theme.detail,
                  {
                    textAlign: 'right',
                    color: theme.primaryColor,
                    fontWeight: 'bold',
                    flex: 0.3,
                    marginTop: 3,
                  },
                ]}>
                {translate(status)}
              </Text>
            </View>
          </TouchableOpacity>
        </CardView>
      </View>
    );
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
            <View style={{flex: 1, height: 80}}>
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
                  {' '}
                  {translate('occurrence_reports')}
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  flex: 1,
                }}>
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
                    {color: theme.primaryColor, fontWeight: 'bold'},
                  ]}>
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
                    {color: theme.primaryColor, fontWeight: 'bold'},
                  ]}>
                  {this.state.typeName}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() =>
                this.props.navigation.navigate('OccurrenceFilter', {
                  getSelectedValues: this.getSelectedValues.bind(this),
                })
              }>
              <Image
                source={require('../../../assets/filter.png')}
                resizeMode="stretch"
                style={[
                  styless.imageThumbnail,
                  {width: 30, height: 30, marginRight: 10},
                ]}
              />
            </TouchableOpacity>
          </View>
        </CardView>
      </View>
    );
  }

  getSelectedValues(employee, typeModel, status) {
    var selectedStatusName = this.getStatusName(status);
    this.setState(
      {
        empId: employee.employeeId !== undefined ? employee.employeeId : '',
        empName:
          employee.empName !== undefined ? employee.empName : 'All Members',
        type: typeModel.typeId !== undefined ? typeModel.typeId : '',
        typeName:
          typeModel.typeName !== undefined ? typeModel.typeName : 'All Types',
        selectedStatus: status.toString(),
        selectedStatusName: selectedStatusName,
      },
      () => {
        this.callgetStaffOccurrences();
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
        statusName = statusName + 'Rejected';
      }
    });

    return statusName;
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

    this.callgetStaffOccurrences();
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
      () => this.callgetStaffOccurrences(),
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
          this.callgetStaffOccurrences(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };
}
const StaffOccurrencesNew = withTheme(StaffOccurrences);
StaffOccurrencesNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    isLoading: isLoadingSelector(state.OccurrenceReducer),
    api: apiSelector(state.OccurrenceReducer),
    error: errorSelector(state.OccurrenceReducer),
    staffOccurrences: getStaffOccurrencesSelector(state.OccurrenceReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getStaffOccurrences: input => dispatch(getStaffOccurrences(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StaffOccurrencesNew);
