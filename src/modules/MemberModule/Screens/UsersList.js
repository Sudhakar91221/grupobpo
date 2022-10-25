/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, FlatList, Text, Alert, TouchableOpacity} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getUserDropdownSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {getUserDropdown} from '../Actions/MemberActions';
import {GET_USER_DROPDOWN} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {flatListItemSeparator} from '../../../components/utility/common';
import MemberCell from './MemberCell';

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      selectedId: null,
    };
    this.loadMore = this.loadMore.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    this.callGetUsers();
  }

  callGetUsers() {
    var input = {
      page: this.state.page,
      employeeId: '',
      keyword: '',
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      type: this.props.navigation.state.params.type,
      pageFlag: 1,
      employeeType: 3,
      request: GET_USER_DROPDOWN,
    };
    this.props.getUserDropdown(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_USER_DROPDOWN) {
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

    //get userDropdown
    if (this.props.api === GET_USER_DROPDOWN) {
      if (this.props.error !== null && this.props.api === GET_USER_DROPDOWN) {
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

      if (!this.props.error && this.props.api === GET_USER_DROPDOWN) {
        if (this.props.userDropdown !== prevProps.userDropdown) {
          let array = [];
          let result = Object.entries(this.props.userDropdown);
          result.map((item, index) => {
            let obj = {userId: item[0], userName: item[1]};
            array.push(obj);
          });
          console.log(array);

          this.setState({
            memberList: array,
            refreshing: false,
          });
        }
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.state.memberList === undefined ? (
            <ActivityIndicatorCustom />
          ) : this.state.memberList.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1, backgroundColor: '#EFEFF4'}}>
              <FlatList
                data={this.state.memberList}
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
                ItemSeparatorComponent={flatListItemSeparator}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => this.onSelect(item)}>
        <Text style={{fontSize: 18, color: 'gray', padding: 10}}>
          {item.userName}
        </Text>
      </TouchableOpacity>
    );
  };

  onSelect(item) {
    if (this.props.navigation.state.params.type === 2) {
      this.props.navigation.state.params.getSupervisor(item);
    } else {
      this.props.navigation.state.params.getHr(item);
    }
    this.props.navigation.goBack();
  }

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

  onRefresh = () => {
    this.setState(
      {
        dataSource: [],
        isLoading: false,
        refreshing: true,
        seed: 1,
        page: 1,
      },
      () => this.callGetUsers(),
    );
  };

  loadMore = () => {
    if (this.onEndReachedCalledDuringMomentum === undefined) {
    } else {
      if (!this.onEndReachedCalledDuringMomentum) {
        this.setState(
          {
            lastPage: this.state.page,
            isLoading: false,
            page: this.state.page + 1,
            refreshing: false,
          },
          () => {
            this.callGetUsers();
            this.onEndReachedCalledDuringMomentum = true;
          },
        );
      }
    }
  };
}
const UsersListNew = withTheme(UsersList);
UsersListNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    userDropdown: getUserDropdownSelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getUserDropdown: input => dispatch(getUserDropdown(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersListNew);
