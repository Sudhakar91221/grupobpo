/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {withTheme} from 'react-native-paper';
import {
  DrawerIcon,
  AddButton,
  NotificationButton,
} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {Calendar} from 'react-native-calendars';
import EventCell from './EventCell';
import {flatListItemSeparator} from '../../../components/utility/common';
import {connect} from 'react-redux';
import {
  getEventsSelector,
  apiSelector,
  errorSelector,
  isLoadingSelector,
} from '../Actions/selectors';
import {getEvents} from '../Actions/CalenderActions';
import {GET_EVENTS} from '../Actions/type';
import moment from 'moment';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {translate} from '../../../../App';
import {isPermissionAllowed} from '../../../network/APICall';

class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    let endOfMonth = moment()
      .endOf('month')
      .format('YYYY-MM-DD');

    let startOfMonth = moment()
      .startOf('month')
      .format('YYYY-MM-DD');

    this.state = {
      selected: undefined,
      startDate: startOfMonth,
      endDate: endOfMonth,
      page: 1,
    };

    this.onDayPress = this.onDayPress.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentWillMount() {
    this.callGetEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_EVENTS) {
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

    //get events
    if (this.props.api === GET_EVENTS) {
      if (this.props.error !== null && this.props.api === GET_EVENTS) {
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

      if (!this.props.error && this.props.api === GET_EVENTS) {
        if (this.props.events !== prevProps.events) {
          if (this.props.events.length === 0) {
            this.setState({events: undefined, refreshing: false});
          } else {
            //sort events list according to date
            let sortedList = this.props.events.sort(function(a, b) {
              if (a.startDate < b.startDate) {
                return -1;
              }
              if (a.startDate > b.startDate) {
                return 1;
              }
              return 0;
            });

            //create new list containing header and users
            let newList = [];
            let currentPrefix = sortedList[0].startDate;
            let obj = {
              name: moment(currentPrefix).format('DD MMM YYYY'),
              isHeader: true,
            };
            newList.push(obj);
            sortedList.map(eventData => {
              if (currentPrefix === eventData.startDate) {
                newList.push(eventData);
              } else {
                currentPrefix = eventData.startDate;
                let obj = {
                  name: moment(currentPrefix).format('DD MMM YYYY'),
                  isHeader: true,
                };
                newList.push(obj);
                newList.push(eventData);
              }
            });

            // var markedDates = {};
            // let dateObj = {
            //   '2020-02-29': {marked: true, dotColor: 'pink', activeOpacity: 0},
            // };
            // markedDates.push(dateObj);

            this.setState({events: newList, refreshing: false});
          }
        }
      }
    }
  }

  onDayPress = day => {
    this.state.startDate = moment(day.dateString).format('YYYY-MM-DD');
    this.state.endDate = moment(day.dateString).format('YYYY-MM-DD');
    this.setState(
      {
        selected: day.dateString,
      },
      this.callGetEvents(),
    );
  };

  onMonthChange = month => {
    let endOfMonth = moment(month)
      .endOf('month')
      .format('YYYY-MM-DD');
    let startOfMonth = moment(month)
      .startOf('month')
      .format('YYYY-MM-DD');
    // this.state.startDate = startOfMonth;
    // this.state.endDate = endOfMonth;

    this.setState({startDate: startOfMonth, endDate: endOfMonth});

    this.callGetEvents();
  };

  callGetEvents() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      page: this.state.page,
      request: GET_EVENTS,
    };
    this.props.getEvents(input);
  }

  render() {
    const {theme} = this.props;
    return <View style={{flex: 1}}>{this.renderCalendarView()}</View>;
  }

  renderEventListView() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
        <View style={{flex: 1}}>
          {this.state.events === undefined ? (
            this.renderNoRecords()
          ) : this.state.events.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                data={this.state.events}
                renderItem={this.renderEventItem}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                extraData={this.props}
                ItemSeparatorComponent={flatListItemSeparator}
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
      () => this.callGetEvents(),
    );
  };

  renderNoRecords() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          marginTop: 10,
        }}>
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

  renderEventItem = ({item}) => {
    return <EventCell item={item} navigation={this.props.navigation} />;
  };

  renderCalendarView() {
    return (
      <ScrollView style={{padding: 0, flex: 1}}>
        <Calendar
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'MMMM yyyy'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={this.onMonthChange}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          onPressArrowLeft={substractMonth => substractMonth()}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={addMonth => addMonth()}
          theme={{
            calendarBackground: 'white',
            textSectionTitleColor: 'black',
            dayTextColor: 'black',
            todayTextColor: 'white',
            selectedDayTextColor: 'white',
            monthTextColor: 'black',
            indicatorColor: '#333248',
            selectedDayBackgroundColor: '#333248',
            todayBackgroundColor: '#333248',
            arrowColor: 'black',
            'stylesheet.calendar.header': {
              week: {
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            },
          }}
          onDayPress={this.onDayPress}
          markedDates={{
            [this.state.selected]: {
              selected: true,
              disableTouchEvent: true,
            },
          }}
          // markedDates={{
          //   '2020-02-16': {selected: true, marked: true, selectedColor: 'blue'},
          //   '2020-02-17': {marked: true},
          //   '2020-02-18': {marked: true, dotColor: 'red', activeOpacity: 0},
          //   '2020-02-19': {disabled: true, disableTouchEvent: true},
          // }}
        />
        {this.renderIndicatorView()}
        {this.renderEventListView()}
      </ScrollView>
    );
  }

  renderIndicatorView() {
    const {theme} = this.props;
    return (
      <View style={{flex: 1}}>
        <View
          style={{height: 0.8, width: '100%', backgroundColor: '#C8C8C8'}}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 5,
            paddingBottom: 10,
            backgroundColor: '#EFEFF4',
          }}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View
              style={{
                color: 'red',
                fontSize: 80,
                fontWeight: 'bold',
                alignSelf: 'flex-start',
                marginTop: 10,
                backgroundColor: 'red',
                width: 10,
                height: 10,
                borderRadius: 5,
                marginLeft: 20,
              }}
            />
            <Text
              style={[
                theme.header,
                {
                  color: theme.black,
                  marginLeft: 20,
                  marginTop: 5,
                },
              ]}
              numberOfLines={1}>
              {translate('holidays')}
            </Text>
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View
              style={{
                color: '#333248',
                fontSize: 80,
                fontWeight: 'bold',
                alignSelf: 'flex-start',
                marginTop: 10,
                backgroundColor: '#333248',
                width: 10,
                height: 10,
                borderRadius: 5,
                marginLeft: 20,
              }}
            />
            <Text
              style={[
                theme.header,
                {
                  color: theme.black,
                  marginLeft: 20,
                  marginTop: 5,
                },
              ]}
              numberOfLines={1}>
              {translate('events')}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 0.8,
            width: '100%',
            backgroundColor: '#C8C8C8',
          }}
        />
      </View>
    );
  }
}

const CalendarScreenNew = withTheme(CalendarScreen);

CalendarScreenNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    headerRight: isPermissionAllowed('Event/add') ? (
      <AddButton
        navigation={navigation}
        action={() => navigation.navigate('AddEvent')}
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
    isLoading: isLoadingSelector(state.CalenderReducer),
    api: apiSelector(state.CalenderReducer),
    error: errorSelector(state.CalenderReducer),
    events: getEventsSelector(state.CalenderReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getEvents: input => dispatch(getEvents(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreenNew);
