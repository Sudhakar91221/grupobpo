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
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import HolidayListCell from './HolidayListCell';
import {GET_HOLIDAYS} from '../Actions/type';
import {isPermissionAllowed} from '../../../network/APICall';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  holidaysListSelector,
} from '../Actions/selectors';
import {getHolidays} from '../Actions/HolidayActions';
import {Dropdown} from 'react-native-material-dropdown';
import moment from 'moment';

class Holiday extends React.Component {
  constructor(props) {
    super(props);
    this.state = {page: 1};
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentWillMount() {
    var currentYear = moment().year();
    var lastYear = currentYear - 1;
    var nextYear = currentYear + 1;

    let list = [];
    var lastYearObj = {index: 0, value: lastYear};
    var currentYearObj = {index: 1, value: currentYear};
    var nextYearObj = {index: 2, value: nextYear};
    list.push(lastYearObj);
    list.push(currentYearObj);
    list.push(nextYearObj);
    this.state.yearList = list;

    this.callGetHolidays();
  }

  callGetHolidays() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      year:
        this.state.value === undefined
          ? this.state.yearList[1].value
          : this.state.value,
      request: GET_HOLIDAYS,
    };
    this.props.getHolidays(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_HOLIDAYS) {
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

    //get holidays
    if (this.props.api === GET_HOLIDAYS) {
      if (this.props.error !== null && this.props.api === GET_HOLIDAYS) {
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

      if (!this.props.error && this.props.api === GET_HOLIDAYS) {
        if (this.props.holidays !== this.state.holidays) {
          this.setState({holidays: this.props.holidays, refreshing: false});
        }
      }
    }
  }

  render() {
    var value = '';
    if (this.state.value !== undefined) {
      value = this.state.value;
    } else {
      value = this.state.yearList[1].value;
    }
    const {theme} = this.props;

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
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
          <View style={{flex: 1, padding: 10}}>
            {this.state.holidays === undefined ? (
              this.renderNoRecords()
            ) : this.state.holidays.length === 0 ? (
              this.renderNoRecords()
            ) : (
              <View style={{flex: 1}}>
                <FlatList
                  data={this.state.holidays}
                  renderItem={this.renderMoreItem}
                  numColumns={1}
                  keyExtractor={this._keyExtractor}
                  extraData={this.props}
                  ItemSeparatorComponent={flatListItemSpaceSeparator}
                  onRefresh={this.onRefresh}
                  refreshing={
                    this.state.refreshing !== undefined
                      ? this.state.refreshing
                      : false
                  }
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
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
      () => this.callGetHolidays(),
    );
  };

  changeText = text => {
    this.setState(
      {
        value: text,
      },
      () => this.callGetHolidays(),
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

  renderMoreItem = ({item}) => {
    return <HolidayListCell item={item} navigation={this.props.navigation} />;
  };
}
const HolidayNew = withTheme(Holiday);
HolidayNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    title: 'Holidays',
    // headerStyle: {
    //   shadowColor: 'transparent',
    //   borderBottomWidth: 0,
    //   backgroundColor: theme.primaryColor,
    // },
    // headerTintColor: 'white',
    headerLeft: (
      <DrawerIcon
        navigation={navigation}
        action={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    ),
    headerRight: isPermissionAllowed('Holiday/add') ? (
      <AddButton
        navigation={navigation}
        action={() => navigation.navigate('AddHoliday')}
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
    isLoading: isLoadingSelector(state.HolidayReducer),
    api: apiSelector(state.HolidayReducer),
    error: errorSelector(state.HolidayReducer),
    holidays: holidaysListSelector(state.HolidayReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getHolidays: input => dispatch(getHolidays(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HolidayNew);
