/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, FlatList, Text, Alert, TouchableOpacity} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getDesignationSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {getDesignationList} from '../Actions/MemberActions';
import {GET_DESIGNATION} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {flatListItemSeparator} from '../../../components/utility/common';

class DesignationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null,
    };

    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    this.callGetDesignation();
  }

  callGetDesignation() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      request: GET_DESIGNATION,
    };
    this.props.getDesignationList(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_DESIGNATION) {
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

    //get designation
    if (this.props.api === GET_DESIGNATION) {
      if (this.props.error !== null && this.props.api === GET_DESIGNATION) {
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

      if (!this.props.error && this.props.api === GET_DESIGNATION) {
        if (this.props.designation !== prevProps.designation) {
          this.setState({
            designationList: this.props.designation.data,
          });
        }
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.state.designationList === undefined ? (
            <ActivityIndicatorCustom />
          ) : this.state.designationList.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1, backgroundColor: '#EFEFF4'}}>
              <FlatList
                data={this.state.designationList}
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
          {item.designation}
        </Text>
      </TouchableOpacity>
    );
  };

  onSelect(item) {
    this.props.navigation.state.params.getDesignation(item);
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
const DesignationListNew = withTheme(DesignationList);
DesignationListNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    designation: getDesignationSelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getDesignationList: input => dispatch(getDesignationList(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DesignationListNew);
