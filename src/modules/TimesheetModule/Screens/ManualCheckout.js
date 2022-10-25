/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, FlatList, Platform, Alert, ScrollView} from 'react-native';
import ManualCheckoutCell from '../Components/ManualCheckoutCell';
import {GET_CHECKINS} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getCheckinsSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getCheckins} from '../Actions/TimesheetActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import Moment from 'moment';
import ProgressCircle from 'react-native-progress-circle';
const TotalWorkingHours = 12;

class ManualCheckout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSpinner : true,
      data: undefined,
      hideSubmitManualCheckout: false,
      selectedDay: this.props.navigation.state.params.selectedDay,
    };
  }

  // componentWillUnmount() {
  //   this.props.navigation.state.params.fetchData();
  // }

  componentWillMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_CHECKINS) {
      if (
        this.props.error !== prevProps.error &&
        this.props.error.message !== ''
      ) {
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

    if (this.props.api === GET_CHECKINS) {
      if (this.props.error !== null && this.props.api === GET_CHECKINS) {
        if (
          this.props.error !== prevProps.error &&
          this.props.error.message !== ''
        ) {
          this.hideSpinner()

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

      if (!this.props.error && this.props.api === GET_CHECKINS) {
        if (this.props.checkins.data !== this.state.data) {
          this.setState({
            data: this.props.checkins.data,
            totalHours: this.props.checkins.totalHours,
            totalMins: this.props.checkins.totalMins,
          });
          this.hideSpinner()
        }
      }
    }
  }

  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    
    const selectedDay = params ? params.selectedDay : '';
    // const date = Moment(selectedDay, 'YYYY-DD-MM').format('DD MMM YYYY');

    const date  = Moment(selectedDay).format('DD MMM YYYY')
    return {
      drawerLabel: 'Home',
      title: date ? date : 'Checkins',
      largeTitle: 'true',
      style: {
        marginTop: Platform.OS === 'ios' ? 0 : 24,
      },
      headerStyle: {
        backgroundColor: '#383C55',
      },
      headerTintColor: 'white',
    };
  };

  render() {
    if (this.state.data === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{paddingTop: 10, flex: 1, flexDirection: 'column'}}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
          <View>{this.renderCircleSlider()}</View>
          <View style={{padding: 20}}>{this.renderCheckinListView()}</View>
        </View>
      </ScrollView>
    );
  }

  renderCircleSlider() {
    console.log('step111');
    console.log(this.state.totalHours);
    let totalTime = parseFloat(
      this.state.totalHours + '.' + this.state.totalMins,
    );
    let avgTime = (totalTime / TotalWorkingHours) * 100;
    let timeToDisplay =
      (this.state.totalHours ? this.state.totalHours : '00') +
      '  :  ' +
      (this.state.totalMins ? this.state.totalMins : '00');
    let timeTextToDisplay = 'Hrs' + '  :  ' + 'Mins';

    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <ProgressCircle
          percent={avgTime}
          radius={70}
          borderWidth={8}
          color="#2E324C"
          shadowColor="#999"
          bgColor="#fff">
          <Text style={{fontSize: 18}}>{timeToDisplay}</Text>
          <Text style={{fontSize: 18}}>{timeTextToDisplay}</Text>
        </ProgressCircle>
      </View>
    );
  }

  fetchData() {
    
    const {params} = this.props.navigation.state;
    const inputData = params ? params.input : '';

    var input = {
      userId: inputData.userId,
      date: inputData.date,
      //dayId: inputData.dayId,
      request: GET_CHECKINS,
    };
    this.props.getCheckins(input);
  }
  keyExtractor = (item, index) => item.key;

  _renderItem({item}) {
    
    const {params} = this.props.navigation.state;
    
    const selectedDay = params ? params.selectedDay : '';
    const date  = Moment(selectedDay).format('YYYY-MM-DD');
    return (
      <ManualCheckoutCell
        item={item}
        navigation={this.props.navigation}
        isFromManualCheckout={true}
        firstCheckinTime={this.state.data[0].inTime}
        selectedDay={date}
        submitCheckoutData={(time, task, notes) =>
          this.getModifiedDetailsForLastCheckin(time, task, notes)
        }
      />
    );
  }

  getModifiedDetailsForLastCheckin(time, task, notes) {
    console.log(time);
    console.log(task);
    console.log(notes);

    this.state.data[this.state.data.length - 1].outTime = time;
    this.state.data[this.state.data.length - 1].notes = notes;
    this.state.data[this.state.data.length - 1].task = task;
    this.props.navigation.state.params.returnData(
      this.state.data[this.state.data.length - 1],
    );
    this.props.navigation.goBack();
    //
  }

  renderCheckinListView() {
    if (this.state.data.length === 0) {
      return (
        <Text
          style={{
            fontSize: 15,
            fontWeight: '500',
            color: 'black',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {' '}
          No checkins available for the day{' '}
        </Text>
      );
    } else {
      return (
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem.bind(this)}
          keyExtractor={this.keyExtractor}
        />
      );
    }
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
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.TimesheetReducer),
    api: apiSelector(state.TimesheetReducer),
    error: errorSelector(state.TimesheetReducer),
    checkins: getCheckinsSelector(state.TimesheetReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getCheckins: input => dispatch(getCheckins(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManualCheckout);
