/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, FlatList, Alert} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {GET_STAFF_TIMESHEETS} from '../../TimesheetModule/Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  staffTimesheetListSelector,
} from '../../TimesheetModule/Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getStaffTimesheets} from '../../TimesheetModule/Actions/TimesheetActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import StaffTimesheetListCell from '../../TimesheetModule/Components/StaffTimesheetListCell';

class TimesheetScreen extends React.Component {
  constructor(props) {
    super(props);
    let item = this.props.navigation.state.params.item;
    this.state = {
      timesheets: undefined,
      item: item,
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      page: 1,
      employeeId: this.state.item.id,
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
          this.setState({timesheets: this.props.timesheets});
          this.state.submitLoader = false;
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    if (this.state.timesheets === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, padding: 10}}>
          {this.state.timesheets === undefined ? (
            this.renderNoRecords()
          ) : this.state.timesheets.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                data={this.state.timesheets}
                renderItem={this.renderTimesheetItem}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                extraData={this.props}
                ItemSeparatorComponent={flatListItemSpaceSeparator}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

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
}

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
const TimesheetScreenNew = withTheme(TimesheetScreen);
export default connect(mapStateToProps, mapDispatchToProps)(TimesheetScreenNew);
