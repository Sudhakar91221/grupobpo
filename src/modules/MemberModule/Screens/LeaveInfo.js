/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  leaveDropdownSelector,
  leaveInfoSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {getLeaveDropdown, getLeaveInfo} from '../Actions/MemberActions';
import {
  GET_USER_DROPDOWN,
  GET_LEAVE_DROPDOWN,
  GET_LEAVE_INFO,
} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {
  flatListItemSeparator,
  flatListItemSpaceSeparator,
} from '../../../components/utility/common';
import {translate} from '../../../../App';
import {Dropdown} from 'react-native-material-dropdown';
import LeaveInfoCell from './LeaveInfoCell';

class LeaveInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null,
      value: 'Select',
      leaveList: undefined,
    };
  }

  componentWillMount() {
    this.callGetLeaveDropdown();
  }

  callGetLeaveDropdown() {
    var input = {
      employeeId: this.props.navigation.state.params.item.employeeId,
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      request: GET_LEAVE_DROPDOWN,
    };
    this.props.getLeaveDropdown(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_LEAVE_DROPDOWN ||
        this.props.error.request == GET_LEAVE_INFO)
    ) {
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

    //get leaveDropdown
    if (this.props.api === GET_LEAVE_DROPDOWN) {
      if (this.props.error !== null && this.props.api === GET_LEAVE_DROPDOWN) {
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

      if (!this.props.error && this.props.api === GET_LEAVE_DROPDOWN) {
        if (this.props.leaveDropdown !== prevProps.leaveDropdown) {
          let list = [];
          Object.keys(this.props.leaveDropdown).map(key => {
            list = [
              ...list,
              {
                index: key,
                value: this.props.leaveDropdown[key].year,
              },
            ];
          });

          this.setState(
            {
              value: this.props.leaveDropdown[0].year,
              yearId: this.props.leaveDropdown[0].yearId,
              leaveList: list,
            },
            () => this.callLeaveInfo(),
          );
        }
      }
    }

    //get leave info
    if (this.props.api === GET_LEAVE_INFO) {
      if (this.props.error !== null && this.props.api === GET_LEAVE_INFO) {
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

      if (!this.props.error && this.props.api === GET_LEAVE_INFO) {
        if (this.props.leaveInfo !== prevProps.leaveInfo) {
          this.setState({
            leaveInfo: this.props.leaveInfo,
          });
        }
      }
    }
  }

  render() {
    var value = '';
    if (this.state.value !== undefined) {
      value = this.state.value;
    } else {
      value = this.state.leaveList[0].value;
    }
    const {theme} = this.props;
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View
            style={{
              paddingLeft: '5%',
              paddingRight: '5%',
            }}>
            <Dropdown
              data={this.state.leaveList}
              value={value}
              textColor={theme.headerColor}
              baseColor={'gray'}
              fontSize={16}
              tintColor={theme.centerColor}
              onChangeText={this.changeText}
              animationDuration={0}
            />
          </View>
          <View style={{flex: 1}}>
            {this.state.leaveInfo === undefined ? (
              <ActivityIndicatorCustom />
            ) : this.state.leaveInfo.length === 0 ? (
              this.renderNoRecords()
            ) : (
              <View style={{flex: 1, padding: 10}}>
                <FlatList
                  data={this.state.leaveInfo}
                  renderItem={this.renderItem}
                  numColumns={1}
                  extraData={this.props}
                  keyExtractor={(item, index) => index.toString()}
                  onEndReached={this.loadMore}
                  onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false;
                  }}
                  onEndReachedThreshold={0.5}
                  onRefresh={this.onRefresh}
                  refreshing={
                    this.state.refreshing !== undefined
                      ? this.state.refreshing
                      : false
                  }
                  ItemSeparatorComponent={flatListItemSpaceSeparator}
                />
              </View>
            )}
          </View>

          {this.renderBottomView()}
        </View>
      </ScrollView>
    );
  }

  renderBottomView() {
    const {theme} = this.props;
    return (
      <View style={{flex: 0.2}}>
        <View
          style={{height: 0.8, width: '100%', backgroundColor: '#C8C8C8'}}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={[
              theme.header,
              {
                textAlign: 'center',
                color: theme.black,
                textTransform: 'none',
              },
            ]}>
            CYL- Current Year Leave
          </Text>
          <Text
            style={[
              theme.header,
              {textAlign: 'center', color: theme.black, textTransform: 'none'},
            ]}>
            LYCF - Last Year Carry Forward
          </Text>
        </View>
      </View>
    );
  }

  changeText = text => {
    var index = this.props.leaveDropdown.findIndex(obj => obj.year === text);
    var yearModel = this.props.leaveDropdown[index];

    this.setState(
      {
        value: text,
        yearId: yearModel.yearId,
      },
      () => this.callLeaveInfo(),
    );
  };

  callLeaveInfo() {
    var input = {
      employeeId: this.props.navigation.state.params.item.employeeId,
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      yearId: this.state.yearId,
      request: GET_LEAVE_INFO,
    };
    this.props.getLeaveInfo(input);
  }

  renderItem = ({item}) => {
    return <LeaveInfoCell item={item} navigation={this.props.navigation} />;
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
const LeaveInfoNew = withTheme(LeaveInfo);

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    leaveDropdown: leaveDropdownSelector(state.MemberReducer),
    leaveInfo: leaveInfoSelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getLeaveDropdown: input => dispatch(getLeaveDropdown(input)),
    getLeaveInfo: input => dispatch(getLeaveInfo(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaveInfoNew);
