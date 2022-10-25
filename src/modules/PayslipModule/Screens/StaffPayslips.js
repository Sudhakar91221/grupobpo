/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  FlatList,
  View,
  Alert,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {
  DrawerIcon,
  AddButton,
  NotificationButton,
} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {flatListItemSpaceSeparator, NoRecordAvailableView} from '../../../components/utility/common';
import {GET_STAFF_PAYSLIPS} from '../Actions/type';
import {isPermissionAllowed} from '../../../network/APICall';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  staffPayslipSelector,
} from '../Actions/selector';
import {getStaffPayslips} from '../Actions/PayslipActions';
import StaffPayslipCell from './StaffPayslipCell';
import {SingleSelection} from '../../FormsComponent/Component/SingleSelection';
import {translate} from '../../../../App';
import {styless} from '../../../components/common/Styles';
import CardView from 'react-native-cardview';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import BaseClass from '../../Base/BaseClass';
import SearchComponent from '../../../components/views/SearchComponent';

class StaffPayslips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      periodName: 'Recent',
      modalVisible: false,
      orderBy: 1,
      orderType: 1,
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  // setModalVisible() {
  //   this.setState({modalVisible: !this.state.modalVisible});
  // }

  componentWillMount() {
    this.props.navigation.setParams({
      handleStateChange: () => this.setState({modalVisible: !this.state.modalVisible}),
    });
    this.callStaffPayslipsAPI();
  }

  callStaffPayslipsAPI(text) {
    if (this.state.periodName === 'Recent') {
      var input = {
        company: this.props.user.userCompany,
        userId: this.props.user.userId,
        page: this.state.page,
        orderBy: this.state.orderBy,
        search: text ? text : '',
        orderType: this.state.orderType,
        request: GET_STAFF_PAYSLIPS,
      };
      this.props.getStaffPayslips(input);
      this.setState({staffPayslipData: undefined});
    } else {
      var input = {
        company: this.props.user.userCompany,
        userId: this.props.user.userId,
        page: this.state.page,
        orderBy: this.state.orderBy,
        orderType: this.state.orderType,
        periodId: this.state.periodId,
        staff: this.state.selectedMembers,
        search: text ? text : '',
        request: GET_STAFF_PAYSLIPS,
      };
      this.props.getStaffPayslips(input);
      this.setState({staffPayslipData: undefined});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_STAFF_PAYSLIPS) {
      if (this.props.error !== prevProps.error) {
        this.setState({period: this.props.error.period});
        this.hideSpinner();
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

    //get staff payslips
    if (this.props.api === GET_STAFF_PAYSLIPS) {
      if (this.props.error !== null && this.props.api === GET_STAFF_PAYSLIPS) {
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
        this.hideSpinner();
      }

      if (!this.props.error && this.props.api === GET_STAFF_PAYSLIPS) {
        if (this.props.staffPayslipData !== prevProps.staffPayslipData) {
          this.setState({
            staffPayslipData: this.props.staffPayslipData,
            refreshing: false,
            arrayholder: this.props.staffPayslipData,
          });
          this.hideSpinner();
        }
      }
    }
  }

  render() {
    return (
      <BaseClass title={translate('payslips')}>
      <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  marginRight: '10%',
                  marginLeft: '10%',
                  backgroundColor: 'white',
                  borderColor: 'gray',
                  borderRadius: 5,
                  borderWidth: 1,
                  padding: 5,
                }}>
                {this.renderDialogView()}
              </View>
            </View>
          </Modal>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        {/* <SearchComponent
            onChangeText={text => this.SearchFilterFunction(text)}
        /> */}
        {this.state.staffPayslipData !== undefined &&

          this.renderFilterView()
          }
        
          {this.renderStaffPaySlips()}
      </BaseClass>
    );
  }

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({staffPayslipData: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.callStaffPayslipsAPI(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          staffPayslipData: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }

  renderStaffPaySlips() {
    if (
      this.state.staffPayslipData !== undefined &&
      this.state.staffPayslipData.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    if (this.state.staffPayslipData !== undefined) {
      return (
          <View style={{flex: 1, padding: 2}}>
            <FlatList
              data={this.state.staffPayslipData}
              renderItem={this.renderPayslipItem}
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
  

  renderDialogView() {
    const {theme} = this.props;
    let orderByItem = {
      option: ['Sort by employee', 'Sort by salary'],
      lable: 'Order By',
    };
    let orderTypeItem = {
      option: ['Ascending', 'Descending'],
      lable: 'Order Type',
    };
    return (
      <View style={{height: 350, width: '80%'}}>
        <Text
          style={[
            theme.header,
            {
              color: theme.primaryColor,
              fontWeight: 'bold',
              fontSize: 18,
              alignSelf: 'center',
              marginBottom: 10,
            },
          ]}
          numberOfLines={1}>
          {translate('sort')}
        </Text>

        <View style={{paddingHorizontal: 10, flex: 1}}>
          <SingleSelection
            item={orderByItem}
            theme={this.props.theme}
            onRef={ref => {
              this.currentPageRef.orderBy = ref;
            }}
            onRadioSelection={this.onOrderbySelection}
          />
        </View>

        <View style={{paddingHorizontal: 10, flex: 1}}>
          <SingleSelection
            item={orderTypeItem}
            theme={this.props.theme}
            onRef={ref => {
              this.currentPageRef.orderBy = ref;
            }}
            onRadioSelection={this.onOrderTypeSelection}
          />
        </View>

        <View
          style={{width: '100%', height: 1, backgroundColor: 'lightgray'}}
        />
        <TouchableOpacity
          onPress={() => {
            this.setState({modalVisible: !this.state.modalVisible}, () =>
              this.callStaffPayslipsAPI(),
            );
          }}>
          <Text
            style={{
              color: theme.white,
              fontWeight: 'bold',
              fontSize: 16,
              alignSelf: 'center',
              marginBottom: 10,
              marginTop: 10,
              backgroundColor: theme.primaryColor,
              borderRadius: 60,
              padding: 10,
              paddingLeft: 30,
              paddingRight: 30,
            }}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  onOrderbySelection = (name, value) => {
    this.state.orderBy = value;
  };

  onOrderTypeSelection = (name, value) => {
    this.state.orderType = value;
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
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginTop: 15}}>
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
                  {this.state.periodName}
                </Text>
                <Text
                  style={[
                    theme.detail,
                    {
                      color: theme.disableButtonColor,
                      textTransform: 'lowercase',
                    },
                  ]}>
                  {translate('payslips')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('PayslipFilter', {
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

  getSelectedValues(members, period, selectAll, selectCount) {
    var arr = [];

    if(members) {

      for (let i = 0; i < members.length; i++) {
        if (members[i].hasOwnProperty('isSelect')) {
          arr.push(members[i].userId);
        }
      }
    }
    

    this.setState(
      {
        periodId: period.periodId,
        periodName: period.periodName,
        selectedMembers: arr.join(', '),
        selectAll: selectAll,
        selectCount: selectCount,
      },
      () => {
        this.callStaffPayslipsAPI();
      },
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

    this.callStaffPayslipsAPI();
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
      () => this.callStaffPayslipsAPI(),
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
          this.callStaffPayslipsAPI(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };

  renderPayslipItem = ({item}) => {
    return <StaffPayslipCell item={item} navigation={this.props.navigation} />;
  };
}
const StaffPayslipsNew = withTheme(StaffPayslips);
StaffPayslipsNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    headerRight: () => (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => navigation.state.params.handleStateChange()}>
          <Image
            source={require('../../../assets/ic_sort_white.png')}
            style={{
              width: 30,
              height: 30,
              marginRight: 10,
              //backgroundColor: '#343957',
            }}
          />
        </TouchableOpacity>
        <NotificationButton
          navigation={navigation}
          action={() => navigation.navigate('Notification')}
          isBadgeShown={global.isBadgeShown}
        />
      </View>
    ),
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.PayslipReducer),
    api: apiSelector(state.PayslipReducer),
    error: errorSelector(state.PayslipReducer),
    staffPayslipData: staffPayslipSelector(state.PayslipReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getStaffPayslips: input => dispatch(getStaffPayslips(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StaffPayslipsNew);
