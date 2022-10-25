/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert, FlatList, TouchableOpacity} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {GET_COMPANY_EMPLOYEE} from '../../TimesheetModule/Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  companyEmployeeSelector,
} from '../../TimesheetModule/Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getCompanyEmployee} from '../../TimesheetModule/Actions/TimesheetActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import {flatListItemSeparator} from '../../../components/utility/common';
import {styless} from '../../../components/common/Styles';
import Icon from 'react-native-vector-icons/Ionicons';

class SelectMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectAll: false,
      selectCount: 0,
    };
    this.onSubmitButtonTapped = this.onSubmitButtonTapped.bind(this);
    this.onSelectAllTapped = this.onSelectAllTapped.bind(this);
  }

  componentWillMount() {
    this.callCompanyEmployeeAPI();
  }

  callCompanyEmployeeAPI() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      request: GET_COMPANY_EMPLOYEE,
    };
    this.props.getCompanyEmployee(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_COMPANY_EMPLOYEE) {
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

    //get company employee
    if (this.props.api === GET_COMPANY_EMPLOYEE) {
      if (
        this.props.error !== null &&
        this.props.api === GET_COMPANY_EMPLOYEE
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

      if (!this.props.error && this.props.api === GET_COMPANY_EMPLOYEE) {
        if (this.props.companyEmployees !== prevProps.companyEmployees) {
          this.setState({companyEmployees: this.props.companyEmployees});
        }
      }
    }
  }

  render() {
    const {theme} = this.props;
    if (this.state.companyEmployees === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            margin: 2,
            flex: 0.1,
          }}>
          <TouchableOpacity
            style={[
              styless.textVertical,
              {
                width: '100%',
                height: '100%',
                padding: 10,
              },
            ]}
            onPress={() => this.onSelectAllTapped()}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  theme.header,
                  {textAlign: 'left', color: theme.primaryColor, flex: 1},
                ]}>
                Select All
              </Text>
              <Icon
                name={
                  this.state.selectAll === true
                    ? 'ios-checkmark-circle'
                    : 'ios-radio-button-off'
                }
                color={theme.primaryColor}
                size={30}
              />
            </View>
          </TouchableOpacity>
        </View>
        {this.state.companyEmployees === undefined ? null : (
          <View style={{flex: 1}}>
            <FlatList
              data={this.state.companyEmployees}
              renderItem={this.renderItem}
              numColumns={1}
              keyExtractor={this._keyExtractor}
              extraData={this.state}
              ItemSeparatorComponent={flatListItemSeparator}
            />
          </View>
        )}

        {this.renderSubmitButton()}
      </View>
    );
  }

  onSelectAllTapped() {
    let list = [];
    for (let i = 0; i < this.state.companyEmployees.length; i++) {
      let obj = this.state.companyEmployees[i];
      obj.isSelect = !this.state.selectAll;
      list.push(obj);
    }

    this.setState({
      selectAll: !this.state.selectAll,
      companyEmployees: list,
      selectCount: this.state.companyEmployees.length,
    });
  }

  renderItem = ({item}) => {
    const {theme} = this.props;
    return (
      <View
        style={{
          margin: 2,
          flex: 1,
        }}>
        <TouchableOpacity
          style={[
            styless.textVertical,
            {
              width: '100%',
              height: '100%',
              padding: 10,
            },
          ]}
          onPress={() => this.selectItem(item)}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                theme.header,
                {textAlign: 'left', color: theme.primaryColor, flex: 1},
              ]}>
              {item.userName}
            </Text>
            <Icon
              name={
                item.isSelect ? 'ios-checkmark-circle' : 'ios-radio-button-off'
              }
              color={theme.primaryColor}
              size={30}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  selectItem = data => {
    data.isSelect = !data.isSelect;
    if (data.isSelect) {
      this.state.selectCount = this.state.selectCount + 1;
    }

    const index = this.state.companyEmployees.findIndex(
      item => data.userId === item.userId,
    );

    this.state.companyEmployees[index] = data;

    this.setState({
      companyEmployees: this.state.companyEmployees,
    });
  };

  renderSubmitButton() {
    return (
      <BottomButton
        style={{borderRadius: 50, margin: 10, width: '60%'}}
        title={translate('submit')}
        action={() => this.onSubmitButtonTapped()}
      />
    );
  }

  onSubmitButtonTapped() {
    this.props.navigation.state.params.getSelectedMembers(
      this.state.companyEmployees,
      this.state.selectAll,
      this.state.selectCount,
    );
    this.props.navigation.goBack();
  }
}
const SelectMembersNew = withTheme(SelectMembers);
SelectMembersNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    companyEmployees: companyEmployeeSelector(state.TimesheetReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getCompanyEmployee: input => dispatch(getCompanyEmployee(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectMembersNew);
