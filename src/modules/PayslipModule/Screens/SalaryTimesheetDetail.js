/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, FlatList, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import {connect} from 'react-redux';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  dailyDetailsSelector,
} from '../../TimesheetModule/Actions/selectors';
import {getDailyDetails} from '../../TimesheetModule/Actions/TimesheetActions';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {GET_DAILY_DETAILS} from '../../TimesheetModule/Actions/type';
import Moment from 'moment';
import DailyDetailCell from './DailyDetailCell';
import {flatListItemSeparator} from '../../../components/utility/common';

class SalaryTimesheetDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      period: this.props.navigation.state.params.period,
      startDate: this.props.navigation.state.params.startDate,
      endDate: this.props.navigation.state.params.endDate,
      isEmployeeSalary: this.props.navigation.state.params.isEmployeeSalary,
    };
  }

  componentWillMount() {
    if (this.state.isEmployeeSalary === false) {
      var input = {
        userId: this.props.user.userId,
        companyId: this.props.user.userCompany,
        periodId: this.state.period,
        request: GET_DAILY_DETAILS,
      };
      this.props.getDailyDetails(input);
    } else {
      var input = {
        userId: this.props.navigation.state.params.userId,
        companyId: this.props.user.userCompany,
        periodId: this.state.period,
        request: GET_DAILY_DETAILS,
      };
      this.props.getDailyDetails(input);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_DAILY_DETAILS) {
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

    //get daily details
    if (this.props.api === GET_DAILY_DETAILS) {
      if (this.props.error !== null && this.props.api === GET_DAILY_DETAILS) {
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

      if (!this.props.error && this.props.api === GET_DAILY_DETAILS) {
        if (this.props.dailyDetail !== prevProps.dailyDetail) {
          this.setState({dailyDetail: this.props.dailyDetail});
        }
      }
    }
  }

  render() {
    const {theme} = this.props;
    if (this.state.dailyDetail === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                theme.header,
                {textAlign: 'center', color: theme.primaryColor, flex: 1},
              ]}
              numberOfLines={1}>
              {translate('day')}
            </Text>

            <Text
              style={[
                theme.header,
                {
                  textAlign: 'center',
                  color: theme.primaryColor,
                  flex: 1,
                },
              ]}
              numberOfLines={1}>
              {translate('regular')}
            </Text>
            <Text
              style={[
                theme.header,
                {textAlign: 'center', color: theme.primaryColor, flex: 1},
              ]}
              numberOfLines={1}>
              {translate('overtime')}
            </Text>
          </View>
          <FlatList
            data={this.state.dailyDetail}
            renderItem={this._renderItem.bind(this)}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={flatListItemSeparator}
          />
        </View>
      </ScrollView>
    );
  }

  _renderItem({item}) {
    return <DailyDetailCell item={item} />;
  }
}

const SalaryTimesheetDetailNew = withTheme(SalaryTimesheetDetail);
SalaryTimesheetDetailNew.navigationOptions = ({navigation, screenProps}) => {
  const {theme} = screenProps;
  const {params = {}} = navigation.state;
  const startDate = Moment(params.startDate, 'YYYY-MM-DD').format('DD MMM YY');
  const endDate = Moment(params.endDate, 'YYYY-MM-DD').format('DD MMM YY');

  const title = startDate + ' - ' + endDate;

  return {
    title: title,
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
  };
};
function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.TimesheetReducer),
    api: apiSelector(state.TimesheetReducer),
    error: errorSelector(state.TimesheetReducer),
    dailyDetail: dailyDetailsSelector(state.TimesheetReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getDailyDetails: input => dispatch(getDailyDetails(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SalaryTimesheetDetailNew);
