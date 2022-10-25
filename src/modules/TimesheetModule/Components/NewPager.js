/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';
import Swiper from './Swiper';
import TimesheetDay from './TimesheetDay';
// import {ScreenHeight} from '../../../Helpers/helpers';

export default class NewPager extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onIndexChanged = this.onIndexChanged.bind(this);
  }

  render() {
    console.log('selected day index-------11----------');
    // console.log(this.props.timesheetDays[this.props.currentOpenDay])
    // console.log('the value of date for selected date')

    console.log(
      '----------first checking time from newPager-----------',
      this.props.timesheetDays[0].inTime,
    );

    return (
      <View style={[styless.container, {backgroundColor: '#fafafa'}]}>
        <Swiper
          ref={ref => (this.swiper = ref)}
          style={[{backgroundColor: 'yellow', flex: 1}]}
          onIndexChanged={this.onIndexChanged}
          index={this.props.index}>
          {this.props.timesheetDays.map(selectedTimesheetDay => (
            <View style={[styless.slideContainer]}>
              <TimesheetDay
                selectedDay={selectedTimesheetDay}
                navigation={this.props.navigation}
                userId={this.props.timesheetUser}
                currentOpenDay={
                  this.props.timesheetDays[this.props.currentOpenDay]
                    ? this.props.timesheetDays[this.props.currentOpenDay].date
                    : undefined
                }
                firstCheckinTime={selectedTimesheetDay.inTime}
                theRemarkReasonViewResult={this.props.theRemarkReasonViewResult}
              />
            </View>
          ))}
        </Swiper>
      </View>
    );
  }

  onIndexChanged(newIndex) {
    this.props.selectedTimesheetDay(newIndex);
    console.log(newIndex);
  }

  nextButtonPress = currentPage => {
    if (currentPage) {
      this.swiper.moveUpDown(false);
    }
  };
  prevButtonPress = currentPage => {
    if (currentPage) {
      this.swiper.moveUpDown(true);
    }
  };
}

const styless = {
  container: {
    flexGrow: 1,
    //   height:ScreenHeight-160
  },
  slideContainer: {
    flexGrow: 1,
    margin: 30,
    justifyContent: 'center',
  },
};
