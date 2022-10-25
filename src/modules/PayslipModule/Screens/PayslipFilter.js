/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {GET_COMPANY_PERIOD} from '../../TimesheetModule/Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myTimesheetListSelector,
  companyPeriodSelector,
  companyEmployeeSelector,
} from '../../TimesheetModule/Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  getMyTimesheets,
  getCompanyPeriod,
  getCompanyEmployee,
} from '../../TimesheetModule/Actions/TimesheetActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {Dropdown} from 'react-native-material-dropdown';
import CustomMultiPicker from '../../../components/external/CustomMultiPicker/index';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';

class PayslipFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStatus: 0,
      members: undefined,
    };
    this.onApplyButtonTapped = this.onApplyButtonTapped.bind(this);
    this.onClearButtonTapped = this.onClearButtonTapped.bind(this);
  }

  componentWillMount() {
    this.callCompanyPeriodAPI();
  }

  callCompanyPeriodAPI() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      request: GET_COMPANY_PERIOD,
    };
    this.props.getCompanyPeriod(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_COMPANY_PERIOD) {
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

    //get company period
    if (this.props.api === GET_COMPANY_PERIOD) {
      if (this.props.error !== null && this.props.api === GET_COMPANY_PERIOD) {
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

      if (!this.props.error && this.props.api === GET_COMPANY_PERIOD) {
        if (this.props.companyPeriods !== prevProps.companyPeriods) {
          let list = [];
          Object.keys(this.props.companyPeriods.data).map(key => {
            list = [
              ...list,
              {
                index: key,
                value: this.props.companyPeriods.data[key].period,
              },
            ];
          });
          this.setState({companyPeriods: list});
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    if (this.state.companyPeriods === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <View style={{flex: 1}}>
        <Text
          style={[
            theme.header,
            {
              color: theme.primaryColor,
              fontWeight: 'bold',
              paddingTop: 20,
              paddingLeft: 20,
            },
          ]}
          numberOfLines={1}>
          Month
        </Text>
        {this.state.companyPeriods === undefined
          ? null
          : this.renderPeriodDropDown()}

        <Text
          style={[
            theme.header,
            {
              color: theme.primaryColor,
              fontWeight: 'bold',
              paddingTop: 20,
              paddingLeft: 20,
            },
          ]}
          numberOfLines={1}>
          Members
        </Text>

        <BottomButton
          style={{height: 50, borderRadius: 50, margin: 10, width: '60%'}}
          title={'Select Members'}
          action={() =>
            this.props.navigation.navigate('SelectMembers', {
              getSelectedMembers: this.getSelectedMembers.bind(this),
            })
          }
        />
        {this.state.members === undefined
          ? this.renderMemberName({userName: 'All Members', isSelect: true})
          : this.renderMemberName({
              userName:
                this.state.members[0].userName +
                ' and ' +
                this.state.selectCount +
                ' others',
              isSelect: true,
            })}

        {this.renderButtons()}
      </View>
    );
  }

  renderSelectedNames() {}

  renderMemberName(item) {
    return item.isSelect === true ? (
      <View
        style={{
          backgroundColor: '#EEE',
          borderRadius: 20,
          alignItems: 'center',
          alignSelf: 'center',
          margin: 5,
          padding: 10,
        }}>
        <Text style={{fontSize: 14, color: 'black'}}>{item.userName}</Text>
      </View>
    ) : null;
  }

  getSelectedMembers(data, selectAll, selectCount) {
    console.log('selected members are ');
    this.setState({
      members: data,
      selectAll: selectAll,
      selectCount: selectCount,
    });
  }

  renderButtons() {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          position: 'absolute',
          bottom: 0,
        }}>
        <BottomButton
          style={{flex: 1, borderRadius: 50, margin: 10}}
          title={translate('apply')}
          action={() => this.onApplyButtonTapped()}
        />
        <BottomButton
          style={{flex: 1, borderRadius: 50, margin: 10}}
          title={translate('clear')}
          action={() => this.onClearButtonTapped()}
        />
      </View>
    );
  }

  onApplyButtonTapped() {
    let periodModel = {};
    if (this.state.periodName !== undefined) {
      periodModel.periodId = this.state.periodId;
      periodModel.periodName = this.state.periodName;
    } else {
      periodModel.periodId = this.props.companyPeriods.data[0].periodId;
      periodModel.periodName = this.props.companyPeriods.data[0].period;
    }
    this.props.navigation.state.params.getSelectedValues(
      this.state.members,
      periodModel,
    );
    this.props.navigation.goBack();
  }

  onClearButtonTapped() {
    let employeeModel = {};
    let periodModel = {};
    this.props.navigation.state.params.getSelectedValues(
      employeeModel,
      periodModel,
      this.state.selectedStatus,
    );
    this.props.navigation.goBack();
  }

  renderPeriodDropDown() {
    const {theme} = this.props;
    var periodName = '';
    if (this.state.periodName !== undefined) {
      periodName = this.state.periodName;
    } else {
      periodName = this.state.companyPeriods[0].value;
    }

    return (
      <View style={{padding: 5, paddingLeft: '5%', paddingRight: '5%'}}>
        <View
          style={{
            paddingLeft: '5%',
            paddingRight: '5%',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'gray',
          }}>
          <Dropdown
            data={this.state.companyPeriods}
            value={periodName}
            textColor={theme.headerColor}
            baseColor={'gray'}
            fontSize={16}
            tintColor={theme.centerColor}
            onChangeText={this.changePeriodText}
            animationDuration={0}
          />
        </View>
      </View>
    );
  }

  changePeriodText = text => {
    var index = this.props.companyPeriods.data.findIndex(
      obj => obj.period === text,
    );
    var periodModel = this.props.companyPeriods.data[index];
    this.setState({
      periodId: periodModel.periodId,
      periodName: periodModel.period,
    });
  };
}
const PayslipFilterNew = withTheme(PayslipFilter);
PayslipFilterNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
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
    companyPeriods: companyPeriodSelector(state.TimesheetReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getCompanyPeriod: input => dispatch(getCompanyPeriod(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PayslipFilterNew);
