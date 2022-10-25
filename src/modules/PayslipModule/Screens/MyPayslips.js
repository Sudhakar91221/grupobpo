/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  FlatList,
  View,
  Alert,
  Text,
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
import HolidayListCell from '../../HolidayModule/Screens/HolidayListCell';
import {GET_MY_PAYSLIPS} from '../Actions/type';
import {isPermissionAllowed} from '../../../network/APICall';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myPayslipSelector,
} from '../Actions/selector';
import {getMyPayslips} from '../Actions/PayslipActions';
import {Dropdown} from 'react-native-material-dropdown';
import {translate} from '../../../../App';
import moment from 'moment';
import MyPayslipCell from './MyPayslipCell';
import BaseClass from '../../Base/BaseClass';
import SearchComponent from '../../../components/views/SearchComponent';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';

class MyPayslips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  componentWillMount() {
    var currentYear = moment().year();
    let list = [];
    var lastYearObj = {index: 0, value: currentYear};
    list.push(lastYearObj);
    this.state.yearList = list;

    this.callMyPayslipsAPI();
  }

  callMyPayslipsAPI(text) {
    var input = {
      search: text ? text : '',
      company: this.props.user.userCompany,
      userId: this.props.user.userId,
      year:
        this.state.value === undefined
          ? this.state.yearList[0].value
          : this.state.value,
      request: GET_MY_PAYSLIPS,
    };
    this.props.getMyPayslips(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_MY_PAYSLIPS) {
      if (this.props.error !== prevProps.error) {
        this.setState({period: this.props.error.period});
        let dates = this.props.error.period.split(' - ');
        let minYear = dates[0];
        let maxYear = dates[1];
        this.state.yearList = [];
        for (let i = maxYear, index = 0; i >= minYear; i--, index++) {
          var yearObj = {index: index, value: i};
          this.state.yearList.push(yearObj);
        }
        if (this.props.error.message !== 'Records not avaliable.') {
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
      this.hideSpinner();
    }

    //get my payslips
    if (this.props.api === GET_MY_PAYSLIPS) {
      if (this.props.error !== null && this.props.api === GET_MY_PAYSLIPS) {
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

      if (!this.props.error && this.props.api === GET_MY_PAYSLIPS) {
        if (this.props.myPayslipData !== prevProps.myPayslipData) {
          this.setState({
            myPayslips: this.props.myPayslipData.data,
            refreshing: false,
            arrayholder: this.props.myPayslipData.data,
          });
          this.hideSpinner();

          let dates = this.props.myPayslipData.period.split(' - ');
          let minYear = dates[0];
          let maxYear = dates[1];
          this.state.yearList = [];
          for (let i = maxYear, index = 0; i >= minYear; i--, index++) {
            var yearObj = {index: index, value: i};
            this.state.yearList.push(yearObj);
          }
        }
      }
    }
  }

  render() {
    var value = '';
    if (this.state.value !== undefined) {
      value = this.state.value;
    } else {
      value = this.state.yearList[0].value;
    }
    const {theme} = this.props;

    return (
      <BaseClass title={translate('payslips')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        {/* <SearchComponent
              onChangeText={text => this.SearchFilterFunction(text)}
        /> */}
        <View style={{flex: 1}}>
          <View style={{padding: 5, paddingLeft: '25%', paddingRight: '25%'}}>
            <View
              style={{
                paddingLeft: '5%',
                paddingRight: '5%',
                borderRadius: 5,
                borderColor: 'gray',
                borderWidth: 1,
              }}>
              <Dropdown
                data={this.state.yearList}
                value={value}
                textColor={theme.headerColor}
                baseColor={'gray'}
                fontSize={16}
                tintColor={theme.centerColor}
                onChangeText={this.changeText}
                animationDuration={0}
              />
            </View>
          </View>
            
          </View>
      
       <View style={{flex:1}}>
        {this.renderMyPayslips()}
        </View>
    </BaseClass>
      
    );
  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({myPayslips: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.callMyPayslipsAPI(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          myPayslips: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }
  renderMyPayslips() {
    if (
      this.state.myPayslips !== undefined &&
      this.state.myPayslips.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    if (this.state.myPayslips !== undefined) {
    return (
      <View style={{flex: 1, padding: 2}}>
        <FlatList
          data={this.state.myPayslips}
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
 

  changeText = text => {
    this.setState(
      {
        value: text,
      },
      () => this.callMyPayslipsAPI(),
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

    this.callMyPayslipsAPI();
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
      () => this.callMyPayslipsAPI(),
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
          this.callMyPayslipsAPI(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };

  renderPayslipItem = ({item}) => {
    return (
      <MyPayslipCell
        item={item}
        navigation={this.props.navigation}
        currency={this.props.myPayslipData.currency}
      />
    );
  };
}
const MyPayslipsNew = withTheme(MyPayslips);
MyPayslipsNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    isLoading: isLoadingSelector(state.PayslipReducer),
    api: apiSelector(state.PayslipReducer),
    error: errorSelector(state.PayslipReducer),
    myPayslipData: myPayslipSelector(state.PayslipReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMyPayslips: input => dispatch(getMyPayslips(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPayslipsNew);
