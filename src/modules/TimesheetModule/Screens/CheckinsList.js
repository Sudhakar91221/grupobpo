/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, FlatList, Platform, Alert} from 'react-native';
import CheckinCell from '../Components/CheckinCell';
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

class CheckinsList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      isSpinner: true,
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  // componentWillUnmount() {
  //   this.props.navigation.state.params.fetchData();
  // }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_CHECKINS) {
      if (
        this.props.error !== prevProps.error &&
        this.props.error.message !== ''
      ) {
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
    }

    if (this.props.api === GET_CHECKINS) {
      if (this.props.error !== null && this.props.api === GET_CHECKINS) {
        if (
          this.props.error !== prevProps.error &&
          this.props.error.message !== ''
        ) {
          this.hideSpinner();

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
          this.hideSpinner();

          this.setState({data: this.props.checkins.data});
        }
      }
    }
  }

  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    const selectedDay = params ? params.selectedDay : '';
    const date = Moment(selectedDay, 'DD-MM-YYYY').format('DD MMM YYYY');

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
      return <ActivityIndicatorCustom
      isSpinner={this.state.isSpinner}
      style={{paddingTop: 20, height: 60}}
    />;
    }
    return <View style={{padding: 20}}>
      <ActivityIndicatorCustom
        isSpinner={this.state.isSpinner}
        style={{paddingTop: 20, height: 60}}
      />
      {this.renderCheckinListView()}</View>;
  }

  fetchData() {
    const {params} = this.props.navigation.state;
    const inputData = params ? params.input : '';

    var input = {
      userId: inputData.userId,
      date: inputData.date,
      dayId: inputData.dayId,
      request: GET_CHECKINS,
    };
    this.props.getCheckins(input);
  }
  keyExtractor = (item, index) => item.key;

  _renderItem({item}) {
    return (
      <CheckinCell
        item={item}
        navigation={this.props.navigation}
        isFromManualCheckout={false}
        firstCheckinTime={this.state.data[0].inTime}
        selectedDay={this.state.selectedDay}
      />
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckinsList);
