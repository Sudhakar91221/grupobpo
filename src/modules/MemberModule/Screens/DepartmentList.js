/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, FlatList, Text, Alert, TouchableOpacity} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getDepartmentSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {getDepartmentList} from '../Actions/MemberActions';
import {GET_DEPARTMENT} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {flatListItemSeparator} from '../../../components/utility/common';

class DepartmentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null,
    };
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    this.callGetDepartment();
  }

  callGetDepartment() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      request: GET_DEPARTMENT,
    };
    this.props.getDepartmentList(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_DEPARTMENT) {
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

    //get department
    if (this.props.api === GET_DEPARTMENT) {
      if (this.props.error !== null && this.props.api === GET_DEPARTMENT) {
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

      if (!this.props.error && this.props.api === GET_DEPARTMENT) {
        if (this.props.department !== prevProps.department) {
          this.setState({
            departmentList: this.props.department.data,
          });
        }
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.state.departmentList === undefined ? (
            <ActivityIndicatorCustom />
          ) : this.state.departmentList.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1, backgroundColor: '#EFEFF4'}}>
              <FlatList
                data={this.state.departmentList}
                renderItem={this.renderItem}
                numColumns={1}
                extraData={this.props}
                keyExtractor={(item, index) => index.toString()}
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
          {item.department}
        </Text>
      </TouchableOpacity>
    );
  };

  onSelect(item) {
    this.props.navigation.state.params.getDepartment(item);
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
}
const DepartmentListNew = withTheme(DepartmentList);
DepartmentListNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    department: getDepartmentSelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getDepartmentList: input => dispatch(getDepartmentList(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentListNew);
