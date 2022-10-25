/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Alert,
  NativeModules,
  NativeEventEmitter,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import CardView from 'react-native-cardview';
const {width} = Dimensions.get('window');
import styles from '../../../components/utility/Styles';
import {WhiteButton} from '../../../components/views/Button';
import {ScreenHeight, ScreenWidth} from '../../../components/utility/Settings';
import Moment from 'moment';
import BlinkText from '../../../components/views/BlinkText';
import MomentTz from 'moment-timezone';
import {ThemeColors} from 'react-navigation';
const timeZone = 'Asia/Manila';

export default class TimesheetDay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedPage: 1,
    };
    this.onViewCheckinsButtonTapped = this.onViewCheckinsButtonTapped.bind(
      this,
    );
    this.onManualCheckoutButtonTapped = this.onManualCheckoutButtonTapped.bind(
      this,
    );
  }

  componentWillUnmount() {
    
  }
  componentDidMount() {
    const currentDay = Moment(this.props.selectedDay.date, 'DD-MM-YYYY').format(
      'DD MMM YYYY',
    );
    // const isToday = Moment.isToday

    // const isToday = today.diff(currentDay) == 0

    // var firstCheckin24Hour = Moment(this.props.firstCheckinTime, ["h:mm A"]).format("HH:mm");
    // console.log((this.props.selectedDay + "T" + firstCheckin24Hour))
    // let firstCheckinDate = new Date(MomentTz.tz((this.props.selectedDay + "T" + this.props.firstCheckinTime),"DD-MM-YYYYTHH:mm",timeZone).format())
    // let dateAfter20Hours = new Date(MomentTz.tz(firstCheckinDate,timeZone).add(20, 'hours').format())

    if (this.props.currentOpenDay === undefined) {
      this.setState({isToday: false});

      return;
    }
    const selectedDay = new Date(
      Moment(this.props.currentOpenDay, 'DD-MM-YYYY').format('DD MMM YYYY'),
    );
    const today = new Date(Moment().format('DD MMM YYYY HH:mm:ss'));

    var firstCheckin24Hour = Moment(this.props.firstCheckinTime, [
      'h:mm A',
    ]).format('HH:mm');
    var currentCheckin24Hour = Moment(this.props.selectedDay.inTime, [
      'h:mm A',
    ]).format('HH:mm');
    console.log(this.props.selectedDay.date + 'T' + firstCheckin24Hour);
    let firstCheckinDate = new Date(
      MomentTz.tz(
        this.props.selectedDay.date + 'T' + firstCheckin24Hour,
        'DD-MM-YYYYTHH:mm',
        timeZone,
      ).format(),
    );
    console.log(firstCheckinDate);
    let currentCheckinDate = new Date(
      MomentTz.tz(
        global.uadate + 'T' + currentCheckin24Hour,
        'YYYY-MM-DDTHH:mm',
        timeZone,
      ).format(),
    );
    let dateAfter20Hours = new Date(
      MomentTz.tz(firstCheckinDate, timeZone)
        .add(20, 'hours')
        .format(),
    );
    console.log(dateAfter20Hours);

    let isToday = false;
    console.log(
      '-----------testing the checking of last day and within 24 hours----------------',
    );
    console.log('--------', this.props.firstCheckinTime);
    console.log('--------', this.props.selectedDay.date);

    console.log(
      '-----------testing the checking of last day and within 24 hours----------------',
    );

    console.log('--------', today);
    console.log('--------', selectedDay);
    console.log('--------', dateAfter20Hours);
    console.log('--------', firstCheckinDate);

    if (today.getTime() === selectedDay.getTime()) {
      isToday = true;
    } else {
      if (today < dateAfter20Hours) {
        isToday = true;
      }
    }
    this.setState({isToday: isToday});
    console.log('--------', isToday);

   
  }
  //Event Handlers
  onViewCheckinsButtonTapped() {
    let input = {
      userId: this.props.userId,
      dayId: this.props.selectedDay.dayId,
      date: this.props.selectedDay.date,
    };

    this.props.navigation.navigate('CheckinsList', {
      input: input,
      selectedDay: this.props.selectedDay.date,
    });
  }
  onManualCheckoutButtonTapped = () => {
    let input = {
      userId: this.props.userId,
      dayId: this.props.selectedDay.dayId,
      date: this.props.selectedDay.date,
    };

    this.props.navigation.navigate('ManualCheckout', {
      input: input,
      selectedDay: this.props.selectedDay.date,
      returnData: selectedDay =>
        this.returnDataFrom20HorusCheckout(selectedDay),
    });

  };
  //Render Methods

  returnDataFrom20HorusCheckout(selectedDay) {
    this.setState({
      selectedDay: selectedDay,
      isToday: true,
      checkoutTime: selectedDay.outTime,
    });
  }
  render() {
    return (
      <View style={{flex: 1,backgroundColor:'pink'}}>{this.renderCards(this.props.selectedDay)}</View>
    );
  }
  _renderTab = ({data}) => {
    return <Text>{data.title}</Text>;
  };

  nextButtonPress = () => {
    if (this.state.initialPage.index) {
      this.setState({
        initialPage: {index: this.state.initialPage.index + 1},
      });
    }
  };

  renderDetailView() {
    var self = this;

    return this.props.timesheetDays.map(selectedTimesheetDay =>
      self.renderCards(selectedTimesheetDay),
    );
  }
  renderCards = selectedTimesheetDay => {
    var self = this;

    const {status, remark, reason} = this.props.theRemarkReasonViewResult;
    // console.log('----------------status----------------', status);
    // console.log('----------------remark----------------', remark);
    // console.log('----------------reason----------------', reason);
    //  selectedTimesheetDay = selectedTimesheetDayObject.data
    const firstRow = [
      {title: 'Check-in', value: selectedTimesheetDay.inTime},
      {title: 'Check-out', value: selectedTimesheetDay.outTime},
    ];
    const secondRow = [
      {title: 'Incl. Lunch', value: selectedTimesheetDay.totalTime},
      {title: 'Excl. Lunch', value: selectedTimesheetDay.totalTimes},
    ];

    const thirdRow = [
      {title: 'Regular', value: selectedTimesheetDay.regularTime},
      {title: 'Night', value: selectedTimesheetDay.nighttime},
    ];

    const fourthRow = [
      {title: 'Overtime', value: selectedTimesheetDay.overTime},
      {title: 'Night OT', value: selectedTimesheetDay.nightOT},
    ];

    const fifthRow = {
      title: 'Remark',
      value: selectedTimesheetDay.remark,
      isShow: remark,
    };
    const sixthRow = {
      title: 'Reason',
      value: selectedTimesheetDay.reason,
      isShow: reason,
    };

    return (
      <ScrollView
        style={{backgroundColor: '#fafafa'}}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          // flexBasis:1
        }}>
        {/* <View style={{paddingTop:0,backgroundColor:'clear'}}> */}

        <Text style={[styles.center, styless.header, {paddingTop: 20}]}>
          {' '}
          {Moment(selectedTimesheetDay.date, 'DD-MM-YYYY').format(
            'DD MMM YYYY',
          )}{' '}
        </Text>
        {this.renderTwoCardsTop(firstRow)}
        <Text style={[styless.title]}> Working Hours </Text>
        {this.renderTwoCards(secondRow)}
        {this.renderTwoCards(thirdRow)}
        {this.renderTwoCards(fourthRow)}
        {this.renderSingleCard(sixthRow)}
        {this.renderSingleCard(fifthRow)}
        {this.renderViewTimesheetButton()}

        {/* </View> */}
      </ScrollView>
    );
  };

  renderTwoCardsTop(object) {
    console.log('testing 123 123 ');
    console.log(
      object[1].value == 'N/A' &&
        this.props.userId == global.loginUserId &&
        this.state.isToday == false,
    );
    console.log(object[1].value);
    console.log(this.props.userId == global.loginUserId);
    console.log(this.state.isToday);

    var self = this;

    //checkin is there and checkout absent , then allow to do manual checkout
    if (object[0].value != '-' && object[1].value == '-') {
      object[1].value = 'N/A';
    }
    console.log(object[1].value);

    const isToday = this.state.isToday;

    return (
      <View
        style={[styles.leftRight, {backgroundColor: 'lightGray', margin: 5}]}>
        <CardView
          style={[
            styles.textVertical,
            styless.cardStyle,
            styles.center,
            {backgroundColor: 'white', margin: 5},
          ]}
          cardElevation={2}
          cardMaxElevation={4}
          cornerRadius={5}>
          <Text style={styless.title}> {object[0].title} </Text>
          <Text style={styless.greenText}> {object[0].value} </Text>
        </CardView>
        <CardView
          style={[
            styles.textVertical,
            styless.cardStyle,
            styles.center,
            {margin: 5},
          ]}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={5}>
          <Text style={styless.title}> {object[1].title} </Text>
          {object[1].value == 'N/A' &&
          this.props.userId == global.loginUserId ? (
            this.renderTapHereSection(object)
          ) : (
            <Text
              style={
                object[1].value == 'N/A' ? styless.redText : styless.blueText
              }>
              {' '}
              {object[1].value}{' '}
            </Text>
          )}
        </CardView>
      </View>
    );
  }

  renderTapHereSection(object) {
    if (this.state.isToday == true) {
      if (this.state.checkoutTime === undefined) {
        return (
          <Text
            style={
              object[1].value == 'N/A' ? styless.redText : styless.blueText
            }>
            {' '}
            {object[1].value}{' '}
          </Text>
        );
      } else {
        return (
          <Text
            style={
              this.state.checkoutTime == 'N/A'
                ? styless.redText
                : styless.blueText
            }>
            {' '}
            {this.state.checkoutTime}{' '}
          </Text>
        );
      }
    } else {
      return (
        <TouchableOpacity onPress={this.onManualCheckoutButtonTapped}>
          <BlinkText style={[styless.redText]} text="Tap Here" />
        </TouchableOpacity>
      );
    }
  }

  renderTwoCards(object) {
    return (
      <View
        style={[
          styles.leftRight,
          {
            backgroundColor: 'lightGray',
            margin: 5,
            justifyContent: 'flex-start',
          },
        ]}>
        <CardView
          style={[
            styles.textVertical,
            styless.cardStyle,
            styles.center,
            {backgroundColor: 'white', margin: 5},
          ]}
          cardElevation={2}
          cardMaxElevation={4}
          cornerRadius={5}>
          <Text style={styless.title}> {object[0].title} </Text>
          <Text style={styless.orangeText}> {object[0].value} </Text>
        </CardView>
        <CardView
          style={[
            styles.textVertical,
            styless.cardStyle,
            styles.center,
            {margin: 5},
          ]}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={5}>
          <Text style={styless.title}> {object[1].title} </Text>
          <Text style={styless.orangeText}> {object[1].value} </Text>
        </CardView>
      </View>
    );
  }

  renderSingleCard(object) {
    if (object.value && object.isShow == true) {
      return (
        <View
          style={[
            styles.leftRight,
            {
              backgroundColor: 'lightGray',
              margin: 5,
              justifyContent: 'flex-start',
            },
          ]}>
          <CardView
            style={[
              styles.textVertical,
              styless.dynamicCardStyle,
              {justifyContent: 'center', padding: 5},
            ]}
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}>
            <Text
              style={[
                styless.title,
                {
                  flex: 1,
                  flexShrink: 1,
                  justifyContent: 'flex-start',
                  alignSelf: 'flex-start',
                },
              ]}>
              {' '}
              {object.title}{' '}
            </Text>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={[styless.detail, {flex: 1, flexShrink: 1}]}>
                {' '}
                {object.value}{' '}
              </Text>
            </View>
          </CardView>
        </View>
      );
    }
  }

  renderViewTimesheetButton() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          padding: 10,
          paddingBottom: ScreenHeight * 0.07,
        }}>
        <WhiteButton
          title="View Check-in(s)"
          action={this.onViewCheckinsButtonTapped}
          color={'#383C55'}
          style={{width: '100%'}}
        />
        {/* <View style={styless.bottomExtra}> </View> */}
      </View>
    );
  }

  _onChangePage(page) {
    console.log('Current page: ' + page);
    // Alert.alert(page)
  }
}

const styless = {
  bottomExtra: {
    height: ScreenHeight * 0.12,
  },
  cardStyle: {
    height: ScreenHeight * 0.12,
    backgroundColor: 'white',
  },
  dynamicCardStyle: {
    backgroundColor: 'white',
  },
  orangeText: {
    fontSize: 25,
    fontWeight: '700',
    color: 'orange',
  },
  greenText: {
    fontSize: 25,
    fontWeight: '700',
    color: 'green',
  },
  blueText: {
    fontSize: 25,
    fontWeight: '700',
    color: 'blue',
  },
  redText: {
    fontSize: 25,
    fontWeight: '700',
    color: 'red',
  },
  title: {
    fontSize: 17,
    color: 'black',
    fontWeight: '500',
  },
  detail: {
    fontSize: 17,
    color: '#808080',
    fontWeight: '300',
  },
  header: {
    fontSize: 35,
    color: 'black',
    fontWeight: '700',
  },
  // container: {
  //   // flex: 1,
  //   backgroundColor: 'pink',
  //   // flexDirection: 'column',
  //   paddingTop: 100
  // },
  container: {
    flex: 1,
    backgroundColor: '#efdeed',
    flexDirection: 'column',
    paddingTop: 20,
    height: 500,
  },
};
